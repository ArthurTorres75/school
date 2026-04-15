import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { env } from "@/lib/env";
import { AUTH_COOKIE, AUTH_ERROR_CODE, AUTH_MESSAGE } from "@/modules/users/user.constants";
import { AuthError } from "@/modules/users/user.errors";
import { loginSchema } from "@/modules/users/user.schemas";
import { authRateLimitService, authTokenService, userService } from "@/modules/users/auth.container";
import type { ApiErrorBody, ApiSuccessBody, SafeUser } from "@/modules/users/user.types";

export async function POST(request: Request): Promise<NextResponse<ApiSuccessBody<SafeUser> | ApiErrorBody>> {
  let loginKey = "anonymous";

  try {
    const payload: unknown = await request.json();
    const input = loginSchema.parse(payload);

    loginKey = resolveLoginKey(request, input.email);
    const rateLimitStatus = authRateLimitService.canAttemptLogin(loginKey);

    if (!rateLimitStatus.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: AUTH_MESSAGE.RATE_LIMITED,
          errorCode: AUTH_ERROR_CODE.RATE_LIMITED,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimitStatus.retryAfterSeconds),
          },
        },
      );
    }

    const user = await userService.login(input);
    authRateLimitService.clearLoginFailures(loginKey);

    const token = await authTokenService.signSession({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const responseBody: ApiSuccessBody<SafeUser> = {
      success: true,
      message: AUTH_MESSAGE.LOGIN_SUCCESS,
      data: user,
    };

    const response = NextResponse.json(responseBody, { status: 200 });

    response.cookies.set(AUTH_COOKIE.SESSION, token, {
      httpOnly: true,
      sameSite: "strict",
      secure: env.NODE_ENV === "production",
      path: "/",
      maxAge: env.JWT_EXPIRES_IN_SECONDS,
      priority: "high",
    });

    return response;
  } catch (error: unknown) {
    if (error instanceof AuthError && error.code === AUTH_ERROR_CODE.INVALID_CREDENTIALS) {
      const rateLimitResult = authRateLimitService.registerFailedLogin(loginKey);

      if (rateLimitResult.locked) {
        return NextResponse.json(
          {
            success: false,
            message: AUTH_MESSAGE.RATE_LIMITED,
            errorCode: AUTH_ERROR_CODE.RATE_LIMITED,
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(rateLimitResult.retryAfterSeconds ?? env.AUTH_LOGIN_LOCKOUT_SECONDS),
            },
          },
        );
      }
    }

    return mapError(error);
  }
}

function mapError(error: unknown): NextResponse<ApiErrorBody> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: error.issues[0]?.message ?? AUTH_MESSAGE.INTERNAL_ERROR,
        errorCode: AUTH_ERROR_CODE.VALIDATION_ERROR,
      },
      { status: 400 },
    );
  }

  if (error instanceof AuthError) {
    const statusCode = error.code === AUTH_ERROR_CODE.INVALID_CREDENTIALS ? 401 : 500;

    return NextResponse.json(
      {
        success: false,
        message: error.message,
        errorCode: error.code,
      },
      { status: statusCode },
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: AUTH_MESSAGE.INTERNAL_ERROR,
      errorCode: AUTH_ERROR_CODE.INTERNAL_ERROR,
    },
    { status: 500 },
  );
}

function resolveLoginKey(request: Request, email: string): string {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const clientIp = forwardedFor.split(",")[0]?.trim() || "unknown-ip";

  return `${email}:${clientIp}`;
}

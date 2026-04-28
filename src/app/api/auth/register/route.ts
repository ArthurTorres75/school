import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { env } from "@/lib/env";
import { AUTH_COOKIE, AUTH_ERROR_CODE, AUTH_MESSAGE } from "@/modules/users/user.constants";
import { AuthError } from "@/modules/users/user.errors";
import { registerUserSchema } from "@/modules/users/user.schemas";
import { authTokenService, userService } from "@/modules/users/auth.container";
import type { ApiErrorBody, ApiSuccessBody, SafeUser } from "@/modules/users/user.types";

export async function POST(request: Request): Promise<NextResponse<ApiSuccessBody<SafeUser> | ApiErrorBody>> {
  try {
    const payload: unknown = await request.json();
    const input = registerUserSchema.parse(payload);

    const user = await userService.register(input);
    const token = await authTokenService.signSession({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const responseBody: ApiSuccessBody<SafeUser> = {
      success: true,
      message: AUTH_MESSAGE.REGISTER_SUCCESS,
      data: user,
    };

    const response = NextResponse.json(responseBody, { status: 201 });

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
    const statusCode =
      error.code === AUTH_ERROR_CODE.USER_ALREADY_EXISTS
        ? 409
        : error.code === AUTH_ERROR_CODE.VALIDATION_ERROR
          ? 400
        : 401;

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

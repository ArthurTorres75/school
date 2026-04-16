import { NextResponse } from "next/server";

import { env } from "@/lib/env";
import { AUTH_COOKIE, AUTH_ERROR_CODE, AUTH_MESSAGE } from "@/modules/users/user.constants";
import { authTokenService } from "@/modules/users/auth.container";
import type { ApiErrorBody, AuthSession, UserRole } from "@/modules/users/user.types";

export async function resolveSessionFromRequest(request: Request): Promise<AuthSession | null> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = extractCookieValue(cookieHeader, AUTH_COOKIE.SESSION);

  if (!token) {
    return null;
  }

  try {
    return await authTokenService.verifySession(token);
  } catch {
    return null;
  }
}

export function ensureRole(
  session: AuthSession | null,
  allowedRoles: UserRole[],
): NextResponse<ApiErrorBody> | null {
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: AUTH_MESSAGE.INVALID_CREDENTIALS,
        errorCode: AUTH_ERROR_CODE.INVALID_CREDENTIALS,
      },
      { status: 401 },
    );
  }

  if (!allowedRoles.includes(session.role)) {
    return NextResponse.json(
      {
        success: false,
        message: AUTH_MESSAGE.FORBIDDEN,
        errorCode: AUTH_ERROR_CODE.FORBIDDEN,
      },
      { status: 403 },
    );
  }

  return null;
}

export function ensureSystemAdmin(session: AuthSession | null): NextResponse<ApiErrorBody> | null {
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: AUTH_MESSAGE.INVALID_CREDENTIALS,
        errorCode: AUTH_ERROR_CODE.INVALID_CREDENTIALS,
      },
      { status: 401 },
    );
  }

  if (!env.SYSTEM_ADMIN_EMAILS.includes(session.email.toLowerCase())) {
    return NextResponse.json(
      {
        success: false,
        message: AUTH_MESSAGE.FORBIDDEN,
        errorCode: AUTH_ERROR_CODE.FORBIDDEN,
      },
      { status: 403 },
    );
  }

  return null;
}

function extractCookieValue(cookieHeader: string, cookieName: string): string | null {
  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [rawName, ...rawValueParts] = cookie.trim().split("=");

    if (rawName !== cookieName) {
      continue;
    }

    return rawValueParts.join("=") || null;
  }

  return null;
}

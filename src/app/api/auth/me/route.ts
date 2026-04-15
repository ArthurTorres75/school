import { NextResponse } from "next/server";

import { AUTH_ERROR_CODE, AUTH_MESSAGE } from "@/modules/users/user.constants";
import { resolveSessionFromRequest } from "@/modules/users/auth-session";
import type { ApiErrorBody, ApiSuccessBody, AuthSession } from "@/modules/users/user.types";

export async function GET(request: Request): Promise<NextResponse<ApiSuccessBody<AuthSession> | ApiErrorBody>> {
  const session = await resolveSessionFromRequest(request);

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

  return NextResponse.json(
    {
      success: true,
      message: AUTH_MESSAGE.LOGIN_SUCCESS,
      data: session,
    },
    { status: 200 },
  );
}

import { NextResponse } from "next/server";

import { AUTH_COOKIE, AUTH_MESSAGE } from "@/modules/users/user.constants";

interface LogoutSuccessBody {
  success: true;
  message: string;
}

export async function POST(): Promise<NextResponse<LogoutSuccessBody>> {
  const responseBody: LogoutSuccessBody = {
    success: true,
    message: AUTH_MESSAGE.LOGOUT_SUCCESS,
  };

  const response = NextResponse.json(responseBody, { status: 200 });

  response.cookies.set(AUTH_COOKIE.SESSION, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    priority: "high",
  });

  return response;
}

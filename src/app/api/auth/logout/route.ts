import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE, AUTH_MESSAGE } from "@/modules/users/user.constants";

interface LogoutSuccessBody {
  success: true;
  message: string;
}

function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE.SESSION, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    priority: "high",
  });
}

export async function POST(): Promise<NextResponse<LogoutSuccessBody>> {
  const responseBody: LogoutSuccessBody = {
    success: true,
    message: AUTH_MESSAGE.LOGOUT_SUCCESS,
  };

  const response = NextResponse.json(responseBody, { status: 200 });
  clearSessionCookie(response);

  return response;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const destination = new URL("/", request.url);
  const response = NextResponse.redirect(destination);
  clearSessionCookie(response);

  return response;
}

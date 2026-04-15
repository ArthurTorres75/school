import { NextResponse } from "next/server";

import { AUTH_COOKIE, AUTH_MESSAGE } from "@/modules/users/user.constants";

export async function POST(): Promise<NextResponse<{ success: true; message: string }>> {
  const response = NextResponse.json(
    {
      success: true,
      message: AUTH_MESSAGE.LOGOUT_SUCCESS,
    },
    { status: 200 },
  );

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

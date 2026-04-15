import { NextResponse } from "next/server";

import { USER_ROLE } from "@/modules/users/user.constants";
import { ensureRole, resolveSessionFromRequest } from "@/modules/users/auth-session";

export async function GET(request: Request): Promise<NextResponse> {
  const session = await resolveSessionFromRequest(request);
  const roleError = ensureRole(session, [USER_ROLE.ADMIN]);

  if (roleError) {
    return roleError;
  }

  return NextResponse.json(
    {
      success: true,
      message: "Acceso admin autorizado.",
      data: {
        now: new Date().toISOString(),
      },
    },
    { status: 200 },
  );
}

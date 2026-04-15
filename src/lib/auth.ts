import { cookies } from "next/headers";

import { authTokenService } from "@/modules/users/auth.container";
import { AUTH_COOKIE } from "@/modules/users/user.constants";
import type { AuthSession } from "@/modules/users/user.types";

export async function getServerSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(AUTH_COOKIE.SESSION)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    return await authTokenService.verifySession(sessionToken);
  } catch {
    return null;
  }
}

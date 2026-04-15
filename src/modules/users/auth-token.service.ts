import "server-only";

import { SignJWT, jwtVerify } from "jose";

import { env } from "@/lib/env";
import type { AuthSession } from "@/modules/users/user.types";

const jwtSecret = new TextEncoder().encode(env.JWT_SECRET);

export class AuthTokenService {
  async signSession(session: AuthSession): Promise<string> {
    return new SignJWT({ role: session.role, email: session.email })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(session.sub)
      .setIssuedAt()
      .setIssuer(env.JWT_ISSUER)
      .setAudience(env.JWT_AUDIENCE)
      .setExpirationTime(`${env.JWT_EXPIRES_IN_SECONDS}s`)
      .sign(jwtSecret);
  }

  async verifySession(token: string): Promise<AuthSession> {
    const { payload } = await jwtVerify(token, jwtSecret, {
      issuer: env.JWT_ISSUER,
      audience: env.JWT_AUDIENCE,
      algorithms: ["HS256"],
    });

    const sub = payload.sub;
    const email = payload.email;
    const role = payload.role;

    if (
      typeof sub !== "string" ||
      typeof email !== "string" ||
      (role !== "admin" && role !== "teacher" && role !== "parent" && role !== "student")
    ) {
      throw new Error("Token de sesion invalido.");
    }

    return {
      sub,
      email,
      role,
    };
  }
}

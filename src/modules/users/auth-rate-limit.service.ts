import "server-only";

import { env } from "@/lib/env";

interface FailedLoginWindow {
  attempts: number;
  windowStartAt: number;
  lockoutUntil: number;
}

const loginFailures = new Map<string, FailedLoginWindow>();

export class AuthRateLimitService {
  canAttemptLogin(key: string): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
    const now = Date.now();
    const entry = loginFailures.get(key);

    if (!entry) {
      return { allowed: true };
    }

    if (entry.lockoutUntil > now) {
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((entry.lockoutUntil - now) / 1000)),
      };
    }

    if (entry.windowStartAt + env.AUTH_LOGIN_WINDOW_SECONDS * 1000 < now) {
      loginFailures.delete(key);
      return { allowed: true };
    }

    return { allowed: true };
  }

  registerFailedLogin(key: string): { locked: boolean; retryAfterSeconds?: number } {
    const now = Date.now();
    const existing = loginFailures.get(key);

    if (!existing || existing.windowStartAt + env.AUTH_LOGIN_WINDOW_SECONDS * 1000 < now) {
      loginFailures.set(key, {
        attempts: 1,
        windowStartAt: now,
        lockoutUntil: 0,
      });

      return { locked: false };
    }

    const attempts = existing.attempts + 1;

    if (attempts >= env.AUTH_LOGIN_MAX_ATTEMPTS) {
      const lockoutUntil = now + env.AUTH_LOGIN_LOCKOUT_SECONDS * 1000;

      loginFailures.set(key, {
        attempts,
        windowStartAt: existing.windowStartAt,
        lockoutUntil,
      });

      return {
        locked: true,
        retryAfterSeconds: env.AUTH_LOGIN_LOCKOUT_SECONDS,
      };
    }

    loginFailures.set(key, {
      attempts,
      windowStartAt: existing.windowStartAt,
      lockoutUntil: 0,
    });

    return { locked: false };
  }

  clearLoginFailures(key: string): void {
    loginFailures.delete(key);
  }
}

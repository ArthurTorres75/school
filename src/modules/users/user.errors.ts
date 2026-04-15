import { AUTH_ERROR_CODE, AUTH_MESSAGE } from "@/modules/users/user.constants";
import type { AuthErrorCode } from "@/modules/users/user.types";

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(resolveAuthMessage(code));
    this.code = code;
    this.name = "AuthError";
  }
}

function resolveAuthMessage(code: AuthErrorCode): string {
  switch (code) {
    case AUTH_ERROR_CODE.VALIDATION_ERROR:
      return AUTH_MESSAGE.VALIDATION_ERROR;
    case AUTH_ERROR_CODE.INVALID_CREDENTIALS:
      return AUTH_MESSAGE.INVALID_CREDENTIALS;
    case AUTH_ERROR_CODE.USER_ALREADY_EXISTS:
      return AUTH_MESSAGE.USER_ALREADY_EXISTS;
    case AUTH_ERROR_CODE.FORBIDDEN:
      return AUTH_MESSAGE.FORBIDDEN;
    case AUTH_ERROR_CODE.RATE_LIMITED:
      return AUTH_MESSAGE.RATE_LIMITED;
    case AUTH_ERROR_CODE.INTERNAL_ERROR:
      return AUTH_MESSAGE.INTERNAL_ERROR;
    default:
      return AUTH_MESSAGE.INTERNAL_ERROR;
  }
}

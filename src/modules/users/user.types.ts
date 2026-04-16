import type { AUTH_ERROR_CODE, USER_ROLE } from "@/modules/users/user.constants";

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export type AuthErrorCode = (typeof AUTH_ERROR_CODE)[keyof typeof AUTH_ERROR_CODE];

export interface UserCredentials {
  email: string;
  password: string;
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  role: UserRole;
  organizationSlug?: string;
}

export interface AuthSession {
  sub: string;
  email: string;
  role: UserRole;
}

export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errorCode: AuthErrorCode;
}

export interface ApiSuccessBody<TData> {
  success: true;
  message: string;
  data: TData;
}

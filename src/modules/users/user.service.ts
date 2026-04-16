import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

import { AUTH_ERROR_CODE } from "@/modules/users/user.constants";
import { AuthError } from "@/modules/users/user.errors";
import type { LoginInput, RegisterUserInput } from "@/modules/users/user.schemas";
import type { CreateUserInput, SafeUser, StoredUser } from "@/modules/users/user.types";
import type { UserRepository } from "@/modules/users/user.repository";

const scrypt = promisify(scryptCallback);

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(input: RegisterUserInput): Promise<SafeUser> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AuthError(AUTH_ERROR_CODE.USER_ALREADY_EXISTS);
    }

    const createUserInput: CreateUserInput = {
      fullName: input.fullName,
      email: input.email,
      role: input.role,
      organizationSlug: input.organizationSlug,
    };

    const passwordHash = await hashPassword(input.password);
    let storedUser: StoredUser;

    try {
      storedUser = await this.userRepository.create(createUserInput, passwordHash);
    } catch (error: unknown) {
      if (isUniqueConstraintError(error)) {
        throw new AuthError(AUTH_ERROR_CODE.USER_ALREADY_EXISTS);
      }

      throw error;
    }

    return toSafeUser(storedUser);
  }

  async login(input: LoginInput): Promise<SafeUser> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new AuthError(AUTH_ERROR_CODE.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await verifyPassword(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AuthError(AUTH_ERROR_CODE.INVALID_CREDENTIALS);
    }

    return toSafeUser(user);
  }
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password: string, storedValue: string): Promise<boolean> {
  const [salt, hashedPassword] = storedValue.split(":");

  if (!salt || !hashedPassword) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const hashedPasswordBuffer = Buffer.from(hashedPassword, "hex");

  if (derivedKey.length !== hashedPasswordBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedKey, hashedPasswordBuffer);
}

function toSafeUser(user: StoredUser): SafeUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

function isUniqueConstraintError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }

  return error.code === "P2002";
}

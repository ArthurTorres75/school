import { prisma } from "@/lib/prisma";

import type { CreateUserInput, StoredUser } from "@/modules/users/user.types";

export interface UserRepository {
  findByEmail(email: string): Promise<StoredUser | null>;
  create(input: CreateUserInput, passwordHash: string): Promise<StoredUser>;
}

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<StoredUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(input: CreateUserInput, passwordHash: string): Promise<StoredUser> {
    const user = await prisma.user.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        role: input.role,
        passwordHash,
      },
    });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

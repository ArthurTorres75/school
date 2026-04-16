import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

import type { CreateUserInput, StoredUser } from "@/modules/users/user.types";

const DEFAULT_ORGANIZATION_SLUG = "default-school";
const DEFAULT_ORGANIZATION_NAME = "Default School";

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
    const user = await prisma.$transaction(async (transaction) => {
      const organization = await resolveOrganization(transaction, input.organizationSlug);
      const createdUser = await transaction.user.create({
        data: {
          fullName: input.fullName,
          email: input.email,
          role: input.role,
          passwordHash,
          organizationId: organization.id,
        },
      });

      if (input.role === "student") {
        await transaction.student.create({
          data: {
            userId: createdUser.id,
            organizationId: organization.id,
            isActive: true,
          },
        });
      }

      if (input.role === "teacher") {
        await transaction.teacher.create({
          data: {
            userId: createdUser.id,
            organizationId: organization.id,
          },
        });
      }

      if (input.role === "parent") {
        await transaction.parent.create({
          data: {
            userId: createdUser.id,
            organizationId: organization.id,
          },
        });
      }

      return createdUser;
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

async function resolveOrganization(transaction: Prisma.TransactionClient, organizationSlug?: string) {
  if (organizationSlug) {
    return transaction.organization.upsert({
      where: { slug: organizationSlug },
      update: { isActive: true },
      create: {
        slug: organizationSlug,
        name: toOrganizationName(organizationSlug),
        isActive: true,
      },
    });
  }

  const activeOrganization = await transaction.organization.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (activeOrganization) {
    return activeOrganization;
  }

  return transaction.organization.upsert({
    where: { slug: DEFAULT_ORGANIZATION_SLUG },
    update: { isActive: true },
    create: {
      slug: DEFAULT_ORGANIZATION_SLUG,
      name: DEFAULT_ORGANIZATION_NAME,
      isActive: true,
    },
  });
}

function toOrganizationName(slug: string): string {
  const normalized = slug.trim();

  if (!normalized) {
    return DEFAULT_ORGANIZATION_NAME;
  }

  return normalized
    .split("-")
    .filter((part) => part.length > 0)
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(" ");
}

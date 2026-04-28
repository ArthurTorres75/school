import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

import { AuthError } from "@/modules/users/user.errors";
import { AUTH_ERROR_CODE } from "@/modules/users/user.constants";
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
      registeredParentEmail: user.registeredParentEmail,
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
          registeredParentEmail: input.parentEmail ?? null,
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
        const parentProfile = await transaction.parent.create({
          data: {
            userId: createdUser.id,
            organizationId: organization.id,
          },
        });

        if (input.representedStudentEmail) {
          const studentProfile = await transaction.student.findFirst({
            where: {
              organizationId: organization.id,
              user: {
                email: input.representedStudentEmail,
                role: "student",
              },
            },
            select: { id: true, userId: true, user: { select: { registeredParentEmail: true } } },
          });

          if (!studentProfile) {
            throw new AuthError(
              AUTH_ERROR_CODE.VALIDATION_ERROR,
              "No se encontro un estudiante con ese email en la institucion seleccionada.",
            );
          }

          await transaction.parentStudent.upsert({
            where: {
              studentId_parentId: {
                studentId: studentProfile.id,
                parentId: parentProfile.id,
              },
            },
            update: {},
            create: {
              studentId: studentProfile.id,
              parentId: parentProfile.id,
            },
          });

          if (!studentProfile.user.registeredParentEmail) {
            await transaction.user.update({
              where: { id: studentProfile.userId },
              data: { registeredParentEmail: createdUser.email },
            });
          }
        }
      }

      return createdUser;
    });

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      registeredParentEmail: user.registeredParentEmail,
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

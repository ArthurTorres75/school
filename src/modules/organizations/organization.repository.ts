import { prisma } from "@/lib/prisma";
import type { CreateOrganizationInput, OrganizationRecord } from "@/modules/organizations/organization.types";

export interface OrganizationRepository {
  findBySlug(slug: string): Promise<OrganizationRecord | null>;
  create(input: Required<CreateOrganizationInput>): Promise<OrganizationRecord>;
}

export class PrismaOrganizationRepository implements OrganizationRepository {
  async findBySlug(slug: string): Promise<OrganizationRecord | null> {
    const organization = await prisma.organization.findUnique({
      where: { slug },
    });

    if (!organization) {
      return null;
    }

    return organization;
  }

  async create(input: Required<CreateOrganizationInput>): Promise<OrganizationRecord> {
    return prisma.organization.create({
      data: {
        name: input.name,
        slug: input.slug,
        isActive: true,
      },
    });
  }
}

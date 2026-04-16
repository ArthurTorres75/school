import { OrganizationError, ORGANIZATION_ERROR_CODE } from "@/modules/organizations/organization.errors";
import type { OrganizationRepository } from "@/modules/organizations/organization.repository";
import type {
  CreateOrganizationInput,
  OrganizationResponse,
  OrganizationRecord,
} from "@/modules/organizations/organization.types";

export class OrganizationService {
  constructor(private readonly organizationRepository: OrganizationRepository) {}

  async create(input: CreateOrganizationInput): Promise<OrganizationResponse> {
    const slug = normalizeOrganizationSlug(input.slug ?? input.name);
    const existingOrganization = await this.organizationRepository.findBySlug(slug);

    if (existingOrganization) {
      throw new OrganizationError(
        ORGANIZATION_ERROR_CODE.ORGANIZATION_ALREADY_EXISTS,
        "Ya existe una organizacion con ese slug.",
      );
    }

    const organization = await this.organizationRepository.create({
      name: input.name,
      slug,
    });

    return toOrganizationResponse(organization);
  }
}

function normalizeOrganizationSlug(value: string): string {
  const normalized = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (normalized.length < 2) {
    throw new OrganizationError(
      ORGANIZATION_ERROR_CODE.INVALID_ORGANIZATION_SLUG,
      "No se pudo generar un slug valido para la organizacion.",
    );
  }

  return normalized;
}

function toOrganizationResponse(organization: OrganizationRecord): OrganizationResponse {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    isActive: organization.isActive,
    createdAt: organization.createdAt.toISOString(),
    updatedAt: organization.updatedAt.toISOString(),
  };
}

import { PrismaOrganizationRepository } from "@/modules/organizations/organization.repository";
import { OrganizationService } from "@/modules/organizations/organization.service";

const organizationRepository = new PrismaOrganizationRepository();

export const organizationService = new OrganizationService(organizationRepository);

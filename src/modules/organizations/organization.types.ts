export interface CreateOrganizationInput {
  name: string;
  slug?: string;
}

export interface PublicOrganizationItem {
  slug: string;
  name: string;
}

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationResponse {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

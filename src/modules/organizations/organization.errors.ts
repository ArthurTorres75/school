export const ORGANIZATION_ERROR_CODE = {
  ORGANIZATION_ALREADY_EXISTS: "ORGANIZATION_ALREADY_EXISTS",
  INVALID_ORGANIZATION_SLUG: "INVALID_ORGANIZATION_SLUG",
} as const;

export type OrganizationErrorCode =
  (typeof ORGANIZATION_ERROR_CODE)[keyof typeof ORGANIZATION_ERROR_CODE];

export class OrganizationError extends Error {
  constructor(public readonly code: OrganizationErrorCode, message: string) {
    super(message);
    this.name = "OrganizationError";
  }
}

import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ensureSystemAdmin, resolveSessionFromRequest } from "@/modules/users/auth-session";
import { AUTH_ERROR_CODE, AUTH_MESSAGE } from "@/modules/users/user.constants";
import type { ApiErrorBody, ApiSuccessBody } from "@/modules/users/user.types";
import { organizationService } from "@/modules/organizations/organization.container";
import { OrganizationError, ORGANIZATION_ERROR_CODE } from "@/modules/organizations/organization.errors";
import { createOrganizationSchema } from "@/modules/organizations/organization.schema";
import type { OrganizationResponse } from "@/modules/organizations/organization.types";

export async function POST(
  request: Request,
): Promise<NextResponse<ApiSuccessBody<OrganizationResponse> | ApiErrorBody>> {
  const session = await resolveSessionFromRequest(request);
  const systemAdminError = ensureSystemAdmin(session);

  if (systemAdminError) {
    return systemAdminError;
  }

  try {
    const payload: unknown = await request.json();
    const input = createOrganizationSchema.parse(payload);
    const organization = await organizationService.create(input);

    return NextResponse.json(
      {
        success: true,
        message: "Organizacion creada exitosamente.",
        data: organization,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return mapError(error);
  }
}

function mapError(error: unknown): NextResponse<ApiErrorBody> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: error.issues[0]?.message ?? AUTH_MESSAGE.INTERNAL_ERROR,
        errorCode: AUTH_ERROR_CODE.VALIDATION_ERROR,
      },
      { status: 400 },
    );
  }

  if (error instanceof OrganizationError) {
    const statusCode =
      error.code === ORGANIZATION_ERROR_CODE.ORGANIZATION_ALREADY_EXISTS ? 409 : 400;

    return NextResponse.json(
      {
        success: false,
        message: error.message,
        errorCode: AUTH_ERROR_CODE.VALIDATION_ERROR,
      },
      { status: statusCode },
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: AUTH_MESSAGE.INTERNAL_ERROR,
      errorCode: AUTH_ERROR_CODE.INTERNAL_ERROR,
    },
    { status: 500 },
  );
}

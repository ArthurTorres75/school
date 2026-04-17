import { NextResponse } from "next/server";

import { organizationService } from "@/modules/organizations/organization.container";
import type { PublicOrganizationItem } from "@/modules/organizations/organization.types";
import type { ApiErrorBody, ApiSuccessBody } from "@/modules/users/user.types";

export async function GET(): Promise<NextResponse<ApiSuccessBody<PublicOrganizationItem[]> | ApiErrorBody>> {
  try {
    const organizations = await organizationService.findAll();

    return NextResponse.json(
      {
        success: true,
        message: "Organizaciones obtenidas exitosamente.",
        data: organizations,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Error al obtener las organizaciones.",
        errorCode: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

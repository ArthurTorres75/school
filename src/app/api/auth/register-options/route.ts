import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { AUTH_ERROR_CODE } from "@/modules/users/user.constants";
import type { ApiErrorBody, ApiSuccessBody } from "@/modules/users/user.types";

interface RegisterStudentOption {
  email: string;
  label: string;
}

interface RegisterOptionsData {
  students: RegisterStudentOption[];
}

export async function GET(
  request: Request,
): Promise<NextResponse<ApiSuccessBody<RegisterOptionsData> | ApiErrorBody>> {
  const { searchParams } = new URL(request.url);
  const organizationSlug = searchParams.get("organizationSlug")?.trim().toLowerCase();
  const searchTerm = searchParams.get("q")?.trim();

  if (!organizationSlug) {
    return NextResponse.json(
      {
        success: false,
        message: "Debes indicar organizationSlug.",
        errorCode: AUTH_ERROR_CODE.VALIDATION_ERROR,
      },
      { status: 400 },
    );
  }

  const organization = await prisma.organization.findUnique({
    where: { slug: organizationSlug },
    select: { id: true, isActive: true },
  });

  if (!organization || !organization.isActive) {
    return NextResponse.json(
      {
        success: false,
        message: "Organizacion no encontrada.",
        errorCode: AUTH_ERROR_CODE.VALIDATION_ERROR,
      },
      { status: 404 },
    );
  }

  const studentsRaw = await prisma.user.findMany({
    where: {
      role: "student",
      organizationId: organization.id,
      ...(searchTerm
        ? {
            OR: [
              {
                fullName: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
    select: {
      email: true,
      fullName: true,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const students = studentsRaw.map((student) => ({
    email: student.email,
    label: `${student.fullName} (${student.email})`,
  }));

  return NextResponse.json(
    {
      success: true,
      message: "Opciones de registro obtenidas.",
      data: { students },
    },
    { status: 200 },
  );
}

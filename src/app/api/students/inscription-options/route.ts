import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ensureRole, resolveSessionFromRequest } from "@/modules/users/auth-session";
import { AUTH_ERROR_CODE, AUTH_MESSAGE, USER_ROLE } from "@/modules/users/user.constants";
import type { ApiErrorBody, ApiSuccessBody } from "@/modules/users/user.types";

interface InscriptionOptionItem {
  id: string;
  label: string;
}

interface InscriptionOptionsData {
  organizationId: string;
  organizationSlug: string;
  actorRole: "admin" | "parent";
  actorParentUserId?: string;
  students: InscriptionOptionItem[];
  parents: InscriptionOptionItem[];
  courses: InscriptionOptionItem[];
}

export async function GET(
  request: Request,
): Promise<NextResponse<ApiSuccessBody<InscriptionOptionsData> | ApiErrorBody>> {
  const session = await resolveSessionFromRequest(request);
  const roleError = ensureRole(session, [USER_ROLE.PARENT, USER_ROLE.ADMIN]);

  if (roleError) {
    return roleError;
  }

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: AUTH_MESSAGE.INVALID_CREDENTIALS,
        errorCode: AUTH_ERROR_CODE.INVALID_CREDENTIALS,
      },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const organizationSlug = searchParams.get("organizationSlug")?.trim().toLowerCase();

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
    select: { id: true, slug: true, isActive: true },
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

  const [studentsRaw, parentsRaw, actorParentProfile, coursesRaw] = await Promise.all([
    prisma.student.findMany({
      where: {
        organizationId: organization.id,
        inscription: null,
      },
      select: {
        userId: true,
        user: {
          select: {
            fullName: true,
            email: true,
            registeredParentEmail: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.parent.findMany({
      where: { organizationId: organization.id },
      select: {
        userId: true,
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    session.role === USER_ROLE.PARENT
      ? prisma.parent.findUnique({
          where: { userId: session.sub },
          select: {
            userId: true,
            children: { select: { student: { select: { userId: true } } } },
          },
        })
      : Promise.resolve(null),
    prisma.course.findMany({
      where: {
        organizationId: organization.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        code: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const actorRole: InscriptionOptionsData["actorRole"] =
    session.role === USER_ROLE.ADMIN ? USER_ROLE.ADMIN : USER_ROLE.PARENT;

  const parentLinkedStudentUserIds = new Set(
    actorParentProfile?.children?.map((c) => c.student.userId) ?? [],
  );

  const students =
    session.role === USER_ROLE.PARENT
      ? studentsRaw
          .filter((student) => {
            const byEmail =
              (student.user.registeredParentEmail ?? "").toLowerCase() === session.email.toLowerCase();
            const byLink = parentLinkedStudentUserIds.has(student.userId);
            return byEmail || byLink;
          })
          .map((student) => ({
            id: student.userId,
            label: `${student.user.fullName} (${student.user.email})`,
          }))
      : studentsRaw.map((student) => ({
          id: student.userId,
          label: `${student.user.fullName} (${student.user.email})`,
        }));

  const parents = parentsRaw.map((parent) => ({
    id: parent.userId,
    label: `${parent.user.fullName} (${parent.user.email})`,
  }));

  const courses = coursesRaw.map((course) => ({
    id: course.id,
    label: course.code ? `${course.name} (${course.code})` : course.name,
  }));

  const responseBody: ApiSuccessBody<InscriptionOptionsData> = {
    success: true,
    message: "Opciones de inscripcion obtenidas.",
    data: {
      organizationId: organization.id,
      organizationSlug: organization.slug,
      actorRole,
      actorParentUserId: actorParentProfile?.userId,
      students,
      parents,
      courses,
    },
  };

  return NextResponse.json(responseBody, { status: 200 });
}

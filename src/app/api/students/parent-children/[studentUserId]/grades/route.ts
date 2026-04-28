import { NextResponse } from "next/server";

import { STUDENT_ERROR_CODE, StudentError } from "@/modules/students/student.errors";
import { studentService } from "@/modules/students/student.container";
import { STUDENT_GRADES_VIEWER_ROLE, type ParentChildGradesResult } from "@/modules/students/student.types";
import { ensureRole, resolveSessionFromRequest } from "@/modules/users/auth-session";
import { AUTH_ERROR_CODE, AUTH_MESSAGE, USER_ROLE } from "@/modules/users/user.constants";
import type { ApiErrorBody, ApiSuccessBody } from "@/modules/users/user.types";

interface RouteParams {
  params: Promise<{
    studentUserId: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteParams,
): Promise<NextResponse<ApiSuccessBody<ParentChildGradesResult> | ApiErrorBody>> {
  try {
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

    const { studentUserId } = await context.params;

    const actorRole =
      session.role === USER_ROLE.ADMIN ? STUDENT_GRADES_VIEWER_ROLE.ADMIN : STUDENT_GRADES_VIEWER_ROLE.PARENT;

    const data = await studentService.getViewerChildGrades(
      {
        userId: session.sub,
        role: actorRole,
      },
      studentUserId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Calificaciones del estudiante obtenidas correctamente.",
        data,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof StudentError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          errorCode: AUTH_ERROR_CODE.FORBIDDEN,
        },
        { status: mapStudentErrorStatus(error.code) },
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
}

function mapStudentErrorStatus(code: string): number {
  if (code === STUDENT_ERROR_CODE.INVALID_PARENT_LINK) {
    return 403;
  }

  if (code === STUDENT_ERROR_CODE.STUDENT_NOT_FOUND) {
    return 404;
  }

  return 400;
}

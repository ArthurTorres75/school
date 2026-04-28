import { NextResponse } from "next/server";

import { studentService } from "@/modules/students/student.container";
import { ensureRole, resolveSessionFromRequest } from "@/modules/users/auth-session";
import { AUTH_ERROR_CODE, AUTH_MESSAGE, USER_ROLE } from "@/modules/users/user.constants";
import type { ApiErrorBody, ApiSuccessBody } from "@/modules/users/user.types";
import {
  STUDENT_GRADES_VIEWER_ROLE,
  type StudentGradesViewerListResult,
} from "@/modules/students/student.types";

export async function GET(
  request: Request,
): Promise<NextResponse<ApiSuccessBody<StudentGradesViewerListResult> | ApiErrorBody>> {
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

  const actorRole =
    session.role === USER_ROLE.ADMIN ? STUDENT_GRADES_VIEWER_ROLE.ADMIN : STUDENT_GRADES_VIEWER_ROLE.PARENT;

  const data = await studentService.listViewerChildren({
    userId: session.sub,
    role: actorRole,
  });

  return NextResponse.json(
    {
      success: true,
      message: "Lista de estudiantes obtenida correctamente.",
      data,
    },
    { status: 200 },
  );
}

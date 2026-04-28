import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { STUDENT_ERROR_CODE, StudentError, type StudentErrorCode } from "@/modules/students/student.errors";
import { studentService } from "@/modules/students/student.container";
import type { CreateStudentInscriptionInput, StudentInscriptionActorRole, StudentInscriptionResult } from "@/modules/students/student.types";
import { ensureRole, resolveSessionFromRequest } from "@/modules/users/auth-session";
import { AUTH_ERROR_CODE, AUTH_MESSAGE, USER_ROLE } from "@/modules/users/user.constants";
import type { ApiErrorBody, ApiSuccessBody, AuthErrorCode } from "@/modules/users/user.types";

type StudentRouteErrorCode = StudentErrorCode | AuthErrorCode;

interface StudentApiErrorBody {
  success: false;
  message: string;
  errorCode: StudentRouteErrorCode;
}

export async function POST(
  request: Request,
): Promise<NextResponse<ApiSuccessBody<StudentInscriptionResult> | StudentApiErrorBody | ApiErrorBody>> {
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
          message: AUTH_MESSAGE.FORBIDDEN,
          errorCode: AUTH_ERROR_CODE.FORBIDDEN,
        },
        { status: 401 },
      );
    }

    const payload: unknown = await request.json();
    const input = payload as CreateStudentInscriptionInput;

    const result = await studentService.inscribeStudent(input, {
      userId: session.sub,
      role: session.role as StudentInscriptionActorRole,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Inscripcion completada exitosamente.",
        data: result,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return mapError(error);
  }
}

function mapError(error: unknown): NextResponse<StudentApiErrorBody> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: error.issues[0]?.message ?? AUTH_MESSAGE.VALIDATION_ERROR,
        errorCode: AUTH_ERROR_CODE.VALIDATION_ERROR,
      },
      { status: 400 },
    );
  }

  if (error instanceof StudentError) {
    const status = mapStudentErrorStatus(error.code);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
        errorCode: error.code,
      },
      { status },
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

function mapStudentErrorStatus(code: StudentErrorCode): number {
  switch (code) {
    case STUDENT_ERROR_CODE.STUDENT_NOT_FOUND:
      return 404;
    case STUDENT_ERROR_CODE.DUPLICATE_CEDULA:
    case STUDENT_ERROR_CODE.DUPLICATE_ENROLLMENT:
    case STUDENT_ERROR_CODE.STUDENT_ALREADY_INSCRIBED:
      return 409;
    case STUDENT_ERROR_CODE.FORBIDDEN_ACTOR:
    case STUDENT_ERROR_CODE.STUDENT_ROLE_MISMATCH:
    case STUDENT_ERROR_CODE.TENANT_MISMATCH:
      return 403;
    case STUDENT_ERROR_CODE.MISSING_PARENT_REFERENCE:
    case STUDENT_ERROR_CODE.INVALID_PARENT_LINK:
    case STUDENT_ERROR_CODE.INVALID_GRADE_LEVEL:
    case STUDENT_ERROR_CODE.INVALID_COURSE_SELECTION:
    case STUDENT_ERROR_CODE.VALIDATION_ERROR:
      return 400;
    case STUDENT_ERROR_CODE.TRANSACTION_FAILED:
    default:
      return 500;
  }
}

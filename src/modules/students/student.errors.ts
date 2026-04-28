export const STUDENT_ERROR_CODE = {
  FORBIDDEN_ACTOR: "FORBIDDEN_ACTOR",
  MISSING_PARENT_REFERENCE: "MISSING_PARENT_REFERENCE",
  STUDENT_NOT_FOUND: "STUDENT_NOT_FOUND",
  STUDENT_ROLE_MISMATCH: "STUDENT_ROLE_MISMATCH",
  INVALID_PARENT_LINK: "INVALID_PARENT_LINK",
  INVALID_GRADE_LEVEL: "INVALID_GRADE_LEVEL",
  INVALID_COURSE_SELECTION: "INVALID_COURSE_SELECTION",
  STUDENT_ALREADY_INSCRIBED: "STUDENT_ALREADY_INSCRIBED",
  DUPLICATE_CEDULA: "DUPLICATE_CEDULA",
  DUPLICATE_ENROLLMENT: "DUPLICATE_ENROLLMENT",
  TENANT_MISMATCH: "TENANT_MISMATCH",
  TRANSACTION_FAILED: "TRANSACTION_FAILED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
} as const;

export type StudentErrorCode = (typeof STUDENT_ERROR_CODE)[keyof typeof STUDENT_ERROR_CODE];

const DEFAULT_MESSAGES: Record<StudentErrorCode, string> = {
  FORBIDDEN_ACTOR: "No tienes permisos para inscribir estudiantes.",
  MISSING_PARENT_REFERENCE: "El administrador debe indicar un representante.",
  STUDENT_NOT_FOUND: "No se encontro el estudiante solicitado.",
  STUDENT_ROLE_MISMATCH: "El usuario indicado no tiene rol de estudiante.",
  INVALID_PARENT_LINK: "El representante no coincide con el estudiante indicado.",
  INVALID_GRADE_LEVEL: "El grado debe estar entre 1 y 12.",
  INVALID_COURSE_SELECTION: "Debes indicar cursos validos para la organizacion.",
  STUDENT_ALREADY_INSCRIBED: "El estudiante ya tiene una inscripcion activa.",
  DUPLICATE_CEDULA: "La cedula del estudiante ya existe en el sistema.",
  DUPLICATE_ENROLLMENT: "El estudiante ya esta inscrito en al menos una materia indicada.",
  TENANT_MISMATCH: "El estudiante y representante deben pertenecer a la misma organizacion.",
  TRANSACTION_FAILED: "No se pudo completar la inscripcion de forma atomica.",
  VALIDATION_ERROR: "Los datos de inscripcion no son validos.",
};

export class StudentError extends Error {
  constructor(
    public readonly code: StudentErrorCode,
    message = DEFAULT_MESSAGES[code],
  ) {
    super(message);
    this.name = "StudentError";
  }
}

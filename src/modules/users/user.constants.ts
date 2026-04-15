export const USER_ROLE = {
  ADMIN: "admin",
  TEACHER: "teacher",
  PARENT: "parent",
  STUDENT: "student",
} as const;

export const AUTH_ERROR_CODE = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  FORBIDDEN: "FORBIDDEN",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export const AUTH_MESSAGE = {
  LOGIN_SUCCESS: "Inicio de sesion exitoso.",
  REGISTER_SUCCESS: "Usuario registrado exitosamente.",
  LOGOUT_SUCCESS: "Sesion cerrada correctamente.",
  VALIDATION_ERROR: "Los datos enviados no son validos.",
  INVALID_CREDENTIALS: "Credenciales invalidas.",
  USER_ALREADY_EXISTS: "Ya existe un usuario con ese correo.",
  FORBIDDEN: "No tenes permisos para acceder a este recurso.",
  RATE_LIMITED: "Demasiados intentos. Espera antes de volver a intentar.",
  INTERNAL_ERROR: "No se pudo procesar la solicitud.",
} as const;

export const AUTH_COOKIE = {
  SESSION: "school.session",
} as const;

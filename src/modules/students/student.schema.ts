import { z } from "zod";

import {
  STUDENT_INSCRIPTION_ACTOR_ROLE,
  type CreateStudentInput,
  type CreateStudentInscriptionInput,
  type CreateStudentInscriptionValidatedInput,
  type StudentInscriptionActorRole,
  type UpdateStudentInput,
} from "@/modules/students/student.types";

const trimmedString = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z.string().min(1, { error: "Este campo es obligatorio." }),
);

const normalizedEmailSchema = z
  .string()
  .transform((value) => value.trim().toLowerCase())
  .pipe(z.email({ error: "Correo electronico invalido." }));

const createStudentInputSchema = z.object({
  fullName: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z
      .string()
      .min(2, { error: "El nombre debe tener al menos 2 caracteres." })
      .max(120, { error: "El nombre supera el largo permitido." }),
  ),
  email: normalizedEmailSchema,
});

const updateStudentInputSchema = z.object({
  fullName: z
    .preprocess(
      (value) => (typeof value === "string" ? value.trim() : value),
      z
        .string()
        .min(2, { error: "El nombre debe tener al menos 2 caracteres." })
        .max(120, { error: "El nombre supera el largo permitido." }),
    )
    .optional(),
  email: normalizedEmailSchema.optional(),
});

const enrollmentsSchema = z
  .array(
    z.object({
      courseId: trimmedString,
    }),
  )
  .min(1, { error: "Debes indicar al menos un curso." })
  .superRefine((items, ctx) => {
    const uniqueIds = new Set(items.map((item) => item.courseId));

    if (uniqueIds.size !== items.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No se permiten cursos repetidos en la misma inscripcion.",
        path: ["enrollments"],
      });
    }
  });

const baseInscriptionSchema = z.object({
  studentUserId: trimmedString,
  organizationId: trimmedString,
  birthDate: z.coerce.date({ error: "La fecha de nacimiento es obligatoria." }),
  gradeLevel: z
    .number({ error: "El grado es obligatorio." })
    .int({ error: "El grado debe ser un numero entero." })
    .min(1, { error: "El grado minimo permitido es 1." })
    .max(12, { error: "El grado maximo permitido es 12." }),
  cedulaNumber: z
    .preprocess(
      (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
      z
        .string()
        .min(5, { error: "La cedula debe tener al menos 5 caracteres." })
        .max(32, { error: "La cedula supera el limite permitido." }),
    ),
  parentUserId: trimmedString.optional(),
  enrollments: enrollmentsSchema,
});

const adminInscriptionSchema = baseInscriptionSchema.extend({
  parentUserId: trimmedString,
});

const parentInscriptionSchema = baseInscriptionSchema.superRefine((value, ctx) => {
  if (value.parentUserId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El representante autenticado no debe enviar parentUserId.",
      path: ["parentUserId"],
    });
  }
});

export function validateCreateStudentInput(input: CreateStudentInput): CreateStudentInput {
  return createStudentInputSchema.parse(input);
}

export function validateUpdateStudentInput(input: UpdateStudentInput): UpdateStudentInput {
  return updateStudentInputSchema.parse(input);
}

export function validateCreateStudentInscriptionInput(
  input: CreateStudentInscriptionInput,
  actorRole: StudentInscriptionActorRole,
): CreateStudentInscriptionValidatedInput {
  if (actorRole === STUDENT_INSCRIPTION_ACTOR_ROLE.ADMIN) {
    return adminInscriptionSchema.parse(input);
  }

  if (actorRole === STUDENT_INSCRIPTION_ACTOR_ROLE.PARENT) {
    return parentInscriptionSchema.parse(input);
  }

  throw new Error("Rol de actor no soportado para inscripcion.");
}

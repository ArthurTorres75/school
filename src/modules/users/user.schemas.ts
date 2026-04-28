import { z } from "zod";

import { USER_ROLE } from "@/modules/users/user.constants";

const normalizedEmailSchema = z
  .string()
  .transform((value) => value.trim().toLowerCase())
  .pipe(z.email({ error: "Correo electronico invalido." }));

const optionalNormalizedEmailSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const normalizedValue = value.trim().toLowerCase();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
}, z.email({ error: "Correo electronico invalido." }).optional());

const optionalOrganizationSlugSchema = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const normalizedValue = value.trim().toLowerCase();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
}, z.string().min(2).max(64).optional());

const passwordPolicySchema = z
  .string()
  .min(8, { error: "La contrasena debe tener al menos 8 caracteres." })
  .max(72, { error: "La contrasena supera el limite permitido." })
  .regex(/[A-Z]/, { error: "La contrasena debe incluir una mayuscula." })
  .regex(/[a-z]/, { error: "La contrasena debe incluir una minuscula." })
  .regex(/[0-9]/, { error: "La contrasena debe incluir un numero." });

export const registerUserSchema = z.object({
  fullName: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z
      .string()
      .min(2, { error: "El nombre debe tener al menos 2 caracteres." })
      .max(120, { error: "El nombre supera el largo permitido." }),
  ),
  email: normalizedEmailSchema,
  parentEmail: optionalNormalizedEmailSchema,
  representedStudentEmail: optionalNormalizedEmailSchema,
  password: passwordPolicySchema,
  role: z.enum([USER_ROLE.TEACHER, USER_ROLE.PARENT, USER_ROLE.STUDENT]),
  organizationSlug: optionalOrganizationSlugSchema,
}).superRefine((data, ctx) => {
  if (data.role !== USER_ROLE.STUDENT && data.parentEmail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Solo los estudiantes pueden enviar parentEmail.",
      path: ["parentEmail"],
    });
  }

  if (data.role !== USER_ROLE.PARENT && data.representedStudentEmail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Solo padres/madres pueden indicar un estudiante representado.",
      path: ["representedStudentEmail"],
    });
  }
});

export const loginSchema = z.object({
  email: normalizedEmailSchema,
  password: z.string().min(1, { error: "La contrasena es obligatoria." }),
});

export type RegisterUserFormInput = z.input<typeof registerUserSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

import { z } from "zod";

import { USER_ROLE } from "@/modules/users/user.constants";

const normalizedEmailSchema = z
  .string()
  .transform((value) => value.trim().toLowerCase())
  .pipe(z.email({ error: "Correo electronico invalido." }));

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
  password: passwordPolicySchema,
  role: z.enum([USER_ROLE.ADMIN, USER_ROLE.TEACHER, USER_ROLE.PARENT, USER_ROLE.STUDENT]),
});

export const loginSchema = z.object({
  email: normalizedEmailSchema,
  password: z.string().min(1, { error: "La contrasena es obligatoria." }),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

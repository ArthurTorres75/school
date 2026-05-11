import { z } from "zod";
import { USER_ROLE } from "@/modules/users/user.constants";
import type { Language } from "@/lib/i18n";

export const VALIDATION_MESSAGES = {
  es: {
    emailInvalid: "Correo electrónico inválido.",
    passwordMinLength: "La contraseña debe tener al menos 8 caracteres.",
    passwordMaxLength: "La contraseña supera el límite permitido.",
    passwordRequiresUppercase: "La contraseña debe incluir una mayúscula.",
    passwordRequiresLowercase: "La contraseña debe incluir una minúscula.",
    passwordRequiresNumber: "La contraseña debe incluir un número.",
    fullNameMinLength: "El nombre debe tener al menos 2 caracteres.",
    fullNameMaxLength: "El nombre supera el largo permitido.",
    parentEmailOnlyForStudents: "Solo los estudiantes pueden enviar email de representante.",
    representedStudentOnlyForParents: "Solo padres/madres pueden indicar un estudiante representado.",
    passwordRequired: "La contraseña es obligatoria.",
  },
  en: {
    emailInvalid: "Invalid email address.",
    passwordMinLength: "Password must be at least 8 characters.",
    passwordMaxLength: "Password exceeds the maximum length.",
    passwordRequiresUppercase: "Password must include an uppercase letter.",
    passwordRequiresLowercase: "Password must include a lowercase letter.",
    passwordRequiresNumber: "Password must include a number.",
    fullNameMinLength: "Full name must be at least 2 characters.",
    fullNameMaxLength: "Full name exceeds the maximum length.",
    parentEmailOnlyForStudents: "Only students can provide a parent email.",
    representedStudentOnlyForParents: "Only parents can indicate a represented student.",
    passwordRequired: "Password is required.",
  },
} as const;

function createNormalizedEmailSchema(messages: typeof VALIDATION_MESSAGES.es) {
  return z
    .string()
    .transform((value) => value.trim().toLowerCase())
    .pipe(z.email({ message: messages.emailInvalid }));
}

function createOptionalNormalizedEmailSchema(messages: typeof VALIDATION_MESSAGES.es) {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const normalizedValue = value.trim().toLowerCase();
    return normalizedValue.length > 0 ? normalizedValue : undefined;
  }, z.email({ message: messages.emailInvalid }).optional());
}

function createOptionalOrganizationSlugSchema() {
  return z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const normalizedValue = value.trim().toLowerCase();
    return normalizedValue.length > 0 ? normalizedValue : undefined;
  }, z.string().min(2).max(64).optional());
}

function createPasswordPolicySchema(messages: typeof VALIDATION_MESSAGES.es) {
  return z
    .string()
    .min(8, { message: messages.passwordMinLength })
    .max(72, { message: messages.passwordMaxLength })
    .regex(/[A-Z]/, { message: messages.passwordRequiresUppercase })
    .regex(/[a-z]/, { message: messages.passwordRequiresLowercase })
    .regex(/[0-9]/, { message: messages.passwordRequiresNumber });
}

function createRegisterUserSchema(messages: typeof VALIDATION_MESSAGES.es) {
  const normalizedEmailSchema = createNormalizedEmailSchema(messages);
  const optionalNormalizedEmailSchema = createOptionalNormalizedEmailSchema(messages);
  const optionalOrganizationSlugSchema = createOptionalOrganizationSlugSchema();
  const passwordPolicySchema = createPasswordPolicySchema(messages);

  return z
    .object({
      fullName: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : value),
        z
          .string()
          .min(2, { message: messages.fullNameMinLength })
          .max(120, { message: messages.fullNameMaxLength }),
      ),
      email: normalizedEmailSchema,
      parentEmail: optionalNormalizedEmailSchema,
      representedStudentEmail: optionalNormalizedEmailSchema,
      password: passwordPolicySchema,
      role: z.enum([USER_ROLE.TEACHER, USER_ROLE.PARENT, USER_ROLE.STUDENT]),
      organizationSlug: optionalOrganizationSlugSchema,
    })
    .superRefine((data, ctx) => {
      if (data.role !== USER_ROLE.STUDENT && data.parentEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.parentEmailOnlyForStudents,
          path: ["parentEmail"],
        });
      }

      if (data.role !== USER_ROLE.PARENT && data.representedStudentEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.representedStudentOnlyForParents,
          path: ["representedStudentEmail"],
        });
      }
    });
}

function createLoginSchema(messages: typeof VALIDATION_MESSAGES.es) {
  const normalizedEmailSchema = createNormalizedEmailSchema(messages);

  return z.object({
    email: normalizedEmailSchema,
    password: z.string().min(1, { message: messages.passwordRequired }),
  });
}

export function getAuthSchemas(language: Language) {
  const messages = VALIDATION_MESSAGES[language];
  return {
    registerUserSchema: createRegisterUserSchema(messages),
    loginSchema: createLoginSchema(messages),
  };
}

export type RegisterUserFormInput = z.input<ReturnType<typeof createRegisterUserSchema>>;
export type RegisterUserInput = z.infer<ReturnType<typeof createRegisterUserSchema>>;
export type LoginFormInput = z.input<ReturnType<typeof createLoginSchema>>;
export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;

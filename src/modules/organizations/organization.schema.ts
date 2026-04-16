import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z
      .string()
      .min(2, { error: "El nombre de la organizacion debe tener al menos 2 caracteres." })
      .max(120, { error: "El nombre de la organizacion supera el largo permitido." }),
  ),
  slug: z
    .preprocess((value) => (typeof value === "string" ? value.trim().toLowerCase() : value), z.string().min(2).max(64))
    .optional(),
});

export type CreateOrganizationSchemaInput = z.infer<typeof createOrganizationSchema>;

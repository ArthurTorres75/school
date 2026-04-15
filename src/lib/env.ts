import "server-only";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, { error: "DATABASE_URL es obligatoria." }),
  JWT_SECRET: z
    .string()
    .min(32, { error: "JWT_SECRET debe tener al menos 32 caracteres." }),
  JWT_ISSUER: z.string().min(1).default("school-app"),
  JWT_AUDIENCE: z.string().min(1).default("school-users"),
  JWT_EXPIRES_IN_SECONDS: z.coerce
    .number()
    .int()
    .min(300, { error: "JWT_EXPIRES_IN_SECONDS debe ser >= 300." })
    .max(604800, { error: "JWT_EXPIRES_IN_SECONDS debe ser <= 604800." })
    .default(7200),
  AUTH_LOGIN_MAX_ATTEMPTS: z.coerce.number().int().min(3).max(20).default(5),
  AUTH_LOGIN_WINDOW_SECONDS: z.coerce.number().int().min(60).max(3600).default(900),
  AUTH_LOGIN_LOCKOUT_SECONDS: z.coerce.number().int().min(60).max(86400).default(900),
});

const parsedEnv = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_AUDIENCE: process.env.JWT_AUDIENCE,
  JWT_EXPIRES_IN_SECONDS: process.env.JWT_EXPIRES_IN_SECONDS,
  AUTH_LOGIN_MAX_ATTEMPTS: process.env.AUTH_LOGIN_MAX_ATTEMPTS,
  AUTH_LOGIN_WINDOW_SECONDS: process.env.AUTH_LOGIN_WINDOW_SECONDS,
  AUTH_LOGIN_LOCKOUT_SECONDS: process.env.AUTH_LOGIN_LOCKOUT_SECONDS,
});

if (!parsedEnv.success) {
  throw new Error(`Configuracion de entorno invalida: ${parsedEnv.error.message}`);
}

export const env = parsedEnv.data;

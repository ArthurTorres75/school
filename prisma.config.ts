// Loads .env BEFORE anything else: a Prisma config file disables Prisma's
// automatic .env loading, so the CLI (generate, db push, db seed) would
// otherwise not see DATABASE_URL.
import "dotenv/config";

import path from "node:path";

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    // Migrated from the deprecated package.json#prisma.seed key.
    seed: "node prisma/seed.cjs",
  },
});

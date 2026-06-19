import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mirror the `@/*` -> `src/*` path alias from tsconfig so tests resolve it.
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Next.js RSC boundary guards have no behavior in the node test env.
      "server-only": fileURLToPath(new URL("./src/tests/empty-module.ts", import.meta.url)),
      "client-only": fileURLToPath(new URL("./src/tests/empty-module.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Deterministic dummy env so tests pass anywhere (CI included) without a
    // local .env. Unit tests mock the repository, so they never reach a real
    // DB; these values only satisfy the zod validation in src/lib/env.ts.
    env: {
      DATABASE_URL: "mongodb://test:test@localhost:27017/test?authSource=admin",
      JWT_SECRET: "test-jwt-secret-placeholder-not-a-real-key-000",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: ["node_modules", ".next", "src/tests"],
    },
  },
});

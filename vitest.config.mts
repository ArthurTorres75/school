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
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      exclude: ["node_modules", ".next", "src/tests"],
    },
  },
});

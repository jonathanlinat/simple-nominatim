// SPDX-License-Identifier: MIT

import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@simple-nominatim/core": resolve(
        __dirname,
        "./packages/core/src/index.ts",
      ),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: [
      "packages/*/src/__tests__/**/*.unit.test.ts",
      "packages/*/src/__tests__/**/*.e2e.test.ts",
    ],
    // `helpers.e2e.test.ts` is a fixture module (execa/tsx helpers), not a suite.
    exclude: ["node_modules", "dist", ".turbo", "**/helpers.e2e.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.unit.test.ts",
        "**/*.e2e.test.ts",
        "**/package.json",
        "**/__tests__/",
      ],
    },
    testTimeout: 10000,
  },
});

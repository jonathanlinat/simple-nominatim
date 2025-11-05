/**
 * MIT License
 *
 * Copyright (c) 2023-2025 Jonathan Linat <https://github.com/jonathanlinat>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

/**
 * Shared Vitest configuration for all packages
 *
 * @returns Vitest configuration object
 */
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
    exclude: ["node_modules", "dist", ".turbo", "**/helpers.e2e.test.ts"],
    typecheck: {
      enabled: true,
      include: ["packages/*/src/__tests__/**/*.types.test.ts"],
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.unit.test.ts",
        "**/*.e2e.test.ts",
        "**/*.types.test.ts",
        "**/package.json",
        "**/__tests__/",
        "**/*.types.ts",
      ],
    },
    testTimeout: 10000,
  },
});

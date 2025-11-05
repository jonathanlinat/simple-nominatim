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

import eslint from "@eslint/js";
import markdown from "@eslint/markdown";
import vitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";
import boundaries from "eslint-plugin-boundaries";
// @ts-expect-error - No type definitions available
import eslintComments from "eslint-plugin-eslint-comments";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import jsoncPlugin from "eslint-plugin-jsonc";
// @ts-expect-error - No type definitions available
import markdownlint from "eslint-plugin-markdownlint";
import n from "eslint-plugin-n";
import prettierPlugin from "eslint-plugin-prettier";
// @ts-expect-error - No type definitions available
import promisePlugin from "eslint-plugin-promise";
// @ts-expect-error - No type definitions available
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import ymlPlugin from "eslint-plugin-yml";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/",
      "**/.turbo/",
      "**/coverage/",
      "**/pnpm-lock.yaml",
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    files: ["**/*.ts"],
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      "eslint-comments": eslintComments,
      jsdoc,
      unicorn,
      sonarjs,
      security,
      "unused-imports": unusedImports,
      boundaries,
      n,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "unused-imports/no-unused-imports": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "unicorn/filename-case": ["error", { case: "camelCase" }],
      "unicorn/prefer-node-protocol": "error",
    },
    settings: {
      "boundaries/elements": [
        { type: "core", pattern: "packages/core/src/**/*.ts" },
        { type: "cli", pattern: "packages/cli/src/**/*.ts" },
      ],
      "boundaries/ignore": ["**/__tests__/**", "**/*.test.ts"],
    },
  },
  {
    files: ["**/__tests__/**/*.ts", "**/*.test.ts"],
    plugins: { vitest },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      ...vitest.configs.recommended.rules,
      "vitest/valid-expect": "off",
      "unicorn/filename-case": "off",
    },
  },
  ...jsoncPlugin.configs["flat/recommended-with-jsonc"],
  ...ymlPlugin.configs["flat/recommended"],
  ...ymlPlugin.configs["flat/prettier"],
  {
    files: ["**/*.md/**"],
    plugins: { markdownlint },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.md"],
    processor: markdown.processors.markdown,
  },
);

import eslint from "@eslint/js";
import markdown from "@eslint/markdown";
import vitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsoncPlugin from "eslint-plugin-jsonc";
import prettierPlugin from "eslint-plugin-prettier";
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
      unicorn,
      "unused-imports": unusedImports,
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
    files: ["**/*.md"],
    processor: markdown.processors.markdown,
  },
  {
    // Relax rules inside fenced code blocks extracted from Markdown.
    files: ["**/*.md/**"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-undef": "off",
    },
  },
);

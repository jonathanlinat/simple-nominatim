import js from "@eslint/js";
import markdown from "@eslint/markdown";
import vitest from "@vitest/eslint-plugin";
import prettier from "eslint-config-prettier";
// @ts-ignore - No type definitions available
import boundaries from "eslint-plugin-boundaries";
// @ts-ignore - No type definitions available
import eslintComments from "eslint-plugin-eslint-comments";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import jsoncPlugin from "eslint-plugin-jsonc";
// @ts-ignore - No type definitions available
import markdownlint from "eslint-plugin-markdownlint";
import prettierPlugin from "eslint-plugin-prettier";
// @ts-ignore - No type definitions available
import promisePlugin from "eslint-plugin-promise";
// @ts-ignore - No type definitions available
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import ymlPlugin from "eslint-plugin-yml";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/",
      "**/.turbo/",
      "**/coverage/",
      "**/pnpm-lock.yaml",
    ],
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
      prettier: prettierPlugin,
    },
    rules: {
      ...eslintComments.configs.recommended.rules,
      ...security.configs.recommended.rules,
      "prettier/prettier": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "spaced-comment": [
        "error",
        "always",
        {
          line: { markers: ["/"], exceptions: [] },
          block: { markers: ["*"], exceptions: ["*"], balanced: true },
        },
      ],
      "no-inline-comments": "error",
      "multiline-comment-style": ["error", "starred-block"],
      "no-warning-comments": "warn",
      "line-comment-position": ["error", { position: "above" }],
      "eslint-comments/no-use": [
        "error",
        {
          allow: [
            "eslint-disable",
            "eslint-disable-line",
            "eslint-disable-next-line",
            "eslint-enable",
          ],
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "type",
          ],
          pathGroups: [
            {
              pattern: "@simple-nominatim/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/newline-after-import": ["error", { count: 1 }],
      "import/no-duplicates": "error",
      "import/first": "error",
      "prefer-template": "error",
      "max-len": [
        "warn",
        {
          code: 120,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
          ignoreComments: true,
        },
      ],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        { blankLine: "always", prev: "directive", next: "*" },
        { blankLine: "any", prev: "directive", next: "directive" },
        { blankLine: "always", prev: "import", next: "*" },
        { blankLine: "any", prev: "import", next: "import" },
        { blankLine: "always", prev: "*", next: "export" },
        { blankLine: "any", prev: "export", next: "export" },
        {
          blankLine: "always",
          prev: "*",
          next: ["if", "for", "while", "switch", "try", "function"],
        },
      ],
      "max-depth": ["warn", 4],
      "max-nested-callbacks": ["warn", 3],
      "max-params": ["warn", 5],
      "sonarjs/cognitive-complexity": ["warn", 15],
      "sonarjs/no-duplicate-string": ["warn", { threshold: 4 }],
      "sonarjs/no-nested-template-literals": "warn",
      "unicorn/better-regex": "error",
      "unicorn/catch-error-name": "error",
      "unicorn/consistent-function-scoping": "error",
      "unicorn/error-message": "error",
      "unicorn/expiring-todo-comments": "warn",
      "unicorn/filename-case": ["error", { case: "camelCase" }],
      "unicorn/no-array-for-each": "error",
      "unicorn/no-null": "off",
      "unicorn/no-process-exit": "off",
      "unicorn/no-useless-undefined": "error",
      "unicorn/prefer-code-point": "warn",
      "unicorn/prefer-module": "error",
      "unicorn/prefer-node-protocol": "error",
      "unicorn/prefer-spread": "error",
      "unicorn/prefer-ternary": "error",
      "unicorn/prevent-abbreviations": [
        "error",
        {
          replacements: {
            props: false,
            args: false,
            argv: false,
            params: false,
            param: false,
            env: false,
            opts: false,
            ref: false,
            refs: false,
            fn: false,
          },
          allowList: {
            number_: true,
            error_: true,
            function_: true,
          },
        },
      ],
      "promise/prefer-await-to-then": "error",
      "promise/prefer-await-to-callbacks": "warn",
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "cli", allow: ["core", "cli"] },
            { from: "core", allow: ["core"] },
          ],
        },
      ],
    },
    settings: {
      "boundaries/elements": [
        { type: "core", pattern: "packages/core/src/**/*.ts" },
        { type: "cli", pattern: "packages/cli/src/**/*.ts" },
      ],
      "boundaries/ignore": ["**/__tests__/**", "**/*.{test,spec}.ts"],
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
          contexts: [
            'ExportNamedDeclaration[declaration.type="TSInterfaceDeclaration"]',
            'ExportNamedDeclaration[declaration.type="TSTypeAliasDeclaration"]',
            'ExportNamedDeclaration[declaration.type="VariableDeclaration"]',
          ],
          publicOnly: true,
          exemptEmptyConstructors: true,
          exemptEmptyFunctions: false,
          enableFixer: false,
        },
      ],
      "jsdoc/require-description": [
        "warn",
        { contexts: ["any"], exemptedBy: ["type", "private", "internal"] },
      ],
      "jsdoc/require-param": [
        "error",
        {
          exemptedBy: ["type", "private", "internal"],
          checkDestructured: false,
        },
      ],
      "jsdoc/require-returns": [
        "error",
        {
          exemptedBy: ["type", "private", "internal"],
          forceRequireReturn: false,
          forceReturnsWithAsync: false,
        },
      ],
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": ["error", { definedTags: ["internal"] }],
      "jsdoc/require-hyphen-before-param-description": ["warn", "never"],
      "jsdoc/check-types": "off",
      "jsdoc/no-undefined-types": "off",
      "jsdoc/empty-tags": "error",
      "jsdoc/multiline-blocks": ["error", { noSingleLineBlocks: true }],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: ["interface", "typeAlias"],
          format: ["PascalCase"],
        },
        {
          selector: ["function", "variable"],
          format: ["camelCase"],
          leadingUnderscore: "allow",
          trailingUnderscore: "allow",
        },
        {
          selector: "variable",
          modifiers: ["const", "exported"],
          format: ["UPPER_CASE", "camelCase"],
        },
        {
          selector: "typeParameter",
          format: ["PascalCase"],
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "warn",
    },
  },
  {
    files: ["**/*.config.ts"],
    rules: {
      "import/no-default-export": "off",
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-unnecessary-condition": "warn",
    },
  },
  ...jsoncPlugin.configs["flat/recommended-with-jsonc"],
  ...ymlPlugin.configs["flat/recommended"],
  ...ymlPlugin.configs["flat/prettier"],
  {
    files: ["**/*.yaml"],
    ignores: ["**/pnpm-lock.yaml"],
    rules: {
      "yml/no-empty-mapping-value": "error",
      "yml/quotes": ["error", { prefer: "double", avoidEscape: true }],
    },
  },
  {
    files: ["**/__tests__/**/*.ts", "**/*.{test,spec}.ts"],
    plugins: { vitest },
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/consistent-test-it": [
        "error",
        { fn: "it", withinDescribe: "it" },
      ],
      "vitest/no-focused-tests": "warn",
      "vitest/no-disabled-tests": "warn",
      "vitest/prefer-hooks-on-top": "error",
      "vitest/valid-title": ["error", { mustMatch: { it: ["^should "] } }],
      "vitest/prefer-to-be": "error",
      "vitest/expect-expect": "error",
      "vitest/prefer-strict-equal": "warn",
      "vitest/max-nested-describe": ["error", { max: 3 }],
      "max-nested-callbacks": ["warn", 5],
      "jsdoc/require-jsdoc": "off",
      "no-warning-comments": "off",
      "unicorn/no-null": "off",
      "sonarjs/no-duplicate-string": "off",
      "unicorn/consistent-function-scoping": "off",
      "security/detect-object-injection": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
    },
    settings: {
      vitest: { typecheck: true },
    },
  },
  {
    files: ["**/*.types.test.ts"],
    rules: {
      "vitest/valid-expect": "off",
      "vitest/expect-expect": "off",
    },
  },
  {
    files: ["**/*.md"],
    plugins: { markdownlint },
    processor: markdown.processors.markdown,
    rules: {
      "markdownlint/md013": "off",
      "markdownlint/md033": "off",
      "markdownlint/md041": "off",
    },
  },
  {
    files: ["**/*.md/*.js", "**/*.md/*.ts", "**/*.md/*.tsx", "**/*.md/*.jsx"],
    rules: {
      "no-console": "off",
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "import/no-unresolved": "off",
      "unicorn/filename-case": "off",
    },
  },
);

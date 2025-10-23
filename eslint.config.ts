import js from "@eslint/js";
import prettier from "eslint-config-prettier";
// @ts-ignore - No type definitions available
import eslintComments from "eslint-plugin-eslint-comments";
import importPlugin from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import jsoncPlugin from "eslint-plugin-jsonc";
// @ts-ignore - No type definitions available
import promisePlugin from "eslint-plugin-promise";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/coverage/**",
    ],
  },
  {
    files: ["**/*.ts"],
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      "eslint-comments": eslintComments,
      jsdoc,
    },
    rules: {
      ...eslintComments.configs.recommended.rules,
      "@typescript-eslint/ban-ts-comment": "off",
      "spaced-comment": [
        "error",
        "always",
        {
          line: {
            markers: ["/", "!"],
            exceptions: [],
          },
          block: {
            markers: ["*", "!"],
            exceptions: ["*"],
            balanced: true,
          },
        },
      ],
      "no-inline-comments": "error",
      "capitalized-comments": [
        "error",
        "always",
        {
          ignorePattern:
            "pragma|ignored|prettier-ignore|webpack\\w+:|c8|type-coverage:|eslint-|@ts-",
          ignoreInlineComments: true,
          ignoreConsecutiveComments: true,
        },
      ],
      "no-warning-comments": [
        "error",
        {
          terms: ["todo", "fixme", "hack", "review", "xxx"],
          location: "anywhere",
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
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/newline-after-import": ["error", { count: 1 }],
      "import/no-duplicates": "error",
      "import/no-default-export": "error",
      "import/first": "error",
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
      ],
      "promise/prefer-await-to-then": "error",
      "promise/prefer-await-to-callbacks": "warn",
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
      complexity: ["warn", 25],
      "max-depth": ["warn", 5],
      "max-nested-callbacks": ["warn", 3],
      "max-params": ["warn", 10],
      "max-statements": ["warn", 30],
    },
  },
  {
    files: ["**/*.ts"],
    rules: {
      "import/no-default-export": "off",
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
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
        {
          contexts: ["any"],
          exemptedBy: ["type", "private", "internal"],
        },
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
      "jsdoc/check-tag-names": [
        "error",
        {
          definedTags: ["internal", "constant"],
        },
      ],
      "jsdoc/require-hyphen-before-param-description": ["warn", "never"],
      "jsdoc/check-types": "off",
      "jsdoc/require-description-complete-sentence": "off",
      "jsdoc/no-undefined-types": "off",
      "jsdoc/empty-tags": "error",
      "jsdoc/multiline-blocks": [
        "error",
        {
          noSingleLineBlocks: true,
        },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: ["interface", "typeAlias", "class"],
          format: ["PascalCase"],
        },
        {
          selector: ["function", "variable"],
          format: ["camelCase"],
          leadingUnderscore: "allow",
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
        {
          selector: "memberLike",
          modifiers: ["private"],
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "error",
    },
  },
  ...jsoncPlugin.configs["flat/recommended-with-jsonc"],
  {
    files: ["**/package.json"],
    rules: {
      "jsonc/sort-keys": [
        "error",
        {
          pathPattern: "^$",
          order: [
            "name",
            "version",
            "description",
            "keywords",
            "homepage",
            "bugs",
            "repository",
            "license",
            "author",
            "type",
            "main",
            "module",
            "types",
            "bin",
            "exports",
            "files",
            "scripts",
            "dependencies",
            "devDependencies",
            "peerDependencies",
            "peerDependenciesMeta",
            "optionalDependencies",
            "bundledDependencies",
            "engines",
            "packageManager",
          ],
        },
        {
          pathPattern: "^(?:dev|peer|optional|bundled)?[Dd]ependencies$",
          order: { type: "asc" },
        },
        {
          pathPattern: "^scripts$",
          order: { type: "asc" },
        },
      ],
    },
  },
  {
    files: ["**/__tests__/**/*.ts"],
    rules: {
      "max-nested-callbacks": ["warn", 5],
      "jsdoc/require-jsdoc": "off",
    },
  },
);

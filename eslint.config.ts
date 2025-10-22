import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import jsdoc from 'eslint-plugin-jsdoc'
import jsoncPlugin from 'eslint-plugin-jsonc'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'warn'
    }
  },
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.turbo/**']
  },
  // JSDoc/TSDoc configuration
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
    plugins: {
      jsdoc
    },
    rules: {
      // Require JSDoc comments on exports
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false
          },
          contexts: [
            'ExportNamedDeclaration[declaration.type="TSInterfaceDeclaration"]',
            'ExportNamedDeclaration[declaration.type="TSTypeAliasDeclaration"]',
            'ExportNamedDeclaration[declaration.type="VariableDeclaration"]'
          ],
          publicOnly: true,
          exemptEmptyConstructors: true,
          exemptEmptyFunctions: false,
          enableFixer: false
        }
      ],
      // Require description in JSDoc
      'jsdoc/require-description': [
        'warn',
        {
          contexts: ['any'],
          exemptedBy: ['type', 'private', 'internal']
        }
      ],
      // Require @param for function parameters
      'jsdoc/require-param': [
        'error',
        {
          exemptedBy: ['type', 'private', 'internal'],
          checkDestructured: false
        }
      ],
      // Require @returns for functions with return values
      'jsdoc/require-returns': [
        'error',
        {
          exemptedBy: ['type', 'private', 'internal'],
          forceRequireReturn: false,
          forceReturnsWithAsync: false
        }
      ],
      // Check parameter names match
      'jsdoc/check-param-names': 'error',
      // Validate tag names (supports TSDoc)
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: ['internal', 'constant']
        }
      ],
      // Require hyphen before param description
      'jsdoc/require-hyphen-before-param-description': ['warn', 'never'],
      // Check types are properly formatted
      'jsdoc/check-types': 'off', // TypeScript handles this
      // Ensure descriptions are complete sentences
      'jsdoc/require-description-complete-sentence': 'off',
      // No undefined types
      'jsdoc/no-undefined-types': 'off', // TypeScript handles this
      // Empty tags
      'jsdoc/empty-tags': 'error',
      // Multiline formatting
      'jsdoc/multiline-blocks': [
        'error',
        {
          noSingleLineBlocks: true
        }
      ]
    }
  },
  // JSON configuration
  ...jsoncPlugin.configs['flat/recommended-with-jsonc'],
  {
    files: ['**/package.json'],
    rules: {
      'jsonc/sort-keys': [
        'error',
        {
          pathPattern: '^$',
          order: [
            'name',
            'version',
            'description',
            'keywords',
            'homepage',
            'bugs',
            'repository',
            'license',
            'author',
            'type',
            'main',
            'module',
            'types',
            'bin',
            'exports',
            'files',
            'scripts',
            'dependencies',
            'devDependencies',
            'peerDependencies',
            'peerDependenciesMeta',
            'optionalDependencies',
            'bundledDependencies',
            'engines',
            'packageManager'
          ]
        },
        {
          pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
          order: { type: 'asc' }
        },
        {
          pathPattern: '^scripts$',
          order: { type: 'asc' }
        }
      ]
    }
  }
)

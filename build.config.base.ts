/**
 * Shared base build configuration for all packages
 *
 * This file exports a factory function that creates a standardized unbuild configuration.
 * Each package can import and use this to maintain consistency while allowing customization.
 *
 * @example
 * ```typescript
 * // Simple usage (no customization)
 * import { defineBuildConfig } from 'unbuild'
 * import { createBaseBuildConfig } from '../../build.config.base'
 *
 * export default defineBuildConfig(createBaseBuildConfig())
 * ```
 *
 * @example
 * ```typescript
 * // Extended usage with overrides
 * import { defineBuildConfig } from 'unbuild'
 * import { createBaseBuildConfig } from '../../build.config.base'
 *
 * const baseConfig = createBaseBuildConfig()
 *
 * export default defineBuildConfig({
 *   ...baseConfig,
 *   entries: ['src/custom-entry'],
 *   // Override other properties as needed
 * })
 * ```
 */

/**
 * Creates a base build configuration with standard settings
 *
 * @param overrides - Optional partial configuration to override defaults
 * @returns Complete build configuration object
 */
export const createBaseBuildConfig = (overrides = {}) => {
  // Lazy-load terser to avoid module resolution issues during config loading
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const terser = require('@rollup/plugin-terser')

  const config = {
    entries: ['src/index'],
    declaration: true,
    rollup: {
      emitCJS: false,
      output: {
        plugins: [terser.default()]
      }
    },
    ...overrides
  }

  return config
}

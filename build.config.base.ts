/**
 * Creates a base build configuration for unbuild
 *
 * @param overrides Optional configuration overrides
 * @returns Promise resolving to the build configuration
 */
export const createBaseBuildConfig = async (
  overrides = {}
): Promise<Record<string, unknown>> => {
  const { default: terser } = await import('@rollup/plugin-terser')

  const config = {
    entries: ['src/index'],
    declaration: true,
    rollup: {
      emitCJS: false,
      output: {
        plugins: [terser()]
      }
    },
    ...overrides
  }

  return config
}

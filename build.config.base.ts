/**
 * Creates a base build configuration for unbuild
 *
 * @param overrides Optional configuration overrides
 * @returns Promise resolving to the build configuration
 */
export const createBaseBuildConfig = async (overrides = {}) => {
  const { default: terser } = await import('@rollup/plugin-terser')

  const config = {
    entries: ['src/index'],
    declaration: true,
    rollup: {
      emitCJS: false,
      output: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        plugins: [terser() as any]
      }
    },
    ...overrides
  }

  return config
}

export const createBaseBuildConfig = async (overrides = {}) => {
  const { default: terser } = await import('@rollup/plugin-terser')

  const config = {
    entries: ['src/index'],
    declaration: true,
    rollup: {
      emitCJS: false,
      output: {
        plugins: [terser() as any]
      }
    },
    ...overrides
  }

  return config
}

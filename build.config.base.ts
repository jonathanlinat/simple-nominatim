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

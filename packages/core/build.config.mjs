import { defineBuildConfig } from 'unbuild'
import terser from '@rollup/plugin-terser'

export default defineBuildConfig({
  rollup: {
    output: {
      plugins: [terser()]
    }
  }
})

import { defineBuildConfig } from 'unbuild'
import { createBaseBuildConfig } from '../../build.config.base'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Type instantiation issue with terser plugin
export default defineBuildConfig(createBaseBuildConfig())

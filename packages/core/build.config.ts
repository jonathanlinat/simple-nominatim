import { defineBuildConfig } from 'unbuild'
import { createBaseBuildConfig } from '../../build.config.base'

// @ts-ignore - Type instantiation depth limitation with Rollup plugin types
export default defineBuildConfig(await createBaseBuildConfig())

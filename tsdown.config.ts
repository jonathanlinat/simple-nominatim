// SPDX-License-Identifier: MIT

import { defineConfig } from "tsdown";

export default defineConfig({
  format: "esm",
  dts: true,
  clean: true,
  target: "node24",
  minify: true,
  sourcemap: true,
  treeshake: true,
  platform: "node",
  outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
});

import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "./src/index.ts",
    "./src/utils.ts",
  ],
  format: ["esm"],
  platform: "node",
  target: "node24",
  dts: true,
  clean: true,
  exports: true,
  publint: true,
  tsconfig: "./tsconfig.json",
});

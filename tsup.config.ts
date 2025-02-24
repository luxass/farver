import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "./src/index.ts",
    "./src/supports.ts",
    "./src/utils.ts",
    "./src/fast.ts",
    "./src/gradients.ts",
  ],
  format: ["cjs", "esm"],
  platform: "node",
  target: "es2022",
  dts: true,
  bundle: true,
  clean: true,
  outExtension(ctx) {
    return {
      js: ctx.format === "cjs" ? ".cjs" : ".mjs",
    };
  },
  tsconfig: "./tsconfig.json",
});

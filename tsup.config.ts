import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: [
      "./src/index.ts",
      "./src/supports.ts",
    ],
    format: ["cjs", "esm"],
    platform: "node",
    target: "es2022",
    dts: true,
    // treeshake: true,
    bundle: true,
    clean: true,
    outExtension(ctx) {
      return {
        js: ctx.format === "cjs" ? ".cjs" : ".mjs",
      };
    },
    tsconfig: "./tsconfig.json",
  },
  {
    entry: [
      "./src/index.ts",
      "./src/supports.browser.ts",
    ],
    format: ["cjs", "esm"],
    platform: "browser",
    outDir: "dist/browser",
    target: "es2022",
    dts: true,
    treeshake: true,
    clean: true,
    bundle: true,
    outExtension(ctx) {
      return {
        js: ctx.format === "cjs" ? ".cjs" : ".mjs",
      };
    },
    tsconfig: "./tsconfig.browser.json",
  },
]);

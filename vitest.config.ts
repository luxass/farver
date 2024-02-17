import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    silent: false,
    alias: {
      "#supports": new URL("./src/supports.ts", import.meta.url).pathname,
    },
  },
});
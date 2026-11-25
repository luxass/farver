import { playwright } from "@vitest/browser-playwright";
import { defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
    },
    projects: [
      {
        test: {
          name: "unit",
          exclude: ["test-bun/**/*.test.ts", "test/browser/**.test.ts", ...defaultExclude],
          environment: "node",
          // The default exports detect the color level when they're imported. Fix it to truecolor,
          // so the tests give the same result in a terminal, a pipe, and CI. NO_COLOR would win over
          // FORCE_COLOR, so clear it in case it's set in your shell.
          env: { FORCE_COLOR: "3", NO_COLOR: "" },
        },
      },
      {
        test: {
          name: "browser",
          exclude: ["test-bun/**/*.test.ts", "test/*.test.ts", ...defaultExclude],
          include: ["test/browser/**/*.test.ts"],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [
              {
                browser: "chromium",
                // We can't use headless mode in browser tests, because window.chrome is not defined in headless mode
                // and therefore fails our color detection logic.
                headless: false,
                screenshotFailures: false,
              },
            ],
          },
        },
      },
    ],
  },
});

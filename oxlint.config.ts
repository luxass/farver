import { defineConfig } from "oxlint";

export default defineConfig({
  options: {
    typeAware: true,
    typeCheck: true,
  },
  ignorePatterns: ["dist/**", "coverage/**", "node_modules/**"],
  plugins: ["unicorn", "typescript", "oxc"],
  categories: {
    correctness: "error",
    perf: "error",
    suspicious: "error",
    pedantic: "warn",
  },
  rules: {
    "eslint/no-await-in-loop": "off",
    "no-console": ["error", { allow: ["error"] }],
    "no-shadow": "off",
    "eslint/eqeqeq": ["warn", "always", { null: "ignore" }],
    "typescript/no-explicit-any": "error",
    "typescript/no-unnecessary-boolean-literal-compare": "off",
    "typescript/prefer-readonly-parameter-types": "off",
    "typescript/no-unsafe-type-assertion": "off",
    curly: "off",
  },
  overrides: [
    {
      files: ["playground.ts"],
      rules: {
        "no-console": "off",
      },
    },
    {
      files: ["test/**/*", "test-bun/**/*"],
      rules: {
        "eslint/max-lines": "off",
        "eslint/max-lines-per-function": "off",
        "eslint/require-await": "off",
        "typescript/require-await": "off",
      },
    },
    {
      // This cross-runtime test helper deliberately accepts untyped values.
      files: ["test/shared.ts"],
      rules: {
        "typescript/no-explicit-any": "off",
      },
    },
  ],
});

// @ts-check
import { luxass } from "@luxass/eslint-config";

export default luxass({
  formatters: true,
  editor: false,
}, {
  files: ["playground.ts"],
  rules: {
    "no-console": "off",
  },
});

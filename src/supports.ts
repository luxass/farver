import tty from "node:tty";
import process from "node:process";

const CIS = [
  "GITHUB_ACTIONS",
  "GITEA_ACTIONS",
  "TRAVIS",
  "CIRCLECI",
  "APPVEYOR",
  "GITLAB_CI",
  "BUILDKITE",
  "DRONE",
];

/**
 * Check if the browser supports colors
 * @returns {boolean} Whether the browser supports colors
 *
 * @example
 * ```js
 * import { isColorsSupported } from "farver";
 *
 * isColorsSupported();
 * // => true
 * ```
 */
export function isColorsSupported(): boolean {
  const {
    env = {},
    argv = [],
    platform = "",
  } = process;

  console.error({
    env: env.DUMB,
    CI: env.CI,
    argv,
    platform,
    tty: tty.isatty(1),
  });

  if ("NO_COLOR" in env || argv.includes("--no-color")) {
    return false;
  }

  if ("FORCE_COLOR" in env || argv.includes("--color")) {
    return true;
  }

  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return true;
  }

  if (platform === "win32" && env.TERM !== "dumb") {
    return true;
  }

  if (env.TERM !== "dumb" && tty.isatty(1) && tty.isatty(2)) {
    return true;
  }

  if ("CI" in env && CIS.some((ci) => ci in env)) {
    return true;
  }

  return false;
}

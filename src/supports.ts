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

  if ("CI" in env && CIS.some((ci) => ci in env)) {
    return true;
  }

  console.error({
    tty,
    ttyIsatty: tty.isatty,
    ttyIsatty1: tty.isatty(1),
    envTerm: env.TERM,
    envTermDumb: env.TERM !== "dumb",
  });
  if (tty && tty.isatty && tty.isatty(1) && env.TERM && env.TERM !== "dumb") {
    return true;
  }

  return false;
}

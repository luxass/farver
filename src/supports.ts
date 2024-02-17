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

  // eslint-disable-next-line no-console
  console.log({
    TERM: env.TERM,
    CI: env.CI,
    KNOWN_CIS: {
      ...Object.fromEntries(CIS.map((ci) => [ci, env[ci]])),
    },
    platform,
  });

  if ("NO_COLOR" in env || argv.includes("--no-color")) {
    return false;
  }

  if ("FORCE_COLOR" in env || argv.includes("--color")) {
    return true;
  }

  // azure devops pipelines
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return true;
  }

  if (!tty.isatty(1) && !tty.isatty(2)) {
    console.error("NOT A TTY");
    return false;
  }

  if (env.TERM === "dumb") {
    return false;
  }

  if (platform === "win32") {
    return true;
  }

  if ("CI" in env && (CIS.some((ci) => ci in env) || env.CI_NAME === "codeship")) {
    return true;
  }

  if ("TEAMCITY_VERSION" in env) {
    return true;
  }

  if (/-256(color)?$/i.test(env.TERM!)) {
    return true;
  }

  if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(env.TERM!)) {
    return true;
  }

  if ("COLORTERM" in env) {
    return true;
  }

  return false;
}

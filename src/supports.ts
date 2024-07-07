import process from "node:process";
import tty from "node:tty";

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
  const argv: string[] = process.argv || [];
  const env: NodeJS.ProcessEnv = process.env;

  return !(env.NO_COLOR || argv.includes("--no-color"))
    && (Boolean(env.FORCE_COLOR)
    || argv.includes("--color")
    || process.platform === "win32"
    || (tty.isatty(1) && env.TERM !== "dumb")
    || Boolean(env.CI));
}

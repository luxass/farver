/**
 * @module gradients
 *
 * Colors text with a gradient, such as `gradient(["#ff0000", "#0000ff"])("Hello, World!")`.
 * Available from `farver/gradients`, so code that doesn't use gradients doesn't load it.
 */

import type { ColorSpace } from "termenv/supports";
import { getColorSpace } from "termenv/supports";

import type { ColorFunctions } from "./styles";
import { getColorFunctions } from "./styles";
import { hexToRgb } from "./utils";

/**
 * Colors text with a gradient. `undefined`, `null`, and `''` give `''`.
 */
export type GradientStyle = (text?: string | null) => string;

export interface GradientOptions {
  /**
   * The color level to use: 0 for no colors, 1 for 16 colors, 2 for 256 colors, 3 for truecolor.
   * At 1 and 2, each color is stepped down to the closest color the terminal can show.
   *
   * @default the detected color level
   */
  level?: ColorSpace;
}

type Rgb = [red: number, green: number, blue: number];

const HEX_COLOR = /^#?(?:[\da-f]{3}|[\da-f]{6})$/iu;

// An escape sequence (CSI, or OSC ending in BEL or ST), or else one character.
const ESCAPE_OR_CHARACTER =
  // oxlint-disable-next-line no-control-regex -- Escape sequences are made of control characters.
  /\u001B\[[\d;?]*[ -/]*[@-~]|\u001B\][^\u0007\u001B]*(?:\u0007|\u001B\\)|[\s\S]/gu;

/** Whether a token is a visible character that gets a color: not an escape sequence, and not whitespace. */
function isColored(token: string): boolean {
  return !token.startsWith("\u001B") && !/\s/u.test(token);
}

const FOREGROUND_CLOSE = "\u001B[39m";

/**
 * Returns the color at `position`, from 0 for the first stop to 1 for the last, interpolated in RGB.
 */
function colorAt(stops: readonly Rgb[], position: number): Rgb {
  if (stops.length === 1) return stops[0]!;

  const scaled = position * (stops.length - 1);
  const index = Math.min(Math.floor(scaled), stops.length - 2);
  const amount = scaled - index;
  const [fromRed, fromGreen, fromBlue] = stops[index]!;
  const [toRed, toGreen, toBlue] = stops[index + 1]!;
  return [
    Math.round(fromRed + (toRed - fromRed) * amount),
    Math.round(fromGreen + (toGreen - fromGreen) * amount),
    Math.round(fromBlue + (toBlue - fromBlue) * amount),
  ];
}

/**
 * Colors each visible character of `text` with its color from the gradient.
 */
function applyGradient(text: string, stops: readonly Rgb[], rgb: ColorFunctions["rgb"]): string {
  const tokens = text.match(ESCAPE_OR_CHARACTER) ?? [];
  const coloredCount = tokens.filter((token) => isColored(token)).length;

  let result = "";
  // The last color code written, so a run of characters with the same color shares one code.
  let lastOpen = "";
  // Whether a color is on and still needs its close code.
  let isColorOn = false;
  let coloredIndex = 0;

  for (const token of tokens) {
    if (!isColored(token)) {
      // Close the color before a line break, so each line stands on its own.
      if (token === "\n" && isColorOn) {
        result += FOREGROUND_CLOSE;
        isColorOn = false;
        lastOpen = "";
      }
      result += token;
      // An escape code in the text may change the color, so set it again on the next character.
      if (token.startsWith("\u001B")) lastOpen = "";
      continue;
    }

    const position = coloredCount === 1 ? 0 : coloredIndex / (coloredCount - 1);
    const { open } = rgb(...colorAt(stops, position));
    coloredIndex++;
    if (open !== lastOpen) {
      result += open;
      lastOpen = open;
      isColorOn = true;
    }
    result += token;
  }

  return isColorOn ? result + FOREGROUND_CLOSE : result;
}

/**
 * Creates a gradient style from hex colors, such as `["#ff0000", "#00ff00", "#0000ff"]`.
 *
 * Each visible character gets its own color, spread evenly from the first color to the last.
 * Spaces don't advance the gradient. Escape codes already in the text, such as bold, are kept.
 *
 * @param {readonly string[]} colors - One or more hex colors, such as `"#ff8800"` or `"#f80"`
 * @param {GradientOptions} [options] - The color level to use
 * @returns {GradientStyle} A function that colors text with the gradient
 * @throws {TypeError} If there are no colors, or a color isn't a hex color
 *
 * @example
 * ```ts
 * import { gradient } from "farver/gradients";
 *
 * const sunset = gradient(["#ff5f6d", "#ffc371"]);
 * console.log(sunset("Hello, World!"));
 * ```
 */
function createGradient(colors: readonly string[], options: GradientOptions = {}): GradientStyle {
  if (colors.length === 0) throw new TypeError("gradient: give at least one color");
  for (const color of colors) {
    if (!HEX_COLOR.test(color)) {
      throw new TypeError(`gradient: "${color}" isn't a hex color such as "#ff8800" or "#f80"`);
    }
  }

  const stops = colors.map((color) => hexToRgb(color));
  const level = options.level ?? getColorSpace();
  const { rgb } = getColorFunctions(level);

  return (text) => {
    if (text === undefined || text === null || text === "") return "";
    if (level <= 0) return text;

    return applyGradient(text, stops, rgb);
  };
}

const PRESETS = {
  rainbow: ["#ff0000", "#ff8000", "#ffff00", "#00ff00", "#0080ff", "#8000ff"],
  pastel: ["#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff"],
  summer: ["#ffd200", "#f7971e", "#ff6a00"],
  retro: ["#f72585", "#7209b7", "#3a0ca3", "#4cc9f0"],
  fruit: ["#ff4e50", "#f9d423"],
  vice: ["#5ee7df", "#b490ca"],
  mind: ["#473b7b", "#3584a7", "#30d2be"],
} as const satisfies Record<string, readonly string[]>;

export type GradientPresetName = keyof typeof PRESETS;

export interface Gradient extends Readonly<Record<GradientPresetName, GradientStyle>> {
  (colors: readonly string[], options?: GradientOptions): GradientStyle;
}

const presetStyles = Object.fromEntries(
  Object.entries(PRESETS).map(([name, colors]) => [name, createGradient(colors)]),
) as Record<GradientPresetName, GradientStyle>;

/**
 * Creates a gradient style from hex colors. The built-in presets, such as `gradient.rainbow`,
 * are ready to use and follow the detected color level.
 *
 * @example
 * ```ts
 * import { gradient } from "farver/gradients";
 *
 * console.log(gradient(["#ff0000", "#0000ff"])("Hello, World!"));
 * console.log(gradient.rainbow("Hello, World!"));
 * ```
 */
export const gradient: Gradient = Object.assign(createGradient, presetStyles);

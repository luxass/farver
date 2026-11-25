/**
 * @internal
 *
 * The escape codes for every style and color, and the color functions stepped down per color space.
 */

import type { ColorSpace } from "termenv/supports";

import { ansi256To16, hexToRgb, rgbToAnsi16, rgbToAnsi256 } from "./utils";

/**
 * One style: the escape code that turns it on, and the one that turns it off.
 */
export interface StyleCodes {
  open: string;
  close: string;
}

function codes(open: number | string, close: number | string): StyleCodes {
  return { open: `\u001B[${open}m`, close: `\u001B[${close}m` };
}

const BASE_COLORS = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
] as const;

type BaseColor = (typeof BASE_COLORS)[number];
type ColorName = BaseColor | "gray" | `${Exclude<BaseColor, "black">}Bright`;
type BackgroundColorName = `bg${Capitalize<ColorName>}`;

function capitalize<Name extends string>(name: Name): Capitalize<Name> {
  return (name.charAt(0).toUpperCase() + name.slice(1)) as Capitalize<Name>;
}

/**
 * Builds the 16 foreground and 16 background colors. A color's code is 30 to 37, its bright variant
 * adds 60, and its background adds 10. Gray is the bright variant of black.
 */
function buildColors(): Record<ColorName | BackgroundColorName, StyleCodes> {
  const colors: Partial<Record<ColorName | BackgroundColorName, StyleCodes>> = {};
  const add = (name: ColorName, code: number): void => {
    colors[name] = codes(code, 39);
    colors[`bg${capitalize(name)}`] = codes(code + 10, 49);
  };

  for (const [index, name] of BASE_COLORS.entries()) {
    add(name, 30 + index);
    add(name === "black" ? "gray" : `${name}Bright`, 90 + index);
  }

  return colors as Record<ColorName | BackgroundColorName, StyleCodes>;
}

export const FIXED_STYLES = {
  reset: codes(0, 0),
  bold: codes(1, 22),
  dim: codes(2, 22),
  italic: codes(3, 23),
  underline: codes(4, 24),
  overline: codes(53, 55),
  inverse: codes(7, 27),
  hidden: codes(8, 28),
  strikethrough: codes(9, 29),
  ...buildColors(),
};

export interface ColorFunctions {
  fg: (code: number) => StyleCodes;
  bg: (code: number) => StyleCodes;
  rgb: (r: number, g: number, b: number) => StyleCodes;
  bgRgb: (r: number, g: number, b: number) => StyleCodes;
  hex: (hex: string) => StyleCodes;
  bgHex: (hex: string) => StyleCodes;
}

const fg256 = (code: number): StyleCodes => codes(`38;5;${code}`, 39);
const bg256 = (code: number): StyleCodes => codes(`48;5;${code}`, 49);

/**
 * The 256-color and RGB functions for each color space. Lower color spaces step colors down
 * to the closest color they can show.
 */
const COLOR_FUNCTIONS_BY_SPACE: Record<1 | 2 | 3, Omit<ColorFunctions, "hex" | "bgHex">> = {
  1: {
    fg: (code) => codes(ansi256To16(code), 39),
    bg: (code) => codes(ansi256To16(code) + 10, 49),
    rgb: (r, g, b) => codes(rgbToAnsi16(r, g, b), 39),
    bgRgb: (r, g, b) => codes(rgbToAnsi16(r, g, b) + 10, 49),
  },
  2: {
    fg: fg256,
    bg: bg256,
    rgb: (r, g, b) => fg256(rgbToAnsi256(r, g, b)),
    bgRgb: (r, g, b) => bg256(rgbToAnsi256(r, g, b)),
  },
  3: {
    fg: fg256,
    bg: bg256,
    rgb: (r, g, b) => codes(`38;2;${r};${g};${b}`, 39),
    bgRgb: (r, g, b) => codes(`48;2;${r};${g};${b}`, 49),
  },
};

/**
 * Returns the color functions for a color space. Without colors, the truecolor codes are returned,
 * because styles don't apply codes at all then.
 */
export function getColorFunctions(colorSpace: ColorSpace): ColorFunctions {
  const space = colorSpace === 1 || colorSpace === 2 ? colorSpace : 3;
  const { fg, bg, rgb, bgRgb } = COLOR_FUNCTIONS_BY_SPACE[space];
  return {
    fg,
    bg,
    rgb,
    bgRgb,
    hex: (hex) => rgb(...hexToRgb(hex)),
    bgHex: (hex) => bgRgb(...hexToRgb(hex)),
  };
}

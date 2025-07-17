import type { ColorSpace } from "termenv/supports";
import { getColorSpace } from "termenv/supports";
import { ansi256To16, hexToRgb, rgbToAnsi16, rgbToAnsi256 } from "./utils";

type FarveFn = (
  text: string | boolean | number | null | undefined,
) => string;

export interface FastFarver {
  // modifiers
  reset: FarveFn;
  bold: FarveFn;
  dim: FarveFn;
  italic: FarveFn;
  underline: FarveFn;
  overline: FarveFn;
  inverse: FarveFn;
  hidden: FarveFn;
  strikethrough: FarveFn;

  // colors
  black: FarveFn;
  red: FarveFn;
  green: FarveFn;
  yellow: FarveFn;
  blue: FarveFn;
  magenta: FarveFn;
  cyan: FarveFn;
  white: FarveFn;
  gray: FarveFn;
  blackBright: FarveFn;
  redBright: FarveFn;
  greenBright: FarveFn;
  yellowBright: FarveFn;
  blueBright: FarveFn;
  magentaBright: FarveFn;
  cyanBright: FarveFn;
  whiteBright: FarveFn;

  // background colors
  bgBlack: FarveFn;
  bgRed: FarveFn;
  bgGreen: FarveFn;
  bgYellow: FarveFn;
  bgBlue: FarveFn;
  bgMagenta: FarveFn;
  bgCyan: FarveFn;
  bgWhite: FarveFn;
  bgGray: FarveFn;
  bgBlackBright: FarveFn;
  bgRedBright: FarveFn;
  bgGreenBright: FarveFn;
  bgYellowBright: FarveFn;
  bgBlueBright: FarveFn;
  bgMagentaBright: FarveFn;
  bgCyanBright: FarveFn;
  bgWhiteBright: FarveFn;

  // true color
  rgb: (r: number, g: number, b: number) => FarveFn;
  bgRgb: (r: number, g: number, b: number) => FarveFn;
  fg: (code: number) => FarveFn;
  bg: (code: number) => FarveFn;
  hex: (hex: string) => FarveFn;
  bgHex: (hex: string) => FarveFn;
}

function formatter(start: number | string, end: number | string) {
  return (input: string | boolean | number | null | undefined | void) => {
    const open = `\x1B[${start}m`;
    const close = `\x1B[${end}m`;
    let text = `${input}`;

    if (text.includes("\x1B")) {
      const search = close;
      text = text.replaceAll(search, open);
    }

    if (text.includes("\n")) {
      text = text.replace(/(\r?\n)/g, `${close}$1${open}`);
    }

    return open + text + close;
  };
}

export function createColors(colorSpace: ColorSpace = getColorSpace()): FastFarver {
  // if colors is disabled, just pass everything into the string constructor
  const wrap = colorSpace > 0 ? formatter : () => String;

  let rgb = (r: number, g: number, b: number): FarveFn =>
    wrap(`38;2;${r};${g};${b}`, 39);
  let bgRgb = (r: number, g: number, b: number): FarveFn =>
    wrap(`48;2;${r};${g};${b}`, 49);
  let fg = (code: number): FarveFn => wrap(`38;5;${code}`, 39);
  let bg = (code: number): FarveFn => wrap(`48;5;${code}`, 49);

  if (colorSpace === 1) {
    fg = (code: number) => wrap(ansi256To16(code), 39);
    bg = (code: number) => wrap(ansi256To16(code) + 10, 49);
    rgb = (r: number, g: number, b: number) => wrap(rgbToAnsi16(r, g, b), 39);
    bgRgb = (r: number, g: number, b: number) =>
      wrap(rgbToAnsi16(r, g, b) + 10, 49);
  } else if (colorSpace === 2) {
    rgb = (r: number, g: number, b: number) => fg(rgbToAnsi256(r, g, b));
    bgRgb = (r: number, g: number, b: number) => bg(rgbToAnsi256(r, g, b));
  }

  return {
    reset: wrap(0, 0),
    bold: wrap(1, 22),
    dim: wrap(2, 22),
    italic: wrap(3, 23),
    underline: wrap(4, 24),
    overline: wrap(53, 55),
    inverse: wrap(7, 27),
    hidden: wrap(8, 28),
    strikethrough: wrap(9, 29),

    black: wrap(30, 39),
    red: wrap(31, 39),
    green: wrap(32, 39),
    yellow: wrap(33, 39),
    blue: wrap(34, 39),
    magenta: wrap(35, 39),
    cyan: wrap(36, 39),
    white: wrap(37, 39),
    gray: wrap(90, 39),
    blackBright: wrap(90, 39),
    redBright: wrap(91, 39),
    greenBright: wrap(92, 39),
    yellowBright: wrap(93, 39),
    blueBright: wrap(94, 39),
    magentaBright: wrap(95, 39),
    cyanBright: wrap(96, 39),
    whiteBright: wrap(97, 39),

    bgBlack: wrap(40, 49),
    bgRed: wrap(41, 49),
    bgGreen: wrap(42, 49),
    bgYellow: wrap(43, 49),
    bgBlue: wrap(44, 49),
    bgMagenta: wrap(45, 49),
    bgCyan: wrap(46, 49),
    bgWhite: wrap(47, 49),
    bgGray: wrap(100, 49),
    bgBlackBright: wrap(100, 49),
    bgRedBright: wrap(101, 49),
    bgGreenBright: wrap(102, 49),
    bgYellowBright: wrap(103, 49),
    bgBlueBright: wrap(104, 49),
    bgMagentaBright: wrap(105, 49),
    bgCyanBright: wrap(106, 49),
    bgWhiteBright: wrap(107, 49),
    rgb,
    bgRgb,
    fg,
    bg,
    // NOTE: maybe the ... is too slow.
    hex: (hex: string) => rgb(...hexToRgb(hex)),
    bgHex: (hex: string) => bgRgb(...hexToRgb(hex)),
  };
}

export const colors: FastFarver = createColors();

export default colors;

const {
  reset,
  bold,
  dim,
  italic,
  underline,
  inverse,
  hidden,
  strikethrough,
  black,
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  blackBright,
  redBright,
  greenBright,
  yellowBright,
  blueBright,
  magentaBright,
  cyanBright,
  whiteBright,
  bgBlack,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite,
  bgGray,
  bgRedBright,
  bgGreenBright,
  bgYellowBright,
  bgBlueBright,
  bgMagentaBright,
  bgCyanBright,
  bgWhiteBright,
  bgBlackBright,
  hex,
  bg,
  bgHex,
  bgRgb,
  fg,
  overline,
  rgb,
} = colors;

export {
  bg,
  bgBlack,
  bgBlackBright,
  bgBlue,
  bgBlueBright,
  bgCyan,
  bgCyanBright,
  bgGray,
  bgGreen,
  bgGreenBright,
  bgHex,
  bgMagenta,
  bgMagentaBright,
  bgRed,
  bgRedBright,
  bgRgb,
  bgWhite,
  bgWhiteBright,
  bgYellow,
  bgYellowBright,
  black,
  blackBright,
  blue,
  blueBright,
  bold,
  cyan,
  cyanBright,
  dim,
  fg,
  gray,
  green,
  greenBright,
  hex,
  hidden,
  inverse,
  italic,
  magenta,
  magentaBright,
  overline,
  red,
  redBright,
  reset,
  rgb,
  strikethrough,
  underline,
  white,
  whiteBright,
  yellow,
  yellowBright,
};

import type { ColorSpace } from "termenv/supports";
import { getColorSpace } from "termenv/supports";
import { ansi256To16, hexToRgb, rgbToAnsi16, rgbToAnsi256 } from "./utils";

export type Farve = (
  text: string | boolean | number | null | undefined,
) => string;

interface Farver {
  // modifiers
  reset: ChainedFarve;
  bold: ChainedFarve;
  dim: ChainedFarve;
  italic: ChainedFarve;
  underline: ChainedFarve;
  overline: ChainedFarve;
  inverse: ChainedFarve;
  hidden: ChainedFarve;
  strikethrough: ChainedFarve;

  // colors
  black: ChainedFarve;
  red: ChainedFarve;
  green: ChainedFarve;
  yellow: ChainedFarve;
  blue: ChainedFarve;
  magenta: ChainedFarve;
  cyan: ChainedFarve;
  white: ChainedFarve;
  gray: ChainedFarve;
  redBright: ChainedFarve;
  greenBright: ChainedFarve;
  yellowBright: ChainedFarve;
  blueBright: ChainedFarve;
  magentaBright: ChainedFarve;
  cyanBright: ChainedFarve;
  whiteBright: ChainedFarve;

  // background colors
  bgBlack: ChainedFarve;
  bgRed: ChainedFarve;
  bgGreen: ChainedFarve;
  bgYellow: ChainedFarve;
  bgBlue: ChainedFarve;
  bgMagenta: ChainedFarve;
  bgCyan: ChainedFarve;
  bgWhite: ChainedFarve;
  bgGray: ChainedFarve;
  bgRedBright: ChainedFarve;
  bgGreenBright: ChainedFarve;
  bgYellowBright: ChainedFarve;
  bgBlueBright: ChainedFarve;
  bgMagentaBright: ChainedFarve;
  bgCyanBright: ChainedFarve;
  bgWhiteBright: ChainedFarve;

  // true color
  rgb: (r: number, g: number, b: number) => ChainedFarve;
  bgRgb: (r: number, g: number, b: number) => ChainedFarve;
  fg: (code: number) => ChainedFarve;
  bg: (code: number) => ChainedFarve;
  hex: (hex: string) => ChainedFarve;
  bgHex: (hex: string) => ChainedFarve;
}

export type ChainedFarve = Farve & Farver;

function createWrap(colorSpace: ColorSpace, colors: Farver) {
  const enabled = colorSpace > 0;
  return function wrap(
    start: number | string,
    end: number | string,
  ): ChainedFarve {
    if (!enabled) {
      return chain((text) => `${text}`, colors) as ChainedFarve;
    }
    return chain((text) => {
      if (typeof text !== "string") {
        text = `${text}`;
      }

      if (text.includes("\x1B")) {
        const search = `\u001B[${end}m`;
        text = text.replaceAll(search, `\u001B[${start}m`);
      }

      if (text.includes("\n")) {
        text = text.replace(/(\r?\n)/g, `\u001B[${end}m$1\u001B[${start}m`);
      }

      return `\u001B[${start}m${text}\u001B[${end}m`;
    }, colors) as ChainedFarve;
  };
}

export function createColors(colorSpace: ColorSpace = getColorSpace()): Farver {
  const colors: Farver = {} as Farver;
  const wrap = createWrap(colorSpace, colors);

  let rgb = (r: number, g: number, b: number): ChainedFarve =>
    wrap(`38;2;${r};${g};${b}`, 39);
  let bgRgb = (r: number, g: number, b: number): ChainedFarve =>
    wrap(`48;2;${r};${g};${b}`, 49);
  let fg = (code: number): ChainedFarve => wrap(`38;5;${code}`, 39);
  let bg = (code: number): ChainedFarve => wrap(`48;5;${code}`, 49);
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

  Object.assign(colors, {
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
    // NOTE: maybe the ... is to slow.
    hex: (hex: string) => rgb(...hexToRgb(hex)),
    bgHex: (hex: string) => bgRgb(...hexToRgb(hex)),
  });

  return colors;
}

export const colors: Farver = createColors();

function chain(farve: Farve, currentColors: Farver): Farve {
  return new Proxy(farve, {
    get(target, prop) {
      if (prop in currentColors) {
        const value = currentColors[prop as keyof Farver];

        if (
          prop === "rgb"
          || prop === "bgRgb"
          || prop === "fg"
          || prop === "bg"
          || prop === "hex"
          || prop === "bgHex"
        ) {
          return (...args: number[]) =>
            chain((text) => {
              // @ts-ignore - typescript is not happy with this
              const current = value(...args)(text);
              return farve(current);
            }, currentColors);
        }

        return chain(
          (text) =>
            // @ts-ignore - typescript is not happy with this
            farve(value(text)),
          currentColors,
        );
      }

      return target[prop as keyof Farve];
    },
  });
}

export const {
  bg,
  bgBlack,
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
} = colors;

export default colors;

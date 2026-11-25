import type { ColorSpace } from "termenv/supports";

/**
 * Styles text. Numbers and booleans are converted to text. `undefined`, `null`, and `''` give `''`,
 * except for `reset()`, which gives the reset code.
 *
 * It also works as a template tag: ``red`Error: ${file} not found` `` styles the whole text.
 */
export interface Farve {
  (text?: string | boolean | number | null): string;
  (strings: TemplateStringsArray, ...values: unknown[]): string;
}

/**
 * The styles and colors that can be applied and chained, such as `red`, `bold`, or `rgb(255, 136, 0)`.
 */
export interface Farver {
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

  /** The color level these styles use: 0 for no colors, 1 for 16 colors, 2 for 256 colors, 3 for truecolor. */
  readonly level: ColorSpace;
}

/**
 * The escape codes of a style or chain, such as `red.bold.open`. Both are `''` when colors are disabled.
 */
export interface StyleCodesOf {
  /** The codes that turn on every style in the chain, outermost first. */
  readonly open: string;

  /** The codes that turn them off again, innermost first. */
  readonly close: string;
}

export type ChainedFarve = Farve & Farver & StyleCodesOf;

import { isColorsSupported } from "#supports";

const isColorSupported = isColorsSupported();

export type Farve<T = string | boolean | number | null | undefined | void> = (text: T) => T;

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
  blackBright: ChainedFarve;
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
  bgBlackBright: ChainedFarve;
  bgRedBright: ChainedFarve;
  bgGreenBright: ChainedFarve;
  bgYellowBright: ChainedFarve;
  bgBlueBright: ChainedFarve;
  bgMagentaBright: ChainedFarve;
  bgCyanBright: ChainedFarve;
  bgWhiteBright: ChainedFarve;
}

export type ChainedFarve = Farve & Farver;

function wrap(start: number, end: number): ChainedFarve {
  return chain((text) => {
    if (!isColorSupported) {
      return text;
    }
    return `\u001B[${start}m${text}\u001B[${end}m`;
  }) as ChainedFarve;
}
function identity<T>(text: T): T {
  return text;
}

export function createColors(enabled: boolean = isColorSupported): Farver {
  const colorize = enabled ? wrap : () => chain(identity) as ChainedFarve;

  return {
    reset: colorize(0, 0),
    bold: colorize(1, 22),
    dim: colorize(2, 22),
    italic: colorize(3, 23),
    underline: colorize(4, 24),
    overline: colorize(53, 55),
    inverse: colorize(7, 27),
    hidden: colorize(8, 28),
    strikethrough: colorize(9, 29),

    black: colorize(30, 39),
    red: colorize(31, 39),
    green: colorize(32, 39),
    yellow: colorize(33, 39),
    blue: colorize(34, 39),
    magenta: colorize(35, 39),
    cyan: colorize(36, 39),
    white: colorize(37, 39),
    gray: colorize(90, 39),
    blackBright: colorize(90, 39),
    redBright: colorize(91, 39),
    greenBright: colorize(92, 39),
    yellowBright: colorize(93, 39),
    blueBright: colorize(94, 39),
    magentaBright: colorize(95, 39),
    cyanBright: colorize(96, 39),
    whiteBright: colorize(97, 39),

    bgBlack: colorize(40, 49),
    bgRed: colorize(41, 49),
    bgGreen: colorize(42, 49),
    bgYellow: colorize(43, 49),
    bgBlue: colorize(44, 49),
    bgMagenta: colorize(45, 49),
    bgCyan: colorize(46, 49),
    bgWhite: colorize(47, 49),
    bgGray: colorize(100, 49),
    bgBlackBright: colorize(100, 49),
    bgRedBright: colorize(101, 49),
    bgGreenBright: colorize(102, 49),
    bgYellowBright: colorize(103, 49),
    bgBlueBright: colorize(104, 49),
    bgMagentaBright: colorize(105, 49),
    bgCyanBright: colorize(106, 49),
    bgWhiteBright: colorize(107, 49),
  };
}

export const colors = createColors();

function chain(farve: Farve): Farve {
  return new Proxy(farve, {
    get(target, prop) {
      if (prop in colors) {
        // TODO: Remove these type casts
        return chain((text) => farve(colors[prop as keyof Farver](text)));
      }
      return target[prop as keyof Farve];
    },
  });
}

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
} = colors;

export {
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
};

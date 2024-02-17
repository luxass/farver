import { isColorsSupported } from "#supports";

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
    if (!isColorsSupported()) {
      return text;
    }
    return `\u001B[${start}m${text}\u001B[${end}m`;
  }) as ChainedFarve;
}

export const colors = {
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
} satisfies Farver;

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

import process from "node:process";
import { describe, expect, it } from "vitest";
import {
  createColors,
} from "../src";

const logAnsi = process.env.FARVER_SHOW ? console.error : () => {};

const COLORS_ENABLED = createColors(true);

const FMT = {
  reset: ["\u001B[0m", "\u001B[0m"],
  bold: ["\u001B[1m", "\u001B[22m"],
  dim: ["\u001B[2m", "\u001B[22m"],
  italic: ["\u001B[3m", "\u001B[23m"],
  overline: ["\u001B[53m", "\u001B[55m"],
  underline: ["\u001B[4m", "\u001B[24m"],
  inverse: ["\u001B[7m", "\u001B[27m"],
  hidden: ["\u001B[8m", "\u001B[28m"],
  strikethrough: ["\u001B[9m", "\u001B[29m"],

  black: ["\u001B[30m", "\u001B[39m"],
  red: ["\u001B[31m", "\u001B[39m"],
  green: ["\u001B[32m", "\u001B[39m"],
  yellow: ["\u001B[33m", "\u001B[39m"],
  blue: ["\u001B[34m", "\u001B[39m"],
  magenta: ["\u001B[35m", "\u001B[39m"],
  cyan: ["\u001B[36m", "\u001B[39m"],
  white: ["\u001B[37m", "\u001B[39m"],
  gray: ["\u001B[90m", "\u001B[39m"],
  blackBright: ["\u001B[90m", "\u001B[39m"],
  redBright: ["\u001B[91m", "\u001B[39m"],
  greenBright: ["\u001B[92m", "\u001B[39m"],
  yellowBright: ["\u001B[93m", "\u001B[39m"],
  blueBright: ["\u001B[94m", "\u001B[39m"],
  magentaBright: ["\u001B[95m", "\u001B[39m"],
  cyanBright: ["\u001B[96m", "\u001B[39m"],
  whiteBright: ["\u001B[97m", "\u001B[39m"],

  bgBlack: ["\u001B[40m", "\u001B[49m"],
  bgRed: ["\u001B[41m", "\u001B[49m"],
  bgGreen: ["\u001B[42m", "\u001B[49m"],
  bgYellow: ["\u001B[43m", "\u001B[49m"],
  bgBlue: ["\u001B[44m", "\u001B[49m"],
  bgMagenta: ["\u001B[45m", "\u001B[49m"],
  bgCyan: ["\u001B[46m", "\u001B[49m"],
  bgWhite: ["\u001B[47m", "\u001B[49m"],
  bgGray: ["\u001B[100m", "\u001B[49m"],
  bgBlackBright: ["\u001B[100m", "\u001B[49m"],
  bgRedBright: ["\u001B[101m", "\u001B[49m"],
  bgGreenBright: ["\u001B[102m", "\u001B[49m"],
  bgYellowBright: ["\u001B[103m", "\u001B[49m"],
  bgBlueBright: ["\u001B[104m", "\u001B[49m"],
  bgMagentaBright: ["\u001B[105m", "\u001B[49m"],
  bgCyanBright: ["\u001B[106m", "\u001B[49m"],
  bgWhiteBright: ["\u001B[107m", "\u001B[49m"],
};

function getAnsi(text: string, ansi: keyof typeof FMT) {
  logAnsi(`${FMT[ansi][0]}${text}${FMT[ansi][1]}`);
  return `${FMT[ansi][0]}${text}${FMT[ansi][1]}`;
}

describe("colors", () => {
  for (const color in COLORS_ENABLED) {
    it(`expect color "${color}" to match their ansi color`, () => {
      expect(COLORS_ENABLED[color as keyof typeof COLORS_ENABLED]("test")).toBe(getAnsi("test", color as keyof typeof FMT));
    });
  }
});

it("handle numbers", () => {
  expect(COLORS_ENABLED.green(1)).toBe(getAnsi("1", "green"));
  expect(COLORS_ENABLED.blue(0)).toBe(getAnsi("0", "blue"));
  expect(COLORS_ENABLED.magenta(-1)).toBe(getAnsi("-1", "magenta"));
  expect(COLORS_ENABLED.bgGreen(1.1)).toBe(getAnsi("1.1", "bgGreen"));
  expect(COLORS_ENABLED.bgYellow(-1.1)).toBe(getAnsi("-1.1", "bgYellow"));
  expect(COLORS_ENABLED.bgBlue(Number.NaN)).toBe(getAnsi("NaN", "bgBlue"));
  expect(COLORS_ENABLED.yellow(Number.POSITIVE_INFINITY)).toBe(getAnsi("Infinity", "yellow"));
  expect(COLORS_ENABLED.red(Number.NEGATIVE_INFINITY)).toBe(getAnsi("-Infinity", "red"));
});

it("handle nullish values", () => {
  expect(COLORS_ENABLED.bgGreen(undefined)).toBe(`${FMT.bgGreen[0]}undefined${FMT.bgGreen[1]}`);
  expect(COLORS_ENABLED.bgBlue(null)).toBe(`${FMT.bgBlue[0]}null${FMT.bgBlue[1]}`);
});

it("handle booleans", () => {
  expect(COLORS_ENABLED.red(true)).toBe(getAnsi("true", "red"));
  expect(COLORS_ENABLED.red(false)).toBe(getAnsi("false", "red"));
});

describe("handle non strings", () => {
  const cases = [
    [undefined, "undefined"],
    [null, "null"],
    [true, "true"],
    [false, "false"],
    [0, "0"],
    [Number.NaN, "NaN"],
    [Number.POSITIVE_INFINITY, "Infinity"],
  ];

  for (const [input, output] of cases) {
    it(`expect ${input} to be ${output}`, () => {
      logAnsi(COLORS_ENABLED.red(input), `${FMT.red[0]}${output}${FMT.red[1]}`);
      expect(COLORS_ENABLED.red(input)).toBe(`${FMT.red[0]}${output}${FMT.red[1]}`);
    });
  }
});

describe("createColors", () => {
  describe("disable colors", () => {
    const colors = createColors(false);
    for (const color in colors) {
      it(`expect color "${color}" to not have colors outputted`, () => {
        expect(colors[color as keyof typeof colors]("test")).toBe("test");
      });
    }
  });
});

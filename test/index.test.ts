import process from "node:process";
import { SPACE_16_COLORS, SPACE_256_COLORS } from "termenv/supports";
import { describe, expect, it } from "vitest";
import { createColors } from "../src";

function escape(code: any) {
  // eslint-disable-next-line no-control-regex
  return code.replace(/\x1B/g, "\\x1b");
}

const logAnsi = process.env.FARVER_SHOW ? console.error : () => {};

const COLORS_ENABLED = createColors();

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

// describe.todo("colors", () => {
//   for (const color in COLORS_ENABLED) {
//     it(`expect color "${color}" to match their ansi color`, () => {
//       expect(COLORS_ENABLED[color as keyof typeof COLORS_ENABLED]("test")).toBe(
//         getAnsi("test", color as keyof typeof FMT),
//       );
//     });
//   }
// });

it("handle numbers", () => {
  expect(COLORS_ENABLED.green(1)).toBe(getAnsi("1", "green"));
  expect(COLORS_ENABLED.blue(0)).toBe(getAnsi("0", "blue"));
  expect(COLORS_ENABLED.magenta(-1)).toBe(getAnsi("-1", "magenta"));
  expect(COLORS_ENABLED.bgGreen(1.1)).toBe(getAnsi("1.1", "bgGreen"));
  expect(COLORS_ENABLED.bgYellow(-1.1)).toBe(getAnsi("-1.1", "bgYellow"));
  expect(COLORS_ENABLED.bgBlue(Number.NaN)).toBe(getAnsi("NaN", "bgBlue"));
  expect(COLORS_ENABLED.yellow(Number.POSITIVE_INFINITY)).toBe(
    getAnsi("Infinity", "yellow"),
  );
  expect(COLORS_ENABLED.red(Number.NEGATIVE_INFINITY)).toBe(
    getAnsi("-Infinity", "red"),
  );
});

it("handle nullish values", () => {
  expect(COLORS_ENABLED.bgGreen(undefined)).toBe(
    `${FMT.bgGreen[0]}undefined${FMT.bgGreen[1]}`,
  );
  expect(COLORS_ENABLED.bgBlue(null)).toBe(
    `${FMT.bgBlue[0]}null${FMT.bgBlue[1]}`,
  );
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
      expect(COLORS_ENABLED.red(input)).toBe(
        `${FMT.red[0]}${output}${FMT.red[1]}`,
      );
    });
  }
});

// describe.todo("createColors", () => {
//   describe("disable colors", () => {
//     const colors = createColors(false);
//     for (const color in colors) {
//       it(`expect color "${color}" to not have colors outputted`, () => {
//         expect(colors[color as keyof typeof colors]("test")).toBe("test");
//       });
//     }
//   });
// });

describe("should downscale true colors", () => {
  describe("truecolors -> ansi16", () => {
    const colors = createColors(SPACE_16_COLORS);

    it.each([
      ["hex(#1BE011) -> green", colors.hex("#1BE011"), colors.green],
      ["hex(#11D9C2) -> cyan", colors.hex("#11D9C2"), colors.cyan],
      ["hex(#C511D9) -> magenta", colors.hex("#C511D9"), colors.magenta],
      ["hex(#6614F6) -> magentaBright", colors.hex("#8c4dfa"), colors.magentaBright],
      ["hex(#1157D9) -> blue", colors.hex("#1157D9"), colors.blue],
      ["hex(#39ed2f) -> greenBright", colors.hex("#39ed2f"), colors.greenBright],

      // grayscale hex
      ["hex(#000000) -> black", colors.hex("#000000"), colors.black],
      ["hex(#ffffff) -> white", colors.hex("#ffffff"), colors.whiteBright],
      ["hex(#808080) -> white", colors.hex("#808080"), colors.white],

      // rgb
      ["rgb(255, 0, 0) -> redBright", colors.rgb(255, 0, 0), colors.redBright],
      ["rgb(0, 255, 0) -> greenBright", colors.rgb(0, 255, 0), colors.greenBright],
      ["rgb(0, 0, 255) -> blueBright", colors.rgb(0, 0, 255), colors.blueBright],
      ["rgb(255, 255, 0) -> yellowBright", colors.rgb(255, 255, 0), colors.yellowBright],
      ["rgb(255, 0, 255) -> magentaBright", colors.rgb(255, 0, 255), colors.magentaBright],
      ["rgb(0, 255, 255) -> cyanBright", colors.rgb(0, 255, 255), colors.cyanBright],

      // grayscale rgb
      ["rgb(0, 0, 0) -> black", colors.rgb(0, 0, 0), colors.black],
      ["rgb(255, 255, 255) -> white", colors.rgb(255, 255, 255), colors.whiteBright],
      ["rgb(128, 128, 128) -> white", colors.rgb(128, 128, 128), colors.white],
    ])("ansi16 foreground (%s)", (_name, truecolorFn, ansiFn) => {
      const received = truecolorFn("foreground");
      const expected = ansiFn("foreground");

      expect(escape(received)).toBe(escape(expected));
    });

    it.each([
      ["bgHex(#1BE011) -> bgGreen", colors.bgHex("#1BE011"), colors.bgGreen],
      ["bgHex(#11D9C2) -> bgCyan", colors.bgHex("#11D9C2"), colors.bgCyan],
      ["bgHex(#C511D9) -> bgMagenta", colors.bgHex("#C511D9"), colors.bgMagenta],
      ["bgHex(#6614F6) -> bgMagentaBright", colors.bgHex("#8c4dfa"), colors.bgMagentaBright],
      ["bgHex(#1157D9) -> bgBlue", colors.bgHex("#1157D9"), colors.bgBlue],
      ["bgHex(#39ed2f) -> bgGreenBright", colors.bgHex("#39ed2f"), colors.bgGreenBright],

      // grayscale hex
      ["bgHex(#000000) -> bgBlack", colors.bgHex("#000000"), colors.bgBlack],
      ["bgHex(#ffffff) -> bgWhite", colors.bgHex("#ffffff"), colors.bgWhiteBright],
      ["bgHex(#808080) -> bgWhite", colors.bgHex("#808080"), colors.bgWhite],

      // rgb
      ["bgRgb(255, 0, 0) -> bgRedBright", colors.bgRgb(255, 0, 0), colors.bgRedBright],
      ["bgRgb(0, 255, 0) -> bgGreenBright", colors.bgRgb(0, 255, 0), colors.bgGreenBright],
      ["bgRgb(0, 0, 255) -> bgBlueBright", colors.bgRgb(0, 0, 255), colors.bgBlueBright],
      ["bgRgb(255, 255, 0) -> bgYellowBright", colors.bgRgb(255, 255, 0), colors.bgYellowBright],
      ["bgRgb(255, 0, 255) -> bgMagentaBright", colors.bgRgb(255, 0, 255), colors.bgMagentaBright],
      ["bgRgb(0, 255, 255) -> bgCyanBright", colors.bgRgb(0, 255, 255), colors.bgCyanBright],

      // grayscale rgb
      ["bgRgb(0, 0, 0) -> bgBlack", colors.bgRgb(0, 0, 0), colors.bgBlack],
      ["bgRgb(255, 255, 255) -> bgWhite", colors.bgRgb(255, 255, 255), colors.bgWhiteBright],
      ["bgRgb(128, 128, 128) -> bgWhite", colors.bgRgb(128, 128, 128), colors.bgWhite],
    ])("ansi16 background (%s)", (_name, truecolorFn, ansiFn) => {
      const received = truecolorFn("background");
      const expected = ansiFn("background");

      expect(escape(received)).toBe(escape(expected));
    });
  });

  describe("truecolors -> ansi256", () => {
    const colors = createColors(SPACE_256_COLORS);

    it.each([
      ["hex(#1BE011) -> fg(76)", colors.hex("#1BE011"), colors.fg(76)],
      ["hex(#11D9C2) -> fg(44)", colors.hex("#11D9C2"), colors.fg(44)],
      ["hex(#C511D9) -> fg(164)", colors.hex("#C511D9"), colors.fg(164)],
      ["hex(#6614F6) -> fg(141)", colors.hex("#8c4dfa"), colors.fg(141)],
      ["hex(#1157D9) -> fg(32)", colors.hex("#1157D9"), colors.fg(32)],
      ["hex(#39ed2f) -> fg(83)", colors.hex("#39ed2f"), colors.fg(83)],

      // grayscale hex
      ["hex(#000000) -> fg(16)", colors.hex("#000000"), colors.fg(16)],
      ["hex(#ffffff) -> fg(231)", colors.hex("#ffffff"), colors.fg(231)],
      ["hex(#808080) -> fg(244)", colors.hex("#808080"), colors.fg(244)],

      // rgb
      ["rgb(255, 0, 0) -> fg(196)", colors.rgb(255, 0, 0), colors.fg(196)],
      ["rgb(0, 255, 0) -> fg(46)", colors.rgb(0, 255, 0), colors.fg(46)],
      ["rgb(0, 0, 255) -> fg(21)", colors.rgb(0, 0, 255), colors.fg(21)],
      ["rgb(255, 255, 0) -> fg(226)", colors.rgb(255, 255, 0), colors.fg(226)],
      ["rgb(255, 0, 255) -> fg(201)", colors.rgb(255, 0, 255), colors.fg(201)],
      ["rgb(0, 255, 255) -> fg(51)", colors.rgb(0, 255, 255), colors.fg(51)],

      // grayscale rgb
      ["rgb(0, 0, 0) -> fg(16)", colors.rgb(0, 0, 0), colors.fg(16)],
      ["rgb(255, 255, 255) -> fg(231)", colors.rgb(255, 255, 255), colors.fg(231)],
      ["rgb(128, 128, 128) -> fg(244)", colors.rgb(128, 128, 128), colors.fg(244)],
    ])("ansi256 foreground (%s)", (_name, truecolorFn, ansiFn) => {
      const received = truecolorFn("foreground");
      const expected = ansiFn("foreground");

      expect(escape(received)).toBe(escape(expected));
    });

    it.each([
      ["bgHex(#1BE011) -> bg(76)", colors.bgHex("#1BE011"), colors.bg(76)],
      ["bgHex(#11D9C2) -> bg(44)", colors.bgHex("#11D9C2"), colors.bg(44)],
      ["bgHex(#C511D9) -> bg(164)", colors.bgHex("#C511D9"), colors.bg(164)],
      ["bgHex(#6614F6) -> bg(141)", colors.bgHex("#8c4dfa"), colors.bg(141)],
      ["bgHex(#1157D9) -> bg(32)", colors.bgHex("#1157D9"), colors.bg(32)],
      ["bgHex(#39ed2f) -> bg(83)", colors.bgHex("#39ed2f"), colors.bg(83)],

      // grayscale hex
      ["bgHex(#000000) -> bg(16)", colors.bgHex("#000000"), colors.bg(16)],
      ["bgHex(#ffffff) -> bg(231)", colors.bgHex("#ffffff"), colors.bg(231)],
      ["bgHex(#808080) -> bg(244)", colors.bgHex("#808080"), colors.bg(244)],

      // rgb
      ["bgRgb(255, 0, 0) -> bg(196)", colors.bgRgb(255, 0, 0), colors.bg(196)],
      ["bgRgb(0, 255, 0) -> bg(46)", colors.bgRgb(0, 255, 0), colors.bg(46)],
      ["bgRgb(0, 0, 255) -> bg(21)", colors.bgRgb(0, 0, 255), colors.bg(21)],
      ["bgRgb(255, 255, 0) -> bg(226)", colors.bgRgb(255, 255, 0), colors.bg(226)],
      ["bgRgb(255, 0, 255) -> bg(201)", colors.bgRgb(255, 0, 255), colors.bg(201)],
      ["bgRgb(0, 255, 255) -> bg(51)", colors.bgRgb(0, 255, 255), colors.bg(51)],

      // grayscale rgb
      ["bgRgb(0, 0, 0) -> bg(16)", colors.bgRgb(0, 0, 0), colors.bg(16)],
      ["bgRgb(255, 255, 255) -> bg(231)", colors.bgRgb(255, 255, 255), colors.bg(231)],
      ["bgRgb(128, 128, 128) -> bg(244)", colors.bgRgb(128, 128, 128), colors.bg(244)],
    ])("ansi256 background (%s)", (_name, truecolorFn, ansiFn) => {
      const received = truecolorFn("background");
      const expected = ansiFn("background");

      expect(escape(received)).toBe(escape(expected));
    });
  });
});

it.only("handle nested colors", () => {
  const colors = createColors(SPACE_256_COLORS);

  const received = colors.bgHex("#1BE011").hex("#11D9C2")("nested");
  const expected = colors.bg(76).fg(44)("nested");
  console.log(escape(received), escape(expected));
  console.log(received, expected);

  expect(escape(received)).toBe(escape(expected));
});

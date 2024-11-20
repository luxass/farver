import {
  SPACE_16_COLORS,
  SPACE_256_COLORS,
  SPACE_MONO,
} from "termenv/supports";
import { describe, expect, it } from "vitest";
import {
  bgBlack,
  bgBlackBright,
  bgBlue,
  bgBlueBright,
  bgCyan,
  bgCyanBright,
  bgGray,
  bgGreen,
  bgGreenBright,
  bgMagenta,
  bgMagentaBright,
  bgRed,
  bgRedBright,
  bgWhite,
  bgWhiteBright,
  bgYellow,
  bgYellowBright,
  black,
  blackBright,
  blue,
  blueBright,
  createColors,
  cyan,
  cyanBright,
  gray,
  green,
  greenBright,
  magenta,
  magentaBright,
  red,
  redBright,
  white,
  whiteBright,
  yellow,
  yellowBright,
} from "../src";
import { ansiLog, escape, FMT, getAnsi } from "./shared";

describe("ansi colors match", () => {
  it.each([
    ["black", black, ["\u001B[30m", "\u001B[39m"]],
    ["red", red, ["\u001B[31m", "\u001B[39m"]],
    ["green", green, ["\u001B[32m", "\u001B[39m"]],
    ["yellow", yellow, ["\u001B[33m", "\u001B[39m"]],
    ["blue", blue, ["\u001B[34m", "\u001B[39m"]],
    ["magenta", magenta, ["\u001B[35m", "\u001B[39m"]],
    ["cyan", cyan, ["\u001B[36m", "\u001B[39m"]],
    ["white", white, ["\u001B[37m", "\u001B[39m"]],
    ["gray", gray, ["\u001B[90m", "\u001B[39m"]],
    ["blackBright", blackBright, ["\u001B[90m", "\u001B[39m"]],
    ["redBright", redBright, ["\u001B[91m", "\u001B[39m"]],
    ["greenBright", greenBright, ["\u001B[92m", "\u001B[39m"]],
    ["yellowBright", yellowBright, ["\u001B[93m", "\u001B[39m"]],
    ["blueBright", blueBright, ["\u001B[94m", "\u001B[39m"]],
    ["magentaBright", magentaBright, ["\u001B[95m", "\u001B[39m"]],
    ["cyanBright", cyanBright, ["\u001B[96m", "\u001B[39m"]],
    ["whiteBright", whiteBright, ["\u001B[97m", "\u001B[39m"]],
    ["bgBlack", bgBlack, ["\u001B[40m", "\u001B[49m"]],
    ["bgRed", bgRed, ["\u001B[41m", "\u001B[49m"]],
    ["bgGreen", bgGreen, ["\u001B[42m", "\u001B[49m"]],
    ["bgYellow", bgYellow, ["\u001B[43m", "\u001B[49m"]],
    ["bgBlue", bgBlue, ["\u001B[44m", "\u001B[49m"]],
    ["bgMagenta", bgMagenta, ["\u001B[45m", "\u001B[49m"]],
    ["bgCyan", bgCyan, ["\u001B[46m", "\u001B[49m"]],
    ["bgWhite", bgWhite, ["\u001B[47m", "\u001B[49m"]],
    ["bgGray", bgGray, ["\u001B[100m", "\u001B[49m"]],
    ["bgBlackBright", bgBlackBright, ["\u001B[100m", "\u001B[49m"]],
    ["bgRedBright", bgRedBright, ["\u001B[101m", "\u001B[49m"]],
    ["bgGreenBright", bgGreenBright, ["\u001B[102m", "\u001B[49m"]],
    ["bgYellowBright", bgYellowBright, ["\u001B[103m", "\u001B[49m"]],
    ["bgBlueBright", bgBlueBright, ["\u001B[104m", "\u001B[49m"]],
    ["bgMagentaBright", bgMagentaBright, ["\u001B[105m", "\u001B[49m"]],
    ["bgCyanBright", bgCyanBright, ["\u001B[106m", "\u001B[49m"]],
    ["bgWhiteBright", bgWhiteBright, ["\u001B[107m", "\u001B[49m"]],
  ])("expect color %s to match their ansi color", (colorName, color, ansi) => {
    const received = color(colorName);

    expect(escape(received)).toBe(escape(`${ansi[0]}${colorName}${ansi[1]}`));
  });
});

it("handle numbers", () => {
  expect(green(1)).toBe(getAnsi("1", "green"));
  expect(magenta(-1)).toBe(getAnsi("-1", "magenta"));
  expect(bgGreen(1.1)).toBe(getAnsi("1.1", "bgGreen"));
  expect(bgYellow(-1.1)).toBe(getAnsi("-1.1", "bgYellow"));
  expect(bgBlue(Number.NaN)).toBe(getAnsi("NaN", "bgBlue"));
  expect(yellow(Number.POSITIVE_INFINITY)).toBe(getAnsi("Infinity", "yellow"));
  expect(red(Number.NEGATIVE_INFINITY)).toBe(getAnsi("-Infinity", "red"));
});

it("handle nullish values", () => {
  expect(bgGreen(undefined)).toBe(
    `${FMT.bgGreen[0]}undefined${FMT.bgGreen[1]}`,
  );
  expect(bgBlue(null)).toBe(`${FMT.bgBlue[0]}null${FMT.bgBlue[1]}`);
});

it("handle booleans", () => {
  expect(red(true)).toBe(getAnsi("true", "red"));
  expect(red(false)).toBe(getAnsi("false", "red"));
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
      ansiLog(red(input), `${FMT.red[0]}${output}${FMT.red[1]}`);
      expect(red(input)).toBe(`${FMT.red[0]}${output}${FMT.red[1]}`);
    });
  }
});

describe("colors disabled", () => {
  const COLORS_DISABLED = createColors(SPACE_MONO);
  it.each([
    ["black", COLORS_DISABLED.black, ["\u001B[30m", "\u001B[39m"]],
    ["red", COLORS_DISABLED.red, ["\u001B[31m", "\u001B[39m"]],
    ["green", COLORS_DISABLED.green, ["\u001B[32m", "\u001B[39m"]],
    ["yellow", COLORS_DISABLED.yellow, ["\u001B[33m", "\u001B[39m"]],
    ["blue", COLORS_DISABLED.blue, ["\u001B[34m", "\u001B[39m"]],
    ["magenta", COLORS_DISABLED.magenta, ["\u001B[35m", "\u001B[39m"]],
    ["cyan", COLORS_DISABLED.cyan, ["\u001B[36m", "\u001B[39m"]],
    ["white", COLORS_DISABLED.white, ["\u001B[37m", "\u001B[39m"]],
    ["gray", COLORS_DISABLED.gray, ["\u001B[90m", "\u001B[39m"]],
    ["blackBright", COLORS_DISABLED.blackBright, ["\u001B[90m", "\u001B[39m"]],
    ["redBright", COLORS_DISABLED.redBright, ["\u001B[91m", "\u001B[39m"]],
    ["greenBright", COLORS_DISABLED.greenBright, ["\u001B[92m", "\u001B[39m"]],
    [
      "yellowBright",
      COLORS_DISABLED.yellowBright,
      ["\u001B[93m", "\u001B[39m"],
    ],
    ["blueBright", COLORS_DISABLED.blueBright, ["\u001B[94m", "\u001B[39m"]],
    [
      "magentaBright",
      COLORS_DISABLED.magentaBright,
      ["\u001B[95m", "\u001B[39m"],
    ],
    ["cyanBright", COLORS_DISABLED.cyanBright, ["\u001B[96m", "\u001B[39m"]],
    ["whiteBright", COLORS_DISABLED.whiteBright, ["\u001B[97m", "\u001B[39m"]],
    ["bgBlack", COLORS_DISABLED.bgBlack, ["\u001B[40m", "\u001B[49m"]],
    ["bgRed", COLORS_DISABLED.bgRed, ["\u001B[41m", "\u001B[49m"]],
    ["bgGreen", COLORS_DISABLED.bgGreen, ["\u001B[42m", "\u001B[49m"]],
    ["bgYellow", COLORS_DISABLED.bgYellow, ["\u001B[43m", "\u001B[49m"]],
    ["bgBlue", COLORS_DISABLED.bgBlue, ["\u001B[44m", "\u001B[49m"]],
    ["bgMagenta", COLORS_DISABLED.bgMagenta, ["\u001B[45m", "\u001B[49m"]],
    ["bgCyan", COLORS_DISABLED.bgCyan, ["\u001B[46m", "\u001B[49m"]],
    ["bgWhite", COLORS_DISABLED.bgWhite, ["\u001B[47m", "\u001B[49m"]],
    ["bgGray", COLORS_DISABLED.bgGray, ["\u001B[100m", "\u001B[49m"]],
    [
      "bgBlackBright",
      COLORS_DISABLED.bgBlackBright,
      ["\u001B[100m", "\u001B[49m"],
    ],
    ["bgRedBright", COLORS_DISABLED.bgRedBright, ["\u001B[101m", "\u001B[49m"]],
    [
      "bgGreenBright",
      COLORS_DISABLED.bgGreenBright,
      ["\u001B[102m", "\u001B[49m"],
    ],
    [
      "bgYellowBright",
      COLORS_DISABLED.bgYellowBright,
      ["\u001B[103m", "\u001B[49m"],
    ],
    [
      "bgBlueBright",
      COLORS_DISABLED.bgBlueBright,
      ["\u001B[104m", "\u001B[49m"],
    ],
    [
      "bgMagentaBright",
      COLORS_DISABLED.bgMagentaBright,
      ["\u001B[105m", "\u001B[49m"],
    ],
    [
      "bgCyanBright",
      COLORS_DISABLED.bgCyanBright,
      ["\u001B[106m", "\u001B[49m"],
    ],
    [
      "bgWhiteBright",
      COLORS_DISABLED.bgWhiteBright,
      ["\u001B[107m", "\u001B[49m"],
    ],
  ])("expect color %s to match their ansi color", (colorName, color, ansi) => {
    const received = color(colorName);

    expect(escape(received)).not.toBe(
      escape(`${ansi[0]}${colorName}${ansi[1]}`),
    );
    expect(received).toBe(colorName);
  });
});

describe("should downscale true colors", () => {
  describe("truecolors -> ansi16", () => {
    const colors = createColors(SPACE_16_COLORS);

    it.each([
      ["hex(#1BE011) -> green", colors.hex("#1BE011"), colors.green],
      ["hex(#11D9C2) -> cyan", colors.hex("#11D9C2"), colors.cyan],
      ["hex(#C511D9) -> magenta", colors.hex("#C511D9"), colors.magenta],
      [
        "hex(#6614F6) -> magentaBright",
        colors.hex("#8c4dfa"),
        colors.magentaBright,
      ],
      ["hex(#1157D9) -> blue", colors.hex("#1157D9"), colors.blue],
      [
        "hex(#39ed2f) -> greenBright",
        colors.hex("#39ed2f"),
        colors.greenBright,
      ],

      // grayscale hex
      ["hex(#000000) -> black", colors.hex("#000000"), colors.black],
      ["hex(#ffffff) -> white", colors.hex("#ffffff"), colors.whiteBright],
      ["hex(#808080) -> white", colors.hex("#808080"), colors.white],

      // rgb
      ["rgb(255, 0, 0) -> redBright", colors.rgb(255, 0, 0), colors.redBright],
      [
        "rgb(0, 255, 0) -> greenBright",
        colors.rgb(0, 255, 0),
        colors.greenBright,
      ],
      [
        "rgb(0, 0, 255) -> blueBright",
        colors.rgb(0, 0, 255),
        colors.blueBright,
      ],
      [
        "rgb(255, 255, 0) -> yellowBright",
        colors.rgb(255, 255, 0),
        colors.yellowBright,
      ],
      [
        "rgb(255, 0, 255) -> magentaBright",
        colors.rgb(255, 0, 255),
        colors.magentaBright,
      ],
      [
        "rgb(0, 255, 255) -> cyanBright",
        colors.rgb(0, 255, 255),
        colors.cyanBright,
      ],

      // grayscale rgb
      ["rgb(0, 0, 0) -> black", colors.rgb(0, 0, 0), colors.black],
      [
        "rgb(255, 255, 255) -> white",
        colors.rgb(255, 255, 255),
        colors.whiteBright,
      ],
      ["rgb(128, 128, 128) -> white", colors.rgb(128, 128, 128), colors.white],
    ])("ansi16 foreground (%s)", (_name, truecolorFn, ansiFn) => {
      const received = truecolorFn("foreground");
      const expected = ansiFn("foreground");

      expect(escape(received)).toBe(escape(expected));
    });

    it.each([
      ["bgHex(#1BE011) -> bgGreen", colors.bgHex("#1BE011"), colors.bgGreen],
      ["bgHex(#11D9C2) -> bgCyan", colors.bgHex("#11D9C2"), colors.bgCyan],
      [
        "bgHex(#C511D9) -> bgMagenta",
        colors.bgHex("#C511D9"),
        colors.bgMagenta,
      ],
      [
        "bgHex(#6614F6) -> bgMagentaBright",
        colors.bgHex("#8c4dfa"),
        colors.bgMagentaBright,
      ],
      ["bgHex(#1157D9) -> bgBlue", colors.bgHex("#1157D9"), colors.bgBlue],
      [
        "bgHex(#39ed2f) -> bgGreenBright",
        colors.bgHex("#39ed2f"),
        colors.bgGreenBright,
      ],

      // grayscale hex
      ["bgHex(#000000) -> bgBlack", colors.bgHex("#000000"), colors.bgBlack],
      [
        "bgHex(#ffffff) -> bgWhite",
        colors.bgHex("#ffffff"),
        colors.bgWhiteBright,
      ],
      ["bgHex(#808080) -> bgWhite", colors.bgHex("#808080"), colors.bgWhite],

      // rgb
      [
        "bgRgb(255, 0, 0) -> bgRedBright",
        colors.bgRgb(255, 0, 0),
        colors.bgRedBright,
      ],
      [
        "bgRgb(0, 255, 0) -> bgGreenBright",
        colors.bgRgb(0, 255, 0),
        colors.bgGreenBright,
      ],
      [
        "bgRgb(0, 0, 255) -> bgBlueBright",
        colors.bgRgb(0, 0, 255),
        colors.bgBlueBright,
      ],
      [
        "bgRgb(255, 255, 0) -> bgYellowBright",
        colors.bgRgb(255, 255, 0),
        colors.bgYellowBright,
      ],
      [
        "bgRgb(255, 0, 255) -> bgMagentaBright",
        colors.bgRgb(255, 0, 255),
        colors.bgMagentaBright,
      ],
      [
        "bgRgb(0, 255, 255) -> bgCyanBright",
        colors.bgRgb(0, 255, 255),
        colors.bgCyanBright,
      ],

      // grayscale rgb
      ["bgRgb(0, 0, 0) -> bgBlack", colors.bgRgb(0, 0, 0), colors.bgBlack],
      [
        "bgRgb(255, 255, 255) -> bgWhite",
        colors.bgRgb(255, 255, 255),
        colors.bgWhiteBright,
      ],
      [
        "bgRgb(128, 128, 128) -> bgWhite",
        colors.bgRgb(128, 128, 128),
        colors.bgWhite,
      ],
    ])("ansi16 background (%s)", (_name, truecolorFn, ansiFn) => {
      const received = truecolorFn("background");
      const expected = ansiFn("background");

      expect(escape(received)).toBe(escape(expected));
    });

    it("handle nested colors", () => {
      const colors = createColors(SPACE_16_COLORS);

      const received = colors.bgHex("#1BE011").hex("#11D9C2")("nested");
      const expected = colors.bgGreen.cyan("nested");

      expect(escape(received)).toBe(escape(expected));
    });

    it("handle deep nested colors", () => {
      const colors = createColors(SPACE_16_COLORS);

      const received = colors
        .bgHex("#1BE011")
        .hex("#11D9C2")
        .bgRgb(0, 255, 0)
        .hex("#C511D9")("deep nested");
      const expected = colors.bgGreen.cyan.bgGreenBright.magenta("deep nested");

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
      [
        "rgb(255, 255, 255) -> fg(231)",
        colors.rgb(255, 255, 255),
        colors.fg(231),
      ],
      [
        "rgb(128, 128, 128) -> fg(244)",
        colors.rgb(128, 128, 128),
        colors.fg(244),
      ],
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
      [
        "bgRgb(255, 255, 0) -> bg(226)",
        colors.bgRgb(255, 255, 0),
        colors.bg(226),
      ],
      [
        "bgRgb(255, 0, 255) -> bg(201)",
        colors.bgRgb(255, 0, 255),
        colors.bg(201),
      ],
      [
        "bgRgb(0, 255, 255) -> bg(51)",
        colors.bgRgb(0, 255, 255),
        colors.bg(51),
      ],

      // grayscale rgb
      ["bgRgb(0, 0, 0) -> bg(16)", colors.bgRgb(0, 0, 0), colors.bg(16)],
      [
        "bgRgb(255, 255, 255) -> bg(231)",
        colors.bgRgb(255, 255, 255),
        colors.bg(231),
      ],
      [
        "bgRgb(128, 128, 128) -> bg(244)",
        colors.bgRgb(128, 128, 128),
        colors.bg(244),
      ],
    ])("ansi256 background (%s)", (_name, truecolorFn, ansiFn) => {
      const received = truecolorFn("background");
      const expected = ansiFn("background");

      expect(escape(received)).toBe(escape(expected));
    });

    it("handle nested colors", () => {
      const colors = createColors(SPACE_256_COLORS);

      const received = colors.bgHex("#1BE011").hex("#11D9C2")("nested");
      const expected = colors.bg(76).fg(44)("nested");

      expect(escape(received)).toBe(escape(expected));
    });

    it("handle deep nested colors", () => {
      const colors = createColors(SPACE_256_COLORS);

      const received = colors
        .bgHex("#1BE011")
        .hex("#11D9C2")
        .bgRgb(0, 255, 0)
        .hex("#C511D9")("deep nested");
      const expected = colors.bg(76).fg(44).bg(46).fg(164)("deep nested");

      expect(escape(received)).toBe(escape(expected));
    });
  });
});

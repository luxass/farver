import process from "node:process";

export const FMT = {
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

export const TrueColorFns = [
  "rgb",
  "hex",
  "bgRgb",
  "bgHex",
  "fg",
  "bg",
];

export const ansiLog = process.env.FARVER_SHOW ? console.error : () => { };

export function getAnsi(text: string, ansi: keyof typeof FMT): string {
  ansiLog(`${FMT[ansi][0]}${text}${FMT[ansi][1]}`);
  return `${FMT[ansi][0]}${text}${FMT[ansi][1]}`;
}

export function escape(code: any): string {
  // eslint-disable-next-line no-control-regex
  return code.replace(/\x1B/g, "\\x1b");
}

import type { ColorSpace } from "termenv/supports";
import { getColorSpace } from "termenv/supports";

import type { StyleCodes } from "./styles";
import { FIXED_STYLES, getColorFunctions } from "./styles";

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
}

export type ChainedFarve = Farve & Farver;

type FixedStyleName = {
  [Name in keyof Farver]: Farver[Name] extends ChainedFarve ? Name : never;
}[keyof Farver];

// Every fixed style in the Farver interface needs codes. A missing one fails the type check here.
const fixedStyles: Record<FixedStyleName, StyleCodes> = FIXED_STYLES;

/**
 * The codes of every style in a chain, outermost first. `red.bold` stores `[red, bold]`.
 */
const CHAIN = Symbol("farver.chain");

interface ChainNode {
  [CHAIN]: readonly StyleCodes[];
}

const NEWLINE = /(\r?\n)/gu;

function toText(text: string | boolean | number): string {
  return typeof text === "string" ? text : `${text}`;
}

function isTemplateStrings(input: unknown): input is TemplateStringsArray {
  return Array.isArray(input) && "raw" in input;
}

/**
 * Joins a tagged template the way an untagged template literal would. Escapes such as `\\n` are
 * applied. A string part with an invalid escape has no cooked value, so its raw text is used.
 */
function joinTemplate(strings: TemplateStringsArray, values: readonly unknown[]): string {
  let text = strings[0] ?? strings.raw[0] ?? "";
  for (let index = 0; index < values.length; index++) {
    text += String(values[index]) + (strings[index + 1] ?? strings.raw[index + 1] ?? "");
  }
  return text;
}

/**
 * Wraps text in one style. A close code of the same style inside the text would end the style early,
 * so it's replaced with the open code. Styles are also closed before each line break and reopened after it.
 */
function applyStyle(text: string, { open, close }: StyleCodes): string {
  let result = text;
  if (result.includes("\u001B")) result = result.replaceAll(close, open);
  if (result.includes("\n")) result = result.replace(NEWLINE, `${close}$1${open}`);
  return open + result + close;
}

/**
 * Checks whether an inner style's code is the close code of an outer style. Wrapping in one step would then
 * give different bytes than wrapping style by style, because the outer style also replaces the inner codes.
 */
function hasOverlappingCodes(chain: readonly StyleCodes[]): boolean {
  for (let outer = 0; outer < chain.length; outer++) {
    for (let inner = outer + 1; inner < chain.length; inner++) {
      const { close } = chain[outer]!;
      if (chain[inner]!.open === close || chain[inner]!.close === close) return true;
    }
  }
  return false;
}

/**
 * Creates the function for a chain of styles. Its prototype holds the getters for chaining further.
 *
 * The result is the same as applying each style in turn, innermost first: `red.bold(text)` equals
 * `red(bold(text))`. Most chains do that in one step, with the open and close codes of the whole chain.
 */
function createStyle(
  chain: readonly StyleCodes[],
  prototype: object,
  enabled: boolean,
): ChainedFarve {
  let openAll = "";
  let closeAll = "";
  for (const { open, close } of chain) {
    openAll += open;
    closeAll = close + closeAll;
  }
  const inOneStep = !hasOverlappingCodes(chain);
  // Empty input gives empty output, so nothing is printed. `reset()` alone gives the reset code.
  const emptyResult =
    enabled && chain.length === 1 && chain[0] === fixedStyles.reset ? openAll : "";

  const style = (
    input?: string | boolean | number | null | TemplateStringsArray,
    ...values: unknown[]
  ): string => {
    const text = isTemplateStrings(input) ? joinTemplate(input, values) : input;
    if (text === undefined || text === null || text === "") return emptyResult;
    let result = toText(text);
    if (!enabled) return result;

    if (!inOneStep) {
      for (let index = chain.length - 1; index >= 0; index--)
        result = applyStyle(result, chain[index]!);
      return result;
    }

    if (result.includes("\u001B")) {
      for (let index = chain.length - 1; index >= 0; index--) {
        result = result.replaceAll(chain[index]!.close, chain[index]!.open);
      }
    }
    if (result.includes("\n")) result = result.replace(NEWLINE, `${closeAll}$1${openAll}`);
    return openAll + result + closeAll;
  };
  Object.setPrototypeOf(style, prototype);
  (style as unknown as ChainNode)[CHAIN] = chain;
  return style as unknown as ChainedFarve;
}

/**
 * Defines a getter that builds a value on first access and then stores it on the object it was read from,
 * so later reads are plain property reads.
 */
function defineCachedGetter(
  prototype: object,
  name: string,
  build: (parentChain: readonly StyleCodes[]) => unknown,
): void {
  Object.defineProperty(prototype, name, {
    get(this: ChainNode) {
      const value = build(this[CHAIN]);
      Object.defineProperty(this, name, { value });
      return value;
    },
  });
}

/**
 * Creates a set of styles for a color space. Without an argument, the color space is detected.
 *
 * Each style is built the first time it's used and then cached, so chains such as `red.bold.underline`
 * cost only property reads after the first use.
 */
export function createColors(colorSpace: ColorSpace = getColorSpace()): Farver {
  const enabled = colorSpace > 0;
  const prototype = Object.create(Function.prototype) as object;

  for (const [name, styleCodes] of Object.entries(fixedStyles)) {
    defineCachedGetter(prototype, name, (parentChain) =>
      createStyle([...parentChain, styleCodes], prototype, enabled),
    );
  }

  for (const [name, colorFunction] of Object.entries(getColorFunctions(colorSpace))) {
    const toCodes = colorFunction as (...args: unknown[]) => StyleCodes;
    defineCachedGetter(
      prototype,
      name,
      (parentChain) =>
        (...args: unknown[]) =>
          createStyle([...parentChain, toCodes(...args)], prototype, enabled),
    );
  }

  const colors = Object.create(prototype) as ChainNode;
  colors[CHAIN] = [];
  return colors as unknown as Farver;
}

export const colors: Farver = createColors();

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

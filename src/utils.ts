/**
 * Transforms a hexadecimal color code into its RGB components.
 *
 * This function accepts hexadecimal color codes that are either 3 or 6 characters long, with an optional leading "#".
 *
 * A 3-character hex code is expanded to 6 characters by duplicating each digit, representing a color in RGB format.
 * For instance, "#123" becomes "#112233".
 *
 * A 6-character hex code directly represents the color in RGB format.
 * For example, "#112233".
 *
 * @example
 * ```ts
 * import { hexToRgb } from "farver/utils";
 *
 * console.log(hexToRgb("#FF0000")); // Outputs: [255, 0, 0]
 * console.log(hexToRgb("#00FF00")); // Outputs: [0, 255, 0]
 * console.log(hexToRgb("#0000FF")); // Outputs: [0, 0, 255]
 * console.log(hexToRgb("#FFF"));    // Outputs: [255, 255, 255]
 * ```
 */
export function hexToRgb(hex: string): [r: number, g: number, b: number] {
  let [, color] = /([a-f\d]{3,6})/i.exec(hex) || [];
  if (!color) return [0, 0, 0];

  if (color.length === 3) {
    color = color[0]! + color[0] + color[1] + color[1] + color[2] + color[2];
  } else if (color.length !== 6) {
    return [0, 0, 0];
  }

  // eslint-disable-next-line prefer-const
  let num = Number.parseInt(color, 16);

  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Converts RGB color values to the closest ANSI 256 color code.
 *
 * @param {number} r - Red component value (0-255)
 * @param {number} g - Green component value (0-255)
 * @param {number} b - Blue component value (0-255)
 * @returns {number} The closest ANSI 256 color code (16-231 for RGB colors, 232-255 for grayscale)
 *
 * @remarks
 * The function first checks if the color is grayscale (all RGB components are equal).
 * For grayscale colors, it returns values between 232-255, with some edge cases:
 * - Values < 8 return 16 (black)
 * - Values > 248 return 231 (white)
 *
 * For RGB colors, it uses the standard 6x6x6 color cube mapping formula to find
 * the closest ANSI 256 color code between 16-231.
 *
 * https://github.com/Qix-/color-convert/blob/master/conversions.js#L551
 *
 * @example
 * ```ts
 * import { rgbToAnsi256 } from "farver/utils";
 *
 * rgbToAnsi256(255, 0, 0); // Returns 196 (red)
 * rgbToAnsi256(0, 255, 0); // Returns 46 (green)
 * rgbToAnsi256(0, 0, 255); // Returns 21 (blue)
 * ```
 */
export function rgbToAnsi256(r: number, g: number, b: number): number {
  // grayscale
  if (r === g && g === b) {
    if (r < 8) return 16;
    if (r > 248) return 231;
    return Math.round(((r - 8) / 247) * 24) + 232;
  }

  return (
    16 +
    // r / 255 * 5 = r / 51
    36 * Math.round(r / 51) +
    6 * Math.round(g / 51) +
    Math.round(b / 51)
  );
}

/**
 * Converts an ANSI 256-color code to its closest ANSI 16-color equivalent
 *
 * @param {number} code - A number between 0 and 255 representing an ANSI 256-color code
 * @returns {number} A number representing the closest ANSI 16-color code (30-37, 90-97)
 *
 * @remarks
 * The conversion follows these rules:
 * - For codes 0-7: Returns standard colors (30-37)
 * - For codes 8-15: Returns bright colors (90-97)
 * - For codes 232-255: Converts grayscale values
 * - For other codes: Converts RGB values to closest 16-color equivalent
 *
 * @example
 * ```ts
 * import { ansi256To16 } from "farver/utils";
 *
 * ansi256To16(196); // Returns bright red color code
 * ansi256To16(0);   // Returns black color code (30)
 * ```
 */
export function ansi256To16(code: number): number {
  // fast path for standard colors
  if (code < 8) return 30 + code;

  // fast path for standard bright colors
  if (code < 16) return 90 + (code - 8);

  let r: number;
  let g: number;
  let b: number;

  // grayscale starts at 232
  if (code >= 232) {
    r = g = b = ((code - 232) * 10 + 8) / 255;
  } else {
    code -= 16;
    const remainder = code % 36;

    r = Math.floor(code / 36) / 5;
    g = Math.floor(remainder / 6) / 5;
    b = (remainder % 6) / 5;
  }

  const value = Math.max(r, g, b) * 2;

  if (value === 0) {
    return 30;
  }

  const code16 =
    30 + ((Math.round(b) << 2) | (Math.round(g) << 1) | Math.round(r));

  return value === 2 ? code16 + 60 : code16;
}

/**
 * Converts RGB values to a 16-color ANSI code (0-15).
 *
 * @param {number} r - The red component (0-255)
 * @param {number} g - The green component (0-255)
 * @param {number} b - The blue component (0-255)
 * @returns {number} A number between 0-15 representing the closest ANSI 16 color
 *
 * @example
 * ```ts
 * import { rgbToAnsi16 } from "farver/utils";
 *
 * rgbToAnsi16(255, 0, 0); // Returns 1 (red)
 * rgbToAnsi16(0, 255, 0); // Returns 2 (green)
 * rgbToAnsi16(0, 0, 255); // Returns 4 (blue)
 * ```
 */
export function rgbToAnsi16(r: number, g: number, b: number): number {
  return ansi256To16(rgbToAnsi256(r, g, b));
}

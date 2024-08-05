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

  return [num >> 16 & 255, num >> 8 & 255, num & 255];
}

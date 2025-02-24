import { hexToRgb, rgbToAnsi256 } from "./utils";

type GradientFunction = (text: string) => string;

export function gradient(colors: string[]): GradientFunction {
  const rgbColors = colors.map(hexToRgb);
  return (text: string) => {
    const length = text.length;
    return text
      .split("")
      .map((char, index) => {
        const colorIndex = Math.floor((index / length) * (rgbColors.length - 1));
        const [r, g, b] = rgbColors[colorIndex];
        const ansiCode = rgbToAnsi256(r, g, b);
        return `\x1B[38;5;${ansiCode}m${char}\x1B[39m`;
      })
      .join("");
  };
}

export const mijd = gradient(["#FF0000", "#00FF00", "#0000FF"]);
export const vice = gradient(["#FF00FF", "#00FFFF", "#FFFF00"]);
export const fruit = gradient(["#FF6347", "#FFD700", "#ADFF2F"]);
export const retro = gradient(["#FF4500", "#32CD32", "#1E90FF"]);
export const summer = gradient(["#FFD700", "#FF8C00", "#FF4500"]);
export const rainbow = gradient(["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#8B00FF"]);
export const pastel = gradient(["#FFB6C1", "#FFDAB9", "#E6E6FA"]);

export default {
  gradient,
  mijd,
  vice,
  fruit,
  retro,
  summer,
  rainbow,
  pastel,
};

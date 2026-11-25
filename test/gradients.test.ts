import { describe, expect, it } from "vitest";

import { createColors, strip } from "../src";
import { gradient } from "../src/gradients";

const CLOSE = "\u001B[39m";
const truecolor = (red: number, green: number, blue: number): string =>
  `\u001B[38;2;${red};${green};${blue}m`;

describe("gradient", () => {
  it("spreads the colors evenly over the characters", () => {
    const blackToWhite = gradient(["#000000", "#ffffff"], { level: 3 });
    expect(blackToWhite("abc")).toBe(
      `${truecolor(0, 0, 0)}a${truecolor(128, 128, 128)}b${truecolor(255, 255, 255)}c${CLOSE}`,
    );
  });

  it("goes through every color in order", () => {
    const style = gradient(["#ff0000", "#00ff00", "#0000ff"], { level: 3 });
    expect(style("abc")).toBe(
      `${truecolor(255, 0, 0)}a${truecolor(0, 255, 0)}b${truecolor(0, 0, 255)}c${CLOSE}`,
    );
  });

  it("doesn't advance the gradient for spaces", () => {
    const style = gradient(["#000000", "#ffffff"], { level: 3 });
    expect(style("a  b")).toBe(`${truecolor(0, 0, 0)}a  ${truecolor(255, 255, 255)}b${CLOSE}`);
  });

  it("closes the color before a line break and continues the gradient on the next line", () => {
    const style = gradient(["#ff0000", "#0000ff"], { level: 3 });
    expect(style("ab\ncd")).toBe(
      `${truecolor(255, 0, 0)}a${truecolor(170, 0, 85)}b${CLOSE}\n${truecolor(85, 0, 170)}c${truecolor(0, 0, 255)}d${CLOSE}`,
    );
  });

  it("uses the first color for a single character, and one color for a single stop", () => {
    expect(gradient(["#ff0000", "#0000ff"], { level: 3 })("a")).toBe(
      `${truecolor(255, 0, 0)}a${CLOSE}`,
    );
    expect(gradient(["#ff8800"], { level: 3 })("ab")).toBe(`${truecolor(255, 136, 0)}ab${CLOSE}`);
  });

  it("accepts three-digit hex colors and colors without #", () => {
    expect(gradient(["f80"], { level: 3 })("a")).toBe(`${truecolor(255, 136, 0)}a${CLOSE}`);
  });

  it("steps colors down at 16 colors and shares a code between characters with the same color", () => {
    expect(gradient(["#ff0000", "#0000ff"], { level: 1 })("abcdef")).toBe(
      `\u001B[91ma\u001B[31mbc\u001B[34mde\u001B[94mf${CLOSE}`,
    );
  });

  it("steps colors down at 256 colors", () => {
    expect(gradient(["#ff0000"], { level: 2 })("a")).toBe(`\u001B[38;5;196ma${CLOSE}`);
  });

  it("gives plain text when colors are disabled", () => {
    expect(gradient(["#ff0000", "#0000ff"], { level: 0 })("plain")).toBe("plain");
  });

  it("gives an empty string for empty input", () => {
    const style = gradient(["#ff0000", "#0000ff"], { level: 3 });
    expect(style()).toBe("");
    expect(style(null)).toBe("");
    expect(style("")).toBe("");
  });

  it("keeps escape codes that are already in the text, and closes the color at the end", () => {
    const style = gradient(["#ff0000", "#0000ff"], { level: 3 });
    const bold = createColors(3).bold;
    expect(style(bold("ab"))).toBe(
      `\u001B[1m${truecolor(255, 0, 0)}a${truecolor(0, 0, 255)}b\u001B[22m${CLOSE}`,
    );
    expect(strip(style(bold("ab")))).toBe("ab");
  });

  it("sets the color again after an escape code inside the text", () => {
    const style = gradient(["#ff8800"], { level: 3 });
    const red = createColors(3).red;
    // The red close code turns the gradient color off, so the next character needs it again.
    expect(style(`a${red("b")}c`)).toBe(
      `${truecolor(255, 136, 0)}a\u001B[31m${truecolor(255, 136, 0)}b${CLOSE}${truecolor(255, 136, 0)}c${CLOSE}`,
    );
  });

  it.each([[[]], [["#zzz"]], [["#ff00"]], [["red"]]])("rejects invalid colors: %j", (colors) => {
    expect(() => gradient(colors)).toThrow(TypeError);
  });
});

describe("gradient presets", () => {
  it.each(["rainbow", "pastel", "summer", "retro", "fruit", "vice", "mind"] as const)(
    "%s colors text and keeps it readable",
    (name) => {
      const output = gradient[name]("Hello, World!");
      // The tests set FORCE_COLOR=3, so the presets use truecolor.
      expect(output).toContain("\u001B[38;2;");
      expect(strip(output)).toBe("Hello, World!");
    },
  );
});

import { describe, expect, it } from "bun:test";
import { escapeAnsi } from "../test/shared.ts";

describe("Bun Integration Tests", () => {
  it("should import main module correctly", async () => {
    const farver = await import("../src/index.ts");

    expect(typeof farver.red).toBe("function");
    expect(typeof farver.createColors).toBe("function");
    expect(typeof farver.default).toBe("object");

    const redText = farver.red("test");
    const escapedRedText = escapeAnsi(redText);

    expect(escapedRedText).toBe("\\x1B[31mtest\\x1B[39m");
  });

  it("should import utils module correctly", async () => {
    const utils = await import("../src/utils.ts");

    expect(typeof utils.hexToRgb).toBe("function");
    expect(typeof utils.rgbToAnsi256).toBe("function");
    expect(typeof utils.ansi256To16).toBe("function");
    expect(typeof utils.rgbToAnsi16).toBe("function");

    expect(utils.hexToRgb("#FF0000")).toEqual([255, 0, 0]);
    expect(utils.rgbToAnsi256(255, 0, 0)).toBe(196);
    expect(utils.ansi256To16(196)).toBe(91);
  });

  it("should import supports module correctly", async () => {
    const supports = await import("termenv/supports");

    expect(typeof supports.getColorSpace).toBe("function");
    expect(typeof supports.isColorsSupported).toBe("function");
    expect(supports.SPACE_16_COLORS).toBeDefined();
    expect(supports.SPACE_256_COLORS).toBeDefined();
    expect(supports.SPACE_TRUE_COLORS).toBeDefined();
  });

  it("should work with Bun's global namespace", () => {
    expect(typeof Bun).toBe("object");
    expect(typeof Bun.version).toBe("string");
    expect(typeof Bun.env).toBe("object");
  });

  it("should handle Bun environment variables", async () => {
    const farver = await import("../src/index.ts");

    const colored = farver.green("bun test");
    const coloredEscaped = escapeAnsi(colored);

    expect(typeof colored).toBe("string");
    expect(colored.length).toBeGreaterThan("bun test".length);
    expect(coloredEscaped).toBe("\\x1B[32mbun test\\x1B[39m");
  });

  it("should work with Bun's module resolution", async () => {
    const farver = await import("../src/index.ts");
    const utils = await import("../src/utils.ts");
    const supports = await import("termenv/supports");

    expect(farver).toBeDefined();
    expect(utils).toBeDefined();
    expect(supports).toBeDefined();
  });

  it("should produce correct ANSI output in Bun", async () => {
    const farver = await import("../src/index.ts");

    const output = farver.red.bgWhite("bun");
    const escapedOutput = escapeAnsi(output);

    expect(escapedOutput).toBe("\\x1B[31m\\x1B[47mbun\\x1B[49m\\x1B[39m");
  });

  it("should handle nested colors in Bun", async () => {
    const farver = await import("../src/index.ts");

    const nested = farver.green(`outer ${farver.red("inner")} outer`);
    const escapedNested = escapeAnsi(nested);

    expect(escapedNested).toBe("\\x1B[32mouter \\x1B[31minner\\x1B[32m outer\\x1B[39m");
  });

  it("should support bg and fg color methods", async () => {
    const farver = await import("../src/index.ts");

    const fgText = farver.fg(196)("red text");
    const escapedFg = escapeAnsi(fgText);
    expect(escapedFg).toBe("\\x1B[38;5;196mred text\\x1B[39m");

    const bgText = farver.bg(46)("green background");
    const escapedBg = escapeAnsi(bgText);
    expect(escapedBg).toBe("\\x1B[48;5;46mgreen background\\x1B[49m");

    const combinedText = farver.fg(226).bg(21)("yellow on blue");
    const escapedCombined = escapeAnsi(combinedText);
    expect(escapedCombined).toBe("\\x1B[38;5;226m\\x1B[48;5;21myellow on blue\\x1B[49m\\x1B[39m");
  });
});

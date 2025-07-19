/// <reference lib="deno.ns" />
/// <reference lib="dom" />

import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { escapeAnsi } from "../test/shared.ts";

describe("Deno Integration Tests", () => {
  it("should import main module correctly", async () => {
    const farver = await import("../src/index.ts");

    expect(typeof farver.red).toBe("function");
    expect(typeof farver.createColors).toBe("function");
    expect(typeof farver.default).toBe("object");

    const redText = farver.red("test");
    expect(redText).toContain("\x1B[31m");
    expect(redText).toContain("\x1B[39m");
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

  it("should work with Deno's global namespace", () => {
    expect(typeof Deno).toBe("object");
    expect(typeof Deno.env).toBe("object");
    expect(typeof Deno.version).toBe("object");
    expect(typeof Deno.version.deno).toBe("string");
  });

  it("should handle Deno environment variables", async () => {
    const farver = await import("../src/index.ts");

    const colored = farver.green("deno test");
    expect(typeof colored).toBe("string");
    expect(colored.length).toBeGreaterThan("deno test".length);
    expect(colored).toContain("\x1B[32m");
  });

  it("should work with Deno's module resolution", async () => {
    const farver = await import("../src/index.ts");
    const utils = await import("../src/utils.ts");
    const supports = await import("termenv/supports");

    expect(farver).toBeDefined();
    expect(utils).toBeDefined();
    expect(supports).toBeDefined();
  });

  it("should produce correct ANSI output in Deno", async () => {
    const farver = await import("../src/index.ts");

    const output = farver.red.bgWhite("deno");
    const escapedOutput = escapeAnsi(output);

    expect(escapedOutput).toContain("\\x1B[31m");
    expect(escapedOutput).toContain("\\x1B[47m");
    expect(escapedOutput).toContain("deno");
    expect(escapedOutput).toContain("\\x1B[49m");
    expect(escapedOutput).toContain("\\x1B[39m");
  });

  it("should handle nested colors in Deno", async () => {
    const farver = await import("../src/index.ts");

    const nested = farver.green(`outer ${farver.red("inner")} outer`);
    const escapedNested = escapeAnsi(nested);

    expect(escapedNested).toContain("\\x1B[32m");
    expect(escapedNested).toContain("\\x1B[31m");
    expect(escapedNested).toContain("inner");
    expect(escapedNested).toContain("outer");
  });
});

it({
  name: "should work without environment permissions",
  permissions: {
    env: false,
  },
  fn: async () => {
    const utils = await import("../src/utils.ts");

    expect(typeof utils.hexToRgb).toBe("function");
    expect(utils.hexToRgb("#FF0000")).toEqual([255, 0, 0]);
    expect(utils.rgbToAnsi256(255, 0, 0)).toBe(196);
    expect(utils.ansi256To16(196)).toBe(91);

    const farver = await import("../src/index.ts");
    const supports = await import("termenv/supports");

    expect(farver).toBeDefined();
    expect(supports).toBeDefined();
    expect(typeof farver.red).toBe("function");
    expect(typeof farver.createColors).toBe("function");

    const redText = farver.red("test");
    const greenText = farver.green("hello");
    const complexText = farver.red.bgYellow.bold("complex");

    expect(escapeAnsi(redText)).toBe("\\x1B[31mtest\\x1B[39m");
    expect(escapeAnsi(greenText)).toBe("\\x1B[32mhello\\x1B[39m");
    expect(escapeAnsi(complexText)).toBe("\\x1B[31m\\x1B[43m\\x1B[1mcomplex\\x1B[22m\\x1B[49m\\x1B[39m");
  },
});

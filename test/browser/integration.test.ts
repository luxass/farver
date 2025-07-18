/// <reference types="@vitest/browser/providers/playwright" />

import { describe, expect, it } from "vitest";
import { escape } from "../shared";

describe("browser integration tests", () => {
  it("should work in browser environment", () => {
    expect(typeof window).toBe("object");
    expect(typeof document).toBe("object");
  });

  it("should always support true colors", async () => {
    const supports = await import("../../src/supports.ts");
    const env = await import("termenv").then((m) => m.getTerminalEnvironment());
    expect(supports).toBeDefined();
    // eslint-disable-next-line no-console
    console.log("Environment:", {
      platform: env.platform,
      runtime: env.runtime,
      colorterm: env.env.COLORTERM,
      term: env.env.TERM,
    });
    const colorSpaceByRuntime = supports.getColorSpaceByRuntime(env);
    const colorSpace = supports.getColorSpace();
    // eslint-disable-next-line no-console
    console.log("Color space by runtime:", colorSpaceByRuntime);
    // eslint-disable-next-line no-console
    console.log("Color space detected:", colorSpace);

    expect(colorSpaceByRuntime).toBe(supports.SPACE_TRUE_COLORS);
    expect(colorSpace).toBe(supports.SPACE_TRUE_COLORS);
  });

  it("should generate ANSI codes for console output", async () => {
    const farver = await import("../../src/index.ts");
    const redText = farver.red("error");
    const greenText = farver.green("success");
    const blueText = farver.blue("info");

    expect(escape(redText)).toBe("\\x1B[31merror\\x1B[39m");
    expect(escape(greenText)).toBe("\\x1B[32msuccess\\x1B[39m");
    expect(escape(blueText)).toBe("\\x1B[34minfo\\x1B[39m");
  });

  it("should handle DOM element text content", async () => {
    const farver = await import("../../src/index.ts");

    const element = document.createElement("div");
    element.textContent = farver.red("Browser test");

    expect(element.textContent).toContain("Browser test");
    expect(element.textContent?.length).toBeGreaterThan("Browser test".length);

    document.body.appendChild(element);

    expect.toContainElement(element);
  });

  it("should work with different color spaces in browser", async () => {
    const farver = await import("../../src/index.ts");
    const supports = await import("../../src/supports.ts");
    const colors16 = farver.createColors(supports.SPACE_16_COLORS);
    const colors256 = farver.createColors(supports.SPACE_256_COLORS);

    expect(escape(colors16.red("test"))).toBe("\\x1B[31mtest\\x1B[39m");
    expect(escape(colors256.fg(196)("test"))).toBe("\\x1B[38;5;196mtest\\x1B[39m");
  });

  it("should handle browser console compatibility", async () => {
    const farver = await import("../../src/index.ts");
    const logMessage = farver.green("✓ Test passed");
    const errorMessage = farver.red("✗ Test failed");

    expect(typeof console.error).toBe("function");
    expect(() => console.error(logMessage)).not.toThrow();
    expect(() => console.error(errorMessage)).not.toThrow();
  });

  it("should work with module imports in browser", async () => {
    const utils = await import("../../src/utils");

    expect(typeof utils.hexToRgb).toBe("function");
    expect(utils.hexToRgb("#FF0000")).toEqual([255, 0, 0]);
  });
});

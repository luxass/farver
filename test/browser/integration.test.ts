/// <reference types="@vitest/browser/providers/playwright" />
import { page } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import {
  blue,
  createColors,
  green,
  red,
} from "../../src";
import { SPACE_16_COLORS, SPACE_256_COLORS } from "../../src/supports";
import { escape } from "../shared";

describe("browser integration tests", () => {
  it("should work in browser environment", () => {
    expect(typeof window).toBe("object");
    expect(typeof document).toBe("object");
  });

  it("should generate ANSI codes for console output", () => {
    const redText = red("error");
    const greenText = green("success");
    const blueText = blue("info");

    expect(escape(redText)).toBe("\\x1B[31merror\\x1B[39m");
    expect(escape(greenText)).toBe("\\x1B[32msuccess\\x1B[39m");
    expect(escape(blueText)).toBe("\\x1B[34minfo\\x1B[39m");
  });

  it("should handle DOM element text content", () => {
    const element = document.createElement("div");
    element.textContent = red("Browser test");

    expect(element.textContent).toContain("Browser test");
    expect(element.textContent?.length).toBeGreaterThan("Browser test".length);

    document.body.appendChild(element);

    expect.toContainElement(element);
  });

  it("should work with different color spaces in browser", () => {
    const colors16 = createColors(SPACE_16_COLORS);
    const colors256 = createColors(SPACE_256_COLORS);

    expect(escape(colors16.red("test"))).toBe("\\x1B[31mtest\\x1B[39m");
    expect(escape(colors256.fg(196)("test"))).toBe("\\x1B[38;5;196mtest\\x1B[39m");
  });

  it("should handle browser console compatibility", () => {
    const logMessage = green("✓ Test passed");
    const errorMessage = red("✗ Test failed");

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

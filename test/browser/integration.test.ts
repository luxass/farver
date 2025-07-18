import { describe, expect, it } from "vitest";
import {
  blue,
  createColors,
  green,
  red,
} from "../../src";
import { SPACE_16_COLORS, SPACE_256_COLORS } from "../../src/supports";

describe("browser integration tests", () => {
  it("should work in browser environment", () => {
    expect(typeof window).toBe("object");
    expect(typeof document).toBe("object");
  });

  it("should generate ANSI codes for console output", () => {
    const redText = red("error");
    const greenText = green("success");
    const blueText = blue("info");

    expect(redText).toContain("\x1B[31m");
    expect(greenText).toContain("\x1B[32m");
    expect(blueText).toContain("\x1B[34m");
  });

  it("should handle DOM element text content", () => {
    const element = document.createElement("div");
    
    // Test that colored text can be used in DOM (though ANSI won't render)
    element.textContent = red("Browser test");
    
    expect(element.textContent).toContain("Browser test");
    expect(element.textContent?.length).toBeGreaterThan("Browser test".length);
  });

  it("should work with different color spaces in browser", () => {
    // Test color space detection in browser environment
    const colors16 = createColors(SPACE_16_COLORS);
    const colors256 = createColors(SPACE_256_COLORS);
    
    expect(colors16.red("test")).toContain("\x1B[31m");
    expect(colors256.fg(196)("test")).toContain("\x1B[38;5;196m");
  });

  it("should handle browser console compatibility", () => {
    // Test that colors work with browser console methods
    const logMessage = green("✓ Test passed");
    const errorMessage = red("✗ Test failed");
    
    expect(typeof console.error).toBe("function");
    expect(() => console.error(logMessage)).not.toThrow();
    expect(() => console.error(errorMessage)).not.toThrow();
  });

  it("should work with module imports in browser", async () => {
    // Test dynamic imports work in browser
    const utils = await import("../../src/utils");
    
    expect(typeof utils.hexToRgb).toBe("function");
    expect(utils.hexToRgb("#FF0000")).toEqual([255, 0, 0]);
  });

  it("should handle browser-specific features", () => {
    // Test that the library doesn't break in browser-specific contexts
    const coloredUrl = blue("https://example.com");
    
    expect(coloredUrl).toContain("https://example.com");
    expect(coloredUrl).toContain("\x1B[34m");
    
    // Test with location if available
    if (typeof location !== "undefined") {
      expect(typeof location.href).toBe("string");
    }
  });
});
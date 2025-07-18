import { describe, expect, it } from "bun:test";

describe("Bun Integration Tests", () => {
  it("should import main module correctly", async () => {
    const farver = await import("../src/index.ts");
    
    expect(typeof farver.red).toBe("function");
    expect(typeof farver.createColors).toBe("function");
    expect(farver.red("test")).toContain("\x1B[31m");
  });

  it("should import fast module correctly", async () => {
    const fastFarver = await import("../src/fast.ts");
    
    expect(typeof fastFarver.red).toBe("function");
    expect(typeof fastFarver.createColors).toBe("function");
    expect(fastFarver.red("test")).toContain("\x1B[31m");
  });

  it("should import utils module correctly", async () => {
    const utils = await import("../src/utils.ts");
    
    expect(typeof utils.hexToRgb).toBe("function");
    expect(typeof utils.rgbToAnsi256).toBe("function");
    expect(utils.hexToRgb("#FF0000")).toEqual([255, 0, 0]);
  });

  it("should import supports module correctly", async () => {
    const supports = await import("../src/supports.ts");
    
    expect(typeof supports.supportsColor).toBe("function");
    expect(typeof supports.getColorSupport).toBe("function");
  });

  it("should work with Bun's global namespace", () => {
    expect(typeof Bun).toBe("object");
    expect(typeof Bun.version).toBe("string");
  });

  it("should handle Bun-specific features", async () => {
    const farver = await import("../src/index.ts");
    
    // Test that colors work with Bun's fast startup
    const colored = farver.cyan("bun test");
    expect(typeof colored).toBe("string");
    expect(colored.length).toBeGreaterThan("bun test".length);
  });

  it("should work with Bun's module resolution", () => {
    // Test that Bun can resolve the modules correctly
    expect(() => require("../src/index.ts")).not.toThrow();
  });
});
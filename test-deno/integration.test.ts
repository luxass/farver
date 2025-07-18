import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";

describe("Deno Integration Tests", () => {
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
    
    expect(typeof supports.getColorSpace).toBe("function");
    expect(typeof supports.isColorsSupported).toBe("function");
  });

  it("should work with Deno's global namespace", () => {
    // @ts-expect-error - Deno global is available in Deno runtime
    expect(typeof Deno).toBe("object");
    // @ts-expect-error - Deno.env is available in Deno runtime
    expect(typeof Deno.env).toBe("object");
  });

  it("should handle Deno environment variables", async () => {
    const farver = await import("../src/index.ts");
    
    // Test that colors work regardless of Deno environment
    const colored = farver.green("deno test");
    expect(typeof colored).toBe("string");
    expect(colored.length).toBeGreaterThan("deno test".length);
  });
});
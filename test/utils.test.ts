import { describe, expect, it } from "vitest";
import {
  ansi256To16,
  hexToRgb,
  rgbToAnsi16,
  rgbToAnsi256,
} from "../src/utils";

describe("convert HEX to RGB", () => {
  it("should convert 3-digit HEX to RGB", () => {
    expect(hexToRgb("#F00")).toEqual([255, 0, 0]);
    expect(hexToRgb("#0F0")).toEqual([0, 255, 0]);
    expect(hexToRgb("#00F")).toEqual([0, 0, 255]);
    expect(hexToRgb("#FFF")).toEqual([255, 255, 255]);
  });

  it("should convert 6-digit HEX to RGB", () => {
    expect(hexToRgb("#FF0000")).toEqual([255, 0, 0]);
    expect(hexToRgb("#00FF00")).toEqual([0, 255, 0]);
    expect(hexToRgb("#0000FF")).toEqual([0, 0, 255]);
    expect(hexToRgb("#FFFFFF")).toEqual([255, 255, 255]);
  });

  it("should return [0, 0, 0] for invalid HEX codes", () => {
    expect(hexToRgb("")).toEqual([0, 0, 0]);
    expect(hexToRgb("#")).toEqual([0, 0, 0]);
    expect(hexToRgb("#FF")).toEqual([0, 0, 0]);
    expect(hexToRgb("#FFF0")).toEqual([0, 0, 0]);
    expect(hexToRgb("#FFFFF")).toEqual([0, 0, 0]);
    expect(hexToRgb("#FFFFFZ")).toEqual([0, 0, 0]);
    expect(hexToRgb("#FFFFFZ0")).toEqual([0, 0, 0]);
  });
});

describe("convert RGB to ANSI 256", () => {
  describe("grayscale", () => {
    it.each([
      [0, 0, 0, 16],
      [255, 255, 255, 231],
      [127, 127, 127, 244],
      [5, 5, 5, 16],
      [250, 250, 250, 231],
    ])("should convert grayscale RGB to ANSI 256", (r, g, b, expected) => {
      expect(rgbToAnsi256(r, g, b)).toBe(expected);
    });
  });

  describe("rgb colors", () => {
    it.each([
      [255, 0, 0, 196],
      [0, 255, 0, 46],
      [0, 0, 255, 21],
      [255, 255, 0, 226],
      [255, 0, 255, 201],
      [0, 255, 255, 51],
    ])("should convert RGB to ANSI 256", (r, g, b, expected) => {
      expect(rgbToAnsi256(r, g, b)).toBe(expected);
    });
  });
});

describe("convert ANSI 256 to ANSI 16", () => {
  it.each([
    ["black", 0, 30], // black
    ["white", 7, 37], // white
    ["bright white", 15, 97], // bright white
    ["gray", 233, 30], // gray
    ["red", 196, 91], // red
    ["green", 124, 31], // green
    ["blue", 20, 34], // blue
    ["bright yellow", 27, 94], // bright yellow
    ["bright magenta", 34, 32], // bright magenta
    ["bright cyan", 82, 92], // bright cyan
  ])("should convert ANSI 256 to ANSI 16 (%s)", (_name, code, expected) => {
    const received = ansi256To16(code);
    expect(received).toBe(expected);
  });
});

describe("convert RGB to ANSI 16", () => {
  it.each([
    ["red bright", "#ff6e67", 91], // red bright
    ["green bright", "#5fff5f", 92], // green bright
    ["yellow bright", "#ffff5f", 93], // yellow bright
    ["blue bright", "#6871ff", 94], // blue bright
    ["magenta bright", "#ff5fff", 95], // magenta bright
    ["cyan bright", "#5fffff", 96], // cyan bright
    ["white bright", "#ffffff", 97], // white bright
    ["black", "#000000", 30], // black
    ["red", "#cd0000", 31], // red
    ["green", "#00cd00", 32], // green
    ["yellow", "#cdcd00", 33], // yellow
    ["blue", "#0000cd", 34], // blue
    ["magenta", "#cd00cd", 35], // magenta
    ["cyan", "#00cdcd", 36], // cyan
    ["white", "#cdcdcd", 37], // white
  ])("should convert RGB to ANSI 16 (%s)", (_name, hex, expected) => {
    const received = rgbToAnsi16(...hexToRgb(hex));
    expect(received).toBe(expected);
  });
});

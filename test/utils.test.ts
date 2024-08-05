import { describe, expect, it } from "vitest";
import {
  hexToRgb,
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

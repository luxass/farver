import { describe, it, expect } from "vitest";
import { gradient, mijd, vice, fruit, retro, summer, rainbow, pastel } from "../src/gradients";

describe("gradient function", () => {
  it("should apply gradient to text", () => {
    const grad = gradient(["#FF0000", "#00FF00", "#0000FF"]);
    const result = grad("Hello, World!");
    expect(result).toMatch(/\x1B\[38;5;\d+mH\x1B\[39m\x1B\[38;5;\d+me\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+m,\x1B\[39m\x1B\[38;5;\d+m \x1B\[39m\x1B\[38;5;\d+mW\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+mr\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+md\x1B\[39m\x1B\[38;5;\d+m!\x1B\[39m/);
  });
});

describe("builtin gradients", () => {
  it("should apply mijd gradient", () => {
    const result = mijd("Hello, World!");
    expect(result).toMatch(/\x1B\[38;5;\d+mH\x1B\[39m\x1B\[38;5;\d+me\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+m,\x1B\[39m\x1B\[38;5;\d+m \x1B\[39m\x1B\[38;5;\d+mW\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+mr\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+md\x1B\[39m\x1B\[38;5;\d+m!\x1B\[39m/);
  });

  it("should apply vice gradient", () => {
    const result = vice("Hello, World!");
    expect(result).toMatch(/\x1B\[38;5;\d+mH\x1B\[39m\x1B\[38;5;\d+me\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+m,\x1B\[39m\x1B\[38;5;\d+m \x1B\[39m\x1B\[38;5;\d+mW\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+mr\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+md\x1B\[39m\x1B\[38;5;\d+m!\x1B\[39m/);
  });

  it("should apply fruit gradient", () => {
    const result = fruit("Hello, World!");
    expect(result).toMatch(/\x1B\[38;5;\d+mH\x1B\[39m\x1B\[38;5;\d+me\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+m,\x1B\[39m\x1B\[38;5;\d+m \x1B\[39m\x1B\[38;5;\d+mW\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+mr\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+md\x1B\[39m\x1B\[38;5;\d+m!\x1B\[39m/);
  });

  it("should apply retro gradient", () => {
    const result = retro("Hello, World!");
    expect(result).toMatch(/\x1B\[38;5;\d+mH\x1B\[39m\x1B\[38;5;\d+me\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+m,\x1B\[39m\x1B\[38;5;\d+m \x1B\[39m\x1B\[38;5;\d+mW\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+mr\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+md\x1B\[39m\x1B\[38;5;\d+m!\x1B\[39m/);
  });

  it("should apply summer gradient", () => {
    const result = summer("Hello, World!");
    expect(result).toMatch(/\x1B\[38;5;\d+mH\x1B\[39m\x1B\[38;5;\d+me\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+m,\x1B\[39m\x1B\[38;5;\d+m \x1B\[39m\x1B\[38;5;\d+mW\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+mr\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+md\x1B\[39m\x1B\[38;5;\d+m!\x1B\[39m/);
  });

  it("should apply rainbow gradient", () => {
    const result = rainbow("Hello, World!");
    expect(result).toMatch(/\x1B\[38;5;\d+mH\x1B\[39m\x1B\[38;5;\d+me\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+m,\x1B\[39m\x1B\[38;5;\d+m \x1B\[39m\x1B\[38;5;\d+mW\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+mr\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+md\x1B\[39m\x1B\[38;5;\d+m!\x1B\[39m/);
  });

  it("should apply pastel gradient", () => {
    const result = pastel("Hello, World!");
    expect(result).toMatch(/\x1B\[38;5;\d+mH\x1B\[39m\x1B\[38;5;\d+me\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+m,\x1B\[39m\x1B\[38;5;\d+m \x1B\[39m\x1B\[38;5;\d+mW\x1B\[39m\x1B\[38;5;\d+mo\x1B\[39m\x1B\[38;5;\d+mr\x1B\[39m\x1B\[38;5;\d+ml\x1B\[39m\x1B\[38;5;\d+md\x1B\[39m\x1B\[38;5;\d+m!\x1B\[39m/);
  });
});

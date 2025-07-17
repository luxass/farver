import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { ansi256To16, hexToRgb, rgbToAnsi16, rgbToAnsi256 } from "../src/utils";

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
    it("should convert RGB (0, 0, 0) to ANSI 256", () => {
      expect(rgbToAnsi256(0, 0, 0)).toBe(16);
    });

    it("should convert RGB (255, 255, 255) to ANSI 256", () => {
      expect(rgbToAnsi256(255, 255, 255)).toBe(231);
    });

    it("should convert RGB (127, 127, 127) to ANSI 256", () => {
      expect(rgbToAnsi256(127, 127, 127)).toBe(244);
    });

    it("should convert RGB (5, 5, 5) to ANSI 256", () => {
      expect(rgbToAnsi256(5, 5, 5)).toBe(16);
    });

    it("should convert RGB (250, 250, 250) to ANSI 256", () => {
      expect(rgbToAnsi256(250, 250, 250)).toBe(231);
    });

    it("should convert RGB (128, 128, 128) to ANSI 256", () => {
      expect(rgbToAnsi256(128, 128, 128)).toBe(244);
    });
  });

  describe("rgb colors", () => {
    it("should convert RGB (255, 0, 0) to ANSI 256", () => {
      expect(rgbToAnsi256(255, 0, 0)).toBe(196);
    });

    it("should convert RGB (0, 255, 0) to ANSI 256", () => {
      expect(rgbToAnsi256(0, 255, 0)).toBe(46);
    });

    it("should convert RGB (0, 0, 255) to ANSI 256", () => {
      expect(rgbToAnsi256(0, 0, 255)).toBe(21);
    });

    it("should convert RGB (255, 255, 0) to ANSI 256", () => {
      expect(rgbToAnsi256(255, 255, 0)).toBe(226);
    });

    it("should convert RGB (255, 0, 255) to ANSI 256", () => {
      expect(rgbToAnsi256(255, 0, 255)).toBe(201);
    });

    it("should convert RGB (0, 255, 255) to ANSI 256", () => {
      expect(rgbToAnsi256(0, 255, 255)).toBe(51);
    });
  });
});

describe("convert ANSI 256 to ANSI 16", () => {
  it("should convert ANSI 256 black (0) to ANSI 16", () => {
    const received = ansi256To16(0);
    expect(received).toBe(30);
  });

  it("should convert ANSI 256 white (7) to ANSI 16", () => {
    const received = ansi256To16(7);
    expect(received).toBe(37);
  });

  it("should convert ANSI 256 bright white (15) to ANSI 16", () => {
    const received = ansi256To16(15);
    expect(received).toBe(97);
  });

  it("should convert ANSI 256 gray (233) to ANSI 16", () => {
    const received = ansi256To16(233);
    expect(received).toBe(30);
  });

  it("should convert ANSI 256 red (196) to ANSI 16", () => {
    const received = ansi256To16(196);
    expect(received).toBe(91);
  });

  it("should convert ANSI 256 green (124) to ANSI 16", () => {
    const received = ansi256To16(124);
    expect(received).toBe(31);
  });

  it("should convert ANSI 256 blue (20) to ANSI 16", () => {
    const received = ansi256To16(20);
    expect(received).toBe(34);
  });

  it("should convert ANSI 256 bright yellow (27) to ANSI 16", () => {
    const received = ansi256To16(27);
    expect(received).toBe(94);
  });

  it("should convert ANSI 256 bright magenta (34) to ANSI 16", () => {
    const received = ansi256To16(34);
    expect(received).toBe(32);
  });

  it("should convert ANSI 256 bright cyan (82) to ANSI 16", () => {
    const received = ansi256To16(82);
    expect(received).toBe(92);
  });
});

describe("convert RGB to ANSI 16", () => {
  it("should convert RGB red bright (#ff6e67) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#ff6e67"));
    expect(received).toBe(91);
  });

  it("should convert RGB green bright (#5fff5f) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#5fff5f"));
    expect(received).toBe(92);
  });

  it("should convert RGB yellow bright (#ffff5f) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#ffff5f"));
    expect(received).toBe(93);
  });

  it("should convert RGB blue bright (#6871ff) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#6871ff"));
    expect(received).toBe(94);
  });

  it("should convert RGB magenta bright (#ff5fff) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#ff5fff"));
    expect(received).toBe(95);
  });

  it("should convert RGB cyan bright (#5fffff) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#5fffff"));
    expect(received).toBe(96);
  });

  it("should convert RGB white bright (#ffffff) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#ffffff"));
    expect(received).toBe(97);
  });

  it("should convert RGB black (#000000) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#000000"));
    expect(received).toBe(30);
  });

  it("should convert RGB red (#cd0000) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#cd0000"));
    expect(received).toBe(31);
  });

  it("should convert RGB green (#00cd00) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#00cd00"));
    expect(received).toBe(32);
  });

  it("should convert RGB yellow (#cdcd00) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#cdcd00"));
    expect(received).toBe(33);
  });

  it("should convert RGB blue (#0000cd) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#0000cd"));
    expect(received).toBe(34);
  });

  it("should convert RGB magenta (#cd00cd) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#cd00cd"));
    expect(received).toBe(35);
  });

  it("should convert RGB cyan (#00cdcd) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#00cdcd"));
    expect(received).toBe(36);
  });

  it("should convert RGB white (#cdcdcd) to ANSI 16", () => {
    const received = rgbToAnsi16(...hexToRgb("#cdcdcd"));
    expect(received).toBe(37);
  });
});

import { describe, expect, it } from "vitest";
import farver from "../src";
import fastFarver from "../src/fast";

import { escape } from "./shared";

describe("handle newlines correctly", () => {
  const newlineString = ` HELLO \n WORLD `;

  it("default module", () => {
    const output = escape(farver.red.bgWhite(newlineString));
    expect(output).toMatchInlineSnapshot(escape(`
      "\x1B[31m\x1B[47m HELLO \x1B[49m\x1B[39m
      \x1B[31m\x1B[47m WORLD \x1B[49m\x1B[39m"
    `));
  });

  it("fast module", () => {
    const output = escape(fastFarver.red(fastFarver.bgWhite(newlineString)));
    expect(output).toMatchInlineSnapshot(escape(`
      "\x1B[31m\x1B[47m HELLO \x1B[49m\x1B[39m
      \x1B[31m\x1B[47m WORLD \x1B[49m\x1B[39m"
    `));
  });
});

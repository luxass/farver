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

describe("handle styles", () => {
  it("default module", () => {
    const output = escape(` HELLO ${farver.red("WORLD")} `);
    expect(output).toMatchInlineSnapshot(escape(`
      " HELLO \x1B[31mWORLD\x1B[39m "
    `));
  });

  it("fast module", () => {
    const output = escape(` HELLO ${fastFarver.red("WORLD")} `);
    expect(output).toMatchInlineSnapshot(escape(`
      " HELLO \x1B[31mWORLD\x1B[39m "
    `));
  });
});

describe("handle nested styles", () => {
  it("default module", () => {
    const output = escape(farver.green(
      `green ${farver.red(
        `red ${farver.blue(
          `blue ${farver.cyan(
            `cyan ${farver.white.italic.underline(`white italic underline`)} cyan`,
          )} blue`,
        )} red`,
      )} green`,
    ));

    expect(output).toMatchInlineSnapshot(escape(`"\x1B[32mgreen \x1B[31mred \x1B[34mblue \x1B[36mcyan \x1B[37m\x1B[3m\x1B[4mwhite italic underline\x1B[24m\x1B[23m\x1B[36m cyan\x1B[34m blue\x1B[31m red\x1B[32m green\x1B[39m"`));
  });

  it("fast module", () => {
    const output = escape(fastFarver.green(
      `green ${fastFarver.red(
        `red ${fastFarver.blue(
          `blue ${fastFarver.cyan(
            `cyan ${fastFarver.white(fastFarver.italic(fastFarver.underline(`white italic underline`)))} cyan`,
          )} blue`,
        )} red`,
      )} green`,
    ));
    expect(output).toMatchInlineSnapshot(escape(`"\x1B[32mgreen \x1B[31mred \x1B[34mblue \x1B[36mcyan \x1B[37m\x1B[3m\x1B[4mwhite italic underline\x1B[24m\x1B[23m\x1B[36m cyan\x1B[34m blue\x1B[31m red\x1B[32m green\x1B[39m"`));
  });
});

import assert from "node:assert/strict";

import farver, { createColors } from "farver";
import { ansi256To16, hexToRgb, rgbToAnsi256 } from "farver/utils";

// CI copies this file into an isolated project that installs the packed npm package.
// Package imports must resolve from that project, not from this repository.
assert.equal(typeof farver.red, "function");

const colors = createColors(3);
assert.equal(colors.red("Hello"), "\u001B[31mHello\u001B[39m");
assert.equal(colors.green.bold("Hello"), "\u001B[32m\u001B[1mHello\u001B[22m\u001B[39m");
assert.deepEqual(hexToRgb("#FF0000"), [255, 0, 0]);
assert.equal(rgbToAnsi256(255, 0, 0), 196);
assert.equal(ansi256To16(196), 91);

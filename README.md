# 🎨 farver

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Colors and styles for terminal output. farver detects how many colors the terminal can show, steps truecolor down to 256 or 16 colors when it needs to, and prints plain text when colors are off.

- Styles that chain, nest, and work as template tags
- 16 colors, 256 colors, and truecolor with `rgb()` and `hex()`
- Gradients, terminal hyperlinks, and `strip()`
- Color detection that respects `NO_COLOR`, `FORCE_COLOR`, `--color`, and `--no-color`
- ESM with types, for Node.js 24.11 and later, Bun, and Chromium-based browser consoles

## 📦 Installation

```sh
npm install farver
```

## 📚 Usage

```ts
import { bold, green, red } from "farver";

console.log(red("Error: something went wrong"));
console.log(bold.green("Done"));
```

Every style is also on the default export:

```ts
import colors from "farver";

console.log(colors.yellow.underline("Warning"));
```

### Chaining, nesting, and template literals

Styles chain from left to right, nest inside each other, and work as template tags:

```ts
import { bgRed, bold, cyan, red, white } from "farver";

console.log(bgRed.white.bold(" ERROR ") + red(` File ${cyan("app.ts")} not found`));

const file = "app.ts";
console.log(red`Error: ${cyan(file)} not found`);
```

A nested style ends without ending the style around it, and text with line breaks keeps its style on every line.

### Styles and colors

| Kind          | Names                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------ |
| Styles        | `reset` `bold` `dim` `italic` `underline` `overline` `inverse` `hidden` `strikethrough`          |
| Colors        | `black` `red` `green` `yellow` `blue` `magenta` `cyan` `white` `gray`                            |
| Bright colors | `redBright` `greenBright` `yellowBright` `blueBright` `magentaBright` `cyanBright` `whiteBright` |
| Backgrounds   | `bgBlack` `bgRed` … `bgGray`, and `bgRedBright` … `bgWhiteBright`                                |

### 256 colors and truecolor

```ts
import { bg, bgHex, fg, hex, rgb } from "farver";

console.log(fg(208)("256-color orange"));
console.log(bg(24)(" 256-color background "));
console.log(rgb(255, 136, 0)("truecolor orange"));
console.log(hex("#8aadf4").bold("truecolor blue"));
console.log(bgHex("#363a4f").hex("#cad3f5")(" truecolor on a dark background "));
```

On a terminal with 256 colors, truecolor is stepped down to the closest of the 256 colors. On a terminal with 16 colors, both are stepped down to the closest of the 16 colors.

### Input

Numbers and booleans are converted to text, so `red(0)` prints a red `0`. `undefined`, `null`, and `''` give `''`, so nothing is printed. `reset()` without text gives the reset code.

## 🎛️ Color detection

farver detects the color level when it's imported, with [termenv](https://github.com/luxass/termenv):

| Level | Meaning                            |
| ----- | ---------------------------------- |
| `0`   | No colors. Styles give plain text. |
| `1`   | 16 colors                          |
| `2`   | 256 colors                         |
| `3`   | Truecolor (16 million colors)      |

Output that goes to a pipe or a file gets no colors, unless colors are forced. You can change the level for your program with environment variables and command-line flags:

| Setting                              | Effect                                    |
| ------------------------------------ | ----------------------------------------- |
| `NO_COLOR=1`                         | Turns colors off                          |
| `FORCE_COLOR=0`, `FORCE_COLOR=false` | Turns colors off                          |
| `FORCE_COLOR=1`, `2`, or `3`         | Uses that level, also for pipes and files |
| `FORCE_COLOR=true`                   | Turns colors on, also for pipes and files |
| `--color`, `--color=always`          | Turns colors on, also for pipes and files |
| `--no-color`, `--color=never`        | Turns colors off                          |

`NO_COLOR` and the flags that turn colors off take priority over the ones that turn them on.

To choose the level yourself, create your own set of styles:

```ts
import { createColors } from "farver";

const colors = createColors(1);

console.log(colors.level); // 1
console.log(colors.hex("#ff8800")("stepped down to 16 colors"));
```

## 🔗 Hyperlinks

`link()` creates a terminal hyperlink: the terminal shows the text, and opens the URL when it's clicked. The text can be styled.

```ts
import { blue, link } from "farver";

console.log(link("https://github.com/luxass/farver", blue.underline("farver on GitHub")));
```

When colors are off, `link()` gives the text with the URL in parentheses, so the URL isn't lost in logs: `farver on GitHub (https://github.com/luxass/farver)`. A URL with control characters throws a `TypeError`.

## 🧩 Raw codes and stripping

Every style has `open` and `close`, the escape codes it wraps text in. Both are `''` when colors are off.

```ts
import { red, strip } from "farver";

console.log(`${red.bold.open}error${red.bold.close} in app.ts`);

strip(red.bold("error")); // "error"
```

`strip()` removes styles, colors, and hyperlinks from text.

## 🌈 Gradients

Gradients live in `farver/gradients`, so code that doesn't use them doesn't load them.

```ts
import { gradient } from "farver/gradients";

console.log(gradient(["#8aadf4", "#c6a0f6", "#f5bde6"])("Hello, World!"));
console.log(gradient.rainbow("Hello, World!"));
```

Each visible character gets its own color, spread evenly over the colors you give. Spaces don't use up a color, and styles already in the text are kept. Gradients follow the detected color level, or the `level` option: `gradient(colors, { level: 1 })`.

The built-in gradients are `rainbow`, `pastel`, `summer`, `retro`, `fruit`, `vice`, and `mind`.

## 🛠️ Color conversion

`farver/utils` has the conversions that farver uses to step colors down:

```ts
import { ansi256To16, hexToRgb, rgbToAnsi16, rgbToAnsi256 } from "farver/utils";

hexToRgb("#ff8800"); // [255, 136, 0]
rgbToAnsi256(255, 136, 0); // 214
ansi256To16(214); // 93
rgbToAnsi16(255, 136, 0); // 93
```

## 📄 License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/farver?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/farver
[npm-downloads-src]: https://img.shields.io/npm/dm/farver?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/farver

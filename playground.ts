import {
  blue,
  cyan,
  green,
  inverse,
  italic,
  magenta,
  red,
  underline,
  white,
  yellow,
  yellowBright,
} from "./src";

console.log(`\n${inverse(" Newlines: ")} \n`);
console.log(red.bgWhite("FIRST LINE \nSECOND LINE\nTHIRD LINE "));

console.log(`\n${inverse(" Nested Syntax: ")} \n`);

console.log(
  magenta(
    `magenta ${underline(`underline ${italic(`italic magenta`)}`)} magenta`,
  ),
);
console.log(
  green(
    `green ${red(
      `red ${blue(
        `blue ${cyan(
          `cyan ${white.italic.underline(`white italic underline`)} cyan`,
        )} blue`,
      )} red`,
    )} green`,
  ),
);

console.log(`\n${inverse(" Deep Nested Syntax: ")} \n`);
console.log(
  yellow(
    `yellow ${magenta(
      `magenta ${cyan(
        `cyan ${blue(
          `blue ${red(
            `red ${green(
              `green ${underline(`underline ${yellowBright.italic(`bright yellow italic`)} underline`)} green`,
            )} red`,
          )} blue`,
        )} cyan`,
      )} magenta`,
    )} yellow`,
  ),
);

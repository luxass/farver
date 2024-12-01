import farver, {
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
import fastFarver from "./src/fast";

console.log(`\n${inverse(" RGB: ")} \n`);
console.log(farver.rgb(13, 42, 79)("blue"));
console.log(farver.rgb(13, 42, 79).bgRgb(199, 120, 125)("Hello"));

console.log(`\n${inverse(" HEX: ")} \n`);

const hexColors = [
  ["#d93611", "#d97511", "#d9d611", "#a0d911", "#18d911"],
  ["#11d9c2", "#119dd9", "#1157d9", "#6614f6", "#c511d9"],
];

hexColors.forEach((colors) => {
  console.log(colors.map((color) => farver.hex(color)(color)).join(" "));
  console.log(
    colors.map((color) => farver.bgHex(color).black(color)).join(" "),
  );
});

console.log(`\n${inverse(" ANSI 256: ")} \n`);
console.log(farver.fg(56)("56"));
console.log(farver.bg(181).fg(18)("181 with 18"));

console.log(`\n${inverse(" Newlines: ")} \n`);
console.log(red.bgWhite("FIRST LINE \nSECOND LINE\nTHIRD LINE "));
console.log(fastFarver.red(fastFarver.bgWhite("FIRST LINE \nSECOND LINE\nTHIRD LINE ")));

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

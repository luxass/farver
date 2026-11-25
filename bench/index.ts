/**
 * Measures how fast farver styles text. Run it with `pnpm bench`, which builds first.
 *
 * Each case runs for a fixed time after a warm-up, and the result is operations per second.
 * Numbers vary between machines and runs, so compare runs on the same machine.
 */

import { createColors } from "farver";

const colors = createColors(3);

const cases: Record<string, () => string> = {
  "red('text')": () => colors.red("text"),
  "red.bold('text')": () => colors.red.bold("text"),
  "red.bold.underline.bgWhite('text')": () => colors.red.bold.underline.bgWhite("text"),
  "nested red(`a ${green('b')} a`)": () => colors.red(`a ${colors.green("b")} a`),
  "multiline bgRed('a\\nb\\nc')": () => colors.bgRed("a\nb\nc"),
  "hex('#ff8800')('text')": () => colors.hex("#ff8800")("text"),
  "rgb(255, 136, 0).bold('text')": () => colors.rgb(255, 136, 0).bold("text"),
};

const WARM_UP_MS = 200;
const MEASURE_MS = 1000;

/**
 * Runs `run` repeatedly for `milliseconds` and returns how many times it ran.
 * Results are summed into `sink`, so the engine can't skip the work.
 */
function runFor(
  run: () => string,
  milliseconds: number,
): { count: number; elapsed: number; sink: number } {
  let count = 0;
  let sink = 0;
  const started = performance.now();
  let elapsed = 0;
  while (elapsed < milliseconds) {
    for (let index = 0; index < 1000; index++) sink += run().length;
    count += 1000;
    elapsed = performance.now() - started;
  }
  return { count, elapsed, sink };
}

const rows: { name: string; opsPerSecond: string }[] = [];
let checksum = 0;

for (const [name, run] of Object.entries(cases)) {
  checksum += runFor(run, WARM_UP_MS).sink;
  const { count, elapsed, sink } = runFor(run, MEASURE_MS);
  checksum += sink;
  const opsPerSecond = (count / elapsed) * 1000;
  rows.push({ name, opsPerSecond: `${(opsPerSecond / 1e6).toFixed(2)}M ops/s` });
}

const nameWidth = Math.max(...rows.map((row) => row.name.length));
console.log(`farver benchmark on ${process.version} (checksum ${checksum % 1000})\n`);
for (const row of rows)
  console.log(`${row.name.padEnd(nameWidth)}  ${row.opsPerSecond.padStart(14)}`);

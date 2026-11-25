/**
 * Prints the size of each built file in dist/, raw and gzipped. Run it with `pnpm size`, which builds first.
 * The sizes don't include termenv, which farver depends on.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const distDirectory = new URL("../dist/", import.meta.url).pathname;

function formatBytes(bytes: number): string {
  return `${(bytes / 1024).toFixed(2)} kB`;
}

const files = readdirSync(distDirectory).filter((name) => name.endsWith(".js"));
files.sort((left, right) => left.localeCompare(right));

const nameWidth = Math.max(...files.map((name) => name.length));
console.log(`${"file".padEnd(nameWidth)}  ${"raw".padStart(9)}  ${"gzip".padStart(9)}`);
for (const name of files) {
  const contents = readFileSync(join(distDirectory, name));
  console.log(
    `${name.padEnd(nameWidth)}  ${formatBytes(contents.length).padStart(9)}  ${formatBytes(gzipSync(contents).length).padStart(9)}`,
  );
}

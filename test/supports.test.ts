import process from "node:process";
import tty from "node:tty";
import { beforeEach, expect, it, vi } from "vitest";

beforeEach(() => {
  Object.defineProperty(process, "platform", {
    value: "linux",
  });
  vi.unstubAllEnvs();
  process.argv = [];
});

it("should return false if NO_COLOR is in env", async () => {
  vi.stubEnv("NO_COLOR", "1");
  const { isColorsSupported } = await import("#supports");

  expect(isColorsSupported()).toBe(false);
});

it("should return false if --no-color is in argv", async () => {
  process.argv.push("--no-color");
  const { isColorsSupported } = await import("#supports");

  expect(isColorsSupported()).toBe(false);
});

it("should return true if FORCE_COLOR is in env", async () => {
  vi.stubEnv("FORCE_COLOR", "1");
  const { isColorsSupported } = await import("#supports");

  expect(isColorsSupported()).toBe(true);
});

it("should return true if --color is in argv", async () => {
  process.argv.push("--color");
  const { isColorsSupported } = await import("#supports");

  expect(isColorsSupported()).toBe(true);
});

it("should return false if not TTY", async () => {
  tty.isatty = vi.fn(() => false);
  const { isColorsSupported } = await import("#supports");
  expect(isColorsSupported()).toBe(false);
});

it("return false if `CI` is in env", async () => {
  vi.stubEnv("CI", "1");
  const { isColorsSupported } = await import("#supports");
  expect(isColorsSupported()).toBe(false);
});

const CIS = [
  "GITHUB_ACTIONS",
  "GITEA_ACTIONS",
  "TRAVIS",
  "CIRCLECI",
  "APPVEYOR",
  "GITLAB_CI",
  "BUILDKITE",
  "DRONE",
];

for (const ci of CIS) {
  it(`should return true when \`CI\` is set and \`${ci}\` is set`, async () => {
    vi.stubEnv("CI", "1");
    vi.stubEnv(ci, "1");
    const { isColorsSupported } = await import("#supports");

    expect(isColorsSupported()).toBe(true);
  });
}

it("should return true if platform is win32 and TERM is not dumb", async () => {
  vi.stubEnv("TERM", "xterm");
  Object.defineProperty(process, "platform", { value: "win32" });
  const { isColorsSupported } = await import("#supports");

  expect(isColorsSupported()).toBe(true);
});

it("should return false if platform is win32 and TERM is dumb", async () => {
  vi.stubEnv("TERM", "dumb");
  Object.defineProperty(process, "platform", { value: "win32" });
  const { isColorsSupported } = await import("#supports");

  expect(isColorsSupported()).toBe(false);
});

it("return false when `TERM` is set to dumb", async () => {
  vi.stubEnv("TERM", "dumb");
  const { isColorsSupported } = await import("#supports");

  expect(isColorsSupported()).toBe(false);
});

it("return false when `TERM` is set to dumb when run on Windows", async () => {
  Object.defineProperty(process, "platform", {
    value: "win32",
  });
  vi.stubEnv("TERM", "dumb");
  const { isColorsSupported } = await import("#supports");

  expect(isColorsSupported()).toBe(false);
});

it("should return true if `TERM` is set to dumb and `FORCE_COLOR` is set", async () => {
  vi.stubEnv("TERM", "dumb");
  vi.stubEnv("FORCE_COLOR", "1");
  const { isColorsSupported } = await import("#supports");

  expect(isColorsSupported()).toBe(true);
});

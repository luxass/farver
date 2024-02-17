/**
 * @vitest-environment jsdom
 */

import { expect, it } from "vitest";
import { isColorsSupported } from "../src/supports.browser";

function setUserAgent(userAgent: string) {
  Object.defineProperty(navigator, "userAgent", {
    get() {
      return userAgent; // customized user agent
    },
    configurable: true,
  });
}

it("should return true if userAgentData contains Chromium with version greater than 93", () => {
  globalThis.navigator.userAgentData = {
    brands: [{ brand: "Chromium", version: "94" }],
  };
  expect(isColorsSupported()).toBe(true);
});

it("should return false if userAgentData contains Chromium with version less than or equal to 93", () => {
  globalThis.navigator.userAgentData = {
    brands: [{ brand: "Chromium", version: "93" }],
  };
  expect(isColorsSupported()).toBe(false);
});

it("should return true if userAgent contains Chrome or Chromium", () => {
  setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

  expect(isColorsSupported()).toBe(true);
});

it("should return false if userAgent does not contain Chrome or Chromium", () => {
  setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Safari/537.3");

  expect(isColorsSupported()).toBe(false);
});

it("should return false if navigator is not defined", () => {
  // @ts-expect-error navigator can't be set to undefined..
  delete globalThis.navigator;

  expect(isColorsSupported()).toBe(false);
});

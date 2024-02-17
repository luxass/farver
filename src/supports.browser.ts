declare global {
  interface Navigator {
    userAgentData?: NavigatorUserAgentData
  }

  interface NavigatorUserAgentData {
    readonly brands: NavigatorUABrandVersion[]
  }

  interface NavigatorUABrandVersion {
    readonly brand: string
    readonly version: string
  }
}

/**
 * Check if the browser supports colors
 * @returns {boolean} Whether the browser supports colors
 *
 * @example
 * ```js
 * import { isColorsSupported } from "farver";
 *
 * isColorsSupported();
 * // => true
 * ```
 */
export function isColorsSupported(): boolean {
  if (!globalThis.navigator) {
    return false;
  }

  if (globalThis.navigator?.userAgentData) {
    const brand = navigator.userAgentData?.brands.find(({ brand }) => brand === "Chromium");
    if (brand && +brand?.version > 93) {
      return true;
    }
  }

  if (/\b(Chrome|Chromium)\//.test(navigator.userAgent)) {
    return true;
  }

  return false;
}

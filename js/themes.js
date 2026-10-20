/**
 * themes.js
 * ----------------------------------------------------------------------------
 * Switches colour theme and font by swapping classes on <html>.
 * All the actual colours/fonts are CSS variables in css/tokens.css, so this
 * file only decides WHICH class is on the root element.
 */

export const THEMES = ['light', 'dark', 'system'];
export const FONTS = ['sans', 'serif', 'mono'];

const root = document.documentElement;
const systemDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');

/** 'system' becomes 'light' or 'dark' depending on the device setting. */
export const resolveTheme = (themeName) =>
  themeName === 'system' ? (systemDarkQuery.matches ? 'dark' : 'light') : themeName;

/** Removes every class that starts with `prefix` and adds `prefix + value`. */
function swapRootClass(prefix, value) {
  [...root.classList]
    .filter((className) => className.startsWith(prefix))
    .forEach((className) => root.classList.remove(className));
  root.classList.add(prefix + value);
}

export const applyTheme = (themeName) => {
  const name = THEMES.includes(themeName) ? themeName : 'system';
  const resolved = resolveTheme(name);

  swapRootClass('theme-', resolved);
  root.dataset.themePreference = name;

  // Colours the mobile browser bar to match the page.
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', resolved === 'dark' ? '#0e121b' : '#ffffff');
};

export const applyFont = (fontName) => {
  swapRootClass('font-', FONTS.includes(fontName) ? fontName : 'sans');
};

/**
 * When the user picked "System", follow the OS live if it switches between
 * light and dark (e.g. automatic dark mode at sunset).
 * @param {() => string} getCurrentTheme returns the saved preference
 */
export const watchSystemTheme = (getCurrentTheme) => {
  systemDarkQuery.addEventListener('change', () => {
    if (getCurrentTheme() === 'system') applyTheme('system');
  });
};

/**
 * storage.js
 * ----------------------------------------------------------------------------
 * The only file that talks to localStorage and sessionStorage.
 *
 *   localStorage   → survives closing the browser   → notes + preferences
 *   sessionStorage → cleared when the tab is closed → the unsaved draft
 *
 * Every write returns a small result object instead of throwing, so the rest
 * of the app can decide how to tell the user something went wrong.
 */

/* All keys share one prefix so they're easy to spot in DevTools → Application. */
const KEYS = {
  notes: 'notes-app:notes-v2',   // v2 = the 10 notes from the Figma design
  preferences: 'notes-app:preferences',
  draft: 'notes-app:draft',
};

export const DEFAULT_PREFERENCES = Object.freeze({
  theme: 'system',   // 'light' | 'dark' | 'system'
  font: 'sans',      // 'sans' | 'serif' | 'mono'
});

/**
 * Reading `window.localStorage` itself can throw (e.g. Safari private mode or
 * when cookies are blocked), so we look the storage up safely.
 */
function getStore(type) {
  try {
    return window[type];
  } catch {
    return null;
  }
}

/** True when the browser refused a write because the storage is full. */
function isQuotaError(error) {
  return error instanceof DOMException && (
    error.name === 'QuotaExceededError' ||           // most browsers
    error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||   // older Firefox
    error.code === 22
  );
}

function readJSON(type, key, fallback) {
  const store = getStore(type);
  if (!store) return fallback;

  try {
    const raw = store.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    // Corrupted JSON: don't crash the app, just start from the fallback.
    console.warn(`Could not read "${key}" from ${type}.`, error);
    return fallback;
  }
}

/**
 * @returns {{ ok: true } | { ok: false, reason: 'quota' | 'unavailable', error?: Error }}
 */
function writeJSON(type, key, value) {
  const store = getStore(type);
  if (!store) return { ok: false, reason: 'unavailable' };

  try {
    store.setItem(key, JSON.stringify(value));
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: isQuotaError(error) ? 'quota' : 'unavailable', error };
  }
}

/* ---------------------------------------------------------------------------
   Notes (localStorage)
--------------------------------------------------------------------------- */

export const saveNotes = (notes) => writeJSON('localStorage', KEYS.notes, notes);

/** Returns the saved array, or `null` if this browser has never saved notes. */
export const loadNotes = () => readJSON('localStorage', KEYS.notes, null);

/* ---------------------------------------------------------------------------
   Preferences (localStorage)
--------------------------------------------------------------------------- */

export const savePreferences = (prefs) => writeJSON('localStorage', KEYS.preferences, prefs);

/** Always returns a complete object: saved values on top of the defaults. */
export const loadPreferences = () => ({
  ...DEFAULT_PREFERENCES,
  ...readJSON('localStorage', KEYS.preferences, {}),
});

/* ---------------------------------------------------------------------------
   Draft (sessionStorage) — auto-saved while typing, restored after a reload
--------------------------------------------------------------------------- */

export const saveDraft = (draft) => writeJSON('sessionStorage', KEYS.draft, draft);

export const loadDraft = () => readJSON('sessionStorage', KEYS.draft, null);

export const clearDraft = () => {
  getStore('sessionStorage')?.removeItem(KEYS.draft);
};

/** Exposed so main.js can recognise changes made in another tab. */
export const NOTES_KEY = KEYS.notes;

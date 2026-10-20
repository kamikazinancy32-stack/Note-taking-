/**
 * location.js
 * ----------------------------------------------------------------------------
 * Geolocation API (bonus feature): attaches where a note was written.
 *
 *  1. Ask the browser for coordinates (the user sees a permission prompt).
 *  2. Try to turn the coordinates into a city name with a free, key-less
 *     public lookup. If that fails (offline, blocked), keep the coordinates.
 */

const REVERSE_GEOCODE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

/** Wraps the callback-style geolocation API in a Promise so we can use await. */
function requestPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('unsupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000, // reuse a position from the last 5 minutes
    });
  });
}

async function lookUpCity(latitude, longitude) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);

  try {
    const url = `${REVERSE_GEOCODE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;

    const place = await response.json();
    const city = place.city || place.locality;
    return city ? [city, place.countryName].filter(Boolean).join(', ') : null;
  } catch {
    return null; // a missing city name is fine; we still have coordinates
  } finally {
    clearTimeout(timer);
  }
}

/** @returns {Promise<{ latitude: number, longitude: number, city: string|null }>} */
export async function getCurrentLocation() {
  const { coords } = await requestPosition();
  const latitude = Number(coords.latitude.toFixed(4));
  const longitude = Number(coords.longitude.toFixed(4));
  const city = await lookUpCity(latitude, longitude);
  return { latitude, longitude, city };
}

/** "Kigali, Rwanda" or, without a city, "-1.9441, 30.0619". */
export const describeLocation = (location) =>
  location ? location.city ?? `${location.latitude}, ${location.longitude}` : '';

/** Turns a GeolocationPositionError into a sentence the user can act on. */
export function locationErrorMessage(error) {
  if (error?.message === 'unsupported') return 'This browser can’t share your location.';

  switch (error?.code) {
    case 1: return 'Location access was blocked. Allow it in your browser’s site settings to add a location.';
    case 2: return 'Your location couldn’t be found. Check your connection and try again.';
    case 3: return 'Finding your location took too long. Try again.';
    default: return 'Your location couldn’t be added. Try again.';
  }
}

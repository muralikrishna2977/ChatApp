// Keeps the signed-in user for the lifetime of the tab so a page refresh
// doesn't drop the user back on the sign-in screen.
const STORAGE_KEY = "wechat.user";

export function saveUser(user) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Storage unavailable (private mode, blocked cookies) — session just won't persist.
  }
}

export function loadUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearUser() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

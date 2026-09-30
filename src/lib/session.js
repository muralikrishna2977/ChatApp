// Keeps the signed-in user ({ user_id, name, email, token }) for the lifetime of the
// tab so a page refresh doesn't drop the user back on the sign-in screen.
const STORAGE_KEY = "wechat.user";

// In-memory copy so the session still works when sessionStorage is unavailable.
let cachedUser;

export function saveUser(user) {
  cachedUser = user;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // Storage unavailable (private mode, blocked cookies) — the in-memory copy is used.
  }
}

// Returns the stored user, or null. Sessions from before auth was added have no
// token and are treated as signed out.
export function loadUser() {
  if (cachedUser === undefined) {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      cachedUser = raw ? JSON.parse(raw) : null;
    } catch {
      cachedUser = null;
    }
  }
  return cachedUser?.token ? cachedUser : null;
}

export function getToken() {
  return loadUser()?.token ?? null;
}

export function clearUser() {
  cachedUser = null;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear.
  }
}

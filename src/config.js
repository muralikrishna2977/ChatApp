// Backend base URL. Override per environment with VITE_API_URL in a .env file,
// export const API_URL = "http://localhost:5000";
export const API_URL = "https://chatappserver-0hoo.onrender.com";

// Public asset prefix (the app is served from /ChatApp/ on GitHub Pages).
export const ASSET_BASE = import.meta.env.BASE_URL;

export const APP_NAME = "We Chat";

// Number of messages the server returns per history page.
export const PAGE_SIZE = 15;

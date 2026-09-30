import ReactDOM from "react-dom/client";
// Global styles first so component styles can override the shared primitives.
import "./styles/global.scss";
import App from "./App.jsx";

// StrictMode is intentionally off: its double-mounted effects would open two
// sockets, and the server allows only one registered connection per user.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

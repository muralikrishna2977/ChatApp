import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon.jsx";
import "./Toast.scss";

export default function Toast({ toast, onDismiss }) {
  return (
    <div className="toast-region" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className={`toast toast--${toast.tone}`}
            role={toast.tone === "error" ? "alert" : "status"}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
          >
            <Icon name={toast.tone === "error" ? "alertCircle" : "checkCircle"} size={18} />
            <span className="toast__message">{toast.message}</span>
            <button type="button" className="toast__close" onClick={onDismiss} aria-label="Dismiss">
              <Icon name="x" size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useEffect } from "react";
import { motion } from "framer-motion";
import Icon from "./Icon.jsx";
import "./Drawer.scss";

const TRANSITION = { type: "tween", duration: 0.22, ease: "easeOut" };

// Slide-over panel with a backdrop. Render inside <AnimatePresence> for exit animation.
export default function Drawer({ side = "left", title, onClose, children }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const offscreen = side === "left" ? "-100%" : "100%";

  return (
    <>
      <motion.div
        className="drawer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={TRANSITION}
        onClick={onClose}
      />
      <motion.aside
        className={`drawer drawer--${side}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ x: offscreen }}
        animate={{ x: 0 }}
        exit={{ x: offscreen }}
        transition={TRANSITION}
      >
        <header className="drawer__header">
          <h2 className="drawer__title">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="x" />
          </button>
        </header>
        <div className="drawer__body">{children}</div>
      </motion.aside>
    </>
  );
}

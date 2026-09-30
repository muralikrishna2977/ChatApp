import { useEffect } from "react";
import { motion } from "framer-motion";
import Icon from "../ui/Icon.jsx";
import "./ImageLightbox.scss";

async function downloadFile(url, name) {
  try {
    const response = await fetch(url);
    const blobUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name || "image";
    link.click();
    URL.revokeObjectURL(blobUrl);
  } catch {
    // Cross-origin fetch blocked — fall back to opening the file.
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export default function ImageLightbox({ image, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onClick={onClose}
    >
      <div className="lightbox__toolbar" onClick={(e) => e.stopPropagation()}>
        <span className="lightbox__name">{image.name}</span>
        <button
          type="button"
          className="lightbox__btn"
          onClick={() => downloadFile(image.url, image.name)}
          aria-label="Download"
          title="Download"
        >
          <Icon name="download" />
        </button>
        <button
          type="button"
          className="lightbox__btn"
          onClick={onClose}
          aria-label="Close"
          title="Close"
        >
          <Icon name="x" />
        </button>
      </div>
      <motion.img
        className="lightbox__image"
        src={image.url}
        alt={image.name || "Preview"}
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { attachmentLabel, fileKind } from "../../utils/format.js";
import Icon from "../ui/Icon.jsx";
import Spinner from "../ui/Spinner.jsx";
import "./AttachmentPreview.scss";

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Preview({ file, url }) {
  const kind = fileKind(file.type);
  if (kind === "image") return <img className="attachment__media" src={url} alt={file.name} />;
  if (kind === "video") return <video className="attachment__media" src={url} controls />;
  if (kind === "pdf") return <iframe className="attachment__pdf" src={url} title={file.name} />;
  return (
    <div className="attachment__file">
      <Icon name="fileText" size={40} strokeWidth={1.5} />
    </div>
  );
}

// Modal to review a selected file and add a caption before sending.
export default function AttachmentPreview({ file, initialCaption = "", onCancel, onSend }) {
  const [caption, setCaption] = useState(initialCaption);
  const [sending, setSending] = useState(false);

  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !sending) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel, sending]);

  async function handleSend(event) {
    event.preventDefault();
    setSending(true);
    const sent = await onSend(caption);
    if (!sent) setSending(false);
  }

  return (
    <motion.div
      className="attachment-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.form
        className="attachment"
        role="dialog"
        aria-modal="true"
        aria-label="Send attachment"
        onSubmit={handleSend}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ type: "tween", duration: 0.18 }}
      >
        <header className="attachment__header">
          <div className="attachment__meta">
            <span className="attachment__name">{file.name}</span>
            <span className="attachment__details">
              {attachmentLabel(file.type)} · {formatSize(file.size)}
            </span>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onCancel}
            disabled={sending}
            aria-label="Cancel"
          >
            <Icon name="x" />
          </button>
        </header>

        <div className="attachment__preview">
          <Preview file={file} url={url} />
        </div>

        <footer className="attachment__footer">
          <input
            className="input"
            placeholder="Add a caption…"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={sending}
            autoFocus
          />
          <button type="submit" className="btn btn--primary" disabled={sending}>
            {sending ? <Spinner size="sm" label="Sending" /> : <Icon name="send" size={16} />}
            {sending ? "Sending…" : "Send"}
          </button>
        </footer>
      </motion.form>
    </motion.div>
  );
}

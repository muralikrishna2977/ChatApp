import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useClickOutside } from "../../hooks/useClickOutside.js";
import { replyAuthor, replyPreviewText } from "../../utils/format.js";
import Icon from "../ui/Icon.jsx";
import AttachmentPreview from "./AttachmentPreview.jsx";
import "./Composer.scss";

const MAX_TEXTAREA_HEIGHT = 140;

const ATTACH_OPTIONS = [
  { id: "image", label: "Photo", icon: "image", accept: "image/*" },
  { id: "video", label: "Video", icon: "video", accept: "video/*" },
  { id: "document", label: "Document", icon: "fileText", accept: ".pdf,.doc,.docx,.txt" },
];

export default function Composer({ selfId, replyTo, onCancelReply, onSend, onTyping }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);
  const attachButtonRef = useRef(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useClickOutside([menuRef, attachButtonRef], closeMenu, menuOpen);

  // Focus the input when a chat opens or a reply is started.
  useEffect(() => {
    textareaRef.current?.focus();
  }, [replyTo]);

  // Auto-grow the textarea with its content.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [text]);

  async function submitText() {
    if (!text.trim()) return;
    const draft = text;
    setText(""); // clear optimistically; restore if sending fails
    const sent = await onSend({ text: draft, file: null });
    if (!sent) setText(draft);
    textareaRef.current?.focus();
  }

  async function submitFile(caption) {
    const sent = await onSend({ text: caption, file });
    if (sent) {
      setFile(null);
      setText(""); // the draft was offered as the caption
    }
    return sent;
  }

  function openPicker(accept) {
    const input = fileInputRef.current;
    input.accept = accept;
    input.click();
    setMenuOpen(false);
  }

  function handleFileChange(event) {
    const selected = event.target.files[0];
    event.target.value = "";
    if (selected) setFile(selected);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitText();
    } else if (event.key === "Escape" && replyTo) {
      onCancelReply();
    }
  }

  return (
    <div className="composer">
      <div className="composer__inner">
        <AnimatePresence>
          {replyTo && (
            <motion.div
              className="composer__reply"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="composer__reply-body">
                <span className="composer__reply-label">
                  Replying to <strong>{replyAuthor(replyTo, selfId)}</strong>
                </span>
                <span className="composer__reply-text">{replyPreviewText(replyTo)}</span>
              </div>
              <button
                type="button"
                className="icon-btn icon-btn--sm"
                onClick={onCancelReply}
                aria-label="Cancel reply"
              >
                <Icon name="x" size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="composer__row">
          <div className="composer__attach">
            <button
              ref={attachButtonRef}
              type="button"
              className="icon-btn"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Attach a file"
              aria-expanded={menuOpen}
              title="Attach"
            >
              <Icon name="paperclip" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  ref={menuRef}
                  className="attach-menu"
                  role="menu"
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.14 }}
                >
                  {ATTACH_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      role="menuitem"
                      className="attach-menu__item"
                      onClick={() => openPicker(option.accept)}
                    >
                      <span className={`attach-menu__icon attach-menu__icon--${option.id}`}>
                        <Icon name={option.icon} size={18} />
                      </span>
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <input ref={fileInputRef} type="file" hidden onChange={handleFileChange} />

          <textarea
            ref={textareaRef}
            className="composer__input"
            rows={1}
            placeholder="Write a message…"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onTyping();
            }}
            onKeyDown={handleKeyDown}
            aria-label="Message"
          />

          <button
            type="button"
            className="icon-btn icon-btn--primary composer__send"
            onClick={submitText}
            disabled={!text.trim()}
            aria-label="Send message"
            title="Send"
          >
            <Icon name="send" size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {file && (
          <AttachmentPreview
            file={file}
            initialCaption={text}
            onCancel={() => setFile(null)}
            onSend={submitFile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

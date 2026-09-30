import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { formatDayLabel, isSameDay, microDiff } from "../../utils/time.js";
import Icon from "../ui/Icon.jsx";
import Spinner from "../ui/Spinner.jsx";
import ImageLightbox from "./ImageLightbox.jsx";
import MessageBubble from "./MessageBubble.jsx";
import "./MessageList.scss";

// Consecutive messages from the same sender within this window are visually grouped.
const GROUP_WINDOW_MICROS = 5 * 60 * 1_000_000;
const LOAD_OLDER_THRESHOLD_PX = 80;
const STICK_TO_BOTTOM_PX = 120;

function buildRows(messages) {
  return messages.map((message, i) => {
    const prev = messages[i - 1];
    const newDay = !prev || !isSameDay(prev.time, message.time);
    const continued =
      !newDay &&
      prev.senderId === message.senderId &&
      microDiff(message.time, prev.time) < GROUP_WINDOW_MICROS;
    return { message, newDay, continued };
  });
}

export default function MessageList({
  messages,
  selfId,
  isGroup,
  loading,
  hasMore,
  error,
  onLoadOlder,
  onReply,
}) {
  const listRef = useRef(null);
  const restoreRef = useRef(null); // scroll position to restore after older messages prepend
  const lastKeyRef = useRef(null);
  const stickToBottomRef = useRef(true);
  const [lightboxImage, setLightboxImage] = useState(null);

  const rows = useMemo(() => buildRows(messages), [messages]);

  function handleScroll() {
    const el = listRef.current;
    stickToBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < STICK_TO_BOTTOM_PX;

    if (el.scrollTop < LOAD_OLDER_THRESHOLD_PX && hasMore && !loading) {
      restoreRef.current = { height: el.scrollHeight, top: el.scrollTop };
      onLoadOlder();
    }
  }

  // Keep the viewport stable when history is prepended; jump to the bottom
  // for the first page, our own messages, or when already near the bottom.
  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const last = messages[messages.length - 1];
    const lastKey = last?.key ?? null;

    if (lastKey === lastKeyRef.current) {
      if (restoreRef.current) {
        el.scrollTop = el.scrollHeight - restoreRef.current.height + restoreRef.current.top;
        restoreRef.current = null;
      }
    } else {
      if (!lastKeyRef.current || stickToBottomRef.current || last?.isMine) {
        el.scrollTop = el.scrollHeight;
        stickToBottomRef.current = true;
      }
      restoreRef.current = null;
    }
    lastKeyRef.current = lastKey;
  }, [messages]);

  // Images/videos change height after they load; keep pinned to the bottom if we were there.
  const handleMediaLoad = useCallback(() => {
    const el = listRef.current;
    if (el && stickToBottomRef.current) el.scrollTop = el.scrollHeight;
  }, []);

  const isEmpty = messages.length === 0;

  return (
    <div className="messages" ref={listRef} onScroll={handleScroll}>
      <div className="messages__inner">
        {loading && !isEmpty && (
          <div className="messages__loader">
            <Spinner size="sm" label="Loading older messages" />
          </div>
        )}

        {!hasMore && !loading && !isEmpty && (
          <p className="messages__start">This is the beginning of your conversation.</p>
        )}

        {isEmpty && (
          <div className="messages__placeholder">
            {loading ? (
              <Spinner size="lg" label="Loading messages" />
            ) : error ? (
              <div className="empty-state">
                <span className="empty-state__icon">
                  <Icon name="alertCircle" />
                </span>
                <p className="empty-state__title">{error}</p>
                <p className="empty-state__text">Check your connection and reopen this chat.</p>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state__icon">
                  <Icon name="messageCircle" />
                </span>
                <p className="empty-state__title">No messages yet</p>
                <p className="empty-state__text">Send a message to start the conversation.</p>
              </div>
            )}
          </div>
        )}

        {rows.map(({ message, newDay, continued }) => (
          <div key={message.key}>
            {newDay && (
              <div className="messages__day">
                <span>{formatDayLabel(message.time)}</span>
              </div>
            )}
            <MessageBubble
              message={message}
              selfId={selfId}
              isGroup={isGroup}
              continued={continued}
              onReply={onReply}
              onOpenImage={setLightboxImage}
              onMediaLoad={handleMediaLoad}
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxImage && (
          <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

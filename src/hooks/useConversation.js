import { useCallback, useEffect, useRef, useState } from "react";
import { messageApi } from "../api/index.js";
import { PAGE_SIZE } from "../config.js";
import {
  conversationKey,
  fromDirectMessage,
  fromGroupEvent,
  fromGroupHistory,
} from "../utils/messages.js";

const EMPTY = [];

// Fetches one page of history. Pages arrive newest-first; the cursor for the
// next (older) page is the timestamp of the oldest message in this one.
async function fetchPage({ type, id }, selfId, before) {
  if (type === "group") {
    const { history = [] } = before
      ? await messageApi.groupBefore(id, before)
      : await messageApi.groupInitial(id);
    return {
      items: history.map((m) => fromGroupHistory(m, selfId)).reverse(),
      cursor: history[history.length - 1]?.sent_time ?? null,
      hasMore: history.length >= PAGE_SIZE,
    };
  }

  const { history = [] } = before
    ? await messageApi.directBefore(id, before)
    : await messageApi.directInitial(id);
  return {
    items: history.map((m) => fromDirectMessage(m, selfId)).reverse(),
    cursor: history[history.length - 1]?.time ?? null,
    hasMore: history.length >= PAGE_SIZE,
  };
}

// Message history + live messages for the open conversation.
// Messages are tagged with the conversation they belong to, so a slow response
// for a previous chat can never leak into the one currently open.
export function useConversation({ socket, selfId, conversation }) {
  const type = conversation?.type;
  const id = conversation?.id;
  const key = type && id ? conversationKey(type, id) : null;

  const [thread, setThread] = useState({ key: null, items: EMPTY });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");

  const keyRef = useRef(key);
  const cursorRef = useRef(null);
  const busyRef = useRef(false);

  // Initial page whenever the conversation changes.
  useEffect(() => {
    keyRef.current = key;
    cursorRef.current = null;
    setHasMore(false);
    setError("");
    setThread({ key, items: EMPTY });
    if (!key) return;

    let cancelled = false;
    busyRef.current = true;
    setLoading(true);

    fetchPage({ type, id }, selfId, null)
      .then((page) => {
        if (cancelled) return;
        cursorRef.current = page.cursor;
        setHasMore(page.hasMore);
        // Keep any live messages that arrived while the page was loading.
        setThread((prev) => ({
          key,
          items: prev.key === key ? [...page.items, ...prev.items] : page.items,
        }));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Failed to load messages:", err);
        setError("Couldn't load messages.");
      })
      .finally(() => {
        if (cancelled) return;
        busyRef.current = false;
        setLoading(false);
      });

    return () => {
      cancelled = true;
      busyRef.current = false;
    };
  }, [key, type, id, selfId]);

  const loadOlder = useCallback(async () => {
    if (!key || busyRef.current || !cursorRef.current) return;
    const requestKey = key;
    busyRef.current = true;
    setLoading(true);
    try {
      const page = await fetchPage({ type, id }, selfId, cursorRef.current);
      if (keyRef.current !== requestKey) return;
      if (page.cursor) cursorRef.current = page.cursor;
      setHasMore(page.hasMore);
      if (page.items.length > 0) {
        setThread((prev) =>
          prev.key === requestKey ? { ...prev, items: [...page.items, ...prev.items] } : prev
        );
      }
    } catch (err) {
      console.error("Failed to load older messages:", err);
    } finally {
      if (keyRef.current === requestKey) {
        busyRef.current = false;
        setLoading(false);
      }
    }
  }, [key, type, id, selfId]);

  const appendMessage = useCallback((message, forKey) => {
    setThread((prev) => (prev.key === forKey ? { ...prev, items: [...prev.items, message] } : prev));
  }, []);

  // Live messages for the open conversation.
  useEffect(() => {
    if (!socket || !key) return;

    if (type === "direct") {
      const onDirect = (data) => {
        if (data.senderid === id) appendMessage(fromDirectMessage(data, selfId), key);
      };
      socket.on("recived_message", onDirect);
      return () => socket.off("recived_message", onDirect);
    }

    const onGroup = (data) => {
      if (data.roomId === id) appendMessage(fromGroupEvent(data, selfId), key);
    };
    socket.on("receive-group-message", onGroup);
    return () => socket.off("receive-group-message", onGroup);
  }, [socket, key, type, id, selfId, appendMessage]);

  return {
    key,
    messages: thread.key === key ? thread.items : EMPTY,
    loading,
    hasMore,
    error,
    loadOlder,
    appendMessage,
  };
}

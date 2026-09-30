import { useEffect, useRef, useState } from "react";
import { conversationKey } from "../utils/messages.js";

// Counts messages that arrive for conversations other than the open one.
// Keyed by conversationKey(); the open conversation is cleared automatically.
export function useUnreadCounts(socket, activeKey) {
  const [unread, setUnread] = useState({});
  const activeKeyRef = useRef(activeKey);

  useEffect(() => {
    activeKeyRef.current = activeKey;
    if (!activeKey) return;
    setUnread((prev) => {
      if (!prev[activeKey]) return prev;
      const next = { ...prev };
      delete next[activeKey];
      return next;
    });
  }, [activeKey]);

  useEffect(() => {
    if (!socket) return;
    const bump = (key) => {
      if (key === activeKeyRef.current) return;
      setUnread((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
    };
    const onDirect = (data) => bump(conversationKey("direct", data.senderid));
    const onGroup = (data) => bump(conversationKey("group", data.roomId));

    socket.on("recived_message", onDirect);
    socket.on("receive-group-message", onGroup);
    return () => {
      socket.off("recived_message", onDirect);
      socket.off("receive-group-message", onGroup);
    };
  }, [socket]);

  return unread;
}

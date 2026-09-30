import { useCallback, useEffect, useRef, useState } from "react";

const STOP_AFTER_MS = 1500;
// Clears a stuck indicator if a "stop-typing" event never arrives.
const STALE_AFTER_MS = 5000;

// Typing indicator for 1-on-1 chats: receives the contact's typing state and
// exposes notifyTyping() to broadcast ours.
export function useTyping(socket, contactId) {
  const [typingFrom, setTypingFrom] = useState(null);
  const staleTimerRef = useRef(null);
  const stopTimerRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    const onTyping = ({ fromUserId }) => {
      setTypingFrom(fromUserId);
      clearTimeout(staleTimerRef.current);
      staleTimerRef.current = setTimeout(() => setTypingFrom(null), STALE_AFTER_MS);
    };
    const onStop = ({ fromUserId }) =>
      setTypingFrom((prev) => (prev === fromUserId ? null : prev));

    socket.on("user-typing", onTyping);
    socket.on("user-stop-typing", onStop);
    return () => {
      socket.off("user-typing", onTyping);
      socket.off("user-stop-typing", onStop);
    };
  }, [socket]);

  const notifyTyping = useCallback(() => {
    if (!socket || !contactId) return;
    // Emit "typing" once per burst, then "stop-typing" after a pause.
    if (!stopTimerRef.current) socket.emit("typing", { toUserId: contactId });
    clearTimeout(stopTimerRef.current);
    stopTimerRef.current = setTimeout(() => {
      socket.emit("stop-typing", { toUserId: contactId });
      stopTimerRef.current = null;
    }, STOP_AFTER_MS);
  }, [socket, contactId]);

  useEffect(
    () => () => {
      clearTimeout(staleTimerRef.current);
      clearTimeout(stopTimerRef.current);
    },
    []
  );

  return { isTyping: Boolean(contactId) && typingFrom === contactId, notifyTyping };
}

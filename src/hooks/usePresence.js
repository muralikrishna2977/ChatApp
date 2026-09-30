import { useEffect, useState } from "react";

// Tracks online/offline status of contacts: { [userId]: "online" | "offline" }.
export function usePresence(socket, activeContactId) {
  const [presence, setPresence] = useState({});

  useEffect(() => {
    if (!socket) return;
    const update = ({ userId, status }) =>
      setPresence((prev) => (prev[userId] === status ? prev : { ...prev, [userId]: status }));

    socket.on("selfstatus", update);
    socket.on("onofstatus", update);
    return () => {
      socket.off("selfstatus", update);
      socket.off("onofstatus", update);
    };
  }, [socket]);

  // Ask the server to broadcast the opened contact's current status.
  useEffect(() => {
    if (socket && activeContactId) socket.emit("onlineofflinestatus", activeContactId);
  }, [socket, activeContactId]);

  return presence;
}

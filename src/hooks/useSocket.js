import { useEffect, useState } from "react";
import io from "socket.io-client";
import { API_URL } from "../config.js";

// Opens one socket per signed-in user and (re-)registers it on every connect,
// so the server can route messages to us again after a reconnect.
export function useSocket(userId) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const connection = io(API_URL, { transports: ["websocket"] });
    const register = () => connection.emit("register_user", userId);
    connection.on("connect", register);
    setSocket(connection);

    return () => {
      connection.off("connect", register);
      connection.disconnect();
    };
  }, [userId]);

  return socket;
}

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { endSession } from "../api/index.js";
import { API_URL } from "../config.js";

// Opens one authenticated socket per session. The server identifies (and registers)
// us from the token on every connect, including reconnects.
export function useSocket(token) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) return;
    const connection = io(API_URL, { transports: ["websocket"], auth: { token } });
    const onConnectError = (err) => {
      if (err.message === "unauthorized") endSession();
    };
    connection.on("connect_error", onConnectError);
    setSocket(connection);

    return () => {
      connection.off("connect_error", onConnectError);
      connection.disconnect();
    };
  }, [token]);

  return socket;
}

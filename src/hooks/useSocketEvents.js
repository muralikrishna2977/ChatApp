import { useEffect } from "react";

export function useSocketEvents({
  socket,
  senderid,
  reciverid,
  isitGroup,
  clickedGroupid,
  setCurrentchat,
  setOnlineOfflineStatus,
  setIsTyping,
}) {
  // Receive 1-on-1 messages in real time
  useEffect(() => {
    if (!socket) return;
    socket.on("recived_message", (data) => {
      if (!isitGroup && reciverid === data.senderid) {
        setCurrentchat((prev) => [...prev, data]);
      }
    });
    return () => socket.off("recived_message");
  }, [socket, reciverid, isitGroup]);

  // Receive group messages in real time
  useEffect(() => {
    if (!socket) return;
    socket.on("receive-group-message", ({ senderid: sender_id, sendername, message, timestamp, roomId, fileUrl, fileType, fileName, replyTo }) => {
      const obj = {
        message,
        user_id: senderid,
        sender_id,
        name: sendername,
        time: timestamp,
        fileUrl,
        filename: fileName,
        fileType,
        replyTo,
      };
      if (roomId === clickedGroupid && isitGroup) {
        setCurrentchat((prev) => [...prev, obj]);
      }
    });
    return () => socket.off("receive-group-message");
  }, [socket, isitGroup, clickedGroupid]);

  // Friend comes online (notified on their login)
  useEffect(() => {
    if (!socket) return;
    const handle = (data) =>
      setOnlineOfflineStatus((prev) => ({ ...prev, [data.userId]: data.status }));
    socket.on("selfstatus", handle);
    return () => socket.off("selfstatus", handle);
  }, [socket]);

  // Friend online/offline status updates
  useEffect(() => {
    if (!socket) return;
    const handle = (data) =>
      setOnlineOfflineStatus((prev) => ({ ...prev, [data.userId]: data.status }));
    socket.on("onofstatus", handle);
    return () => socket.off("onofstatus", handle);
  }, [socket]);

  // Emit status check when opening a 1-on-1 chat
  useEffect(() => {
    if (!socket || !reciverid) return;
    socket.emit("onlineofflinestatus", reciverid);
  }, [socket, reciverid]);

  // Typing indicator — receive and clear
  useEffect(() => {
    if (!socket) return;
    const handleTyping = ({ fromUserId }) => {
      if (fromUserId === reciverid) setIsTyping(true);
    };
    const handleStopTyping = ({ fromUserId }) => {
      if (fromUserId === reciverid) setIsTyping(false);
    };
    socket.on("user-typing", handleTyping);
    socket.on("user-stop-typing", handleStopTyping);
    return () => {
      socket.off("user-typing", handleTyping);
      socket.off("user-stop-typing", handleStopTyping);
    };
  }, [socket, reciverid]);
}

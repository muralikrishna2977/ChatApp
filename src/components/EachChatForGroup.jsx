import React from "react";
import MessageBubble from "./MessageBubble.jsx";

function EachChatForGroup({ message, user_id, sender_id, name, time, fileUrl, filename, fileType, replyTo, onReply }) {
  function handleReply() {
    const senderName = user_id === sender_id ? "You" : (name || "Member");
    onReply({
      senderName,
      text: message || "",
      fileType: fileUrl ? fileType : undefined,
    });
  }

  return (
    <MessageBubble
      isSent={user_id === sender_id}
      isGroup={true}
      senderName={name}
      message={message}
      time={time}
      fileUrl={fileUrl}
      filename={filename}
      fileType={fileType}
      replyTo={replyTo}
      onReply={onReply ? handleReply : undefined}
    />
  );
}

export default EachChatForGroup;

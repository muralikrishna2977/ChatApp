import React from "react";
import MessageBubble from "./MessageBubble.jsx";

function EachChat({ messageSenderid, messageReciverid, message, receiverid, time, fileUrl, filename, fileType, replyTo, friendname, onReply }) {
  function handleReply() {
    // Build a reply context: "You" if this was our own sent message, otherwise the contact's name
    const senderName = messageReciverid === receiverid ? "You" : (friendname || "Contact");
    onReply({
      senderName,
      text: message || "",
      fileType: fileUrl ? fileType : undefined,
    });
  }

  return (
    <MessageBubble
      isSent={messageReciverid === receiverid}
      isGroup={false}
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

export default EachChat;

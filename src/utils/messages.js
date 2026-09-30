// The server returns messages in several shapes (direct history, group history,
// group socket events). Everything is normalized to one shape before rendering:
//
// { key, senderId, senderName, isMine, text, time, fileUrl, fileName, fileType, replyTo }

export function conversationKey(type, id) {
  return `${type}:${id}`;
}

function normalize({ senderId, senderName, text, time, fileUrl, fileName, fileType, replyTo }, selfId) {
  const stamp = String(time);
  return {
    key: `${senderId}:${stamp}`,
    senderId,
    senderName: senderName || null,
    isMine: senderId === selfId,
    text: text || "",
    time: stamp,
    fileUrl: fileUrl || null,
    fileName: fileName || "",
    fileType: fileType || null,
    replyTo: replyTo || null,
  };
}

export function fromDirectMessage(raw, selfId) {
  return normalize(
    {
      senderId: raw.senderid,
      text: raw.sendmessage || raw.caption,
      time: raw.time,
      fileUrl: raw.fileUrl,
      fileName: raw.fileName ?? raw.filename,
      fileType: raw.fileType,
      replyTo: raw.replyTo,
    },
    selfId
  );
}

export function fromGroupHistory(raw, selfId) {
  return normalize(
    {
      senderId: raw.sender_id,
      senderName: raw.sender_name,
      text: raw.message,
      time: raw.sent_time,
      fileUrl: raw.fileUrl,
      fileName: raw.fileName,
      fileType: raw.fileType,
      replyTo: raw.replyTo,
    },
    selfId
  );
}

export function fromGroupEvent(event, selfId) {
  return normalize(
    {
      senderId: event.senderid,
      senderName: event.sendername,
      text: event.message,
      time: event.timestamp,
      fileUrl: event.fileUrl,
      fileName: event.fileName,
      fileType: event.fileType,
      replyTo: event.replyTo,
    },
    selfId
  );
}

export function createOutgoingMessage({ selfId, selfName, text, time, fileUrl, fileName, fileType, replyTo }) {
  return normalize(
    { senderId: selfId, senderName: selfName, text, time, fileUrl, fileName, fileType, replyTo },
    selfId
  );
}

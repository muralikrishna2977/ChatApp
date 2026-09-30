import React, { useState } from "react";
import { convertMicroEpochToIST } from "../utils/time.js";
import "./MessageBubble.scss";

function MessageBubble({ isSent, isGroup, senderName, message, time, fileUrl, filename, fileType, replyTo, onReply }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [copied, setCopied] = useState(false);

  const sentColor = isGroup ? "#55C2F8" : "#72d0ff";
  const receivedColor = "#c7ecff";
  const bubbleColor = isSent ? sentColor : receivedColor;

  async function downloadImage(url, name) {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = name || "image";
    a.click();
    URL.revokeObjectURL(blobUrl);
  }

  function handleCopy() {
    if (!message) return;
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function replyPreviewText(rt) {
    if (!rt) return "";
    if (rt.fileType?.startsWith("image/")) return "[Image]";
    if (rt.fileType?.startsWith("video/")) return "[Video]";
    if (rt.fileType === "application/pdf") return "[PDF]";
    return rt.text || "";
  }

  const ReplyQuote = () =>
    replyTo ? (
      <div className="msg-reply-quote">
        <span className="msg-reply-sender">{replyTo.senderName}</span>
        <span className="msg-reply-text">{replyPreviewText(replyTo)}</span>
      </div>
    ) : null;

  const GroupReceivedHeader = () =>
    !isSent && isGroup && senderName ? (
      <div className="msg-group-header" style={{ backgroundColor: bubbleColor }}>
        <p className="msg-sender-name">{senderName}</p>
        <p className="msg-time-small">{convertMicroEpochToIST(time)}</p>
      </div>
    ) : null;

  return (
    <div className="msg-bubble">
      <div className={`msg-row ${isSent ? "msg-row--sent" : "msg-row--received"}`}>
        <div className="msg-files">
          {/* ── Image ── */}
          {fileUrl && fileType?.startsWith("image/") && (
            <div className="msg-image-wrap">
              <GroupReceivedHeader />
              {replyTo && (
                <div className="msg-reply-quote" style={{ backgroundColor: isSent ? "#5ab8ef" : "#b0ddf7" }}>
                  <span className="msg-reply-sender">{replyTo.senderName}</span>
                  <span className="msg-reply-text">{replyPreviewText(replyTo)}</span>
                </div>
              )}
              <img
                style={{
                  maxWidth: "400px",
                  maxHeight: "300px",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "4px",
                  border: `solid 5px ${bubbleColor}`,
                  cursor: "pointer",
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderBottom: 0,
                }}
                src={fileUrl}
                alt="Uploaded"
                onClick={() => setPreviewImage({ url: fileUrl, filename })}
              />
              <div className="msg-caption" style={{ backgroundColor: bubbleColor }}>
                <p className="msg-caption-text">{message}</p>
                {(!isGroup || isSent) && (
                  <p className="msg-time-small">{convertMicroEpochToIST(time)}</p>
                )}
              </div>
            </div>
          )}

          {/* ── Video ── */}
          {fileUrl && fileType?.startsWith("video/") && (
            <div className="msg-video-wrap">
              <GroupReceivedHeader />
              {replyTo && (
                <div className="msg-reply-quote" style={{ backgroundColor: isSent ? "#5ab8ef" : "#b0ddf7" }}>
                  <span className="msg-reply-sender">{replyTo.senderName}</span>
                  <span className="msg-reply-text">{replyPreviewText(replyTo)}</span>
                </div>
              )}
              <video
                controls
                style={{
                  maxWidth: "400px",
                  maxHeight: "300px",
                  width: "100%",
                  height: "100%",
                  borderRadius: "4px",
                  border: `solid 5px ${bubbleColor}`,
                  cursor: "pointer",
                  borderBottomRightRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                <source src={fileUrl} type={fileType} />
              </video>
              <div className="msg-caption" style={{ backgroundColor: bubbleColor }}>
                <p className="msg-caption-text">{message}</p>
                {(!isGroup || isSent) && (
                  <p className="msg-time-small">{convertMicroEpochToIST(time)}</p>
                )}
              </div>
            </div>
          )}

          {/* ── PDF / Document ── */}
          {fileUrl && fileType === "application/pdf" && (
            <div className="msg-file-wrap" style={{ backgroundColor: "#55C2F8" }}>
              <GroupReceivedHeader />
              {replyTo && (
                <div className="msg-reply-quote" style={{ backgroundColor: "#5ab8ef" }}>
                  <span className="msg-reply-sender">{replyTo.senderName}</span>
                  <span className="msg-reply-text">{replyPreviewText(replyTo)}</span>
                </div>
              )}
              <div className="msg-pdf-inner">
                <div className="msg-pdf-name">
                  <img
                    src={`${import.meta.env.BASE_URL}assets/pdf.svg`}
                    width="30px"
                    height="30px"
                    alt="PDF"
                  />
                  {filename}
                </div>
                <div className="msg-pdf-open">
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                  <div />
                </div>
              </div>
              <div className="msg-caption" style={{ backgroundColor: "#a4defb" }}>
                <p className="msg-caption-text">{message}</p>
                {(!isGroup || isSent) && (
                  <p className="msg-time-small">{convertMicroEpochToIST(time)}</p>
                )}
              </div>
            </div>
          )}

          {/* ── Plain text ── */}
          {!fileUrl && (
            <div className="msg-text-wrap" style={{ backgroundColor: bubbleColor }}>
              {!isSent && isGroup && senderName && (
                <div className="msg-group-header" style={{ backgroundColor: "transparent" }}>
                  <p className="msg-sender-name">{senderName}</p>
                  <p className="msg-time-small">{convertMicroEpochToIST(time)}</p>
                </div>
              )}
              {replyTo && (
                <div className="msg-reply-quote" style={{ backgroundColor: isSent ? "#5ab8ef" : "#b0ddf7" }}>
                  <span className="msg-reply-sender">{replyTo.senderName}</span>
                  <span className="msg-reply-text">{replyPreviewText(replyTo)}</span>
                </div>
              )}
              <p className="msg-text">{message}</p>
              {(!isGroup || isSent) && (
                <p className="msg-time-small">{convertMicroEpochToIST(time)}</p>
              )}
            </div>
          )}
        </div>

        {/* ── Action buttons (reply + copy) shown on hover via CSS ── */}
        <div className={`msg-actions ${isSent ? "msg-actions--left" : "msg-actions--right"}`}>
          {onReply && (
            <button className="msg-action-btn" title="Reply" onClick={onReply}>
              ↩
            </button>
          )}
          {!fileUrl && message && (
            <button className="msg-action-btn" title={copied ? "Copied!" : "Copy"} onClick={handleCopy}>
              {copied ? "✓" : "⎘"}
            </button>
          )}
        </div>
      </div>

      {/* ── Image preview modal ── */}
      {previewImage && (
        <div className="image_preview_modal" onClick={() => setPreviewImage(null)}>
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <button className="modal_close" onClick={() => setPreviewImage(null)}>✕</button>
            <img src={previewImage.url} alt="Preview" className="modal_image" />
            <button
              className="modal_download"
              onClick={() => downloadImage(previewImage.url, previewImage.filename)}
            >
              ↓ Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageBubble;

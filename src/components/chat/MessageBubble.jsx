import { memo, useState } from "react";
import {
  attachmentLabel,
  avatarColor,
  cx,
  fileKind,
  replyAuthor,
  replyPreviewText,
} from "../../utils/format.js";
import { formatTime } from "../../utils/time.js";
import Avatar from "../ui/Avatar.jsx";
import Icon from "../ui/Icon.jsx";
import "./MessageBubble.scss";

function Attachment({ kind, url, name, type, onOpenImage, onMediaLoad }) {
  if (kind === "image") {
    return (
      <button type="button" className="msg__media-btn" onClick={() => onOpenImage({ url, name })}>
        <img className="msg__media" src={url} alt={name || "Shared image"} onLoad={onMediaLoad} />
      </button>
    );
  }

  if (kind === "video") {
    return (
      <video className="msg__media" controls preload="metadata" onLoadedMetadata={onMediaLoad}>
        <source src={url} type={type} />
      </video>
    );
  }

  return (
    <a className="msg__file" href={url} target="_blank" rel="noopener noreferrer">
      <span className="msg__file-icon">
        <Icon name="fileText" />
      </span>
      <span className="msg__file-info">
        <span className="msg__file-name">{name || "Attachment"}</span>
        <span className="msg__file-type">{attachmentLabel(type)} · Open</span>
      </span>
      <Icon name="externalLink" size={16} />
    </a>
  );
}

function MessageBubble({ message, selfId, isGroup, continued, onReply, onOpenImage, onMediaLoad }) {
  const { isMine, senderName, text, time, fileUrl, fileName, fileType, replyTo } = message;
  const [copied, setCopied] = useState(false);

  const kind = fileUrl ? fileKind(fileType) : null;
  const isMedia = kind === "image" || kind === "video";
  const showSender = isGroup && !isMine && !continued;
  const showAvatar = isGroup && !isMine;

  function handleCopy() {
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }

  return (
    <div className={cx("msg", isMine ? "msg--out" : "msg--in", continued && "msg--continued")}>
      {showAvatar &&
        (continued ? (
          <span className="msg__avatar-spacer" />
        ) : (
          <span className="msg__avatar">
            <Avatar name={senderName || "Member"} size="sm" />
          </span>
        ))}

      <div
        className={cx(
          "msg__bubble",
          isMedia && "msg__bubble--media",
          isMedia && !text && "msg__bubble--media-only",
          kind && !isMedia && !text && "msg__bubble--file-only"
        )}
      >
        {showSender && (
          <span className="msg__sender" style={{ color: avatarColor(senderName || "Member") }}>
            {senderName || "Member"}
          </span>
        )}

        {replyTo && (
          <div className="msg__quote">
            <span className="msg__quote-author">{replyAuthor(replyTo, selfId)}</span>
            <span className="msg__quote-text">{replyPreviewText(replyTo)}</span>
          </div>
        )}

        {kind && (
          <Attachment
            kind={kind}
            url={fileUrl}
            name={fileName}
            type={fileType}
            onOpenImage={onOpenImage}
            onMediaLoad={onMediaLoad}
          />
        )}

        {text && (
          <p className="msg__text">
            {text}
            <span className="msg__time-spacer" aria-hidden="true" />
          </p>
        )}

        <time className="msg__time">{formatTime(time)}</time>
      </div>

      <div className="msg__actions">
        <button
          type="button"
          className="msg__action"
          onClick={() => onReply(message)}
          aria-label="Reply"
          title="Reply"
        >
          <Icon name="reply" size={16} />
        </button>
        {text && (
          <button
            type="button"
            className="msg__action"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy text"}
            title={copied ? "Copied" : "Copy"}
          >
            <Icon name={copied ? "check" : "copy"} size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(MessageBubble);

import { cx } from "../../utils/format.js";
import Avatar from "../ui/Avatar.jsx";
import Icon from "../ui/Icon.jsx";
import "./ChatHeader.scss";

export default function ChatHeader({ conversation, status, isTyping, onBack, onOpenInfo }) {
  const isGroup = conversation.type === "group";
  const online = !isGroup && status === "online";

  let subtitle = "Group · View info";
  if (!isGroup) subtitle = isTyping ? "typing…" : online ? "Online" : "Offline";

  const identity = (
    <>
      <Avatar name={conversation.name} shape={isGroup ? "square" : "circle"} online={online} />
      <span className="chat-header__text">
        <span className="chat-header__name">{conversation.name}</span>
        <span
          className={cx(
            "chat-header__status",
            online && "chat-header__status--online",
            isTyping && "chat-header__status--typing"
          )}
        >
          {subtitle}
        </span>
      </span>
    </>
  );

  return (
    <header className="chat-header">
      <button
        type="button"
        className="icon-btn chat-header__back"
        onClick={onBack}
        aria-label="Back to conversations"
      >
        <Icon name="chevronLeft" />
      </button>

      {isGroup ? (
        <button type="button" className="chat-header__identity" onClick={onOpenInfo}>
          {identity}
        </button>
      ) : (
        <div className="chat-header__identity">{identity}</div>
      )}

      {isGroup && (
        <button
          type="button"
          className="icon-btn"
          onClick={onOpenInfo}
          aria-label="Group info"
          title="Group info"
        >
          <Icon name="info" />
        </button>
      )}
    </header>
  );
}

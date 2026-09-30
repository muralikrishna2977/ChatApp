import { APP_NAME, ASSET_BASE } from "../../config.js";
import Icon from "../ui/Icon.jsx";
import "./EmptyChat.scss";

export default function EmptyChat({ userName, onAddContact, onNewGroup }) {
  const firstName = userName?.split(" ")[0];

  return (
    <div className="empty-chat">
      <img className="empty-chat__logo" src={`${ASSET_BASE}assets/logo.png`} alt="" />
      <h2 className="empty-chat__title">
        {firstName ? `Welcome, ${firstName}` : `Welcome to ${APP_NAME}`}
      </h2>
      <p className="empty-chat__text">
        Pick a conversation from the list to start messaging, or reach out to someone new.
      </p>
      <div className="empty-chat__actions">
        <button type="button" className="btn btn--primary" onClick={onAddContact}>
          <Icon name="userPlus" size={18} />
          Add contact
        </button>
        <button type="button" className="btn btn--secondary" onClick={onNewGroup}>
          <Icon name="users" size={18} />
          New group
        </button>
      </div>
    </div>
  );
}

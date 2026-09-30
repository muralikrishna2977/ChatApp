import { memo, useState } from "react";
import { cx } from "../../utils/format.js";
import { conversationKey } from "../../utils/messages.js";
import Avatar from "../ui/Avatar.jsx";
import Icon from "../ui/Icon.jsx";
import { FILTERS } from "./filters.js";
import "./ConversationList.scss";

function ConversationItem({ name, subtitle, online, shape, active, unread, onClick }) {
  return (
    <li>
      <button
        type="button"
        className={cx("conv", active && "conv--active")}
        onClick={onClick}
        aria-current={active ? "true" : undefined}
      >
        <Avatar name={name} shape={shape} online={online} />
        <span className="conv__body">
          <span className="conv__name">{name}</span>
          <span className={cx("conv__meta", online && "conv__meta--online")}>{subtitle}</span>
        </span>
        {unread > 0 && (
          <span className="badge" aria-label={`${unread} unread`}>
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>
    </li>
  );
}

function ListSkeleton() {
  return (
    <ul className="conv-list" aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="conv conv--skeleton">
          <span className="skeleton skeleton--circle" />
          <span className="conv__body">
            <span className="skeleton skeleton--line" />
            <span className="skeleton skeleton--line skeleton--short" />
          </span>
        </li>
      ))}
    </ul>
  );
}

function ConversationList({
  filter,
  contacts,
  groups,
  loading,
  activeKey,
  presence,
  unread,
  onSelect,
  onAddContact,
  onNewGroup,
}) {
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const matches = (name) => (name || "").toLowerCase().includes(search);

  const visibleContacts = filter === "groups" ? [] : contacts.filter((c) => matches(c.friend_name));
  const visibleGroups = filter === "contacts" ? [] : groups.filter((g) => matches(g.name));
  const title = FILTERS.find((f) => f.id === filter)?.label ?? "Chats";
  const hasAnything = contacts.length + groups.length > 0;
  const nothingVisible = visibleContacts.length + visibleGroups.length === 0;

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h1 className="sidebar__title">{title}</h1>
        <div className="sidebar__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onAddContact}
            aria-label="Add contact"
            title="Add contact"
          >
            <Icon name="userPlus" />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onNewGroup}
            aria-label="New group"
            title="New group"
          >
            <Icon name="plus" />
          </button>
        </div>
      </div>

      <div className="sidebar__search">
        <label className="search">
          <Icon name="search" size={16} />
          <span className="sr-only">Search conversations</span>
          <input
            type="search"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <div className="sidebar__list">
        {loading ? (
          <ListSkeleton />
        ) : nothingVisible ? (
          <div className="empty-state">
            <span className="empty-state__icon">
              <Icon name={search ? "search" : "users"} />
            </span>
            {search ? (
              <p className="empty-state__title">No results for “{query.trim()}”</p>
            ) : (
              <>
                <p className="empty-state__title">
                  {hasAnything ? `No ${title.toLowerCase()} yet` : "No conversations yet"}
                </p>
                <p className="empty-state__text">
                  Add a contact by email or create a group to start chatting.
                </p>
                <button type="button" className="btn btn--primary btn--sm" onClick={onAddContact}>
                  <Icon name="userPlus" size={16} />
                  Add contact
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {visibleContacts.length > 0 && (
              <section>
                {filter === "all" && <h2 className="sidebar__section">Direct messages</h2>}
                <ul className="conv-list">
                  {visibleContacts.map((contact) => {
                    const key = conversationKey("direct", contact.friend_id);
                    const online = presence[contact.friend_id] === "online";
                    return (
                      <ConversationItem
                        key={contact.friend_id}
                        name={contact.friend_name}
                        subtitle={online ? "Online" : "Offline"}
                        online={online}
                        active={activeKey === key}
                        unread={unread[key]}
                        onClick={() => onSelect("direct", contact.friend_id, contact.friend_name)}
                      />
                    );
                  })}
                </ul>
              </section>
            )}

            {visibleGroups.length > 0 && (
              <section>
                {filter === "all" && <h2 className="sidebar__section">Groups</h2>}
                <ul className="conv-list">
                  {visibleGroups.map((group) => {
                    const key = conversationKey("group", group.groupid);
                    const name = group.name || "Untitled group";
                    return (
                      <ConversationItem
                        key={group.groupid}
                        name={name}
                        subtitle="Group"
                        shape="square"
                        active={activeKey === key}
                        unread={unread[key]}
                        onClick={() => onSelect("group", group.groupid, name)}
                      />
                    );
                  })}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

export default memo(ConversationList);

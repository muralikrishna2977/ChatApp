import { cx } from "../../utils/format.js";
import Avatar from "../ui/Avatar.jsx";

// Checkbox list of contacts. `lockedIds` are shown checked and disabled (e.g. existing members).
export default function MemberPicker({ contacts, selected, onToggle, lockedIds, emptyText }) {
  if (contacts.length === 0) {
    return <p className="panel__muted">{emptyText || "You have no contacts yet."}</p>;
  }

  return (
    <ul className="member-list">
      {contacts.map((contact) => {
        const locked = lockedIds?.has(contact.friend_id) ?? false;
        return (
          <li key={contact.friend_id}>
            <label className={cx("member", "member--selectable", locked && "member--locked")}>
              <Avatar name={contact.friend_name} size="sm" />
              <span className="member__body">
                <span className="member__name">{contact.friend_name}</span>
                {locked && <span className="member__meta">Already a member</span>}
              </span>
              <input
                type="checkbox"
                className="member__check"
                checked={locked || selected.has(contact.friend_id)}
                disabled={locked}
                onChange={() => onToggle(contact.friend_id)}
              />
            </label>
          </li>
        );
      })}
    </ul>
  );
}

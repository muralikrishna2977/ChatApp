import { cx } from "../../utils/format.js";
import Drawer from "../ui/Drawer.jsx";
import AddContactSection from "./AddContactSection.jsx";
import NewGroupSection from "./NewGroupSection.jsx";
import ProfileSection from "./ProfileSection.jsx";
import "./Panels.scss";

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "add-contact", label: "Add contact" },
  { id: "new-group", label: "New group" },
];

// Left drawer for account actions: profile, adding contacts, creating groups.
export default function AccountDrawer({
  tab,
  onTabChange,
  onClose,
  email,
  displayName,
  contacts,
  onRenamed,
  onContactAdded,
  onGroupCreated,
}) {
  return (
    <Drawer side="left" title="Account" onClose={onClose}>
      <div className="segmented panel-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={cx("segmented__item", tab === t.id && "segmented__item--active")}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <ProfileSection
          email={email}
          displayName={displayName}
          onRenamed={onRenamed}
        />
      )}
      {tab === "add-contact" && (
        <AddContactSection
          selfEmail={email}
          contacts={contacts}
          onAdded={onContactAdded}
        />
      )}
      {tab === "new-group" && (
        <NewGroupSection contacts={contacts} onCreated={onGroupCreated} />
      )}
    </Drawer>
  );
}

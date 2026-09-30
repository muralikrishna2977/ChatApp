import React from "react";
import "./Contacts.scss";

// Returns initials for the text-avatar (first letter of each word, max 2)
function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// Deterministic hue from a string so every group keeps a consistent color
function nameToHue(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

const Contacts = React.memo(function Contacts({
  conOrGro,
  cga,
  contacts,
  reciverid,
  handleContactClick,
  groups,
  handleSingleGroupClick9,
  clickedGroupid,
}) {
  const showContacts = conOrGro === "contacts" || conOrGro === "";
  const showGroups = conOrGro === "groups" || conOrGro === "";

  return (
    <div className="contactsaddprofilename">
      <div className="Names_cga">
        <p>{cga}</p>
      </div>
      <div className="contacts">
        {showContacts && contacts.length > 0 && (
          <div className="section-header">Contacts</div>
        )}
        {showContacts &&
          contacts.map((contact) => (
            <div
              className={`singlecontact ${reciverid === contact.friend_id ? "singleContactSelected" : ""}`}
              onClick={() => handleContactClick(contact.friend_id, contact.friend_name)}
              key={contact.friend_id}
            >
              <img
                src={`${import.meta.env.BASE_URL}assets/profile.svg`}
                width="25px"
                height="25px"
                alt="Profile"
              />
              <p>{contact.friend_name}</p>
            </div>
          ))}

        {showGroups && groups.length > 0 && (
          <div className="section-header">Groups</div>
        )}
        {showGroups &&
          groups.map((group) => {
            const hue = nameToHue(group.name);
            const initials = getInitials(group.name);
            return (
              <div
                className={`singlegroup ${clickedGroupid === group.groupid ? "singlegroupSelected" : ""}`}
                key={group.groupid}
                onClick={() => handleSingleGroupClick9(group.groupid, group.name)}
              >
                <div
                  className="group-avatar"
                  style={{ background: `hsl(${hue}, 65%, 55%)` }}
                >
                  {initials}
                </div>
                <p className="group-name">{group.name}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
});

export default Contacts;

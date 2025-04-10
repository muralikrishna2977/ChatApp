import React from "react";
import "./Contacts.scss";

const Contacts = React.memo(function Contacts({cga, ocontacts, contacts, reciverid, handleContactClick, ogroup, groups, handleSingleGroupClick9, setClickedGroupName, clickedGroupid}) {
    return (

        <div className="contactsaddprofilename">
          <div className="Names_cga">
            <p>{cga}</p>
          </div>
          <div className="contacts">
            {ocontacts &&
              contacts.map((contact) => (
                <div
                  className={`singlecontact ${
                    reciverid === contact.friend_id
                      ? "singleContactSelected"
                      : ""
                  }`}
                  onClick={() =>
                    handleContactClick(contact.friend_id, contact.friend_name)
                  }
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
            {ogroup &&
              groups.map((group) => (
                <div
                  className={`singlegroup ${
                    clickedGroupid === group.groupid ? "singlegroupSelected" : ""
                  }`}
                  key={group.groupid}
                  onClick={() => {
                    handleSingleGroupClick9(group.groupid);
                    setClickedGroupName(group.name);
                  }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}assets/profile.svg`}
                    width="25px"
                    height="25px"
                    alt="Group"
                  />
                  <p>{group.name}</p>
                </div>
              ))}
          </div>
        </div>

    );
  });

export default Contacts;


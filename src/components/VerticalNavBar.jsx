import React, { forwardRef } from "react";
import "./VerticalNavBar.scss";

const VerticalNavBar = forwardRef(
  ({ setLeftmenuapper, setOcontacts, setOgroup, setCga }, buttonRef_s) => {
    return (
      <div className="virtical_options">
        <img
          className="applogo"
          src={`${import.meta.env.BASE_URL}assets/logo.png`}
          width="40px"
          height="40px"
        />
        <img
          className="menu_in_virnav"
          src={`${import.meta.env.BASE_URL}assets/menu.svg`}
          width="40px"
          height="40px"
          onClick={() => {
            setLeftmenuapper((prev) => !prev);
          }}
          ref={buttonRef_s}
        />
        <div className="virtical_options1">
          <img
            src={`${import.meta.env.BASE_URL}assets/all.svg`}
            width="38px"
            height="38px"
            onClick={() => {
              setOcontacts(true);
              setOgroup(true);
              setCga("Chats");
            }}
          />
          <img
            src={`${import.meta.env.BASE_URL}assets/contacts.svg`}
            width="45px"
            height="45px"
            onClick={() => {
              setOcontacts(true);
              setOgroup(false);
              setCga("Contacts");
            }}
          />
          <img
            src={`${import.meta.env.BASE_URL}assets/groupVirtical.svg`}
            width="40px"
            height="40px"
            onClick={() => {
              setOcontacts(false);
              setOgroup(true);
              setCga("Groups");
            }}
          />
        </div>
      </div>
    );
  }
);

export default React.memo(VerticalNavBar);

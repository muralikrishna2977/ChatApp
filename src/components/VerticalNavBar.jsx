import React, { forwardRef } from "react";
import "./VerticalNavBar.scss";
import { useState } from "react";

const VerticalNavBar = forwardRef(
  ({ leftmenuapper, setLeftmenuapper, setConOrGro, setCga, clickedOption, setClickedOption}, buttonRef_s) => {

    // const [clickedOption, setClickedOption]=useState("");
    return (
      <div className="virtical_options">
        <div className="hoverLogo">
          <img
            src={`${import.meta.env.BASE_URL}assets/logo.png`}
            width="40px"
            height="40px"
          />
        </div>

        <div 
          // className="hoverMenu" 
          className={leftmenuapper?"hoverMenu hoverBorder":"hoverMenu"}
          onClick={() => {
            setLeftmenuapper((prev) => !prev);

            // setClickedOption((prev)=>prev==="1"?"":"1");
          }}
        >
          <img
            ref={buttonRef_s}
            className="menu_in_virnav"
            src={`${import.meta.env.BASE_URL}assets/menu.svg`}
            width="40px"
            height="40px"
          />
        </div>

        <div className="virtical_options1">
          <div 
            // className="hoverAll"
            className={clickedOption==="2"?"hoverAll hoverBorder":"hoverAll"}
            onClick={() => {
                setConOrGro("");
                setCga("Chats");
                setClickedOption((prev)=>prev==="2"?"":"2");
              }}
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/all.svg`}
              width="38px"
              height="38px"
            />
          </div>

          <div 
            // className="hoverContacts"
            className={clickedOption==="3"?"hoverContacts hoverBorder":"hoverContacts"}
            onClick={() => {
                setConOrGro("contacts");
                setCga("Contacts");
                setClickedOption((prev)=>prev==="3"?"":"3");
              }}
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/contacts.svg`}
              width="45px"
              height="45px"
            />
          </div>

          <div 
            // className="hoverGroups"
            className={clickedOption==="4"?"hoverGroups hoverBorder":"hoverGroups"}
            onClick={() => {
                setConOrGro("groups");
                setCga("Groups");
                setClickedOption((prev)=>prev==="4"?"":"4");
              }}
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/groupVirtical.svg`}
              width="40px"
              height="40px"
            />
          </div>

        </div>
      </div>
    );
  }
);

export default React.memo(VerticalNavBar);
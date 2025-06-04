import React from "react";
import "./Welcome.scss";

const Welcome=() => {
  

  return (
    <div className="chatarea_nc">
        <img
            className="menu_in_virnav"
            src={`${import.meta.env.BASE_URL}assets/logo.png`}
            width="100px"
            height="100px"
            alt="Logo"
        />
        <h3>Welcome to We Chat</h3>
    </div>  
  );
};

export default Welcome;
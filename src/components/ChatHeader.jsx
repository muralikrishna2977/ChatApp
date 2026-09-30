import React from "react";
import { BounceLoader } from "react-spinners";

function ChatHeader({
  isitGroup,
  friendname,
  clickedGroupName,
  onlineOfflineStatus,
  reciverid,
  loading,
  setTopmenuopen,
  buttonRef,
  isTyping,
}) {
  return (
    <div className="statusonof">
      {isitGroup ? (
        <>
          <p
            className="friendname"
            onClick={() => setTopmenuopen((prev) => !prev)}
            ref={buttonRef}
          >
            {clickedGroupName}
          </p>
          <div></div>
        </>
      ) : (
        <>
          <p className="friendname">{friendname}</p>
          <p className={`onlineofline ${isTyping ? "typing-indicator" : ""}`}>
            {isTyping ? "typing..." : onlineOfflineStatus[reciverid] || "offline"}
          </p>
        </>
      )}

      {loading && (
        <div
          style={{
            position: "absolute",
            top: "160%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <BounceLoader color="#6FA5DB" />
        </div>
      )}
    </div>
  );
}

export default ChatHeader;

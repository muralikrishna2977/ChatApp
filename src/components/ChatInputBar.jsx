import React from "react";
import { AnimatePresence } from "framer-motion";
import BottemPopup from "./BottemPopup.jsx";
import FilePopup from "./FilePopup.jsx";
import "./ChatInputBar.scss";

function ChatInputBar({
  sendmessage,
  setSendmessage,
  file,
  setFile,
  filetype,
  caption,
  setCaption,
  openFileTypes,
  setOpenFileTypes,
  textareaRef,
  imageInputRef,
  videoInputRef,
  docInputRef,
  buttonRef_down,
  popupRef_down,
  handleSendForChat,
  handleFileChange,
  handleTyping,
  replyTo,
  setReplyTo,
}) {
  function replyPreviewText(rt) {
    if (!rt) return "";
    if (rt.fileType?.startsWith("image/")) return "[Image]";
    if (rt.fileType?.startsWith("video/")) return "[Video]";
    if (rt.fileType === "application/pdf") return "[PDF]";
    return rt.text || "";
  }

  return (
    <div className="typemessage">
      <AnimatePresence>
        {file && filetype && (
          <BottemPopup
            file={file}
            setFile={setFile}
            handleSendForChat={handleSendForChat}
            caption={caption}
            setCaption={setCaption}
            filetype={filetype}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openFileTypes && (
          <FilePopup
            popupRef_down={popupRef_down}
            imageInputRef={imageInputRef}
            videoInputRef={videoInputRef}
            docInputRef={docInputRef}
          />
        )}
      </AnimatePresence>

      <input
        type="file"
        ref={imageInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="image/*"
      />
      <input
        type="file"
        ref={videoInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="video/*"
      />
      <input
        type="file"
        ref={docInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt"
      />

      {/* Reply preview banner */}
      {replyTo && (
        <div className="reply-preview-bar">
          <div className="reply-preview-content">
            <span className="reply-preview-sender">{replyTo.senderName}</span>
            <span className="reply-preview-text">{replyPreviewText(replyTo)}</span>
          </div>
          <button className="reply-preview-cancel" onClick={() => setReplyTo(null)} title="Cancel reply">
            ✕
          </button>
        </div>
      )}

      <img
        ref={buttonRef_down}
        src={`${import.meta.env.BASE_URL}assets/attach.svg`}
        width="25px"
        height="25px"
        alt="Attach"
        onClick={() => setOpenFileTypes((prev) => !prev)}
        style={{ cursor: "pointer" }}
      />

      <textarea
        style={{
          height: "50px",
          paddingTop: "13px",
          paddingBottom: "10px",
          lineHeight: "20px",
          fontSize: "16px",
        }}
        className="textArea"
        ref={textareaRef}
        placeholder="Type a message"
        value={sendmessage}
        onChange={(e) => {
          setSendmessage(e.target.value);
          handleTyping();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendForChat();
          }
        }}
      />

      <img
        src={`${import.meta.env.BASE_URL}assets/send1.svg`}
        width="40px"
        height="40px"
        onClick={handleSendForChat}
        style={{ cursor: "pointer" }}
        alt="Send"
      />
    </div>
  );
}

export default ChatInputBar;

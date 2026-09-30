import React, { useMemo, useEffect } from "react";
import "./BottemPopup.scss";
import { motion } from "framer-motion";

function BottemPopup({ file, setFile, handleSendForChat, caption, setCaption, filetype }) {
  // Create object URL once per file and revoke it on cleanup to prevent memory leaks
  const fileUrl = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => {
    return () => URL.revokeObjectURL(fileUrl);
  }, [fileUrl]);

  function handleClose() {
    setFile(null);
    setCaption("");
  }

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "tween", duration: 0.2 }}
      className="reviewImage bottomsidemenu fixed bottom-0 left-0 w-full h-64 bg-white shadow-lg p-4"
    >
      <div className="closeReview">
        <div></div>
        <img
          onClick={handleClose}
          height="20px"
          width="20px"
          src={`${import.meta.env.BASE_URL}assets/close.svg`}
          alt="Close"
        />
      </div>

      {file && filetype.startsWith("image/") && (
        <img
          src={fileUrl}
          alt="Selected"
          style={{
            border: "solid 1px rgb(194, 192, 192)",
            maxWidth: "600px",
            maxHeight: "300px",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />
      )}

      {file && filetype.startsWith("video/") && (
        <video
          style={{
            maxWidth: "600px",
            maxHeight: "300px",
            width: "100%",
            height: "100%",
            borderRadius: "4px",
            border: "solid 5px #9ddcfb",
            cursor: "pointer",
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          <source src={fileUrl} type={filetype} />
        </video>
      )}

      {file && filetype === "application/pdf" && (
        <iframe src={fileUrl} width="100%" height="300px" title="PDF preview" />
      )}

      <div className="captionSend">
        <textarea
          placeholder="Caption"
          onChange={(e) => setCaption(e.target.value)}
          value={caption}
        />
        <img
          onClick={handleSendForChat}
          src={`${import.meta.env.BASE_URL}assets/send1.svg`}
          height="30px"
          width="30px"
          alt="Send"
        />
      </div>
    </motion.div>
  );
}

export default BottemPopup;

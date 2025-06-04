import React from "react";
import { motion } from "framer-motion";

import "./FilePopup.scss";

function FilePopup({popupRef_down, imageInputRef, videoInputRef, docInputRef}) {

  return (
    <motion.div
        ref={popupRef_down}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.2 }}
        className="fileTypes"
    >
        <div
            className="fileTypeButton"
            onClick={() => imageInputRef.current.click()}
        >
            <img
            src={`${import.meta.env.BASE_URL}assets/images.svg`}
            width="25px"
            height="25px"
            alt="Images"
            />
            <p>Images</p>
        </div>
        <div
            className="fileTypeButton"
            onClick={() => videoInputRef.current.click()}
        >
            <img
            src={`${import.meta.env.BASE_URL}assets/video.svg`}
            width="25px"
            height="25px"
            alt="Videos"
            />
            <p>Videos</p>
        </div>
        <div
            className="fileTypeButton"
            onClick={() => docInputRef.current.click()}
        >
            <img
            src={`${import.meta.env.BASE_URL}assets/document.svg`}
            width="25px"
            height="25px"
            alt="Documents"
            />
            <p>Documents</p>
        </div>
    </motion.div>
  );
}

export default FilePopup;
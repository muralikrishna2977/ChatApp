import React, {useState} from "react";
import "./BottemPopup.scss";
import { motion } from "framer-motion";


function BottemPopup({file, setFile, handleSendForChat, caption, setCaption, filetype}) {
    const fileUrl = URL.createObjectURL(file); // Create a temporary URL

    function handleClose(){
        setFile(null);
        setCaption("");
    }
  return (
    <motion.div 
        initial={{ y: "100%" }} // Start completely off-screen (bottom)
        animate={{ y: 0 }} // Slide in to position
        exit={{ y: "100%" }} // Slide out when hidden
        transition={{ type: "tween", duration: 0.2 }} // Smooth transition
        className="reviewImage bottomsidemenu fixed bottom-0 left-0 w-full h-64 bg-white shadow-lg p-4"
    >
        <div className="closeReview">
            <div></div>
            <img onClick={handleClose} height="20px" width="20px" src={`${import.meta.env.BASE_URL}assets/close.svg`}/>
        </div>

        {file && filetype.startsWith("image/") && (
            <img 
                src={fileUrl} 
                alt="Selected" 
                style={{
                    border: "solid 1px rgb(194, 192, 192)",
                    maxWidth: "600px",
                    maxHeight: "300px",
                    width: "100%", // Ensures it scales within the max width 
                    height: "100%", // Ensures it scales within the max height
                    objectFit: "cover", // Crops left & right to maintain aspect ratio
                    cursor: "pointer", // Makes it clear that the image is clickable
                }}
            />
        )}

        {file && filetype.startsWith("video/") && (
            <video 
                // controls
                style={{
                    maxWidth: "600px",
                    maxHeight: "300px",
                    width: "100%", // Ensures it scales within the max width 
                    height: "100%", // Ensures it scales within the max height
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

            <iframe
                src={fileUrl}
                width="100%" 
                height="300px"  
            />

        )}

        <div className="captionSend">
            <textarea placeholder="Caption" onChange={(event) =>setCaption(event.target.value)} value={caption} />
            <img onClick={handleSendForChat} src={`${import.meta.env.BASE_URL}assets/send1.svg`} height="30px" width="30px" />
        </div>
    </motion.div>
  );
}

export default BottemPopup;
















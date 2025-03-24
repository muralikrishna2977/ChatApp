import React from "react";
import "./EachChatForGroup.scss";

function EachChatForGroup({ message, user_id, sender_id, name, time, fileUrl, filename, fileType }) {
  function convertMicroEpochToIST(microEpoch) {
    const date = new Date(Number(microEpoch) / 1000); 
    return date.toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  }


  return (

    <div className="eachmessage_g">
      {user_id === sender_id ? (
        <div className="sent_message_g">
          <div></div>

          <div className="files_sent">
            {fileUrl && fileType.startsWith("image/") && (
              <div className="image_time_image">
                <img  
                  style={{
                    maxWidth: "400px", 
                    maxHeight: "300px",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "4px",
                    border: "solid 5px #55C2F8",
                    cursor: "pointer",
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                    borderBottom:0,
                  }}
                  src={fileUrl} 
                  alt="Uploaded"
                  onClick={() => window.open(fileUrl, "_blank")} 
                />
                <div className="captionTime_image">
                  <p className="chat_caption_image">{message}</p>
                  <p className="caption_time_image">{convertMicroEpochToIST(time)}</p>
                </div>
              </div>
            )}

            {fileUrl && fileType.startsWith("video/") && (
              <div className="image_time_video">
                <video 
                  controls
                  style={{
                    maxWidth: "400px", 
                    maxHeight: "300px",
                    width: "100%",
                    height: "100%",
                    borderRadius: "4px",
                    border: "solid 5px #55C2F8",
                    cursor: "pointer",
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                >
                  <source src={fileUrl} type={fileType} />

                </video>
                <div className="captionTime_video">
                  <p className="chat_caption_video">{message}</p>
                  <p className="caption_time_video">{convertMicroEpochToIST(time)}</p>
                </div>
              </div>
            )}

            {fileUrl && fileType === "application/pdf" && (
              <div className="image_time_file">
                <div className="pdfAndOpen">
                  <div className="pdfSymbolName">
                      <img src={`${import.meta.env.BASE_URL}assets/pdf.svg`} width="30px" height="30px" />
                      {filename}
                  </div>
                  
                
                  <div className="openButtondiv">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                     
                    >
                      Open
                    </a>
                    <div></div>
                  </div>
                </div>

                <div className="captionTime_fi">
                  <p className="chat_caption_fi">{message}</p>
                  <p className="caption_time_fi">{convertMicroEpochToIST(time)}</p>
                </div>
              </div>
            )}


            {!fileUrl && 
              <div className="message_time_sr">
                <p className="message_sr">{message}</p>
                <p className="time_sr">{convertMicroEpochToIST(time)}</p>
              </div>
            }
          </div>
          
        </div>
      ) : (
        <div className="received_message_g"> 

          {/* <div className="messageTimeImage">

            <div className="messageTimeGroup">
              <p className="sent_name_g">{name} <span className="timestamp_g">{convertMicroEpochToIST(time)}</span></p>
              <p>{message}</p>
            </div>
            {fileUrl && fileType === "image/png" && 
            <img 
              style={{
                maxWidth: "400px",
                maxHeight: "300px",
                width: "100%", // Ensures it scales within the max width
                height: "100%", // Ensures it scales within the max height
                objectFit: "cover", // Crops left & right to maintain aspect ratio
                borderRadius: "4px", // Optional, for rounded corners
                border: "solid 5px #55C2F8",
                cursor: "pointer", // Makes it clear that the image is clickable
              }}
              src={fileUrl} alt="Uploaded" 
              onClick={() => window.open(fileUrl, "_blank")}
            />}

          </div> */}


          <div className="files_recive">

            {fileUrl && fileType.startsWith("image/") && (
              <div className="image_time_image">
                <div className="name_time_g_re">
                  <p className="sent_name_g">{name}</p>
                  <p className="caption_time_image">{convertMicroEpochToIST(time)}</p>
                </div>

                <img  
                  style={{
                    maxWidth: "400px", 
                    maxHeight: "300px",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    border: "solid 5px #55C2F8",
                    cursor: "pointer",
                  }}
                  src={fileUrl} 
                  alt="Uploaded"
                  onClick={() => window.open(fileUrl, "_blank")} 
                />
                <div className="captionTime_image">
                  <p className="chat_caption_image">{message}</p>
                </div>
              </div>
            )}

            {fileUrl && fileType.startsWith("video/") && (
              <div className="image_time_video">
                <div className="name_time_g_re">
                  <p className="sent_name_g">{name}</p>
                  <p className="caption_time_image">{convertMicroEpochToIST(time)}</p>
                </div>

                <video 
                  controls
                  style={{
                    maxWidth: "400px", 
                    maxHeight: "300px",
                    width: "100%",
                    height: "100%",
                    border: "solid 5px #55C2F8",
                    cursor: "pointer",
                  }}
                >
                  <source src={fileUrl} type={fileType} />
                  
                </video>
                <div className="captionTime_video">
                  <p className="chat_caption_video">{message}</p>
                </div>
              </div>
            )}

            {fileUrl && fileType === "application/pdf" && (
              <div className="image_time_file">

                <div className="name_time_g_re">
                  <p className="sent_name_g">{name}</p>
                  <p className="caption_time_image">{convertMicroEpochToIST(time)}</p>
                </div>

                <div className="pdfAndOpen">
                  <div className="pdfSymbolName">
                      <img src={`${import.meta.env.BASE_URL}assets/pdf.svg`} width="30px" height="30px" />
                      {filename}
                  </div>
                  
                
                  <div className="openButtondiv">
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    
                    >
                      Open
                    </a>
                    <div></div>
                  </div>
                </div>

                <div className="captionTime_fi">
                  <p className="chat_caption_fi">{message}</p>
                </div>
              </div>
            )}

            {!fileUrl && 
              <div className="message_time_sr">
                <div className="name_time_g_re">
                  <p className="sent_name_g">{name}</p>
                  <p className="caption_time_image">{convertMicroEpochToIST(time)}</p>
                </div>
                <p className="message_group_recive">{message}</p>
              </div>
            }
          </div>

          <div></div>
        </div>
      )}
    </div>
  );
}

export default EachChatForGroup;
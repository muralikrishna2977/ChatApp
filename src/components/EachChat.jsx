import React from "react";
import "./EachChat.scss";

function EachChat({ messageSenderid, messageReciverid, message, receiverid, time, fileUrl, filename, fileType}) {
  function convertMicroEpochToIST(microEpoch) {
    const date = new Date(Number(microEpoch) / 1000); // Convert BigInt to Number
    return date.toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }); 
  }

  return (
    <div className="eachmessage">
      {messageReciverid===receiverid ? (
        <div className="sent-message">
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
                    border: "solid 5px #72d0ff",
                    cursor: "pointer",
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
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
                    border: "solid 5px #72d0ff",
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
        <div className="received-message">
          <div className="files_recive">

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
                    border: "solid 5px #c7ecff",
                    cursor: "pointer",
                    borderBottomRightRadius: 0,
                    borderBottomLeftRadius: 0,
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
                    border: "solid 5px #c7ecff",
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

          <div></div>
        </div>
      )}
    </div>
  );
}

export default EachChat;
















import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import EachChat from "./EachChat.jsx";
import LeftMenu from "./LeftMenu.jsx";
import BottemPopup from "./BottemPopup.jsx";
import EachChatForGroup from "./EachChatForGroup.jsx";
import TopMenu from "./TopMenu.jsx";
import Contacts from "./Contacts.jsx";
import VerticalNavBar from "./VerticalNavBar.jsx";
import Welcome from "./Welcome.jsx";
import FilePopup from "./FilePopup.jsx";

import axios from "axios";
import io from "socket.io-client";
import "./Chat.scss";
import { AnimatePresence } from "framer-motion";
import { BounceLoader } from 'react-spinners';
import { API_URL } from "../App.jsx";

function Chat() {
  const location = useLocation();
  const userData = location.state?.user;
  const senderid = userData.user_id;
  const email = userData.email;
  const sendername = userData.name;

  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [sendmessage, setSendmessage] = useState("");
  const [error, setError] = useState("");
  const [reciverid, setReciverid] = useState("");
  const [socket, setSocket] = useState(null);
  const [openinput, setOpeninput] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentchat, setCurrentchat] = useState([]);
  const [onlineOfflineStatus, setOnlineOfflineStatus] = useState({});
  const [friendname, setFriendname] = useState("");
  const [leftmenuapper, setLeftmenuapper] = useState(false);
  const [topmenuopen, setTopmenuopen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [clickedGroupid, setClickedGroupid] = useState("");
  const [clickedGroupName, setClickedGroupName] = useState("");
  const [isitGroup, setIsitGroup] = useState(false);
  const [cga, setCga] = useState("Chats");
  const [name, setName]=useState("");

  const [conOrGro, setConOrGro]=useState("");
  const [clickedOption, setClickedOption]=useState("");

  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  const popupRef_s = useRef(null);
  const buttonRef_s = useRef(null);

  const popupRef_down = useRef(null);
  const buttonRef_down = useRef(null);

  const chatContainerRef = useRef(null);
  const lastMessageLengthRef = useRef(null);
  const textareaRef = useRef(null);
  const lastTimeStamp = useRef(null);
  const lastTimeforgroup = useRef(null);

  const previousScrollHeight = useRef(null);
  const previousScrollTop = useRef(null);
  const initialScrollIndicator = useRef(0);
  // const fileInputRef = useRef(null);

  const docInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [filetype, setFiletype] = useState("");
  const [filename, setFilename] = useState("");
  const [caption, setCaption] = useState("");
  const [openFileTypes, setOpenFileTypes] = useState(false);


  
  useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await axios.post(`${API_URL}/contacts`, {senderid});
        setContacts(response.data.contacts);
        setClickedOption("2");

        const respons = await axios.post(`${API_URL}/getgroups`, {senderid});
        setGroups(respons.data.groups);

        const respon = await axios.post(`${API_URL}/getname`, { senderid });
        setName(respon.data.name);

        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    }
    fetchContacts();
  }, [senderid]);

  
  // Initialize websocket connection
  useEffect(() => {
    if (userData) {
      const newSocket = io(API_URL, {
        transports: ["websocket"],
      });
      setSocket(newSocket);
      newSocket.emit("register_user", senderid);
      return () => {
        newSocket.disconnect();
      };
    }
  }, [userData]);


  useEffect(() => {
    async function loadmessagesforChatInitial() {
      if (!reciverid) return;
      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}/gethistoryinitial`, {
          senderid,
          reciverid,
        });
        const len = response.data.history.length;
        if(len>0){
          lastTimeStamp.current = response.data.history[len - 1].time;
          lastMessageLengthRef.current = response.data.history.length;
          setHistory(response.data.history.reverse());
        }
        // setLoading(false);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }

    }
    loadmessagesforChatInitial();
  }, [reciverid]);


  // Function to fetch older messages for chat
  async function loadOlderMessagesForChat() {
    if (!chatContainerRef.current) return;

    try {
      const chatContainer = chatContainerRef.current;
      previousScrollHeight.current = chatContainer.scrollHeight;
      previousScrollTop.current = chatContainer.scrollTop;
      setLoading(true);
      const response = await axios.post(`${API_URL}/gethistory`, {
        senderid,
        reciverid,
        time: lastTimeStamp.current,
      });

      const len = response.data.history.length;
      if(len>0){
        lastTimeStamp.current = response.data.history[len - 1].time;
        lastMessageLengthRef.current = response.data.history.length;
        setHistory((prevHistory) => [
          ...response.data.history.reverse(),
          ...prevHistory,
        ]);
      }

      // setLoading(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (chatContainerRef.current && previousScrollHeight.current !== null) {
      const chatContainer = chatContainerRef.current;
      const newScrollHeight = chatContainer.scrollHeight;
      chatContainer.scrollTop =
        newScrollHeight - previousScrollHeight.current + previousScrollTop.current;
    }
  }, [history]);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    if (isitGroup) {
      loadmessagesforGroupInitial();
    }
    
    async function loadmessagesforGroupInitial() {
      try {
        setLoading(true);
        const groupid = clickedGroupid;
        const response = await axios.post(`${API_URL}/createroomforgroupandfetchhistory`, {
          groupid,
          senderid,
        });
  
        const len = response.data.history.length;
        if(len>0){
          lastTimeforgroup.current = response.data.history[len - 1].sent_time;
          lastMessageLengthRef.current = response.data.history.length;
          setHistory(response.data.history.reverse());
        }

        // setLoading(false);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      } finally{
        setLoading(false);
      }
    }

  }, [clickedGroupid, isitGroup]);

  

  async function loadmessagesforGroup() {
    try {
      const groupid = clickedGroupid;
      const chatContainer = chatContainerRef.current;
      previousScrollHeight.current = chatContainer.scrollHeight;
      previousScrollTop.current = chatContainer.scrollTop;
      setLoading(true);
      const response = await axios.post(`${API_URL}/fetchhistoryforgroup`, {
        groupid,
        time: lastTimeforgroup.current,
      });

      const len = response.data.history.length;

      if(len>0){
        lastTimeforgroup.current = response.data.history[len - 1].sent_time;
        lastMessageLengthRef.current = response.data.history.length;
        setHistory((prevHistory) => [
          ...response.data.history.reverse(),
          ...prevHistory,
        ]);
      }
      // setLoading(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally{
      setLoading(false);
    }
  }

  const handleContactClick = useCallback((id, name) => {
    if(reciverid===id){
      return;
    } else{
      initialScrollIndicator.current = 1;
      setHistory([]);
      setCurrentchat([]);
      setIsitGroup(false);
      setOpeninput(true);
      setFriendname(name);
      setReciverid(id);
      setClickedGroupid("");
    }
   
  }, [reciverid]);

  const handleSingleGroupClick9 = useCallback((groupid, groupname) => {
    if(clickedGroupid===groupid){
      return;
    }
    initialScrollIndicator.current = 1;
    setClickedGroupid(groupid);
    setClickedGroupName(groupname);
    setIsitGroup(true);
    setReciverid("");
    setCurrentchat([]);
    setHistory([]);
    setOpeninput(true);
  }, [clickedGroupid]);

  useEffect(() => {
    if (!chatContainerRef.current) return;
    const chatContainer = chatContainerRef.current;
    chatContainer.addEventListener("scroll", handleScroll);
    return () =>
      chatContainer.removeEventListener("scroll", handleScroll);
  }, [reciverid, clickedGroupid]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const chatContainer = chatContainerRef.current;
    if (
      chatContainer.scrollTop === 0 &&
      lastMessageLengthRef.current >= 15
    ) {
      initialScrollIndicator.current = 0;
      if (!isitGroup) {
        loadOlderMessagesForChat();
      } else {
        loadmessagesforGroup();
      }
    }
  };

  useEffect(() => {
    if (!chatContainerRef.current) return;
    if (initialScrollIndicator.current === 1) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);
  
  useEffect(() => {
    const onClickOutside = (e) => {
      if (
        popupRef.current &&
        buttonRef.current &&
        !popupRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setTopmenuopen(false);
      }
  
      if (
        popupRef_down.current &&
        buttonRef_down.current &&
        !popupRef_down.current.contains(e.target) &&
        !buttonRef_down.current.contains(e.target)
      ) {
        setOpenFileTypes(false);
      }
  
      if (
        popupRef_s.current &&
        buttonRef_s.current &&
        !popupRef_s.current.contains(e.target) &&
        !buttonRef_s.current.contains(e.target)
      ) {
        setLeftmenuapper(false);
      }
    };
  
    if (topmenuopen || openFileTypes || leftmenuapper) {
      document.addEventListener("mousedown", onClickOutside);
    } else {
      document.removeEventListener("mousedown", onClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [topmenuopen, openFileTypes, leftmenuapper]);

  // Receive normal messages via socket
  useEffect(() => {
    if (!socket) return;
    socket.on("recived_message", (data) => {
      if (!isitGroup && reciverid === data.senderid) {
        setCurrentchat((prevChats) => [...prevChats, data]);
      }
    });
    return () => {
      socket.off("recived_message");
    };
  }, [socket, reciverid, isitGroup]);

  // Receive group messages via socket
  useEffect(() => {
    if (!socket) return;
    socket.on(
      "receive-group-message",
      ({ senderid: sender_id, sendername, message, timestamp, roomId, fileUrl, fileType, fileName }) => {
        const obj = {
          message: message,
          user_id: senderid,
          sender_id: sender_id,
          name: sendername,
          time: timestamp,
          fileUrl,
          filename: fileName,
          fileType,
        };
        if (roomId === clickedGroupid && isitGroup) {
          setCurrentchat((prevChat) => [...prevChat, obj]);
        }
      }
    );
    return () => {
      socket.off("receive-group-message");
    };
  }, [socket, isitGroup, clickedGroupid]);

  useEffect(() => {
    if (!socket) return;
    const handleStatusUpdate = (data) => {
      setOnlineOfflineStatus((prevStatus) => ({
        ...prevStatus,
        [data.userId]: data.status,
      }));
    };
    socket.on("selfstatus", handleStatusUpdate);
    return () => {
      socket.off("selfstatus");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    const handleStatusUpdate = (data) => {
      setOnlineOfflineStatus((prevStatus) => ({
        ...prevStatus,
        [data.userId]: data.status,
      }));
    };
    socket.on("onofstatus", handleStatusUpdate);
    return () => {
      socket.off("onofstatus", handleStatusUpdate);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket || !reciverid) return;
    socket.emit("onlineofflinestatus", reciverid);
  }, [socket, reciverid]);


  const handleSendForChat = useCallback(async () => {
    let uploadedFileUrl = null;
    let uploadedFileType = filetype;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        uploadedFileUrl = response.data.url;
      } catch (error) {
        console.error("Upload Error:", error);
        return;
      }
    }
    const time = (BigInt(Date.now()) * BigInt(1000)).toString();
    if (isitGroup) {
      const obj = {
        message: sendmessage || caption,
        user_id: senderid,
        sender_id: senderid,
        name: sendername,
        time: time,
        fileUrl: uploadedFileUrl || null,
        fileType: uploadedFileType || null,
        filename: filename,
      };
      setCurrentchat((prevChats) => [...prevChats, obj]);
      if (chatContainerRef.current) {
        setTimeout(() => {
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
          });
        }, 100);
      }
      socket.emit("send-group-message", {
        clickedGroupid,
        senderid,
        sendmessage: sendmessage || caption,
        time,
        sendername,
        fileUrl: uploadedFileUrl || null,
        fileType: uploadedFileType || null,
        filename: filename,
      });
    } else {
      try {
        await axios.post(`${API_URL}/sendmessageinchat`, {
          senderid,
          reciverid,
          sendmessage: sendmessage || caption,
          time,
          fileUrl: uploadedFileUrl || null,
          fileType: uploadedFileType || null,
          filename: filename,
        });
        const obj = {
          sendmessage: sendmessage || caption,
          senderid,
          reciverid,
          time,
          fileUrl: uploadedFileUrl || null,
          fileType: uploadedFileType || null,
          filename: filename,
        };
        setCurrentchat((prevChats) => [...prevChats, obj]);
        setError("");
        if (chatContainerRef.current) {
          setTimeout(() => {
            chatContainerRef.current.scrollTo({
              top: chatContainerRef.current.scrollHeight,
            });
          }, 100);
        }
      } catch (err) {
        console.error("Message Send Error:", err);
        setError(err.response?.data?.message || "An error occurred");
      }
    }
    setSendmessage("");
    setFile(null);
    setFiletype(null);
    setCaption("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [file, filetype, filename, caption, sendmessage, isitGroup, clickedGroupid, reciverid, senderid, sendername]);

  const handleFileChange = useCallback((e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setFiletype(f.type);
    setFilename(f.name);
    setOpenFileTypes(false);
    e.target.value = "";
  }, []);

  return (
    <div className="chatapp_familycontainer">

      <VerticalNavBar 
        leftmenuapper={leftmenuapper}
        setLeftmenuapper={setLeftmenuapper} 
        setConOrGro={setConOrGro} 
        setCga={setCga} 
        ref={buttonRef_s}
        clickedOption={clickedOption}
        setClickedOption={setClickedOption}
      />

      <AnimatePresence>
        {leftmenuapper && (
          <LeftMenu
            senderid={senderid}
            email={email}
            contacts={contacts}
            setContacts={setContacts}
            setGroups={setGroups}
            name={name}
            setName={setName}
            ref={popupRef_s}
          />
        )}
      </AnimatePresence>

      <div className="contactsandmessages">

        <Contacts
          conOrGro={conOrGro} 
          cga={cga}  
          contacts={contacts} 
          reciverid={reciverid} 
          handleContactClick={handleContactClick} 
          groups={groups} 
          handleSingleGroupClick9={handleSingleGroupClick9} 
          clickedGroupid={clickedGroupid}
        />

        <div className="messagearea">
          <AnimatePresence>
            {topmenuopen && (
              <TopMenu
                contacts={contacts}
                clickedGroupName={clickedGroupName}
                clickedGroupid={clickedGroupid}
                ref={popupRef}
              />
            )}
          </AnimatePresence>

          {openinput &&
            (!isitGroup ? (
              <div className="statusonof">
                <p className="friendname">{friendname}</p>
                <p className="onlineofline">
                  {onlineOfflineStatus[reciverid] || "offline"}
                </p>

                {loading && (
                  <div style={{
                    position: 'absolute',
                    top: '160%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                  }}>
                    <BounceLoader color="#6FA5DB" />
                  </div>
                )}

              </div>
            ) : (
              <div className="statusonof">
                <p
                  className="friendname"
                  onClick={() => setTopmenuopen((prev) => !prev)}
                  ref={buttonRef}
                >
                  {clickedGroupName}
                </p>
                <div></div>

                {loading && (
                  <div style={{
                    position: 'absolute',
                    top: '160%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                  }}>
                    <BounceLoader color="#6FA5DB" />
                  </div>
                )}

              </div>
            ))}

          {openinput && (
            <div 
              className="chatarea" 
              ref={chatContainerRef}
             style={{ 
                backgroundImage: `url('${import.meta.env.BASE_URL}assets/background_enhanced3.jpg')`, 
                backgroundSize: "100% 100%", 
                backgroundPosition: "center", 
                backgroundRepeat: "no-repeat" 
              }}
            >
              {history.map((eachchat, index) =>
                !isitGroup ? (
                  <EachChat
                    key={index}
                    messageSenderid={eachchat.senderid}
                    messageReciverid={eachchat.reciverid}
                    message={eachchat.sendmessage || eachchat.caption}
                    receiverid={reciverid}
                    time={eachchat.time}
                    fileUrl={eachchat.fileUrl}
                    filename={eachchat.fileName}
                    fileType={eachchat.fileType}
                  />
                ) : (
                  <EachChatForGroup
                    key={index}
                    message={eachchat.message}
                    user_id={senderid}
                    sender_id={eachchat.sender_id}
                    name={eachchat.sender_name}
                    time={eachchat.sent_time}
                    fileUrl={eachchat.fileUrl}
                    filename={eachchat.fileName}
                    fileType={eachchat.fileType}
                  />
                )
              )}

              {currentchat.map((eachchat, index) =>
                !isitGroup ? (
                  <EachChat
                    key={index}
                    messageSenderid={eachchat.senderid}
                    messageReciverid={eachchat.reciverid}
                    message={eachchat.sendmessage || eachchat.caption}
                    receiverid={reciverid}
                    time={eachchat.time}
                    fileUrl={eachchat.fileUrl}
                    filename={eachchat.filename}
                    fileType={eachchat.fileType}
                  />
                ) : (
                  <EachChatForGroup
                    key={index}
                    message={eachchat.message}
                    user_id={eachchat.user_id}
                    sender_id={eachchat.sender_id}
                    name={eachchat.name}
                    time={eachchat.time}
                    fileUrl={eachchat.fileUrl}
                    filename={eachchat.filename}
                    fileType={eachchat.fileType}
                  />
                )
              )}

            </div>
          )}

          {openinput && (
            <div className="typemessage">

              <AnimatePresence>
                {file && filetype && filename && (
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
                        height: '50px',
                        paddingTop: '13px',
                        paddingBottom: '10px',
                        lineHeight: '20px',
                        fontSize: '16px',
                        // resize: 'none',
                      }}
                className="textArea"
                ref={textareaRef}
                placeholder="Type a message"
                value={sendmessage}
                onChange={(event) => setSendmessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
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
          )}

          {!openinput && (
            <Welcome />
          )}

        </div>
      </div>
    </div>
  );
}

export default Chat;

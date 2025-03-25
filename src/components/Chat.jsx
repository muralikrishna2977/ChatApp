// import React, { useState, useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";
// import EachChat from "./EachChat.jsx";
// import LeftMenu from "./LeftMenu.jsx";
// import BottemPopup from "./BottemPopup.jsx";
// import EachChatForGroup from "./EachChatForGroup.jsx";
// import TopMenu from "./TopMenu.jsx";
// import axios from "axios";
// import io from "socket.io-client";
// import "./Chat.scss";
// import { AnimatePresence } from "framer-motion";
// import { motion } from "framer-motion";

// function Chat() {
//   const location = useLocation();
//   const userData = location.state?.user;
//   const senderid = userData.user_id;
//   const email = userData.email;
//   const sendername = userData.name;

//   const [contacts, setContacts] = useState([]);
//   const [sendmessage, setSendmessage] = useState("");
//   const [error, setError] = useState("");
//   const [reciverid, setReciverid] = useState("");
//   const [socket, setSocket] = useState(null);
//   const [openinput, setOpeninput] = useState(false);
//   const [history, setHistory] = useState([]);
//   const [currentchat, setCurrentchat] = useState([]);
//   const [onlineOfflineStatus, setOnlineOfflineStatus] = useState({});
//   const [friendname, setFriendname] = useState("");
//   const [leftmenuapper, setLeftmenuapper] = useState(false);
//   const [topmenuopen, setTopmenuopen] = useState(false);
//   const [groups, setGroups] = useState([]);
//   const [clickedGroupid, setClickedGroupid] = useState("");
//   const [clickedGroupName, setClickedGroupName] = useState("");
//   const [isitGroup, setIsitGroup] = useState(false);
//   const [cga, setCga]=useState("Chats");
//   const [ogroup, setOgroup]=useState(true);
//   const [ocontacts, setOcontacts]=useState(true);

//   const popupRef = useRef(null);
//   const buttonRef = useRef(null);

//   const popupRef_s = useRef(null);
//   const buttonRef_s = useRef(null);

//   const popupRef_down = useRef(null);
//   const buttonRef_down = useRef(null);

//   const chatContainerRef = useRef(null);
//   const lastMessageLengthRef = useRef(null);
//   const textareaRef = useRef(null);
//   const lastTimeStamp=useRef(null);
//   const lastTimeforgroup=useRef(null);

//   const previousScrollHeight=useRef(null);
//   const previousScrollTop=useRef(null);
//   const initialScrollIndicator=useRef(0);
//   // const fileInputRef = useRef(null);

//   const docInputRef = useRef(null);
//   const videoInputRef = useRef(null);
//   const imageInputRef= useRef(null);

//   const [file, setFile] = useState(null);
//   // const [fileurl, setFileurl]=useState(null);
//   const [filetype, setFiletype]=useState("");
//   const [filename, setFilename]=useState("");
//   const [caption, setCaption]=useState("");
//   const [openFileTypes, setOpenFileTypes]=useState(false);

  

//   // Function to fetch older messages
//   async function loadOlderMessagesForChat() {
//     if (!chatContainerRef.current) return;

//     try {
//       const chatContainer = chatContainerRef.current;
//       // Save the distance from the bottom before fetching messages
//       previousScrollHeight.current = chatContainer.scrollHeight;
//       previousScrollTop.current = chatContainer.scrollTop;

//       const response = await axios.post("http://localhost:3000/gethistory", {
//         senderid,
//         reciverid,
//         time: lastTimeStamp.current, 
//       });

//       const len=response.data.history.length;
//       lastTimeStamp.current=response.data.history[len-1].time;
//       console.log(lastTimeStamp.current);

//       lastMessageLengthRef.current = response.data.history.length;
 
//       console.log("history ",response.data.history);
//       setHistory((prevHistory) => [
//         ...response.data.history.reverse(),
//         ...prevHistory,
//       ]);
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.message || "An error occurred");
//     }
//   }



//   useEffect(() => {
//     if (chatContainerRef.current && previousScrollHeight.current !== null) {
//       const chatContainer = chatContainerRef.current;
//       const newScrollHeight = chatContainer.scrollHeight;
//       chatContainer.scrollTop = newScrollHeight - previousScrollHeight.current + previousScrollTop.current;
//     }
//   }, [history]);

//   useEffect(() => {
//     if (!chatContainerRef.current) return;

//     if (isitGroup) {
//       loadmessagesforGroupInitial();
//     }
//   }, [clickedGroupid, isitGroup]);

//   async function loadmessagesforGroupInitial() {
//     try {
//       const groupid = clickedGroupid;
//       const response = await axios.post(
//         "http://localhost:3000/createroomforgroupandfetchhistory",
//         { groupid, senderid}
//       );

//       const len=response.data.history.length;
//       lastTimeforgroup.current=response.data.history[len-1].sent_time;
//       // console.log("time ", lastTimeforgroup);
//       // console.log("group history ",response.data.history);
//       lastMessageLengthRef.current = response.data.history.length;
//       // Append older messages at the beginning
//       setHistory(response.data.history.reverse());
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.message || "An error occurred");
//     }
//   }

//   async function loadmessagesforGroup() {
//     try {
//       const groupid = clickedGroupid;
//       const chatContainer = chatContainerRef.current;

//       // Save the distance from the bottom before fetching messages
//       previousScrollHeight.current = chatContainer.scrollHeight;
//       previousScrollTop.current = chatContainer.scrollTop;

//       const response = await axios.post(
//         "http://localhost:3000/fetchhistoryforgroup",
//         { groupid, time: lastTimeforgroup.current}
//       );

//       const len=response.data.history.length;
//       lastTimeforgroup.current=response.data.history[len-1].sent_time;
//       // console.log(lastTimeforgroup.current);
//       // console.log("group history 2nd ",response.data.history);

//       lastMessageLengthRef.current = response.data.history.length;

//       // Append older messages at the beginning
//       setHistory((prevHistory) => [
//         ...response.data.history.reverse(),
//         ...prevHistory,
//       ]);
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.message || "An error occurred");
//     }
//   }

//   async function handleSingleGroupClick9(groupid) {
//     initialScrollIndicator.current=1;
//     setClickedGroupid(groupid);
//     setIsitGroup(true);
//     setReciverid("");
//     setCurrentchat([]);
//     setHistory([]);
//     setOpeninput(true);
//   }

//   async function handleContactClick(id, name) {
//     initialScrollIndicator.current=1;
//     setHistory([]);
//     setIsitGroup(false);
//     setCurrentchat([]);
//     setOpeninput(true);
//     setFriendname(name);
//     setReciverid(id);
//     setClickedGroupid("");
//   }

//   useEffect(() => {
//     async function loadmessagesforChatInitial() {
//       if (!reciverid) return;

//       try {
//         const response = await axios.post("http://localhost:3000/gethistoryinitial", {
//           senderid,
//           reciverid,
//         });
//         const len=response.data.history.length;
//         lastTimeStamp.current=response.data.history[len-1].time;
//         console.log(lastTimeStamp.current);
//         console.log("history initial ", response.data.history);

//         lastMessageLengthRef.current = response.data.history.length;

//         setHistory(response.data.history.reverse());

//         setError("");
//       } catch (err) {
//         setError(err.response?.data?.message || "An error occurred");
//       }
//     }
//     loadmessagesforChatInitial();
//   }, [reciverid]);

//   //enters websocket in hashmap
//   useEffect(() => {
//     if (userData) {
//       const newSocket = io("https://trial2-production.up.railway.app", {
//         transports: ["websocket"],
//       });
//       setSocket(newSocket);
//       newSocket.emit("register_user", senderid);
//       return () => {
//         newSocket.disconnect();
//       };
//     }
//   }, [userData]);

//   // adds Scroll Event Listener and removes it
//   useEffect(() => {
//     if (!chatContainerRef.current) return;
//     const chatContainer = chatContainerRef.current;

//     chatContainer.addEventListener("scroll", handleScroll);
//     return () => chatContainer.removeEventListener("scroll", handleScroll);
//   }, [reciverid, clickedGroupid]);

//   const handleScroll = () => {
//     if (!chatContainerRef.current) return;

//     const chatContainer = chatContainerRef.current;

//     if (chatContainer.scrollTop === 0 && lastMessageLengthRef.current >= 15) {
//       initialScrollIndicator.current=0;

//       if(!isitGroup){
//         loadOlderMessagesForChat();
//         console.log("anomaly ");
//       } else{
//         loadmessagesforGroup();
//         console.log("entering");
//       }

//     }
//   };

//   //scrolls the scrollbar down when chat is opened
//   useEffect(() => {
//     if (!chatContainerRef.current) return;
//     if(initialScrollIndicator.current==1){
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [history]);

//   useEffect(() => {
//     const onClickOutside = (e) => {
//       if (
//         popupRef.current &&
//         buttonRef.current &&
//         !popupRef.current.contains(e.target) &&
//         !buttonRef.current.contains(e.target)
//       ) {
//         setTopmenuopen(false);
//       }
//     };

//     if (topmenuopen) {
//       document.addEventListener("mousedown", onClickOutside);
//     } else {
//       document.removeEventListener("mousedown", onClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", onClickOutside);
//     };
//   }, [topmenuopen]);

//   useEffect(() => {
//     const onClickOutside = (e) => {
//       if (
//         popupRef_down.current &&
//         buttonRef_down.current &&
//         !popupRef_down.current.contains(e.target) &&
//         !buttonRef_down.current.contains(e.target)
//       ) {
//         setOpenFileTypes(false);
//       }
//     };

//     if (openFileTypes) {
//       document.addEventListener("mousedown", onClickOutside);
//     } else {
//       document.removeEventListener("mousedown", onClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", onClickOutside);
//     };
//   }, [openFileTypes]);

//   useEffect(() => {
//     const onClickOutside1 = (e) => {
//       if (
//         popupRef_s.current &&
//         buttonRef_s.current &&
//         !popupRef_s.current.contains(e.target) &&
//         !buttonRef_s.current.contains(e.target)
//       ) {
//         setLeftmenuapper(false);
//       }
//     };

//     if (leftmenuapper) {
//       document.addEventListener("mousedown", onClickOutside1);
//     } else {
//       document.removeEventListener("mousedown", onClickOutside1);
//     }

//     return () => {
//       document.removeEventListener("mousedown", onClickOutside1);
//     };
//   }, [leftmenuapper]);

//   useEffect(() => {
//     async function fetchContacts() {
//       try {
//         const response = await axios.post("https://trial2-production.up.railway.app/contacts", {
//           senderid,
//         });
//         setContacts(response.data.contacts);

//         const resp = await axios.post("https://trial2-production.up.railway.app/getgroups", {
//           senderid,
//         });
//         console.log(resp.data.groups);
//         setGroups(resp.data.groups);

//         setError("");
//       } catch (err) {
//         setError(err.response?.data?.message || "An error occurred");
//       }
//     }
//     fetchContacts();
//   }, []);

//   //recives normal messages
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("recived_message", (data) => { 
//       console.log(data);

//       if (!isitGroup && reciverid === data.senderid) {
//         setCurrentchat((prevChats) => [...prevChats, data]);
//       }
//     });

//     return () => {
//       socket.off("recived_message");
//     };
//   }, [socket, reciverid, isitGroup]);

//   //recives group messages
//   useEffect(() => {
//     if (!socket) return;

//     socket.on(
//       "receive-group-message",
//       ({ senderid: sender_id, sendername, message, timestamp, roomId, fileUrl, fileType, fileName}) => {
//         const obj = {
//           message: message,
//           user_id: senderid,
//           sender_id: sender_id,
//           name: sendername,
//           time: timestamp,
//           fileUrl, 
//           filename: fileName,
//           fileType
//         };

//         if (roomId === clickedGroupid && isitGroup) {
//           setCurrentchat((prevChat) => [...prevChat, obj]);
//         }
//       }
//     );

//     return () => {
//       socket.off("receive-group-message");
//     };
//   }, [socket, isitGroup, clickedGroupid]);


//   useEffect(() => {
//     if (!socket) return;

//     const handleStatusUpdate = (data) => {
//       console.log("oo1 ",data);
//       setOnlineOfflineStatus((prevStatus) => ({
//         ...prevStatus,
//         [data.userId]: data.status,
//       }));
//     };

//     socket.on("selfstatus", handleStatusUpdate);

//     return () => {
//       socket.off("selfstatus");
//     };
//   }, [socket]);

//   useEffect(() => {
//     if (!socket) return;

//     const handleStatusUpdate = (data) => {
//       console.log("oo2 ",data);
//       setOnlineOfflineStatus((prevStatus) => ({
//         ...prevStatus,
//         [data.userId]: data.status,
//       }));
//     };

//     socket.on("onofstatus", handleStatusUpdate);

//     return () => {
//       socket.off("onofstatus", handleStatusUpdate);
//     };
//   }, [socket]);

//   useEffect(() => {
//     if (!socket || !reciverid) return;
//     socket.emit("onlineofflinestatus", reciverid);
//   }, [socket, reciverid]);





//   async function handleSendForChat() {
//     let uploadedFileUrl = null; // Store uploaded file URL locally
//     let uploadedFileType = filetype; // Store file type locally
  
//     if (file) {
//       const formData = new FormData();
//       formData.append("file", file);
  
//       try {
//         const response = await axios.post("http://localhost:3000/upload", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
  
//         uploadedFileUrl = response.data.url;
//         console.log("URL of file:", uploadedFileUrl);
//       } catch (error) {
//         console.error("Upload Error:", error);
//         return; // Stop execution if file upload fails
//       }
//     }
  
//     const time = (BigInt(Date.now()) * BigInt(1000)).toString();
  
//     if (isitGroup) {
//       const obj = {
//         message: sendmessage || caption,
//         user_id: senderid,
//         sender_id: senderid,
//         name: sendername,
//         time: time,
//         fileUrl: uploadedFileUrl || null, // Use local variable
//         fileType: uploadedFileType || null,
//         filename: filename,
//       };
      
//       setCurrentchat((prevChats) => [...prevChats, obj]);
  
//       if (chatContainerRef.current) {
//         setTimeout(() => {
//           chatContainerRef.current.scrollTo({
//             top: chatContainerRef.current.scrollHeight,
//             // behavior: "smooth",
//           });
//         }, 100);
//       }
  
//       socket.emit("send-group-message", {
//         clickedGroupid,
//         senderid,
//         sendmessage: sendmessage || caption,
//         time,
//         sendername,
//         fileUrl: uploadedFileUrl || null, // Use local variable
//         fileType: uploadedFileType || null,
//         filename: filename,
//       });
//     } else {
//       try {
//         await axios.post("http://localhost:3000/sendmessageinchat", {
//           senderid,
//           reciverid,
//           sendmessage: sendmessage || caption,
//           time,
//           fileUrl: uploadedFileUrl || null, // Use local variable
//           fileType: uploadedFileType || null,
//           filename: filename,
//         });
  
//         const obj = {
//           sendmessage:sendmessage || caption,
//           senderid,
//           reciverid,
//           time,
//           fileUrl: uploadedFileUrl || null, // Use local variable
//           fileType: uploadedFileType || null,
//           filename: filename,
//         };
  
//         setCurrentchat((prevChats) => [...prevChats, obj]);
//         setError("");
  
//         if (chatContainerRef.current) {
//           setTimeout(() => {
//             chatContainerRef.current.scrollTo({
//               top: chatContainerRef.current.scrollHeight,
//               // behavior: "smooth",
//             });
//           }, 100);
//         }
//       } catch (err) {
//         console.error("Message Send Error:", err);
//         setError(err.response?.data?.message || "An error occurred");
//       }
//     }
  
//     // Reset input fields
//     setSendmessage("");
//     setFile(null);
//     setFiletype(null);
//     setCaption("");
  
//     if (textareaRef.current) {
//       textareaRef.current.focus();
//     }
//   }


//   const handleImageClick = () => {
//     setOpenFileTypes((prev)=>!prev);
//   };

//   const handleFileChange = (event) => {
//       setFile(event.target.files[0]);
//       setFiletype(event.target.files[0].type);
//       setFilename(event.target.files[0].name);
//       setOpenFileTypes(false);
//       console.log("Selected file: ", event.target.files[0].name);
//       console.log("Selected file type: ", event.target.files[0].type);
//       event.target.value = "";
//   };

//   return (
//     <div className="chatapp_familycontainer">
//       <div className="virtical_options">
//         <img
//           className="applogo"
//           src="/assets/logo.png"
//           width="40px"
//           height="40px"
//         />

//         <img
//           className="menu_in_virnav"
//           src="/assets/menu.svg"
//           width="40px"
//           height="40px"
//           onClick={() => {
//             setLeftmenuapper((prev) => !prev);
//           }}
//           ref={buttonRef_s}
//         />

//         <div className="virtical_options1">
//           <img
//             src="/assets/all.svg"
//             width="38px"
//             height="38px"
//             onClick={()=>{
//                 setOcontacts(true);
//                 setOgroup(true);
//                 setCga("Chats");
//               }}
//           />

//           <img
//             src="/assets/contacts.svg"
//             width="45px"
//             height="45px"
//             onClick={()=>{
//               setOcontacts(true);
//               setOgroup(false);
//               setCga("Contacts");
//             }}
//           />

//           <img
//             src="/assets/groupVirtical.svg"
//             width="40px"
//             height="40px"
//             onClick={()=>{
//               setOcontacts(false);
//               setOgroup(true);
//               setCga("Groups");
//             }}
//           />
//         </div>

//       </div>

//       <AnimatePresence>
//         {leftmenuapper && (
//           <LeftMenu
//             senderid={senderid}
//             email={email}
//             contacts={contacts}
//             setContacts={setContacts}
//             groups={groups}
//             setGroups={setGroups}
//             ref={popupRef_s}
//           />
//         )}
//       </AnimatePresence>

//       <div className="contactsandmessages">
//         <div className="contactsaddprofilename">
//           <div className="Names_cga">
//             <p>{cga}</p>
//           </div>
//           <div className="contacts">

//             {ocontacts && contacts.map((contact) => (
//               <div
//                 className={`singlecontact ${
//                   reciverid === contact.friend_id ? "singleContactSelected" : ""
//                 }`}
//                 onClick={() =>
//                   handleContactClick(contact.friend_id, contact.friend_name)
//                 }
//                 key={contact.friend_id}
//               >
//                 <img src="/assets/profile.svg" width="25px" height="25px" />
//                 <p>{contact.friend_name}</p>
//               </div>
//             ))}
//             {ogroup && groups.map((group) => (
//               <div
//                 className={`singlegroup ${
//                   clickedGroupid === group.groupid ? "singlegroupSelected" : ""
//                 }`}
//                 key={group.groupid}
//                 onClick={() => {
//                   handleSingleGroupClick9(group.groupid);
//                   setClickedGroupName(group.name);
//                 }}
//               >
//                 <img src="/assets/profile.svg" width="25px" height="25px" />
//                 <p>{group.name}</p>
//               </div>
//             ))}

//           </div>
//         </div>

//         <div className="messagearea">
//           <AnimatePresence>
//             {topmenuopen && (
//               <TopMenu
//                 contacts={contacts}
//                 clickedGroupName={clickedGroupName}
//                 clickedGroupid={clickedGroupid}
//                 ref={popupRef}
//               />
//             )}
//           </AnimatePresence>

//           {openinput &&
//             (!isitGroup ? (

//               <div className="statusonof">
//                 <p className="friendname">{friendname}</p>
//                 <p className="onlineofline">{onlineOfflineStatus[reciverid] || "offline"}</p>
//               </div>
              
//             ) : (
//               <div className="statusonof">
//                 <p
//                   className="friendname"
//                   onClick={() => setTopmenuopen((prev) => !prev)}
//                   ref={buttonRef}
//                 >
//                   {clickedGroupName}
//                 </p>
//                 <div></div>
//               </div>
//             ))}

//           {openinput && (
//             <div className="chatarea" ref={chatContainerRef}>
//               {history.map((eachchat, index) =>
              
//                 !isitGroup ? (
//                   <EachChat
//                     key={index}
//                     messageSenderid={eachchat.senderid}
//                     messageReciverid={eachchat.reciverid}
//                     message={eachchat.sendmessage || eachchat.caption}
//                     receiverid={reciverid}
//                     time={eachchat.time}
//                     fileUrl={eachchat.fileUrl}
//                     filename={eachchat.fileName}
//                     fileType={eachchat.fileType}
//                   />
//                 ) : (
//                   <EachChatForGroup
//                     key={index}
//                     message={eachchat.message}
//                     user_id={senderid}
//                     sender_id={eachchat.sender_id}
//                     name={eachchat.sender_name}
//                     time={eachchat.sent_time}
//                     fileUrl={eachchat.fileUrl}
//                     filename={eachchat.fileName}
//                     fileType={eachchat.fileType}
//                   />
//                 )
//               )}

//               {currentchat.map((eachchat, index) =>
//                 !isitGroup ? (
//                   <EachChat
//                     key={index}
//                     messageSenderid={eachchat.senderid}
//                     messageReciverid={eachchat.reciverid}
//                     message={eachchat.sendmessage || eachchat.caption}
//                     receiverid={reciverid}
//                     time={eachchat.time}
//                     fileUrl={eachchat.fileUrl}
//                     filename={eachchat.filename}
//                     fileType={eachchat.fileType}
//                   />
//                 ) : (
//                   <EachChatForGroup
//                     key={index}
//                     message={eachchat.message}
//                     user_id={eachchat.user_id}
//                     sender_id={eachchat.sender_id}
//                     name={eachchat.name}
//                     time={eachchat.time}
//                     fileUrl={eachchat.fileUrl}
//                     filename={eachchat.filename}
//                     fileType={eachchat.fileType} 
//                   />
//                 )
//               )}
//             </div>
//           )}

//           {openinput && (
//             <div className="typemessage">

//               <AnimatePresence>
//                 {file && filetype && filename &&
//                 <BottemPopup 
//                   file={file} 
//                   setFile={setFile} 
//                   handleSendForChat={handleSendForChat} 
//                   caption={caption} 
//                   setCaption={setCaption} 
//                   filetype={filetype}
//                 />}
//               </AnimatePresence>

//               <AnimatePresence>
//                 {openFileTypes &&
//                 <motion.div 
//                 ref={popupRef_down}
//                 initial={{ y: "100%" }} // Start completely off-screen (bottom)
//                 animate={{ y: 0 }} // Slide in to position
//                 exit={{ y: "100%" }} // Slide out when hidden
//                 transition={{ type: "tween", duration: 0.2 }} // Smooth transition
//                 className="fileTypes"
//                 >
//                   <div className="fileTypeButton" onClick={()=>imageInputRef.current.click()}>
//                     <img src="/assets/images.svg" width="25px" height="25px"/>
//                     <p>Images</p>
//                   </div>
//                   <div className="fileTypeButton" onClick={()=>videoInputRef.current.click()}>
//                     <img src="/assets/video.svg" width="25px" height="25px"/>
//                     <p>Videos</p>
//                   </div>
//                   <div className="fileTypeButton" onClick={()=>docInputRef.current.click()}>
//                     <img src="/assets/document.svg" width="25px" height="25px"/>
//                     <p>Documents</p>
//                   </div>
//                 </motion.div>
//                  }
//               </AnimatePresence>

//               <input
//                 type="file"
//                 ref={imageInputRef}
//                 style={{ display: "none" }}
//                 onChange={handleFileChange}
//                 accept="image/*"
//               />
          
//               <input
//                 type="file"
//                 ref={videoInputRef}
//                 style={{ display: "none" }}
//                 onChange={handleFileChange}
//                 accept="video/*"
//               />
            
//               <input
//                 type="file"
//                 ref={docInputRef}
//                 style={{ display: "none" }}
//                 onChange={handleFileChange}
//                 accept=".pdf,.doc,.docx,.txt"
//               />
              
//               <img
//                   ref={buttonRef_down}
//                   src="/assets/attach.svg"
//                   width="25px"
//                   height="25px"
//                   alt="Attach"
//                   onClick={handleImageClick} // Triggers file input when clicked
//                   style={{ cursor: "pointer" }}
//               />

//               <textarea
//                 ref={textareaRef}
//                 placeholder="Type a message"
//                 value={sendmessage}
//                 onChange={(event) => setSendmessage(event.target.value)}
//                 onKeyDown={(event) => {
//                   if (event.key === "Enter" && !event.shiftKey) {
//                     event.preventDefault(); // Prevents new line in textarea
//                     handleSendForChat();
//                   }
//                 }}
//               />

//               <img
//                 src="/assets/send1.svg"
//                 width="40px"
//                 height="40px"
//                 onClick={handleSendForChat}
//                 style={{ cursor: "pointer" }}
//               />
//             </div>
//           )}

//           <AnimatePresence>
//             {topmenuopen && (
//               <TopMenu
//                 contacts={contacts}
//                 clickedGroupName={clickedGroupName}
//                 clickedGroupid={clickedGroupid}
//                 ref={popupRef}
//               />
//             )}
//           </AnimatePresence>

//           {!openinput && (
//             <div className="chatarea_nc">
//               <img
//                 className="menu_in_virnav"
//                 src="/assets/logo.png"
//                 width="100px"
//                 height="100px"
//               />

//               <h3>Welcome to We Chat</h3>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chat;


import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import EachChat from "./EachChat.jsx";
import LeftMenu from "./LeftMenu.jsx";
import BottemPopup from "./BottemPopup.jsx";
import EachChatForGroup from "./EachChatForGroup.jsx";
import TopMenu from "./TopMenu.jsx";
import axios from "axios";
import io from "socket.io-client";
import "./Chat.scss";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const API_URL = "https://trial2-production.up.railway.app"; // Use your Railway backend URL

function Chat() {
  const location = useLocation();
  const userData = location.state?.user;
  const senderid = userData.user_id;
  const email = userData.email;
  const sendername = userData.name;

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
  const [ogroup, setOgroup] = useState(true);
  const [ocontacts, setOcontacts] = useState(true);

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

  // Function to fetch older messages for chat
  async function loadOlderMessagesForChat() {
    if (!chatContainerRef.current) return;

    try {
      const chatContainer = chatContainerRef.current;
      previousScrollHeight.current = chatContainer.scrollHeight;
      previousScrollTop.current = chatContainer.scrollTop;

      const response = await axios.post(`${API_URL}/gethistory`, {
        senderid,
        reciverid,
        time: lastTimeStamp.current,
      });

      const len = response.data.history.length;
      lastTimeStamp.current = response.data.history[len - 1].time;
      lastMessageLengthRef.current = response.data.history.length;

      setHistory((prevHistory) => [
        ...response.data.history.reverse(),
        ...prevHistory,
      ]);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
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
  }, [clickedGroupid, isitGroup]);

  async function loadmessagesforGroupInitial() {
    try {
      const groupid = clickedGroupid;
      const response = await axios.post(`${API_URL}/createroomforgroupandfetchhistory`, {
        groupid,
        senderid,
      });

      const len = response.data.history.length;
      lastTimeforgroup.current = response.data.history[len - 1].sent_time;
      lastMessageLengthRef.current = response.data.history.length;
      setHistory(response.data.history.reverse());
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  }

  async function loadmessagesforGroup() {
    try {
      const groupid = clickedGroupid;
      const chatContainer = chatContainerRef.current;
      previousScrollHeight.current = chatContainer.scrollHeight;
      previousScrollTop.current = chatContainer.scrollTop;

      const response = await axios.post(`${API_URL}/fetchhistoryforgroup`, {
        groupid,
        time: lastTimeforgroup.current,
      });

      const len = response.data.history.length;
      lastTimeforgroup.current = response.data.history[len - 1].sent_time;
      lastMessageLengthRef.current = response.data.history.length;

      setHistory((prevHistory) => [
        ...response.data.history.reverse(),
        ...prevHistory,
      ]);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  }

  async function handleSingleGroupClick9(groupid) {
    initialScrollIndicator.current = 1;
    setClickedGroupid(groupid);
    setIsitGroup(true);
    setReciverid("");
    setCurrentchat([]);
    setHistory([]);
    setOpeninput(true);
  }

  async function handleContactClick(id, name) {
    initialScrollIndicator.current = 1;
    setHistory([]);
    setIsitGroup(false);
    setCurrentchat([]);
    setOpeninput(true);
    setFriendname(name);
    setReciverid(id);
    setClickedGroupid("");
  }

  useEffect(() => {
    async function loadmessagesforChatInitial() {
      if (!reciverid) return;
      try {
        const response = await axios.post(`${API_URL}/gethistoryinitial`, {
          senderid,
          reciverid,
        });
        const len = response.data.history.length;
        lastTimeStamp.current = response.data.history[len - 1].time;
        lastMessageLengthRef.current = response.data.history.length;
        setHistory(response.data.history.reverse());
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    }
    loadmessagesforChatInitial();
  }, [reciverid]);

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
    };
    if (topmenuopen) {
      document.addEventListener("mousedown", onClickOutside);
    } else {
      document.removeEventListener("mousedown", onClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [topmenuopen]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (
        popupRef_down.current &&
        buttonRef_down.current &&
        !popupRef_down.current.contains(e.target) &&
        !buttonRef_down.current.contains(e.target)
      ) {
        setOpenFileTypes(false);
      }
    };
    if (openFileTypes) {
      document.addEventListener("mousedown", onClickOutside);
    } else {
      document.removeEventListener("mousedown", onClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [openFileTypes]);

  useEffect(() => {
    const onClickOutside1 = (e) => {
      if (
        popupRef_s.current &&
        buttonRef_s.current &&
        !popupRef_s.current.contains(e.target) &&
        !buttonRef_s.current.contains(e.target)
      ) {
        setLeftmenuapper(false);
      }
    };
    if (leftmenuapper) {
      document.addEventListener("mousedown", onClickOutside1);
    } else {
      document.removeEventListener("mousedown", onClickOutside1);
    }
    return () => {
      document.removeEventListener("mousedown", onClickOutside1);
    };
  }, [leftmenuapper]);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const response = await axios.post(`${API_URL}/contacts`, {
          senderid,
        });
        setContacts(response.data.contacts);

        const resp = await axios.post(`${API_URL}/getgroups`, {
          senderid,
        });
        setGroups(resp.data.groups);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    }
    fetchContacts();
  }, []);

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

  async function handleSendForChat() {
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
  }

  const handleImageClick = () => {
    setOpenFileTypes((prev) => !prev);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setFiletype(event.target.files[0].type);
    setFilename(event.target.files[0].name);
    setOpenFileTypes(false);
    event.target.value = "";
  };

  return (
    <div className="chatapp_familycontainer">
      <div className="virtical_options">
        <img
          className="applogo"
          src={`${import.meta.env.BASE_URL}assets/logo.png`}
          width="40px"
          height="40px"
        />
        <img
          className="menu_in_virnav"
          src={`${import.meta.env.BASE_URL}assets/menu.svg`}
          width="40px"
          height="40px"
          onClick={() => {
            setLeftmenuapper((prev) => !prev);
          }}
          ref={buttonRef_s}
        />
        <div className="virtical_options1">
          <img
            src={`${import.meta.env.BASE_URL}assets/all.svg`}
            width="38px"
            height="38px"
            onClick={() => {
              setOcontacts(true);
              setOgroup(true);
              setCga("Chats");
            }}
          />
          <img
            src={`${import.meta.env.BASE_URL}assets/contacts.svg`}
            width="45px"
            height="45px"
            onClick={() => {
              setOcontacts(true);
              setOgroup(false);
              setCga("Contacts");
            }}
          />
          <img
            src={`${import.meta.env.BASE_URL}assets/groupVirtical.svg`}
            width="40px"
            height="40px"
            onClick={() => {
              setOcontacts(false);
              setOgroup(true);
              setCga("Groups");
            }}
          />
        </div>
      </div>
      <AnimatePresence>
        {leftmenuapper && (
          <LeftMenu
            senderid={senderid}
            email={email}
            contacts={contacts}
            setContacts={setContacts}
            groups={groups}
            setGroups={setGroups}
            ref={popupRef_s}
          />
        )}
      </AnimatePresence>
      <div className="contactsandmessages">
        <div className="contactsaddprofilename">
          <div className="Names_cga">
            <p>{cga}</p>
          </div>
          <div className="contacts">
            {ocontacts &&
              contacts.map((contact) => (
                <div
                  className={`singlecontact ${
                    reciverid === contact.friend_id
                      ? "singleContactSelected"
                      : ""
                  }`}
                  onClick={() =>
                    handleContactClick(contact.friend_id, contact.friend_name)
                  }
                  key={contact.friend_id}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}assets/profile.svg`}
                    width="25px"
                    height="25px"
                    alt="Profile"
                  />
                  <p>{contact.friend_name}</p>
                </div>
              ))}
            {ogroup &&
              groups.map((group) => (
                <div
                  className={`singlegroup ${
                    clickedGroupid === group.groupid ? "singlegroupSelected" : ""
                  }`}
                  key={group.groupid}
                  onClick={() => {
                    handleSingleGroupClick9(group.groupid);
                    setClickedGroupName(group.name);
                  }}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}assets/profile.svg`}
                    width="25px"
                    height="25px"
                    alt="Group"
                  />
                  <p>{group.name}</p>
                </div>
              ))}
          </div>
        </div>
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
              </div>
            ))}
          {openinput && (
            <div 
              className="chatarea" 
              ref={chatContainerRef}
              style={{ 
                // backgroundImage: `url("${import.meta.env.BASE_URL}assets/background_enhanced.png")`, 
                backgroundImage: `url("${import.meta.env.BASE_URL}background_enhanced.png")`, 
                backgroundSize: "850px 600px", 
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
                onClick={handleImageClick}
                style={{ cursor: "pointer" }}
              />
              <textarea
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
          {!openinput && (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;

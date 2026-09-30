import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { AnimatePresence } from "framer-motion";

import { API_URL } from "../App.jsx";
import { useMessageLoader } from "../hooks/useMessageLoader.js";
import { useSocketEvents } from "../hooks/useSocketEvents.js";

import EachChat from "./EachChat.jsx";
import EachChatForGroup from "./EachChatForGroup.jsx";
import LeftMenu from "./LeftMenu.jsx";
import TopMenu from "./TopMenu.jsx";
import Contacts from "./Contacts.jsx";
import VerticalNavBar from "./VerticalNavBar.jsx";
import ChatHeader from "./ChatHeader.jsx";
import ChatInputBar from "./ChatInputBar.jsx";
import Welcome from "./Welcome.jsx";

import "./Chat.scss";

function Chat() {
  const location = useLocation();
  const userData = location.state?.user;
  const senderid = userData?.user_id ?? "";
  const email = userData?.email ?? "";
  const sendername = userData?.name ?? "";

  // ── UI state ──
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [openinput, setOpeninput] = useState(false);
  const [leftmenuapper, setLeftmenuapper] = useState(false);
  const [topmenuopen, setTopmenuopen] = useState(false);
  const [cga, setCga] = useState("Chats");
  const [conOrGro, setConOrGro] = useState("");
  const [clickedOption, setClickedOption] = useState("");

  // ── Active chat state ──
  const [reciverid, setReciverid] = useState("");
  const [friendname, setFriendname] = useState("");
  const [isitGroup, setIsitGroup] = useState(false);
  const [clickedGroupid, setClickedGroupid] = useState("");
  const [clickedGroupName, setClickedGroupName] = useState("");
  const [currentchat, setCurrentchat] = useState([]);
  const [onlineOfflineStatus, setOnlineOfflineStatus] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  // ── Reply state ──
  const [replyTo, setReplyTo] = useState(null);

  // ── Socket ──
  const [socket, setSocket] = useState(null);

  // ── File / input state ──
  const [sendmessage, setSendmessage] = useState("");
  const [file, setFile] = useState(null);
  const [filetype, setFiletype] = useState("");
  const [filename, setFilename] = useState("");
  const [caption, setCaption] = useState("");
  const [openFileTypes, setOpenFileTypes] = useState(false);

  // ── Refs ──
  const chatContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const docInputRef = useRef(null);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const popupRef_s = useRef(null);
  const buttonRef_s = useRef(null);
  const popupRef_down = useRef(null);
  const buttonRef_down = useRef(null);
  const initialScrollIndicator = useRef(0);
  const typingTimerRef = useRef(null);

  // ── Message loader hook ──
  const {
    loading,
    history,
    setHistory,
    lastMessageLengthRef,
    previousScrollHeight,
    previousScrollTop,
    loadOlderMessages,
  } = useMessageLoader({ senderid, reciverid, clickedGroupid, isitGroup, chatContainerRef });

  // ── Socket events hook ──
  useSocketEvents({
    socket,
    senderid,
    reciverid,
    isitGroup,
    clickedGroupid,
    setCurrentchat,
    setOnlineOfflineStatus,
    setIsTyping,
  });

  // ── Initial data fetch ──
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [contactsRes, groupsRes, nameRes] = await Promise.all([
          axios.post(`${API_URL}/contacts`, { senderid }),
          axios.post(`${API_URL}/getgroups`, { senderid }),
          axios.post(`${API_URL}/getname`, { senderid }),
        ]);
        setContacts(contactsRes.data.contacts);
        setGroups(groupsRes.data.groups);
        setName(nameRes.data.name);
        setClickedOption("2");
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    }
    fetchInitialData();
  }, [senderid]);

  // ── Socket initialization ──
  useEffect(() => {
    if (!userData) return;
    const newSocket = io(API_URL, { transports: ["websocket"] });
    setSocket(newSocket);
    newSocket.emit("register_user", senderid);
    return () => newSocket.disconnect();
  }, [userData]);

  // ── Preserve scroll position when older messages prepend ──
  useEffect(() => {
    if (chatContainerRef.current && previousScrollHeight.current !== null) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight - previousScrollHeight.current + previousScrollTop.current;
    }
  }, [history]);

  // ── Scroll to bottom on initial chat open ──
  useEffect(() => {
    if (chatContainerRef.current && initialScrollIndicator.current === 1) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [history]);

  // ── Scroll to bottom when a new message arrives in currentchat ──
  useEffect(() => {
    if (!chatContainerRef.current) return;
    setTimeout(() => {
      chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight });
    }, 100);
  }, [currentchat]);

  // ── Infinite scroll — load older messages on scroll to top ──
  useEffect(() => {
    if (!chatContainerRef.current) return;
    const container = chatContainerRef.current;
    const handleScroll = () => {
      if (container.scrollTop === 0 && lastMessageLengthRef.current >= 15) {
        initialScrollIndicator.current = 0;
        loadOlderMessages();
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [reciverid, clickedGroupid, loadOlderMessages]);

  // ── Close popups on outside click ──
  useEffect(() => {
    const onClickOutside = (e) => {
      if (popupRef.current && buttonRef.current &&
        !popupRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
        setTopmenuopen(false);
      }
      if (popupRef_down.current && buttonRef_down.current &&
        !popupRef_down.current.contains(e.target) && !buttonRef_down.current.contains(e.target)) {
        setOpenFileTypes(false);
      }
      if (popupRef_s.current && buttonRef_s.current &&
        !popupRef_s.current.contains(e.target) && !buttonRef_s.current.contains(e.target)) {
        setLeftmenuapper(false);
      }
    };
    if (topmenuopen || openFileTypes || leftmenuapper) {
      document.addEventListener("mousedown", onClickOutside);
    } else {
      document.removeEventListener("mousedown", onClickOutside);
    }
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [topmenuopen, openFileTypes, leftmenuapper]);

  // ── Handlers ──
  const handleContactClick = useCallback((id, friendName) => {
    if (reciverid === id) return;
    initialScrollIndicator.current = 1;
    setHistory([]);
    setCurrentchat([]);
    setIsitGroup(false);
    setOpeninput(true);
    setFriendname(friendName);
    setReciverid(id);
    setClickedGroupid("");
    setIsTyping(false);
    setReplyTo(null);
  }, [reciverid]);

  const handleSingleGroupClick9 = useCallback((groupid, groupname) => {
    if (clickedGroupid === groupid) return;
    initialScrollIndicator.current = 1;
    setClickedGroupid(groupid);
    setClickedGroupName(groupname);
    setIsitGroup(true);
    setReciverid("");
    setCurrentchat([]);
    setHistory([]);
    setOpeninput(true);
    setReplyTo(null);
  }, [clickedGroupid]);

  // Called by TopMenu after a successful rename
  const handleGroupNameChange = useCallback((groupid, newName) => {
    setClickedGroupName(newName);
    setGroups((prev) =>
      prev.map((g) => (g.groupid === groupid ? { ...g, name: newName } : g))
    );
  }, []);

  // Emit typing event to the active 1-on-1 contact
  const handleTyping = useCallback(() => {
    if (!socket || !reciverid || isitGroup) return;
    socket.emit("typing", { toUserId: reciverid });
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      socket.emit("stop-typing", { toUserId: reciverid });
    }, 1500);
  }, [socket, reciverid, isitGroup]);

  const handleFileChange = useCallback((e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setFiletype(f.type);
    setFilename(f.name);
    setOpenFileTypes(false);
    e.target.value = "";
  }, []);

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
      } catch (err) {
        console.error("Upload Error:", err);
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
        time,
        fileUrl: uploadedFileUrl || null,
        fileType: uploadedFileType || null,
        filename,
        replyTo: replyTo || undefined,
      };
      setCurrentchat((prev) => [...prev, obj]);
      socket.emit("send-group-message", {
        clickedGroupid,
        senderid,
        sendmessage: sendmessage || caption,
        time,
        sendername,
        fileUrl: uploadedFileUrl || null,
        fileType: uploadedFileType || null,
        filename,
        replyTo: replyTo || undefined,
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
          filename,
          replyTo: replyTo || undefined,
        });
        const obj = {
          sendmessage: sendmessage || caption,
          senderid,
          reciverid,
          time,
          fileUrl: uploadedFileUrl || null,
          fileType: uploadedFileType || null,
          filename,
          replyTo: replyTo || undefined,
        };
        setCurrentchat((prev) => [...prev, obj]);
        setError("");
      } catch (err) {
        console.error("Message Send Error:", err);
        setError(err.response?.data?.message || "An error occurred");
      }
    }

    setSendmessage("");
    setFile(null);
    setFiletype("");
    setFilename("");
    setCaption("");
    setReplyTo(null);
    if (textareaRef.current) textareaRef.current.focus();
  }, [file, filetype, filename, caption, sendmessage, isitGroup, clickedGroupid, reciverid, senderid, sendername, socket, replyTo]);

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
                onGroupNameChange={handleGroupNameChange}
                ref={popupRef}
              />
            )}
          </AnimatePresence>

          {openinput && (
            <ChatHeader
              isitGroup={isitGroup}
              friendname={friendname}
              clickedGroupName={clickedGroupName}
              onlineOfflineStatus={onlineOfflineStatus}
              reciverid={reciverid}
              loading={loading}
              setTopmenuopen={setTopmenuopen}
              buttonRef={buttonRef}
              isTyping={isTyping}
            />
          )}

          {openinput && (
            <div
              className="chatarea"
              ref={chatContainerRef}
              style={{
                backgroundImage: `url('${import.meta.env.BASE_URL}assets/background_enhanced3.jpg')`,
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {history.map((msg, index) =>
                !isitGroup ? (
                  <EachChat
                    key={index}
                    messageSenderid={msg.senderid}
                    messageReciverid={msg.reciverid}
                    message={msg.sendmessage || msg.caption}
                    receiverid={reciverid}
                    time={msg.time}
                    fileUrl={msg.fileUrl}
                    filename={msg.fileName}
                    fileType={msg.fileType}
                    replyTo={msg.replyTo}
                    friendname={friendname}
                    onReply={setReplyTo}
                  />
                ) : (
                  <EachChatForGroup
                    key={index}
                    message={msg.message}
                    user_id={senderid}
                    sender_id={msg.sender_id}
                    name={msg.sender_name}
                    time={msg.sent_time}
                    fileUrl={msg.fileUrl}
                    filename={msg.fileName}
                    fileType={msg.fileType}
                    replyTo={msg.replyTo}
                    onReply={setReplyTo}
                  />
                )
              )}

              {currentchat.map((msg, index) =>
                !isitGroup ? (
                  <EachChat
                    key={index}
                    messageSenderid={msg.senderid}
                    messageReciverid={msg.reciverid}
                    message={msg.sendmessage || msg.caption}
                    receiverid={reciverid}
                    time={msg.time}
                    fileUrl={msg.fileUrl}
                    filename={msg.filename}
                    fileType={msg.fileType}
                    replyTo={msg.replyTo}
                    friendname={friendname}
                    onReply={setReplyTo}
                  />
                ) : (
                  <EachChatForGroup
                    key={index}
                    message={msg.message}
                    user_id={msg.user_id}
                    sender_id={msg.sender_id}
                    name={msg.name}
                    time={msg.time}
                    fileUrl={msg.fileUrl}
                    filename={msg.filename}
                    fileType={msg.fileType}
                    replyTo={msg.replyTo}
                    onReply={setReplyTo}
                  />
                )
              )}
            </div>
          )}

          {openinput && (
            <ChatInputBar
              sendmessage={sendmessage}
              setSendmessage={setSendmessage}
              file={file}
              setFile={setFile}
              filetype={filetype}
              caption={caption}
              setCaption={setCaption}
              openFileTypes={openFileTypes}
              setOpenFileTypes={setOpenFileTypes}
              textareaRef={textareaRef}
              imageInputRef={imageInputRef}
              videoInputRef={videoInputRef}
              docInputRef={docInputRef}
              buttonRef_down={buttonRef_down}
              popupRef_down={popupRef_down}
              handleSendForChat={handleSendForChat}
              handleFileChange={handleFileChange}
              handleTyping={handleTyping}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
            />
          )}

          {!openinput && <Welcome />}
        </div>
      </div>
    </div>
  );
}

export default Chat;

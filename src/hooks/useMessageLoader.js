import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_URL } from "../App.jsx";

export function useMessageLoader({ senderid, reciverid, clickedGroupid, isitGroup, chatContainerRef }) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const lastTimeStamp = useRef(null);
  const lastTimeforgroup = useRef(null);
  const lastMessageLengthRef = useRef(null);
  const previousScrollHeight = useRef(null);
  const previousScrollTop = useRef(null);

  // Load initial 1-on-1 messages when reciverid changes
  useEffect(() => {
    if (!reciverid) return;
    async function load() {
      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}/gethistoryinitial`, { senderid, reciverid });
        const msgs = response.data.history;
        if (msgs.length > 0) {
          lastTimeStamp.current = msgs[msgs.length - 1].time;
          lastMessageLengthRef.current = msgs.length;
          setHistory(msgs.reverse());
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [reciverid]);

  // Load initial group messages when group changes
  useEffect(() => {
    if (!isitGroup || !chatContainerRef.current) return;
    async function load() {
      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}/createroomforgroupandfetchhistory`, {
          groupid: clickedGroupid,
          senderid,
        });
        const msgs = response.data.history;
        if (msgs.length > 0) {
          lastTimeforgroup.current = msgs[msgs.length - 1].sent_time;
          lastMessageLengthRef.current = msgs.length;
          setHistory(msgs.reverse());
        }
      } catch (err) {
        console.error("Failed to load group history:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [clickedGroupid, isitGroup]);

  async function loadOlderMessages() {
    if (!chatContainerRef.current) return;
    const chatContainer = chatContainerRef.current;
    previousScrollHeight.current = chatContainer.scrollHeight;
    previousScrollTop.current = chatContainer.scrollTop;

    try {
      setLoading(true);
      if (!isitGroup) {
        const response = await axios.post(`${API_URL}/gethistory`, {
          senderid,
          reciverid,
          time: lastTimeStamp.current,
        });
        const msgs = response.data.history;
        if (msgs.length > 0) {
          lastTimeStamp.current = msgs[msgs.length - 1].time;
          lastMessageLengthRef.current = msgs.length;
          setHistory((prev) => [...msgs.reverse(), ...prev]);
        }
      } else {
        const response = await axios.post(`${API_URL}/fetchhistoryforgroup`, {
          groupid: clickedGroupid,
          time: lastTimeforgroup.current,
        });
        const msgs = response.data.history;
        if (msgs.length > 0) {
          lastTimeforgroup.current = msgs[msgs.length - 1].sent_time;
          lastMessageLengthRef.current = msgs.length;
          setHistory((prev) => [...msgs.reverse(), ...prev]);
        }
      }
    } catch (err) {
      console.error("Failed to load older messages:", err);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    history,
    setHistory,
    lastMessageLengthRef,
    previousScrollHeight,
    previousScrollTop,
    loadOlderMessages,
  };
}

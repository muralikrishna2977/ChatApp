import { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { contactApi, getErrorMessage, groupApi, messageApi, uploadFile, userApi } from "../api/index.js";
import { clearUser, loadUser, saveUser } from "../lib/session.js";
import { useConversation } from "../hooks/useConversation.js";
import { usePresence } from "../hooks/usePresence.js";
import { useSocket } from "../hooks/useSocket.js";
import { useToast } from "../hooks/useToast.js";
import { useTyping } from "../hooks/useTyping.js";
import { useUnreadCounts } from "../hooks/useUnreadCounts.js";
import { cx } from "../utils/format.js";
import { conversationKey, createOutgoingMessage } from "../utils/messages.js";
import { microNow } from "../utils/time.js";

import AccountDrawer from "../components/chat/AccountDrawer.jsx";
import ChatHeader from "../components/chat/ChatHeader.jsx";
import Composer from "../components/chat/Composer.jsx";
import ConversationList from "../components/chat/ConversationList.jsx";
import EmptyChat from "../components/chat/EmptyChat.jsx";
import GroupInfoDrawer from "../components/chat/GroupInfoDrawer.jsx";
import MessageList from "../components/chat/MessageList.jsx";
import NavRail from "../components/chat/NavRail.jsx";
import Toast from "../components/ui/Toast.jsx";
import "./ChatPage.scss";

export default function ChatPage() {
  const location = useLocation();
  const user = location.state?.user ?? loadUser();
  if (!user?.user_id || !user.token) return <Navigate to="/" replace />;
  return <ChatWorkspace user={user} />;
}

function ChatWorkspace({ user }) {
  const navigate = useNavigate();
  const selfId = user.user_id;

  // ── Data ──
  const [displayName, setDisplayName] = useState(user.name ?? "");
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  // ── UI ──
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null); // { type: "direct" | "group", id, name }
  const [replyTo, setReplyTo] = useState(null);
  const [accountTab, setAccountTab] = useState(null); // null = drawer closed
  const [groupInfoOpen, setGroupInfoOpen] = useState(false);
  const { toast, showToast, dismissToast } = useToast();

  // ── Realtime ──
  const socket = useSocket(user.token);
  const activeKey = active ? conversationKey(active.type, active.id) : null;
  const activeContactId = active?.type === "direct" ? active.id : null;
  const presence = usePresence(socket, activeContactId);
  const { isTyping, notifyTyping } = useTyping(socket, activeContactId);
  const unread = useUnreadCounts(socket, activeKey);
  const { messages, loading, hasMore, error, loadOlder, appendMessage } = useConversation({
    socket,
    selfId,
    conversation: active,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([contactApi.list(), groupApi.list(), userApi.getName()])
      .then(([contactsRes, groupsRes, nameRes]) => {
        if (cancelled) return;
        setContacts(contactsRes.contacts ?? []);
        setGroups(groupsRes.groups ?? []);
        if (nameRes.name) setDisplayName(nameRes.name);
      })
      .catch((err) => {
        if (!cancelled) showToast(getErrorMessage(err, "Could not load your conversations."));
      })
      .finally(() => {
        if (!cancelled) setListLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selfId, showToast]);

  // ── Navigation ──
  const selectConversation = useCallback(
    (type, id, name) => {
      if (conversationKey(type, id) === activeKey) return;
      setActive({ type, id, name });
      setReplyTo(null);
      setGroupInfoOpen(false);
    },
    [activeKey]
  );

  const closeConversation = useCallback(() => setActive(null), []);
  const openProfile = useCallback(() => setAccountTab("profile"), []);
  const closeAccount = useCallback(() => setAccountTab(null), []);
  const openAddContact = useCallback(() => setAccountTab("add-contact"), []);
  const openNewGroup = useCallback(() => setAccountTab("new-group"), []);
  const closeGroupInfo = useCallback(() => setGroupInfoOpen(false), []);

  const handleLogout = useCallback(() => {
    clearUser();
    navigate("/", { replace: true });
  }, [navigate]);

  // ── Account / group mutations ──
  const handleRenamed = useCallback(
    (name) => {
      setDisplayName(name);
      saveUser({ ...user, name });
    },
    [user]
  );

  const handleContactAdded = useCallback((contact) => {
    setContacts((prev) => [...prev, contact]);
  }, []);

  const handleGroupCreated = useCallback(
    (group) => {
      setGroups((prev) => [...prev, group]);
      setAccountTab(null);
      showToast(`Group “${group.name}” created`, "success");
      selectConversation("group", group.groupid, group.name);
    },
    [selectConversation, showToast]
  );

  const handleGroupRenamed = useCallback((groupid, name) => {
    setGroups((prev) => prev.map((g) => (g.groupid === groupid ? { ...g, name } : g)));
    setActive((prev) => (prev?.type === "group" && prev.id === groupid ? { ...prev, name } : prev));
  }, []);

  // ── Messaging ──
  const handleReply = useCallback(
    (message) => {
      setReplyTo({
        senderId: message.senderId,
        senderName: message.isMine ? displayName : message.senderName || active?.name || "Contact",
        text: message.text,
        fileType: message.fileUrl ? message.fileType : undefined,
      });
    },
    [displayName, active?.name]
  );

  const cancelReply = useCallback(() => setReplyTo(null), []);

  const handleSend = useCallback(
    async ({ text, file }) => {
      if (!active) return false;
      const body = text.trim();
      if (!body && !file) return false;

      const targetKey = activeKey;
      const reply = replyTo ?? undefined;
      try {
        const fileUrl = file ? await uploadFile(file) : null;
        const fileType = file?.type || null;
        const fileName = file?.name ?? "";
        const time = microNow();

        if (active.type === "group") {
          if (!socket) throw new Error("Not connected");
          socket.emit("send-group-message", {
            clickedGroupid: active.id,
            sendmessage: body,
            time,
            fileUrl,
            fileType,
            filename: fileName,
            replyTo: reply,
          });
        } else {
          await messageApi.sendDirect({
            reciverid: active.id,
            sendmessage: body,
            time,
            fileUrl,
            fileType,
            filename: fileName,
            replyTo: reply,
          });
        }

        appendMessage(
          createOutgoingMessage({
            selfId,
            selfName: displayName,
            text: body,
            time,
            fileUrl,
            fileName,
            fileType,
            replyTo: reply,
          }),
          targetKey
        );
        setReplyTo(null);
        return true;
      } catch (err) {
        console.error("Failed to send message:", err);
        showToast(getErrorMessage(err, "Message could not be sent. Please try again."));
        return false;
      }
    },
    [active, activeKey, replyTo, socket, selfId, displayName, appendMessage, showToast]
  );

  return (
    <div className={cx("app-shell", active && "app-shell--chat-open")}>
      <NavRail
        filter={filter}
        onFilterChange={setFilter}
        userName={displayName}
        onOpenProfile={openProfile}
        onLogout={handleLogout}
      />

      <ConversationList
        filter={filter}
        contacts={contacts}
        groups={groups}
        loading={listLoading}
        activeKey={activeKey}
        presence={presence}
        unread={unread}
        onSelect={selectConversation}
        onAddContact={openAddContact}
        onNewGroup={openNewGroup}
      />

      <main className="chat-pane">
        {active ? (
          <>
            <ChatHeader
              conversation={active}
              status={presence[active.id]}
              isTyping={isTyping}
              onBack={closeConversation}
              onOpenInfo={() => setGroupInfoOpen(true)}
            />
            <MessageList
              key={`messages:${activeKey}`}
              messages={messages}
              selfId={selfId}
              isGroup={active.type === "group"}
              loading={loading}
              hasMore={hasMore}
              error={error}
              onLoadOlder={loadOlder}
              onReply={handleReply}
            />
            <Composer
              key={`composer:${activeKey}`}
              selfId={selfId}
              replyTo={replyTo}
              onCancelReply={cancelReply}
              onSend={handleSend}
              onTyping={notifyTyping}
            />
          </>
        ) : (
          <EmptyChat userName={displayName} onAddContact={openAddContact} onNewGroup={openNewGroup} />
        )}
      </main>

      <AnimatePresence>
        {accountTab && (
          <AccountDrawer
            key="account"
            tab={accountTab}
            onTabChange={setAccountTab}
            onClose={closeAccount}
            email={user.email}
            displayName={displayName}
            contacts={contacts}
            onRenamed={handleRenamed}
            onContactAdded={handleContactAdded}
            onGroupCreated={handleGroupCreated}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {groupInfoOpen && active?.type === "group" && (
          <GroupInfoDrawer
            key={active.id}
            group={active}
            contacts={contacts}
            onClose={closeGroupInfo}
            onRenamed={handleGroupRenamed}
            onNotify={showToast}
          />
        )}
      </AnimatePresence>

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}

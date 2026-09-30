import React, { useState, forwardRef } from "react";
import axios from "axios";
import "./TopMenu.scss";
import { motion } from "framer-motion";

import { API_URL } from "../App.jsx";

const TopMenu = forwardRef(({ contacts, clickedGroupName, clickedGroupid, onGroupNameChange }, popupRef) => {

  const [openOption, setOpenOption] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [ids, setIds] = useState(new Set());
  const [creategroupStatus, setCreategroupStatus] = useState("");
  const [clickedButton, setClickedButton] = useState("");

  // ── Rename group state ──
  const [isRenaming, setIsRenaming] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [renameError, setRenameError] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);

  async function handleMembersClick() {
    try {
      setOpenOption("members");
      setClickedButton("members");
      const response = await axios.post(`${API_URL}/getgroupmembers`, { clickedGroupid });
      setGroupMembers(response.data.groupMembers);
      setIds(new Set(response.data.groupMembers.map((member) => member.friend_id)));
    } catch (err) {
      console.log(err);
    }
  }

  function convertMicroEpochToIST(microEpoch) {
    const date = new Date(Number(microEpoch) / 1000);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };
    return new Intl.DateTimeFormat("en-IN", options).format(date);
  }

  async function handleOverviewClick() {
    try {
      setOpenOption("overview");
      setClickedButton("overview");
      setIsRenaming(false);
      setRenameError("");
      const response = await axios.post(`${API_URL}/fetchGroupInfo`, { clickedGroupid });
      setCreatedAt(convertMicroEpochToIST(response.data.groupinfo.created_at));
    } catch (err) {
      console.log(err);
    }
  }

  function handleAddNewMember() {
    setOpenOption("addnewmember");
  }

  async function handleAddCheckedMembers() {
    setOpenOption("");
    if (checkedItems.length === 0) return;
    const timeAddmambers = (BigInt(Date.now()) * BigInt(1000)).toString();
    const res = await axios.post(`${API_URL}/addmemberstogroup`, {
      groupid: clickedGroupid,
      checkedItems,
      timeAddmambers,
    });
    setCreategroupStatus(res.data.message);
    setTimeout(() => setCreategroupStatus(""), 3000);
  }

  function handleCheckboxChange(event) {
    const { id, checked } = event.target;
    setCheckedItems((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  }

  function startRename() {
    setNewGroupName(clickedGroupName);
    setRenameError("");
    setIsRenaming(true);
  }

  function cancelRename() {
    setIsRenaming(false);
    setRenameError("");
  }

  async function saveRename() {
    const trimmed = newGroupName.trim();
    if (!trimmed) { setRenameError("Name cannot be empty."); return; }
    if (trimmed === clickedGroupName) { setIsRenaming(false); return; }
    setRenameLoading(true);
    try {
      await axios.post(`${API_URL}/updateGroupName`, { groupid: clickedGroupid, newName: trimmed });
      onGroupNameChange?.(clickedGroupid, trimmed);
      setIsRenaming(false);
      setRenameError("");
    } catch (err) {
      setRenameError(err.response?.data?.message || "Could not rename group.");
    } finally {
      setRenameLoading(false);
    }
  }

  return (
    <motion.div
      ref={popupRef}
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ type: "tween", duration: 0.2 }}
      className="topmenuforgroups leftsidemenu fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-4"
    >
      <div className="topmenuOptions">
        <div
          className={clickedButton === "overview" ? "GroupOverview hoverMenuOption" : "GroupOverview"}
          onClick={handleOverviewClick}
        >
          <img src={`${import.meta.env.BASE_URL}assets/iOverview.svg`} width="25px" height="25px" alt="Overview" />
          <p>Overview</p>
        </div>
        <div
          className={clickedButton === "members" ? "addGroupmembers hoverMenuOption" : "addGroupmembers"}
          onClick={handleMembersClick}
        >
          <img src={`${import.meta.env.BASE_URL}assets/add_friends.png`} width="25px" height="25px" alt="Members" />
          <p>Members</p>
        </div>
      </div>

      <div className="topmenuExecution">
        {openOption === "overview" && (
          <div className="OverViewDiv">
            <img src={`${import.meta.env.BASE_URL}assets/profile.svg`} width="70px" height="70px" alt="Group" />

            {/* ── Group name / rename ── */}
            {isRenaming ? (
              <div className="rename-group-wrap">
                <input
                  className="rename-group-input"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveRename(); if (e.key === "Escape") cancelRename(); }}
                  autoFocus
                  maxLength={60}
                />
                {renameError && <p className="rename-error">{renameError}</p>}
                <div className="rename-group-actions">
                  <button className="rename-btn rename-btn--save" onClick={saveRename} disabled={renameLoading}>
                    {renameLoading ? "…" : "Save"}
                  </button>
                  <button className="rename-btn rename-btn--cancel" onClick={cancelRename}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="group-name-row">
                <p className="group-name-text">{clickedGroupName}</p>
                <button className="rename-icon-btn" title="Rename group" onClick={startRename}>✎</button>
              </div>
            )}

            <p className="group-created-at">{`Created at: ${createdAt}`}</p>
          </div>
        )}

        {openOption === "members" && (
          <div className="groupmembersofgroup">
            {groupMembers.map((member) => (
              <div className="groupmemberofthisgroup" key={member.friend_id}>
                <img src={`${import.meta.env.BASE_URL}assets/profile_small.png`} width="25px" height="25px" alt="Member" />
                <p>{member.friend_name}</p>
              </div>
            ))}
          </div>
        )}

        {openOption === "members" && (
          <div className="addExtraMemberToGroup" onClick={handleAddNewMember}>
            <img src={`${import.meta.env.BASE_URL}assets/plusSvg.svg`} width="45px" height="45px" alt="Add Member" />
          </div>
        )}

        {openOption === "addnewmember" && (
          <div className="groupmembersofgroup">
            {contacts.map((contact) =>
              ids.has(contact.friend_id) ? (
                <div className="singlecontactPresent" key={contact.friend_id}>
                  <p className="AlreadyPresentName">{contact.friend_name}</p>
                  <p className="AlreadyPresent">Already in the group</p>
                </div>
              ) : (
                <div className="singlecontactforgroup" key={contact.friend_id}>
                  <input type="checkbox" id={contact.friend_id} onChange={handleCheckboxChange} />
                  <p>{contact.friend_name}</p>
                </div>
              )
            )}
          </div>
        )}

        {openOption === "addnewmember" && (
          <div className="addSelectedNewMembers" onClick={handleAddCheckedMembers}>
            <img src={`${import.meta.env.BASE_URL}assets/right-arrow.svg`} width="30px" height="40px" alt="Submit" />
          </div>
        )}

        <p className="creategroupStatus">{creategroupStatus}</p>
      </div>
    </motion.div>
  );
});

export default TopMenu;

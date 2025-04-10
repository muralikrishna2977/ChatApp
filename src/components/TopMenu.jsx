import React, { useState, forwardRef } from "react";
import axios from "axios";
import "./TopMenu.scss";
import { motion } from "framer-motion";

const API_URL = "https://trial2-production.up.railway.app"; // Use your Railway backend URL

const TopMenu = forwardRef(({ contacts, clickedGroupName, clickedGroupid }, popupRef) => {
  const [openOverview, setOpenOverview] = useState(false);
  const [openMembers, setOpenMembers] = useState(false);
  const [openAddNewMember, setOpenAddNewMember] = useState(false);
  const [createdAt, setCreatedAt] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [ids, setIds] = useState(new Set());
  const [creategroupStatus, setCreategroupStatus] = useState("");

  async function handleMembersClick() {
    try { 
      setOpenMembers(true);
      setOpenOverview(false);
      setOpenAddNewMember(false);
      const response = await axios.post(`${API_URL}/getgroupmembers`, { clickedGroupid });
      setGroupMembers(response.data.groupMembers); 
      setIds(new Set(response.data.groupMembers.map(member => member.friend_id)));
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
    const formattedDate = new Intl.DateTimeFormat("en-IN", options).format(date);
    return formattedDate;
  }

  async function handleOverviewClick() {
    try {
      setOpenMembers(false);
      setOpenAddNewMember(false);
      const response = await axios.post(`${API_URL}/fetchGroupInfo`, { clickedGroupid });
      console.log("gr id ", clickedGroupid);
      setCreatedAt(convertMicroEpochToIST(response.data.groupinfo.created_at));
      setOpenOverview(true);
    } catch (err) {
      console.log(err);
    }
  }

  function handleAddNewMember() {
    setOpenAddNewMember(true);
    setOpenOverview(false);
    setOpenMembers(false);
  }

  async function handleAddCheckedMembers() {
    setOpenAddNewMember(false);
    if (checkedItems.length === 0) {
      return;
    }
    const timeAddmambers = (BigInt(Date.now()) * BigInt(1000)).toString(); 
    const res = await axios.post(`${API_URL}/addmemberstogroup`, { groupid: clickedGroupid, checkedItems, timeAddmambers });
    setCreategroupStatus(res.data.message);
    setTimeout(() => {
      setCreategroupStatus("");
    }, 3000);
  }

  function handleCheckboxChange(event) {
    const { id, checked } = event.target;
    setCheckedItems((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  return (
    <motion.div
      ref={popupRef} 
      initial={{ y: "-100%" }} // Start completely off-screen (above)
      animate={{ y: 0 }} // Slide down into position
      exit={{ y: "-100%" }} // Slide back up when hidden
      transition={{ type: "tween", duration: 0.2 }} // Smooth transition
      className="topmenuforgroups leftsidemenu fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-4"
    >
      <div className="topmenuOptions">
        <div className="GroupOverview" onClick={handleOverviewClick}>
          <img src={`${import.meta.env.BASE_URL}assets/iOverview.svg`} width="25px" height="25px" alt="Overview" />
          <p>Overview</p>
        </div>
        <div className="addGroupmembers" onClick={handleMembersClick}>
          <img src={`${import.meta.env.BASE_URL}assets/add_friends.png`} width="25px" height="25px" alt="Members" />
          <p>Members</p>
        </div>
      </div>
      <div className="topmenuExecution">
        {openOverview && (
          <div className="OverViewDiv">
            <img src={`${import.meta.env.BASE_URL}assets/profile.svg`} width="70px" height="70px" alt="Group" />
            <p>{clickedGroupName}</p>
            <p>{`Created at: ${createdAt}`}</p>
          </div>
        )}
        {openMembers && (
          <div className="groupmembersofgroup">
            {groupMembers.map((member) => (
              <div className="groupmemberofthisgroup" key={member.friend_id}>
                <img src={`${import.meta.env.BASE_URL}assets/profile_small.png`} width="25px" height="25px" alt="Member" />
                <p>{member.friend_name}</p>
              </div>
            ))}
          </div>
        )}
        {openMembers && (
          <div className="addExtraMemberToGroup" onClick={handleAddNewMember}>
            <img src={`${import.meta.env.BASE_URL}assets/plusSvg.svg`} width="45px" height="45px" alt="Add Member" />
          </div>
        )}
        {openAddNewMember && (
          <div className="groupmembersofgroup">
            {contacts.map((contact) =>
              ids.has(contact.friend_id) ? (
                <div className="singlecontactPresent" key={contact.friend_id}>
                  <p className="AlreadyPresentName">{contact.friend_name}</p>
                  <p className="AlreadyPresent">Already in the group</p>
                </div>
              ) : (
                <div className="singlecontactforgroup" key={contact.friend_id}>
                  <input
                    type="checkbox"
                    id={contact.friend_id}
                    onChange={handleCheckboxChange}
                  />
                  <p>{contact.friend_name}</p>
                </div>
              )
            )}
          </div>
        )}
        {openAddNewMember && (
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

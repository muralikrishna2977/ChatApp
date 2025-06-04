import { useState, forwardRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LeftMenu.scss";
import { motion } from "framer-motion";

import { API_URL } from "../App.jsx";

const LeftMenu = forwardRef(
  ({ senderid, email, contacts, setContacts, setGroups, name, setName}, popupRef_s) => {
    const navigate = useNavigate();
    // const [name, setName] = useState("");
    const [openOption, setOpenOption]=useState("");
    // const [editnameofSender, setEditnameofSender] = useState("");
    const [editname, setEditname] = useState(true);
    const [error, setError] = useState("");
    const [member, setMember] = useState("");
    const [membererror, setMembererror] = useState("");
    const [status, setStatus] = useState("");
    const [checkedItems, setCheckedItems] = useState([senderid]);
    const [openNamegroup, setOpenNamegroup] = useState(false);
    const [groupname, setGroupname] = useState("");
    const [creategroupStatus, setCreategroupStatus] = useState("");

    async function handleClickAddfriend(event) {
      event.preventDefault();
      try {
        const response = await axios.post(`${API_URL}/findifexist`, { member });
        if (response.data.contacts.length === 1) {
          var fri_id = response.data.contacts[0]._id.toString();
          var fri_name = response.data.contacts[0].name;
          var obj = { friend_id: fri_id, friend_name: fri_name };
          setContacts((prevContacts) => [...prevContacts, obj]);
          const respon = await axios.post(`${API_URL}/addfriend`, {
            senderid,
            fri_id,
            fri_name,
          });
          setMembererror("");
          setStatus(respon.data.message);
          setTimeout(() => {
            setStatus("");
          }, 2000);
        } else if (response.data.contacts.length === 0) {
          setStatus("");
          setMembererror("No such user");
          setTimeout(() => {
            setMembererror("");
          }, 2000);
        }
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    }

    async function handleEditname() {
      try {
        const response = await axios.post(`${API_URL}/editsendername`, { name, senderid });
        setName(name);
        setEditname(true); 
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    }

    async function handleClickProfile() {
      setOpenNamegroup(false);
      setOpenOption("profile");
    }

    useEffect(()=>{
      handleClickProfile();
    }, [])

    function handleClickNewGroup() {
      setOpenNamegroup(false);
      setOpenOption("addGroup");
    }

    function handleCheckboxChange(event) {
      const { id, checked } = event.target;
      setCheckedItems((prev) =>
        checked ? [...prev, id] : prev.filter((item) => item !== id)
      );
    }

    function handleAddforgroup() {
      setOpenOption("");
      setOpenNamegroup(true);
    }

    async function handleCreateGroup(event) {
      event.preventDefault();
      try {
        const time = (BigInt(Date.now()) * BigInt(1000)).toString();
        const response = await axios.post(`${API_URL}/creategroup`, { groupname, senderid, time });
        const groupid = response.data.groupid;
        const timeAddmambers = (BigInt(Date.now()) * BigInt(1000)).toString();
        const res = await axios.post(`${API_URL}/addmemberstogroup`, { groupid, checkedItems, timeAddmambers });
        const obj = {
          groupid: groupid,
          name: groupname,
        };
        setGroups((prev) => [...prev, obj]);
        console.log(checkedItems);
        setCreategroupStatus(res.data.message);
        setGroupname("");
        setTimeout(() => {
          setCreategroupStatus("");
        }, 2000);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    }

    return (
      <motion.div
        ref={popupRef_s}
        initial={{ x: "-100%" }} // Start completely off-screen (left)
        animate={{ x: 9 }} // Slide in to position
        exit={{ x: "-100%" }} // Slide out when hidden
        transition={{ type: "tween", duration: 0.2 }} // Smooth transition
        className="leftsidemenu fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-4"
      >
        <div className="leftsidemenuoptions">
          <div className="mo_except_logout">

            <div 
              className={openOption==="profile"?"hoverMenuOption menuoption": "menuoption"}
              onClick={handleClickProfile}
            >
              <img src={`${import.meta.env.BASE_URL}assets/profile_small.png`} width="25px" height="25px" alt="Profile" />
              <p>Profile</p>
            </div>

            <div
              className={openOption==="addFriend"?"hoverMenuOption menuoption": "menuoption"}
              onClick={() => {
                setOpenNamegroup(false);
                setOpenOption("addFriend");
              }}
            >
              <img src={`${import.meta.env.BASE_URL}assets/add_friends.png`} width="25px" height="25px" alt="Add Friend" />
              <p>Add Friend</p>
            </div>

            <div 
              // className="menuoption" 
              className={openOption==="addGroup"?"hoverMenuOption menuoption": "menuoption"}
              onClick={handleClickNewGroup}
            >
              <img src={`${import.meta.env.BASE_URL}assets/my_team.svg`} width="30px" height="30px" alt="New Group" />
              <p>New Group</p>
            </div>
          </div>

          <div className="menuoption" onClick={() => navigate("/")}>
            <img
              className="applogout"
              src={`${import.meta.env.BASE_URL}assets/logout.png`}
              width="22px"
              height="22px"
              alt="Logout"
            />
            <p>Logout</p>
          </div>
        </div>

        <div className="leftsidemenuexecution">
          {openOption==="addFriend" && (
            <div className="addfriendanderror">
              <img src={`${import.meta.env.BASE_URL}assets/add_friends.png`} width="80px" height="80px" alt="Add Friend" />
              <form className="addfriend" onSubmit={handleClickAddfriend}>
                <input
                  placeholder="Enter Email"
                  type="email"
                  value={member}
                  onChange={(event) => setMember(event.target.value)}
                  required
                />
                <button type="submit">Add</button>
              </form>
              <div className="error_user">
                <p className="addFriendError">{membererror}</p>
                <p className="addFriendSuccess">{status}</p>
              </div>
            </div>
          )}

          {openOption==="profile" && (
            <div className="openProfileclass">
              <img className="profilePicture" src={`${import.meta.env.BASE_URL}assets/profile_sideview.png`} width="100px" height="100px" alt="Profile" />
              <div className="emailname">
                <div className="editname">
                  {editname && <h4>{name}</h4>}
                  {editname && (
                    <div className="pensilEdit">
                      <img
                        src={`${import.meta.env.BASE_URL}assets/pensil_edit.svg`}
                        width="20px"
                        height="20px"
                        alt="Edit"
                        onClick={() => {
                          setEditname(false);
                          setName(name);
                        }}
                      />
                    </div>
                  )}
                  {!editname && (
                    <input
                      placeholder="Enter Name"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  )}
                  {!editname && (
                    <div className="pensilEdit">
                      <img
                        src={`${import.meta.env.BASE_URL}assets/tick.svg`}
                        width="20px"
                        height="20px"
                        alt="Confirm"
                        onClick={handleEditname}
                      />
                    </div>
                  )}
                </div>
                <p>{email}</p>
              </div>
            </div>
          )}

          {openOption==="addGroup" && (
            <div className="contactsforgroup">
              {contacts.map((contact) => (
                <div className="singlecontactforgroup" key={contact.friend_id}>
                  <input type="checkbox" id={contact.friend_id} onChange={handleCheckboxChange} />
                  <p>{contact.friend_name}</p>
                </div>
              ))}
              <div className="addforgroup" onClick={handleAddforgroup}>
                <img src={`${import.meta.env.BASE_URL}assets/right-arrow.svg`} width="30px" height="40px" alt="Next" />
              </div>
            </div>
          )}

          {openNamegroup && (
            <div className="entergroupname">
              <p>Group Name</p>
              <form className="creategroup" onSubmit={handleCreateGroup}>
                <input
                  type="text"
                  placeholder="Enter Group Name"
                  onChange={(event) => setGroupname(event.target.value)}
                  value={groupname}
                  required
                />
                <button type="submit">Create</button>
              </form>
              <div className="createGroupStatus">
                <p>{creategroupStatus}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);

export default LeftMenu;

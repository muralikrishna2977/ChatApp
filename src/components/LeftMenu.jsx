// import React, { useState, forwardRef} from "react";
// import axios from "axios";
// import {useNavigate } from "react-router-dom";
// import "./LeftMenu.scss";
// import { motion } from "framer-motion";



// const LeftMenu = forwardRef(({ senderid, email, contacts, setContacts, groups, setGroups}, popupRef_s) => {
//     const navigate = useNavigate();
//     const [name, setName]=useState("");

//     const [openaddfriend, setOpenaddfriend]=useState(false);
//     const [openProfile, setOpenProfile]=useState(false);
//     const [openAddgroup, setOpenAddgroup]=useState(false);

//     const [editnameofSender, setEditnameofSender] = useState("");
//     const [editname, setEditname] = useState(true);
//     const [error, setError] = useState("");
//     const [member, setMember] = useState("");
//     const [membererror, setMembererror] = useState("");
//     const [status, setStatus]=useState("");
//     const [checkedItems, setCheckedItems] = useState([senderid]);
//     const [openNamegroup, setOpenNamegroup]=useState(false);
//     const [groupname, setGroupname]=useState("");
//     const [creategroupStatus, setCreategroupStatus]=useState("");

//     async function handleClickAddfriend(event) {
//         event.preventDefault();
    
//         try {
//           const response = await axios.post("http://localhost:3000/findifexist", {
//             member,
//           });
//           if (response.data.contacts.length === 1) {
//             var fri_id = response.data.contacts[0]._id.toString();
//             var fri_name = response.data.contacts[0].name;
//             var obj = { friend_id: fri_id, friend_name: fri_name };
//             setContacts((prevContacts) => [...prevContacts, obj]);
//             const respon = await axios.post("http://localhost:3000/addfriend", {
//               senderid,
//               fri_id,
//               fri_name,
//             });
//             setMembererror("");
//             setStatus(respon.data.message);
//             setTimeout(() => {
//               setStatus("");
//             }, 2000);
//           } else if (response.data.contacts.length === 0) {
//             setStatus("");
//             setMembererror("No such user");
//             setTimeout(() => {
//               setMembererror("");
//             }, 2000);
    
//           }
//           setError("");
//         } catch (err) {
//           setError(err.response?.data?.message || "An error occurred");
//         }
//       }

//     async function handleEditname()
//     {
//       try {
//         const response = await axios.post("http://localhost:3000/editsendername", 
//         {editnameofSender, senderid});
//         setName(editnameofSender);
//         setEditname(true);
//         setError("");
//       } catch (err) {
//         setError(err.response?.data?.message || "An error occurred");
//       }
//     }
  
//     async function handleClickProfile() {
      
//       try {
//         console.log("senderid ", senderid);
//         const response = await axios.post("http://localhost:3000/getname", 
//         {senderid});

//         setName(response.data.name);
//         setEditname(true);
//         setOpenProfile(true);
//         setOpenaddfriend(false);
//         setOpenAddgroup(false);
//         setOpenNamegroup(false);
//         setError("");
//       } catch (err) {
//         setError(err.response?.data?.message || "An error occurred");
//       }
//     }
  
//     function handleClickNewGroup() {
//       setOpenNamegroup(false);
//       setOpenAddgroup(true);
//       setOpenProfile(false);
//       setOpenaddfriend(false);
//     }

//     function handleCheckboxChange(event){
//       const { id, checked } = event.target;

//       setCheckedItems((prev) =>
//         checked ? [...prev, id] : prev.filter((item) => item !== id)
//       );
      
//     };

//     function handleAddforgroup(){
//       setOpenAddgroup(false);
//       setOpenNamegroup(true);
//     }

//     async function handleCreateGroup(event){
//       event.preventDefault();
//       try {
//         const time = (BigInt(Date.now()) * BigInt(1000)).toString(); 
//         const response = await axios.post("http://localhost:3000/creategroup", 
//         {groupname, senderid, time});
//         const groupid=response.data.groupid;

//         const timeAddmambers = (BigInt(Date.now()) * BigInt(1000)).toString(); 
//         const res=await axios.post("http://localhost:3000/addmemberstogroup", {groupid, checkedItems, timeAddmambers});
//         const obj={
//           groupid: groupid,
//           name: groupname,
//         }
//         setGroups((prev) => [...prev, obj]);
//         console.log(checkedItems);
//         setCreategroupStatus(res.data.message);
//         setGroupname("");
//         setTimeout(() => {
//           setCreategroupStatus("");
//         }, 2000);
//         setError("");
//       } catch (err) {
//         setError(err.response?.data?.message || "An error occurred");
//       }
//     }

    


//     return (
//       <motion.div 
//         ref={popupRef_s} 
//         initial={{ x: "-100%" }} // Start completely off-screen (left)
//         animate={{ x: 0 }} // Slide in to position
//         exit={{ x: "-100%" }} // Slide out when hidden
//         transition={{ type: "tween", duration: 0.2 }} // Smooth transition
//         className="leftsidemenu fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-4"
//       >
//         <div className="leftsidemenuoptions">
//           <div className="mo_except_logout">
//             <div
//               className="menuoption"
//               onClick={() => {
//                 setOpenaddfriend(true);
//                 setOpenProfile(false);
//                 setOpenAddgroup(false);
//                 setOpenNamegroup(false);
//               }}
//             >
//               <img src="/assets/add_friends.png" width="25px" height="25px" />
//               <p>Add Friend</p>
//             </div>

//             <div className="menuoption" onClick={handleClickProfile}>
//               <img src="/assets/profile_small.png" width="25px" height="25px" />
//               <p>Profile</p>
//             </div>

//             <div className="menuoption" onClick={handleClickNewGroup}>
//               <img src="/assets/my_team.svg" width="30px" height="30px" />
//               <p>New Group</p>
//             </div>
//           </div>

//           <div className="menuoption" onClick={() => navigate("/")}>
//             <img
//               className="applogout"
//               src="/assets/logout.png"
//               width="22px"
//               height="22px"
//             />
//             <p>Logout</p>
//           </div>
//         </div>

//         <div className="leftsidemenuexecution">
//           {openaddfriend && (
//             <div className="addfriendanderror">
//               <img src="/assets/add_friends.png" width="80px" height="80px" />
//               <form className="addfriend" onSubmit={handleClickAddfriend}>
//                 <input
//                   placeholder="Enter Email"
//                   type="email"
//                   value={member}
//                   onChange={(event) => setMember(event.target.value)}
//                   required
//                 />
//                 <button type="submit">Add</button>
//               </form>
//               <div className="error_user">
//                 <p className="addFriendError">{membererror}</p>
//                 <p className="addFriendSuccess">{status}</p>
//               </div>
//             </div>
//           )}

//           {openProfile && (
//             <div className="openProfileclass">
//               <img src="/assets/profile_small.png" width="80px" height="80px" />
//               <div className="emailname">
//                 <div className="editname">
//                   {editname && <h3>{name}</h3>}

//                   {editname && (
//                     <img
//                       src="/assets/pensil_edit.svg"
//                       width="20px"
//                       height="20px"
//                       onClick={() => {
//                         setEditname(false);
//                         setEditnameofSender(name);
//                       }}
//                     />
//                   )}

//                   {!editname && (
//                     <input
//                       placeholder="Enter Name"
//                       type="text"
//                       value={editnameofSender}
//                       onChange={(event) =>
//                         setEditnameofSender(event.target.value)
//                       }
//                       required
//                     />
//                   )}
//                   {!editname && (
//                     <img
//                       src="/assets/tick.svg"
//                       width="20px"
//                       height="20px"
//                       onClick={handleEditname}
//                     />
//                   )}
//                 </div>
//                 <h4>{email}</h4>
//               </div>
//             </div>
//           )}

//           {openAddgroup && (
//             <div className="contactsforgroup">
//               {contacts.map((contact) => (
//                 console.log(contact.friend_id),
//                 <div className="singlecontactforgroup" key={contact.friend_id}>
//                   <input type="checkbox" id={contact.friend_id} onChange={handleCheckboxChange} />
//                   <p>{contact.friend_name}</p>
//                 </div>
//               ))}

//               <div className="addforgroup" onClick={handleAddforgroup}>
//                 <img src="/assets/right-arrow.svg" width="30px" height="40px" />
//               </div>
//             </div>
//           )}

//           {openNamegroup &&
//             <div className="entergroupname">
//               <p>Group Name</p>
//               <form className="creategroup" onSubmit={handleCreateGroup}>
//                 <input type="text" placeholder="Enter Group Name" onChange={(event) =>setGroupname(event.target.value)} value={groupname} required/>
//                 <button type="submit">Create</button>
//               </form>
//               <div className="createGroupStatus">
//                 <p>{creategroupStatus}</p>
//               </div>
//             </div>
//           }

//         </div>
//       </motion.div>
//     );
// });

// export default LeftMenu;


import React, { useState, forwardRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LeftMenu.scss";
import { motion } from "framer-motion";

const API_URL = "https://trial2-production.up.railway.app"; // Your Railway backend URL

const LeftMenu = forwardRef(
  ({ senderid, email, contacts, setContacts, groups, setGroups }, popupRef_s) => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [openaddfriend, setOpenaddfriend] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [openAddgroup, setOpenAddgroup] = useState(false);
    const [editnameofSender, setEditnameofSender] = useState("");
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
        const response = await axios.post(`${API_URL}/editsendername`, { editnameofSender, senderid });
        setName(editnameofSender);
        setEditname(true);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    }

    async function handleClickProfile() {
      try {
        console.log("senderid ", senderid);
        const response = await axios.post(`${API_URL}/getname`, { senderid });
        setName(response.data.name);
        setEditname(true);
        setOpenProfile(true);
        setOpenaddfriend(false);
        setOpenAddgroup(false);
        setOpenNamegroup(false);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      }
    }

    function handleClickNewGroup() {
      setOpenNamegroup(false);
      setOpenAddgroup(true);
      setOpenProfile(false);
      setOpenaddfriend(false);
    }

    function handleCheckboxChange(event) {
      const { id, checked } = event.target;
      setCheckedItems((prev) =>
        checked ? [...prev, id] : prev.filter((item) => item !== id)
      );
    }

    function handleAddforgroup() {
      setOpenAddgroup(false);
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
        animate={{ x: 0 }} // Slide in to position
        exit={{ x: "-100%" }} // Slide out when hidden
        transition={{ type: "tween", duration: 0.2 }} // Smooth transition
        className="leftsidemenu fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-4"
      >
        <div className="leftsidemenuoptions">
          <div className="mo_except_logout">
            <div
              className="menuoption"
              onClick={() => {
                setOpenaddfriend(true);
                setOpenProfile(false);
                setOpenAddgroup(false);
                setOpenNamegroup(false);
              }}
            >
              <img src={`${import.meta.env.BASE_URL}assets/add_friends.png`} width="25px" height="25px" alt="Add Friend" />
              <p>Add Friend</p>
            </div>

            <div className="menuoption" onClick={handleClickProfile}>
              <img src={`${import.meta.env.BASE_URL}assets/profile_small.png`} width="25px" height="25px" alt="Profile" />
              <p>Profile</p>
            </div>

            <div className="menuoption" onClick={handleClickNewGroup}>
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
          {openaddfriend && (
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

          {openProfile && (
            <div className="openProfileclass">
              <img src={`${import.meta.env.BASE_URL}assets/profile_small.png`} width="80px" height="80px" alt="Profile" />
              <div className="emailname">
                <div className="editname">
                  {editname && <h3>{name}</h3>}
                  {editname && (
                    <img
                      src={`${import.meta.env.BASE_URL}assets/pensil_edit.svg`}
                      width="20px"
                      height="20px"
                      alt="Edit"
                      onClick={() => {
                        setEditname(false);
                        setEditnameofSender(name);
                      }}
                    />
                  )}
                  {!editname && (
                    <input
                      placeholder="Enter Name"
                      type="text"
                      value={editnameofSender}
                      onChange={(event) => setEditnameofSender(event.target.value)}
                      required
                    />
                  )}
                  {!editname && (
                    <img
                      src={`${import.meta.env.BASE_URL}assets/tick.svg`}
                      width="20px"
                      height="20px"
                      alt="Confirm"
                      onClick={handleEditname}
                    />
                  )}
                </div>
                <h4>{email}</h4>
              </div>
            </div>
          )}

          {openAddgroup && (
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

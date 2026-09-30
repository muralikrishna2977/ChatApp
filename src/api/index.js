import axios from "axios";
import { API_URL } from "../config.js";

const http = axios.create({ baseURL: API_URL });

const post = (url, body) => http.post(url, body).then((res) => res.data);

export function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  return err?.response?.data?.message || fallback;
}

export const authApi = {
  signIn: (email, password) => post("/signin", { email, password }),
  signUp: (name, email, password) => post("/signup", { name, email, password }),
};

export const userApi = {
  getName: (senderid) => post("/getname", { senderid }),
  rename: (senderid, name) => post("/editsendername", { senderid, name }),
  findByEmail: (member) => post("/findifexist", { member }),
};

export const contactApi = {
  list: (senderid) => post("/contacts", { senderid }),
  add: (senderid, friendId, friendName) =>
    post("/addfriend", { senderid, fri_id: friendId, fri_name: friendName }),
};

export const groupApi = {
  list: (senderid) => post("/getgroups", { senderid }),
  create: (groupname, senderid, time) => post("/creategroup", { groupname, senderid, time }),
  addMembers: (groupid, memberIds, time) =>
    post("/addmemberstogroup", { groupid, checkedItems: memberIds, timeAddmambers: time }),
  members: (groupid) => post("/getgroupmembers", { clickedGroupid: groupid }),
  info: (groupid) => post("/fetchGroupInfo", { clickedGroupid: groupid }),
  rename: (groupid, newName) => post("/updateGroupName", { groupid, newName }),
};

export const messageApi = {
  directInitial: (senderid, reciverid) => post("/gethistoryinitial", { senderid, reciverid }),
  directBefore: (senderid, reciverid, time) => post("/gethistory", { senderid, reciverid, time }),
  sendDirect: (payload) => post("/sendmessageinchat", payload),
  // Also joins the caller's socket to the group room on the server.
  groupInitial: (groupid, senderid) =>
    post("/createroomforgroupandfetchhistory", { groupid, senderid }),
  groupBefore: (groupid, time) => post("/fetchhistoryforgroup", { groupid, time }),
};

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await http.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.url;
}

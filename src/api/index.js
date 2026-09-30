import axios from "axios";
import { API_URL } from "../config.js";
import { clearUser, getToken } from "../lib/session.js";

const http = axios.create({ baseURL: API_URL });

// The server identifies the caller from this token, never from ids in the body.
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Expired or invalid session: sign out and return to the sign-in screen.
export function endSession() {
  clearUser();
  window.location.hash = "#/";
}

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) endSession();
    return Promise.reject(error);
  }
);

const post = (url, body) => http.post(url, body).then((res) => res.data);

export function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  return err?.response?.data?.message || fallback;
}

export const authApi = {
  signIn: (email, password) => post("/signin", { email, password }),
  signUp: (name, email, password) => post("/signup", { name, email, password }),
};

export const userApi = {
  getName: () => post("/getname"),
  rename: (name) => post("/editsendername", { name }),
  findByEmail: (member) => post("/findifexist", { member }),
};

export const contactApi = {
  list: () => post("/contacts"),
  add: (friendId, friendName) => post("/addfriend", { fri_id: friendId, fri_name: friendName }),
};

export const groupApi = {
  list: () => post("/getgroups"),
  // The server adds the creator as the first member.
  create: (groupname, time) => post("/creategroup", { groupname, time }),
  addMembers: (groupid, memberIds, time) =>
    post("/addmemberstogroup", { groupid, checkedItems: memberIds, timeAddmambers: time }),
  members: (groupid) => post("/getgroupmembers", { clickedGroupid: groupid }),
  info: (groupid) => post("/fetchGroupInfo", { clickedGroupid: groupid }),
  rename: (groupid, newName) => post("/updateGroupName", { groupid, newName }),
};

export const messageApi = {
  directInitial: (reciverid) => post("/gethistoryinitial", { reciverid }),
  directBefore: (reciverid, time) => post("/gethistory", { reciverid, time }),
  sendDirect: (payload) => post("/sendmessageinchat", payload),
  // Also joins our socket to the group room on the server.
  groupInitial: (groupid) => post("/createroomforgroupandfetchhistory", { groupid }),
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

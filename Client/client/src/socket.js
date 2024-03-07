import { io } from "socket.io-client";
const access_token = localStorage.getItem("access_token");
// const socket = io("http://localhost:4000", {
const socket = io("http://174.138.16.213:4000", {
  auth: {
    Authorization: `Bearer ${access_token}`,
  },
});

export default socket;

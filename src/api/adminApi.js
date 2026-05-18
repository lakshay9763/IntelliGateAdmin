import axios from "axios";

const adminApi = axios.create({
  baseURL: "https://intelligate-server.onrender.com/admin", 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default adminApi
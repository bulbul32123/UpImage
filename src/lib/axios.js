// src/lib/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // same domain as your Next.js app
  withCredentials: true, // ✅ ensures cookies are sent/received
});

export default api;

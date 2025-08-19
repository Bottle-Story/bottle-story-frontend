import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "", // 로컬일 땐 localhost, 배포일 땐 빈 값
  withCredentials: process.env.REACT_APP_WITH_CREDENTIALS === "true", // 로컬에서만 true
});

export default api;

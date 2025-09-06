import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE;

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "", // 로컬일 땐 localhost, 배포일 땐 빈 값
  withCredentials: process.env.REACT_APP_WITH_CREDENTIALS === "true", // 로컬에서만 true
});


// 응답 인터셉터: SEC003 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 서버 응답 형식이 { code: "SEC003", ... } 라고 가정
    if (error.response?.data?.code === "SEC003" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 재발급 요청
        const res = await axios.post(`${API_BASE}/member/reissue`, {}, { withCredentials: true });

          return api(originalRequest);
        
      } catch (reissueError) {
        console.error("토큰 재발급 실패", reissueError);
        // 재발급 실패 시 로그인 페이지로 이동
        window.location.href = "/doit";
      }
    }

    return Promise.reject(error);
  }
);


export default api;

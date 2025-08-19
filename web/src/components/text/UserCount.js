// src/components/text/UserCount.js
import React from "react";

const UserCount = ({ count = 0 }) => {
  return (
    <div
      style={{
  position: "absolute",
  top: "21vh",              // 300px → 화면 높이 비율
  right: "1vw",             // 70px → 화면 너비 비율
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",            // 8px → rem 단위
  background: "rgba(255, 255, 255, 0.15)",
  backdropFilter: "blur(6px)",
  borderRadius: "12px",
  padding: "0.5rem 1rem",   // 8px 14px → rem 단위
  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
  color: "#fff",
  fontSize: "clamp(11px, 2vw, 13px)", // 최소 12px, 최대 16px, 뷰포트에 따라 자동 조절
  fontWeight: "500",
  zIndex: 1100,
  border: "1px solid rgba(255,255,255,0.25)"
      }}
    >
    
      <span style={{ fontFamily: "'Gowun Dodum', sans-serif" }}>
        바다에 있는 사람 {count}명
      </span>
    </div>
  );
};

export default UserCount;

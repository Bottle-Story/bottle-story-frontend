// src/components/text/UserCount.js
import React from "react";

const UserCount = ({ count = 0 }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "300px",
        right: "70px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(6px)",
        borderRadius: "12px",
        padding: "8px 14px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
        color: "#fff",
        fontSize: "16px",
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

import React from "react";
import { FiLogOut } from "react-icons/fi";
import "./LogoutButton.css"; // 스타일 분리

export default function LogoutButton({ onLogout }) {
  return (
    <button className="logout-button" onClick={onLogout}>
      <FiLogOut size={20} />
    </button>
  );
}

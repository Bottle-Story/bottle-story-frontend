// src/components/Time.js
import React from 'react';
import './Time.css';

export default function TimeText({ font, color }) {
  return (
    <div
      className="time-text"
      style={{
        fontFamily: font ? `"${font}", sans-serif` : 'sans-serif',
        color: color || '#fff',
      }}
    >
      2025-08-15 19:30
    </div>
  );
}

// src/components/Time.js
import React from 'react';
import './Time.css';

export default function TimeText({ font, color }) {
  return (
    <div
      className="temperature-text"
      style={{
        fontFamily: font ? `"${font}", sans-serif` : 'sans-serif',
        color: color || '#fff',
      }}
    >
      -30℃
    </div>
  );
}

// src/components/Time.js
import React from 'react';
import './Time.css';

const Temperature = ({ t1h = 20, font, color}) => {
  return (
    <div
      className="temperature-text"
      style={{
        fontFamily: font ? `"${font}", sans-serif` : 'sans-serif',
        color: color || '#fff',
      }}
    >
    
      {t1h}℃
    </div>
  );
};


export default Temperature;



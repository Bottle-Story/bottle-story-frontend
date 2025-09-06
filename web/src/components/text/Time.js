// src/components/Time.js
import React, { useEffect, useState } from 'react';
import './Time.css';

export default function TimeText({ font, color }) {
  const [timeText, setTimeText] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // 한국 시간(KST, UTC+9)으로 변환
      const koreaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));

      const year = koreaTime.getFullYear();
      const month = String(koreaTime.getMonth() + 1).padStart(2, '0');
      const date = String(koreaTime.getDate()).padStart(2, '0');
      const hours = String(koreaTime.getHours()).padStart(2, '0');
      const minutes = String(koreaTime.getMinutes()).padStart(2, '0');

      setTimeText(`${year}-${month}-${date} ${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="time-text"
      style={{
        fontFamily: font ? `"${font}", sans-serif` : 'sans-serif',
        color: color || '#fff',
      }}
    >
      {timeText}
    </div>
  );
}

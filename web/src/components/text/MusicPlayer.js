// src/components/MusicPlayer.js
import React, { useState, useRef } from 'react';

export default function MusicPlayer({ src, position = [0, 0] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(src));

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
<div 
  style={{ 
    position: 'absolute', 
    left: position[0], 
    top: position[1], 
    zIndex: 1000,
    backgroundColor: 'transparent', // div 배경 투명
  }}
>
  <button 
    onClick={togglePlay} 
    style={{
      padding: '10px 20px',
      fontSize: '50px',
      cursor: 'pointer',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: 'transparent', // 버튼 배경 투명
      color: '#fff',
    }}
  >
    {isPlaying ? '⏸️' : '▶️'}
  </button>
</div>

  );
}

// src/Login.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import Ocean from './ocean/Ocean';
import SkyType from './sky/Sky';
import '../css/Login.css';

export default function Login() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      
      {/* 3D 배경 */}
      <Canvas camera={{ position: [0, 10, 20], fov: 75 }}>  
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 25, 10]} intensity={0.8} />
        <SkyType code={'DAWN_MOON_CLEAR'} sunPosition={[10, 20, 10]} />
        <Ocean code={'DAWN_OCEAN'} />
      </Canvas>

      {/* 블러 오버레이 */}
      <div className="blur-overlay"></div>

      {/* 모달 */}
      <div className="login-modal">
        <h1>Bottle Story</h1>
        <p>여러분의 고민... 누군가 들어줄 수 있습니다</p>
        <p>몽환적인 감성과 함께 유리병 편지를 띄워보세요</p>

        <div className="login-buttons">
          <button className="kakao-btn">카카오 로그인</button>
          <button className="naver-btn">네이버 로그인</button>
          <button className="google-btn">구글 로그인</button>
        </div>
      </div>
    </div>
  );
}

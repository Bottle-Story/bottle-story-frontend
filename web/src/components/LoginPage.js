// src/Login.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import Ocean from './ocean/Ocean';
import SkyType from './sky/Sky';
import '../css/Login.css';
import api from '../api/api'; // mock 로그인 호출용

export default function Login() {
  const API_BASE = process.env.REACT_APP_API_BASE; 
  const LOGIN_API_BASE = process.env.REACT_APP_LOGIN_API_BASE;
  const ENV = process.env.REACT_APP_ENV; // 개발환경 구분용 변수 (dev, prod 등)

  const handleMockLogin = async () => {
    try {
      const response = await api.post('/mock/login', {
        username: 'devUser',
        password: 'devPass'
      });
      if (response.status === 200) {
        // 성공 시 세션/토큰 처리
        console.log('Mock login success', response.data);
        window.location.href = '/'; // 로그인 후 리다이렉트
      }
    } catch (error) {
      console.error('Mock login failed', error);
    }
  };

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
          <button
            className="kakao-btn"
            onClick={() => window.location.href=`${LOGIN_API_BASE}/oauth2/authorization/kakao`}
          >
            카카오 로그인
          </button>

          <button
            className="naver-btn"
            onClick={() => window.location.href=`${LOGIN_API_BASE}/oauth2/authorization/naver`}
          >
            네이버 로그인
          </button>

          <button
            className="google-btn"
            onClick={() => window.location.href=`${LOGIN_API_BASE}/oauth2/authorization/google`}
          >
            구글 로그인
          </button>

          {/* 개발환경에서만 보이는 Mock 로그인 */}
          {ENV === 'dev' && (
            <button
              className="mock-btn"
              onClick={handleMockLogin}
            >
              개발용 Mock 로그인
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import Ocean from './ocean/Ocean';
import Particle from './particle/Particle';
import SkyType from './sky/Sky';
import Timer from './text/Time';
import Temperature from './text/Temperature';
import * as THREE from 'three';
import MusicPlayer from './text/MusicPlayer';
import FloatingText from './text/FloatingText';
import FloatingBottleManager from './bottle/FloatingBottleManater';
import BottleLetterModal from "./BottleLetterModal"; // 경로는 위치에 맞게 조정
import UserCount from './text/UserCount';
import FloatingBottleFromFrontManager from './bottle/FloatingBottleFromFrontManager';

// ===== 바람 효과 (카메라흔들림) =====
function CameraShake({ windCode = 'WIND_NONE' }) {
  const { camera } = useThree();
  const basePos = camera.position.clone();

  const windSettings = {
    WIND_NONE: { intensity: 0, speed: 0 },
    WIND_WEAK: { intensity: 0.1, speed: 1.0 },           // 약간 올림
    WIND_NORMAL: { intensity: 0.2, speed: 1.5 },         // 보통보다 좀 더 흔들림
    WIND_STRONG: { intensity: 0.35, speed: 2.0 },        // 강하게 흔들림
    WIND_VERY_STRONG: { intensity: 0.6, speed: 2.5 },    // 매우 강하게 흔들림
  };

  const { intensity, speed } = windSettings[windCode] || windSettings['WIND_NONE'];

  useFrame((state) => {
    if (intensity === 0) return;

    const time = state.clock.elapsedTime * speed;

    // 카메라 위치 오프셋 강화
    camera.position.x = basePos.x + Math.sin(time) * intensity;
    camera.position.y = basePos.y + Math.cos(time * 1.3) * intensity * 0.7;
    camera.position.z = basePos.z + Math.sin(time * 0.7) * intensity * 0.5;

    // 시점 고정
    camera.lookAt(0, 0, 0);
  });

  return null;
}





// ===== 전체 씬 =====
function FullOceanScene() {

  const [userCount, setUserCount] = useState(123); // 예시: 현재 이용자 수

  // (추후 WebSocket이나 API로 갱신 가능---사용자 수 )
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  /* 유리병 편지 띄우기 버튼 */
  const [isModalOpen, setModalOpen] = useState(false);

  const handleBottleClick = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const [frontBottles, setFrontBottles] = useState([]);
  const handleSubmit = () => {
    // API 성공 가정 → 바로 병 추가
    const newBottle = {
      id: Date.now().toString(),
      enter: true,
      position: { y: 1, z: (Math.random() - 0.5) * 10 },
    };

    setFrontBottles((prev) => [...prev, newBottle]);

    // 모달 닫기
    setModalOpen(false);
  };

  //컴포넌트 타입 분기처리
  const [oceanCode, setOceanCode] = useState('SUN_RISE_SET_OCEAN');
  const [particleCode, setParticleCode] = useState('PARTICLE');
  const [skyCode, setSkyCode] = useState('SUNRISE_PROGRESS_CLEAR');
  const [windCode, setWindCode] = useState('WIND_NONE');





  const nightDawnColor = '#E0E7FF';
  const DayColor = '#2563EB';
  const sunSetColor = '#FB923C'; 

  // 폰트 결정 
  const font = '/fonts/Pacifico-Regular.ttf';
  let fontcolor = nightDawnColor; // 기본값

  if (oceanCode === 'NORMAL_OCEAN' || oceanCode === 'DAY_OCEAN') {
    fontcolor = DayColor;
  } else if (oceanCode === 'NIGHT_OCEAN' || oceanCode === 'DAWN_OCEAN') {
    fontcolor = nightDawnColor;
  } else if (oceanCode === 'SUN_RISE_SET_OCEAN') {
    fontcolor = sunSetColor;
  }
  


  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>


      <Canvas camera={{ position: [0, 10, 20], fov: 75 }}>  
        {/* 조명 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 25, 10]} intensity={0.8} />

        {/* 바람 효과 */}
        <CameraShake windCode={windCode} />

        {/* 파티클 */}
        <Particle code={particleCode} />
      

        {/* 하늘/태양/달 */}
         <SkyType code={skyCode} sunPosition={[10, 20, 10]} />


        {/* 바다 */}
        <Ocean code={oceanCode} />

        {/* 타이머 */}
        <Timer font={font} color={fontcolor} position={[24, 13.7, -5]} />
        {/* 기온 */}
        <Temperature font={font} color={fontcolor} position={[29, 12, -5]}/>

         {/* 답장편지 글귀 */}
        <FloatingText
          textArray={['안']}
          startY={-1}
          endY={12}
          delay={0.5}
          font={font}
          fontcolor={fontcolor}
        />


      {/* 흘러들어온 유리병 편지들 */}
      <FloatingBottleManager
        newBottleList={[
        { id: '123132ㅌㅌ' }
        ]}
      />
     {/* 글쓰기 작성성공 시 유리병 흘러감 */}
    <FloatingBottleFromFrontManager
      bottles={frontBottles}
      removeBottle={(id) => setFrontBottles((prev) => prev.filter((b) => b.id !== id))}
    />

      </Canvas>

  {/* 음악 플레이어 */}
    <MusicPlayer 
    src="/audio/sample.mp3" 
    position={[1800, 60]} // left, top(px)
    style={{ 
      position: 'absolute', 
      left: '50%', 
      transform: 'translateX(-50%)', // 가운데 정렬
      top: 'calc(50% + 150px)', // Temperature 밑으로 이동
      zIndex: 1000 
    }}
  />

  {/* 유리병 글쓰기 버튼 */}
      <button
        onClick={handleBottleClick}
        style={{
          position: 'absolute',
          left: '95%',
          transform: 'translateX(-50%)',
          top: 'calc(10% + 80px)',
          width: '120px',
          height: '120px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          outline: 'none',
          zIndex: 1000,
          padding: 0, // 버튼 안쪽 여백 제거
        }}
      >
        <img
          src="https://teamgoo.s3.ap-northeast-2.amazonaws.com/bottle/ChatGPT+Image+2025%E1%84%82%E1%85%A7%E1%86%AB+8%E1%84%8B%E1%85%AF%E1%86%AF+19%E1%84%8B%E1%85%B5%E1%86%AF+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+12_37_44.png"
          alt="bottle"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transition: 'transform 0.2s ease, filter 0.2s ease',
            filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.3))',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.filter =
              'drop-shadow(0px 12px 20px rgba(0,0,0,0.4))';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.filter =
              'drop-shadow(0px 8px 16px rgba(0,0,0,0.3))';
          }}
        />
      </button>

      {/* 실시간 이용자 표시 */}
      <UserCount count={userCount} />

      {/* 글쓰기 모달 */}
      <BottleLetterModal
        open={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default FullOceanScene;

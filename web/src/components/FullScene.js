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
import BottleDetailModal from './BottleDetailModal';



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

  // 조회 유리병 클릭 시 상세모달
  const [selectedBottleId, setSelectedBottleId] = useState(null);

  const handleReadBottleClick = (id) => {
    setSelectedBottleId(id);
  };

  const handleReadBottleCloseModal = () => {
    setSelectedBottleId(null);
  };
  


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
  const [oceanCode, setOceanCode] = useState('DAY_OCEAN');
  const [particleCode, setParticleCode] = useState('PARTICLE');
  const [skyCode, setSkyCode] = useState('DAY_CLEAR');



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
  
  /*상태관리 조회용 유리병 리스트  */
  const [newBottleList, setNewBottleList] = useState([
    { id: '123132ㅌㅌ' },
    { id: '123132ddㅌㅌx' },
    { id: '12313' },
    {id: 'dddd'}
  ]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>


      <Canvas camera={{ position: [0, 10, 20], fov: 75 }}>  
        {/* 조명 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 25, 10]} intensity={0.8} />
        
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
          newBottleList={newBottleList}
          onBottleClick={handleReadBottleClick} // 여기서 전달
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

      {/* 흘러들어온 유리병 편지 클릭시 모달*/}
    <BottleDetailModal
      open={!!selectedBottleId}
      bottleId={selectedBottleId}
      onClose={handleReadBottleCloseModal}
      onLeave={(id) => {
        console.log('흘려보내기 API 호출 후 제거:', id);
        // 배열에서 해당 병 제거
        setNewBottleList((prev) => prev.filter((b) => b.id !== id));
        handleReadBottleCloseModal();
      }}
      onSubmit={(id) => {
        console.log('작성 API 호출 후 제거:', id);
        // 배열에서 해당 병 제거
        setNewBottleList((prev) => prev.filter((b) => b.id !== id));
        handleReadBottleCloseModal();
      }}
    />
    </div>
  );
}

export default FullOceanScene;

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
import LogoutButton from "./text/LogoutButton"; // 경로 확인 필요
import BottleDetailModal from './BottleDetailModal';
import '../App.css'; // 또는 index.css
import TimeText from './text/Time';
import { setOceanCode, setParticleCode, setSkyCode, setUserCount, setNewBottleList } from '../store/sceneSlice';
import { useSelector, useDispatch } from 'react-redux';
import Swal from "sweetalert2";
import api from '../api/api';

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (size.width < 768) {
      camera.position.set(0, 15, 25);
      camera.fov = 120;
      camera.updateProjectionMatrix();
    }
  }, [size, camera]);

  return null;
}

// ===== 전체 씬 =====
function FullOceanScene() {



 const dispatch = useDispatch();
  const { oceanCode, particleCode, skyCode, userCount ,newBottleList} = useSelector(state => state.scene);



  // (추후 WebSocket이나 API로 갱신 가능---사용자 수 )
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(setUserCount(userCount + (Math.random() > 0.5 ? 1 : -1)));
    }, 5000);
    return () => clearInterval(interval);
  }, [userCount, dispatch]);

  //유리병 조회 리스트
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(setNewBottleList([
        { id: '123132ㅌㅌ' },
        { id: '123132ddㅌㅌx' },
        { id: 'dddd' },
        { id: '12313asdasdsad' },
    ]));

    }, 5000);
    return () => clearInterval(interval);
  }, [newBottleList, dispatch]);

  // 조회 유리병 클릭 시 상세모달
  const [selectedBottleId, setSelectedBottleId] = useState(null);

  const handleReadBottleClick = (id) => {
    
    setSelectedBottleId(id);
  };

  const handleReadBottleCloseModal = () => {
    setSelectedBottleId(null);
  };
  //로그아웃
const handleLogout = async () => {
  try {
    const response = await api.get("/member/logout");
    if (response.status === 200) {
      // 로그아웃 성공 시 로그인 페이지로 이동
      
      window.location.href = "/doit";
    }
  } catch (error) {
    Swal.fire({
      icon: "error", // success, error, warning, info, question 가능
      title: "로그아웃 실패",
      text: "로그아웃 중 문제가 발생했습니다.",
      confirmButtonText: "확인",
    });
  }
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




  const nightDawnColor = '#E0E7FF';
  const DayColor = '#2563EB';
  const sunSetColor = '#FB923C'; 

  // // 폰트 결정 
  const font = '/fonts/Pacifico-Regular.ttf';
  let fontColor = nightDawnColor; // 기본값

  if (oceanCode === 'NORMAL_OCEAN' || oceanCode === 'DAY_OCEAN') {
    fontColor = DayColor;
  } else if (oceanCode === 'NIGHT_OCEAN' || oceanCode === 'DAWN_OCEAN') {
    fontColor = nightDawnColor;
  } else if (oceanCode === 'SUN_RISE_SET_OCEAN') {
    fontColor = sunSetColor;
  }
  

  return (
  <div className="scene-wrapper">


     <Canvas camera={{ position: [0, 10, 20], fov: 75 }}>
      <ResponsiveCamera />
        {/* 조명 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 25, 10]} intensity={0.8} />
        
        {/* 파티클 */}
        <Particle code={particleCode} />
      

        {/* 하늘/태양/달 */}
         <SkyType code={skyCode} sunPosition={[10, 20, 10]} />


        {/* 바다 */}
        <Ocean code={oceanCode} />



         {/* 답장편지 글귀 */}
        <FloatingText
          textArray={['안']}
          startY={-1}
          endY={12}
          delay={0.5}
          font={font}
          fontcolor={fontColor}
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
      className="music-player"
    />

    {/* 유리병 글쓰기 버튼 */}
    <button
      onClick={handleBottleClick}
      className="bottle-button"
    >
      <img
        src="https://teamgoo.s3.ap-northeast-2.amazonaws.com/bottle/ChatGPT+Image+2025%E1%84%82%E1%85%A7%E1%86%AB+8%E1%84%8B%E1%85%AF%E1%86%AF+19%E1%84%8B%E1%85%B5%E1%86%AF+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+12_37_44.png"
        alt="bottle"
      />
    </button>

    {/* 실시간 이용자 표시 */}
    <UserCount count={userCount} className="user-count" />
      {/* 로그아웃 버튼 */}
      <LogoutButton onLogout={handleLogout} />
    {/* 모달 */}
    <BottleLetterModal open={isModalOpen} onClose={handleClose} onSubmit={handleSubmit} />
    <BottleDetailModal
      open={!!selectedBottleId}
      bottleId={selectedBottleId}
      onClose={handleReadBottleCloseModal}
      onLeave={(id) => {
        setNewBottleList((prev) => prev.filter((b) => b.id !== id));
        handleReadBottleCloseModal();
      }}
      onSubmit={(id) => {
        setNewBottleList((prev) => prev.filter((b) => b.id !== id));
        handleReadBottleCloseModal();
      }}
    />


    {/* 타이머 */}
    <TimeText font={font} color={fontColor} />


    {/* 기온 */}
    <Temperature  font={font} color={fontColor}/>

  </div>
  );
}

export default FullOceanScene;

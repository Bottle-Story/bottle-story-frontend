// src/components/FullOceanScene.js
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import Ocean from './ocean/Ocean';
import Particle from './particle/Particle';
import SkyType from './sky/Sky';
import Temperature from './text/Temperature';
import MusicPlayer from './text/MusicPlayer';
import FloatingText from './text/FloatingText';
import FloatingBottleManager from './bottle/FloatingBottleManater';
import BottleLetterModal from "./BottleLetterModal";
import UserCount from './text/UserCount';
import FloatingBottleFromFrontManager from './bottle/FloatingBottleFromFrontManager';
import LogoutButton from "./text/LogoutButton";
import BottleDetailModal from './BottleDetailModal';
import '../App.css';
import TimeText from './text/Time';
import { setOceanCode, setParticleCode, setSkyCode, setUserCount, setNewBottleList, setUserLat, setUserLot, setSunsetTime, setSunRiseTime, setT1h } from '../store/sceneSlice';
import { useSelector, useDispatch } from 'react-redux';
import Swal from "sweetalert2";
import api from '../api/api';
import { connectWebSocket, sendLocation } from '../socket/socketClient';

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

function FullOceanScene() {
  const dispatch = useDispatch();
  const { oceanCode, particleCode, skyCode, userCount, newBottleList, userLat, userLot, t1h } = useSelector(state => state.scene);

  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 유리병 모달
  const [isModalOpen, setModalOpen] = useState(false);
  const [frontBottles, setFrontBottles] = useState([]);
  const [selectedBottleId, setSelectedBottleId] = useState(null);

  const font = '/fonts/Pacifico-Regular.ttf';
  const nightDawnColor = '#E0E7FF';
  const DayColor = '#2563EB';
  const sunSetColor = '#FB923C';
  let fontColor = nightDawnColor;

  if (oceanCode === 'NORMAL_OCEAN' || oceanCode === 'DAY_OCEAN') {
    fontColor = DayColor;
  } else if (oceanCode === 'NIGHT_OCEAN' || oceanCode === 'DAWN_OCEAN') {
    fontColor = nightDawnColor;
  } else if (oceanCode === 'SUN_RISE_SET_OCEAN') {
    fontColor = sunSetColor;
  }

  // ======================
  // 위치 전송
  // ======================
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    const sendCurrentPosition = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          dispatch(setUserLat(latitude));
          dispatch(setUserLot(longitude));
          sendLocation(latitude, longitude);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    };
    sendCurrentPosition();
    const intervalId = setInterval(sendCurrentPosition, 10 * 60 * 1000); // 10분
    return () => clearInterval(intervalId);
  }, [dispatch]);

  // ======================
  // 웹소켓 연결
  // ======================
  useEffect(() => {
    const client = connectWebSocket((message) => { });
    return () => { /* client.deactivate(); */ };
  }, []);

  // ======================
  // 날씨 정보 조회
  // ======================
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await api.post("/wheatherbgm/wthr", { lat: latitude, lot: longitude });
          if (response.status === 200) {
            dispatch(setOceanCode(response.data.data.oceanCode));
            dispatch(setSkyCode(response.data.data.skyCode));
            dispatch(setParticleCode(response.data.data.particleCode));
            dispatch(setSunRiseTime(response.data.data.sunRiseTime));
            dispatch(setSunsetTime(response.data.data.sunSetTime));
            dispatch(setT1h(response.data.data.t1h));
            setLoading(false); // ✅ 데이터 로딩 완료
          }
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "날씨정보 조회 실패",
            text: error.response?.data?.msg || "오류가 발생했습니다.",
            confirmButtonText: "확인",
          });
        }
      },
      (err) => console.error("위치 조회 실패:", err),
      { enableHighAccuracy: true }
    );
  }, [dispatch]);

  // ======================
  // 유리병 조회
  // ======================
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     dispatch(setNewBottleList([
  //       { id: '123132ㅌㅌ' },
  //       { id: '123132ddㅌㅌx' },
  //       { id: 'dddd' },
  //       { id: '12313asdasdsad' },
  //     ]));
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [newBottleList, dispatch]);

  // ======================
  // 유리병 모달 처리
  // ======================
  const handleBottleClick = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const handleSubmit = () => {
    const newBottle = {
      id: Date.now().toString(),
      enter: true,
      position: { y: 1, z: (Math.random() - 0.5) * 10 },
    };
    setFrontBottles((prev) => [...prev, newBottle]);
    setModalOpen(false);
  };

  const handleReadBottleClick = (id) => setSelectedBottleId(id);
  const handleReadBottleCloseModal = () => setSelectedBottleId(null);

  // ======================
  // 로그아웃
  // ======================
  const handlePreLogout = async () => {
    try {
      const response = await api.put("/member/pre/logout");
      if (response.status === 200) await handleLogout();
    } catch (error) {
      Swal.fire({ icon: "error", title: "로그아웃 실패", text: "로그아웃 중 문제가 발생했습니다.", confirmButtonText: "확인" });
    }
  };
  const handleLogout = async () => {
    try {
      const response = await api.get("/member/logout");
      if (response.status === 200) window.location.href = "/doit";
    } catch (error) {
      Swal.fire({ icon: "error", title: "로그아웃 실패", text: "로그아웃 중 문제가 발생했습니다.", confirmButtonText: "확인" });
    }
  };

  // ======================
  // 로딩 화면
  // ======================
  if (loading) {
    return (
      <div className="scene-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // ======================
  // 전체 씬 렌더링
  // ======================
  return (
    <div className="scene-wrapper">
      <Canvas camera={{ position: [0, 10, 20], fov: 75 }}>
        <ResponsiveCamera />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 25, 10]} intensity={0.8} />
        <Particle code={particleCode} />
        <SkyType code={skyCode} sunPosition={[10, 20, 10]} />
        <Ocean code={oceanCode} />
        <FloatingText
          textArray={['안']}
          startY={-1}
          endY={12}
          delay={0.5}
          font={font}
          fontcolor={fontColor}
        />
        <FloatingBottleManager
          newBottleList={newBottleList}
          onBottleClick={handleReadBottleClick}
        />
        <FloatingBottleFromFrontManager
          bottles={frontBottles}
          removeBottle={(id) => setFrontBottles((prev) => prev.filter((b) => b.id !== id))}
        />
      </Canvas>

      <MusicPlayer src="/audio/sample.mp3" className="music-player" />
      <button onClick={handleBottleClick} className="bottle-button">
        <img
          src="https://teamgoo.s3.ap-northeast-2.amazonaws.com/bottle/ChatGPT+Image+2025%E1%84%82%E1%85%A7%E1%86%AB+8%E1%84%8B%E1%85%AF%E1%86%AF+19%E1%84%8B%E1%85%B5%E1%86%AF+%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB+12_37_44.png"
          alt="bottle"
        />
      </button>

      <UserCount count={userCount} className="user-count" />
      <LogoutButton onLogout={handlePreLogout} />
      <BottleLetterModal open={isModalOpen} onClose={handleClose} onSubmit={handleSubmit} />
      <BottleDetailModal
        open={!!selectedBottleId}
        bottleId={selectedBottleId}
        onClose={handleReadBottleCloseModal}
        onLeave={(id) => {
          console.log('테스트!!'+id);
    dispatch(setNewBottleList(newBottleList.filter((b) => b.id !== id))); // ✅ Redux 상태 갱신
          handleReadBottleCloseModal();
        }}
        onSubmit={(id) => {
    dispatch(setNewBottleList(newBottleList.filter((b) => b.id !== id))); // ✅ 동일하게 수정
          handleReadBottleCloseModal();
        }}
      />

      <TimeText font={font} color={fontColor} />
      <Temperature t1h={t1h} font={font} color={fontColor} />
    </div>
  );
}

export default FullOceanScene;

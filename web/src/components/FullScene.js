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
      

  
        {/* 낙뢰 효과 */}

        {/* 하늘/태양/달 */}
         <SkyType code={skyCode} sunPosition={[10, 20, 10]} />


        {/* 바다 */}
        <Ocean code={oceanCode} />

        {/* 타이머 */}
        <Timer font={font} color={fontcolor} position={[26.3, 13.7, -5]} />
        {/* 기온 */}
        <Temperature font={font} color={fontcolor} position={[31, 13.7, -5]}/>

         {/* 답장편지 */}
        <FloatingText
          textArray={['안']}
          startY={-1}
          endY={12}
          delay={0.5}
          font={font}
          fontcolor={fontcolor}
        />


      {/* 유리병 편지 */}
      <FloatingBottleManager
        newBottleList={[
        { id: '123132ㅌㅌ' }
        ]}
      />

      </Canvas>

  {/* HTML 버튼은 Canvas 바깥에 렌더링 */}
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
    </div>
  );
}

export default FullOceanScene;

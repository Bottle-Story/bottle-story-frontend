// DayOvercast.js
import React, { useRef } from 'react';
import { Sky } from '@react-three/drei';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { TextureLoader, DoubleSide } from 'three';



// ===== DayOvercast 메인 =====
export default function DayOvercast() {
  const sunMap = useLoader(TextureLoader, '/textures/sun.png');
  const { camera } = useThree();
  const sunRef = useRef();

  useFrame(() => {
    if (sunRef.current) sunRef.current.lookAt(camera.position);
  });

  return (
    <>
      {/* 흐린 하늘 */}
      <Sky
        turbidity={5}          // 뿌연 느낌 증가
        rayleigh={0.1}          // 푸른 빛 감소
        mieCoefficient={0.02}   // 빛 산란 증가
        mieDirectionalG={0.8}
        distance={20000}
        azimuth={0.8}
      />

      {/* 태양 (조금 흐린 느낌) */}
      <mesh ref={sunRef} position={[10, 28, 10]} renderOrder={1}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          map={sunMap}
          emissive={0xfff5e1}       // 약간 노란빛
          emissiveIntensity={2.5}   // 낮춘 강도
          side={DoubleSide}
          transparent
          alphaTest={0.01}
        />
        <pointLight
          color={0xfff5e1}
          intensity={1.2}           // 낮춘 밝기
          distance={400}
          decay={1.5}
          position={[0, 0, 0]}
        />
      </mesh>



      {/* 전체 광원 (흐린 느낌) */}
      <ambientLight color={0xffffff} intensity={0.6} />
    </>
  );
}
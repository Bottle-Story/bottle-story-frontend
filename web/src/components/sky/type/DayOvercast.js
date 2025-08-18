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
        turbidity={9}          // 뿌연 느낌 증가
        rayleigh={0.16}          // 푸른 빛 감소
        mieCoefficient={0.024}   // 빛 산란 증가
        mieDirectionalG={0.8}
        distance={20000}
        azimuth={0.8}
      />


      {/* 전체 광원 (흐린 느낌) */}
      <ambientLight color={0xffffff} intensity={0.6} />
    </>
  );
}
// SunriseProgressOvercast.js
import React, { useRef } from 'react';
import { Sky } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

export default function SunriseProgressOvercast() {
  const { camera } = useThree();
  const sunRef = useRef();

  useFrame(() => {
    if (sunRef.current) sunRef.current.lookAt(camera.position);
  });

  return (
    <>
      {/* 은은한 흐린 일출 하늘 */}
      <Sky
        turbidity={30}           // 약간 뿌연 느낌
        rayleigh={0.7}           // 붉은/노란빛 살짝 강조
        mieCoefficient={0.04}    // 구름 산란 강조
        mieDirectionalG={0.72}
        distance={20000}
        azimuth={0.26}
        inclination={0.49}
      />

      {/* 태양광 */}
      <directionalLight
        color={0xffe0b3}          // 은은한 노을빛
        intensity={0.7}
        position={[-500, 40, -300]}
      />

      {/* 바다 반사광 */}
      <directionalLight
        color={0xffd0a0}
        intensity={0.8}
        position={[-500, -10, -300]}
      />

      {/* 하늘/바다 톤 */}
      <hemisphereLight
        skyColor={0xffe8c8}
        groundColor={0x323c4f}    // 바다 톤 자연스럽게
        intensity={0.48}
      />
      <ambientLight color={0xffe3b0} intensity={0.25} />
    </>
  );
}

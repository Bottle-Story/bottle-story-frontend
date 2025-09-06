// SunriseClear.js
import React, { useRef } from 'react';
import { Sky } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, DoubleSide } from 'three';

export default function SuSetClear() {
  const { camera } = useThree();
  const sunRef = useRef();
  const reflectionRef = useRef();

  useFrame(() => {
    if (sunRef.current) sunRef.current.lookAt(camera.position);

    // 반사광 플레인도 카메라 방향 보정 (항상 바라보게)
    if (reflectionRef.current) reflectionRef.current.lookAt(camera.position);
  });

  return (
    <>
      {/* 일출 하늘 */}
      <Sky
        turbidity={18}
        rayleigh={1.2}
        mieCoefficient={0.01}
        mieDirectionalG={0.85}
        distance={20000}
        azimuth={0.26}
        inclination={0.495}
      />


      {/* 기본 태양광 */}
      <directionalLight
        color={0xffc477}
        intensity={1.0}
        position={[-500, 50, -300]}
      />

      {/* 바다 반사용 보조광 */}
      <directionalLight
        color={0xffb347}
        intensity={1.2}
        position={[-500, -10, -300]}
      />

      {/* 하늘/바다 톤 */}
      <hemisphereLight
        skyColor={0xffd9a3}
        groundColor={0x1f2a3a}
        intensity={0.65}
      />
      <ambientLight color={0xffc966} intensity={0.35} />


    </>
  );
}

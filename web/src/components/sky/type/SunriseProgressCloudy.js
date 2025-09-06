// SunriseProgressCloudy.js
import React, { useRef } from 'react';
import { Sky } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

export default function SunriseProgressCloudy() {
  const { camera } = useThree();
  const sunRef = useRef();

  useFrame(() => {
    if (sunRef.current) sunRef.current.lookAt(camera.position);
  });

  return (
    <>
      {/* 은은한 구름 많은 일출 하늘 */}
      <Sky
        turbidity={20}           // 약간 더 강조
        rayleigh={1.1}           // 붉은/노란빛 강화
        mieCoefficient={0.022}   // 구름 느낌 강화
        mieDirectionalG={0.78}
        distance={20000}
        azimuth={0.26}
        inclination={0.49}
      />

      {/* 태양광 */}
      <directionalLight
        color={0xffd9a3}         // 은은한 주황빛
        intensity={0.9}
        position={[-500, 50, -300]}
      />

      {/* 바다 반사광 */}
      <directionalLight
        color={0xffc880}
        intensity={1.05}
        position={[-500, -10, -300]}
      />

      {/* 하늘/바다 톤 */}
      <hemisphereLight
        skyColor={0xffe6b3}
        groundColor={0x2a344a}    // 바다톤 밝게
        intensity={0.6}
      />
      <ambientLight color={0xffe0b0} intensity={0.32} />
    </>
  );
}

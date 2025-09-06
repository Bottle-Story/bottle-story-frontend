// DayClear.js
import React, { useRef } from 'react';
import { Sky } from '@react-three/drei';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { TextureLoader, DoubleSide } from 'three';



// ===== DayClear 메인 =====
export default function DayClear() {
  const sunMap = useLoader(TextureLoader, '/textures/sun.png');
  const { camera } = useThree();
  const sunRef = useRef();

  useFrame(() => {
    if (sunRef.current) sunRef.current.lookAt(camera.position);
  });

  return (
    <>
      {/* 맑은 하늘 */}
      <Sky
        turbidity={10}
        rayleigh={0.4}
        mieCoefficient={0.001}
        mieDirectionalG={0.6}
        distance={20000}
        azimuth={0.9}
      />

      {/* 태양 */}
      {/* <mesh ref={sunRef} position={[0, 18,5]}  renderOrder={1}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial
          map={sunMap}
          emissive={0xffffff}
          emissiveIntensity={2.5}
          side={DoubleSide}
          transparent
          alphaTest={0.01}
        />
        <pointLight
          color={0xffffff}
          intensity={2.2}
          distance={600}
          decay={1.5}
          position={[0, 0, 0]}
        />
      </mesh> */}


      {/* 광원 */}
      <ambientLight color={0xffffff} intensity={1} />
    </>
  );
}

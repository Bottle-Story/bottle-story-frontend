// DawnMoonOvercast.js
import React, { useRef } from 'react';
import { Sky, Stars, Clouds } from '@react-three/drei';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { TextureLoader, DoubleSide, AdditiveBlending } from 'three';

export default function DawnMoonOvercast() {
  const colorMap = useLoader(TextureLoader, '/textures/moon3.png');
  const { camera } = useThree();
  const moonRef = useRef();
  const glowRef = useRef();

  useFrame(() => {
    if (moonRef.current) moonRef.current.lookAt(camera.position);
    if (glowRef.current) glowRef.current.lookAt(camera.position);
  });

  return (
    <>
      <Sky
        turbidity={3}
        rayleigh={0.05}
        mieCoefficient={0.01}
        mieDirectionalG={0.8}
        distance={15000}
        inclination={0}
        azimuth={0.25}
      />

      {/* 구름 레이어 */}
      <Clouds opacity={0.5} speed={0.05} width={200} depth={200} segments={30} />

      {/* 달 */}
      <mesh ref={moonRef} position={[0, 25, -120]} renderOrder={1}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          map={colorMap}
          emissive={0xaaaaee}
          emissiveIntensity={0.08}
          side={DoubleSide}
          transparent
          alphaTest={0.01}
        />
        <pointLight
          color={0xaaaaff}
          intensity={0.12}
          distance={50}
          decay={2}
          position={[0, 25, -120]}
        />
      </mesh>

      {/* 달빛 글로우 */}
      <mesh ref={glowRef} position={[0, 25, -122]} renderOrder={0}>
        <circleGeometry args={[25, 128]} />
        <shaderMaterial
          vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
          fragmentShader={`varying vec2 vUv; void main(){ float dist=distance(vUv, vec2(0.5)); float alpha=0.01*(1.0-smoothstep(0.0,1.0,dist)); gl_FragColor=vec4(0.8,0.8,1.0,alpha);}`}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      <Stars radius={300} depth={60} count={3000} factor={4} saturation={0} fade />
      <ambientLight color={0x444466} intensity={0.04} />
    </>
  );
}

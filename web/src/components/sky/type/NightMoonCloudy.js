import React, { useRef } from 'react';
import { Sky, Stars } from '@react-three/drei';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { TextureLoader, DoubleSide, AdditiveBlending, Color } from 'three';

export default function NightMoonCloudy() {
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
      {/* 밤 하늘 - 구름 많은 분위기 */}
      <Sky
        turbidity={1.5}
        rayleigh={0.1}
        mieCoefficient={0.004}
        mieDirectionalG={0.5}
        distance={15000}
        inclination={0}
        azimuth={0.25}
        skyColor={new Color(0x050518)}
      />

      {/* 달 (그대로) */}
      <mesh ref={moonRef} position={[10, 21,9]} renderOrder={1}>
        <planeGeometry args={[22, 16]} />
        <meshStandardMaterial
          map={colorMap}
          emissive={0xddddff}
          emissiveIntensity={0.2}
          side={DoubleSide}
          transparent
          alphaTest={0.01}
        />
        <pointLight
          color={0xaaaaff}
          intensity={0.25}
          distance={50}
          decay={2}
          position={[0, 25, -120]}
        />
      </mesh>

      {/* 달빛 글로우 - 구름에 따라 약간 흐리게 */}
      <mesh ref={glowRef} position={[10, 21,9]} renderOrder={0}>
        <circleGeometry args={[38, 138]} />
        <shaderMaterial
          vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
          fragmentShader={`varying vec2 vUv; void main(){ float dist=distance(vUv, vec2(0.5)); float alpha=0.01*(1.0-smoothstep(0.0,1.0,dist)); gl_FragColor=vec4(0.8,0.8,1.0,alpha);}`}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* 별 */}
      <Stars radius={300} depth={100} count={12000} factor={4} saturation={0} fade />

      {/* 은은한 주변광 */}
      <ambientLight color={0x111133} intensity={0.03} />

      {/* 바다 Plane - 달빛 반사 약간 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color={0x02031a} roughness={0.6} metalness={0.15} />
      </mesh>
    </>
  );
}

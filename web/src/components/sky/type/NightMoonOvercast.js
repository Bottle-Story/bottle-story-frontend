import React, { useRef } from 'react';
import { Sky, Stars, Clouds } from '@react-three/drei';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { TextureLoader, DoubleSide, AdditiveBlending, Color } from 'three';

export default function NightMoonOvercast() {
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
      {/* 밤 하늘 - 흐린 밤 */}
      <Sky
        turbidity={3}
        rayleigh={0.05}
        mieCoefficient={0.01}
        mieDirectionalG={0.8}
        distance={15000}
        inclination={0}
        azimuth={0.25}
        skyColor={new Color(0x0a0a12)}
      />

      {/* 구름 레이어 */}
      <Clouds opacity={0.6} speed={0.03} width={250} depth={250} segments={30} />

      {/* 달 */}
      <mesh ref={moonRef} position={[10, 21,9]} renderOrder={1}>
        <planeGeometry args={[22, 16]} />
        <meshStandardMaterial
          map={colorMap}
          emissive={0xccccff}
          emissiveIntensity={0.15}
          side={DoubleSide}
          transparent
          alphaTest={0.01}
        />
        <pointLight
          color={0xaaaaff}
          intensity={0.18}
          distance={50}
          decay={2}
          position={[0, 25, -120]}
        />
      </mesh>

      {/* 달빛 글로우 - 거의 흐림 */}
      <mesh ref={glowRef} position={[10, 21,9]} renderOrder={0}>
        <circleGeometry args={[38, 138]} />
        <shaderMaterial
          vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
          fragmentShader={`varying vec2 vUv; void main(){ float dist=distance(vUv, vec2(0.5)); float alpha=0.008*(1.0-smoothstep(0.0,1.0,dist)); gl_FragColor=vec4(0.8,0.8,1.0,alpha);}`}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* 별 - 흐린 밤이므로 최소 */}
      <Stars radius={300} depth={60} count={2000} factor={3} saturation={0} fade />

      {/* 은은한 주변광 */}
      <ambientLight color={0x111122} intensity={0.02} />

      {/* 바다 Plane - 달빛 반사 거의 없음 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color={0x01010a} roughness={0.8} metalness={0.05} />
      </mesh>
    </>
  );
}

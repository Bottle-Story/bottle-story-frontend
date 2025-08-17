import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';
import Ocean from './components/ocean/Ocean';
import Particle from './components/particle/Particle';
import SkyType from './components/sky/Sky';


// // ===== 2. 하늘 + 해/달 컴포넌트 =====
// function SkyWithSun({ sunPosition }) {
//   return <Sky sunPosition={sunPosition} turbidity={5} rayleigh={1} distance={15000} />;
// }

// ===== 3. 낙뢰 효과 =====
function LightningEffect() {
  const lightRef = useRef();
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlash(Math.random() > 0.7); // 30% 확률로 번쩍
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.intensity = flash ? 5 : 0;
    }
  });

  return <pointLight ref={lightRef} position={[0, 20, 0]} color={0xffffff} />;
}

// ===== 4. 바람 효과 (물결 흔들림 + 바람 느낌) =====
function WindEffect() {
  const { scene } = useThree();
  const windParticlesRef = useRef([]);
  const numParticles = 50;

  useEffect(() => {
    const temp = [];
    for (let i = 0; i < numParticles; i++) {
      const geom = new THREE.SphereGeometry(0.05, 8, 8);
      const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
      const particle = new THREE.Mesh(geom, mat);
      particle.position.set(Math.random() * 40 - 20, Math.random() * 5 + 5, Math.random() * 20 - 10);
      scene.add(particle);
      temp.push(particle);
    }
    windParticlesRef.current = temp;

    return () => temp.forEach(p => scene.remove(p));
  }, [scene]);

  useFrame((state, delta) => {
    windParticlesRef.current.forEach(p => {
      p.position.x += delta * 2;
      if (p.position.x > 20) p.position.x = -20;
    });
  });

  return null;
}

// ===== 5. 유리병 편지 컴포넌트 =====
function FloatingBottle({ id, zPosition }) {
  const bottleRef = useRef();
  const startX = -50;
  const endX = Math.random() * 20 - 10;
  const [position, setPosition] = useState(new THREE.Vector3(startX, 0.5, zPosition));

  useFrame((state, delta) => {
    if (bottleRef.current) {
      position.x += delta * 0.5;
      if (position.x > endX) position.x = endX;
      position.y = Math.sin(state.clock.elapsedTime + position.x) * 0.02;
      bottleRef.current.position.set(position.x, position.y, position.z);
    }
  });

  return (
    <mesh ref={bottleRef} position={position}>
      <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
      <meshStandardMaterial color='orange' />
    </mesh>
  );
}

// ===== 6. 전체 씬 =====
function FullOceanScene() {
  //컴포넌트 타입 분기처리
  const [oceanCode, setOceanCode] = useState('NORMAL_OCEAN');
  const [particleCode, setParticleCode] = useState('PARTICLE_RAIN_DROP');
  const [skyCode, setSkyCode] = useState('NIGHT_MOON_CLEAR');

  const [bottles, setBottles] = useState([
    { id: 1, z: -3 },
    { id: 2, z: 0 },
    { id: 3, z: 4 }
  ]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 15, 35], fov: 75 }}>
        {/* 조명 */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 25, 10]} intensity={0.8} />

        {/* 하늘 */}
        {/* <SkyWithSun sunPosition={[10, 20, 10]} /> */}
        {/* 하늘/태양/달 */}
        <SkyType code={skyCode} sunPosition={[10, 20, 10]} />
        {/* 바다 */}
        {/* <CartoonOcean /> */}
        <Ocean code={oceanCode} />

        {/* 파티클 */}
        <Particle code={particleCode} />
        
        {/* 날씨 효과 */}
        <LightningEffect />
        <WindEffect />

        {/* 유리병 편지 */}
        {bottles.map((bottle) => (
          <FloatingBottle key={bottle.id} id={bottle.id} zPosition={bottle.z} />
        ))}
      </Canvas>
    </div>
  );
}

export default FullOceanScene;

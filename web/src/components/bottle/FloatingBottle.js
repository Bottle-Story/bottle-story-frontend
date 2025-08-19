import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function FloatingBottle({ bottle, removeBottle, onClick }) {
  const groupRef = useRef();
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false); // 마우스 오버 상태

  const floatAmplitude = 0.25;
  const floatSpeed = 1.2;
  const moveSpeed = 0.05;
  const rotateSpeed = 0.2;
  const waterLevel = 0;
  const startX = camera.position.x - 50;
  const leaveX = camera.position.x + 50;
  const targetX = bottle.leave ? leaveX : bottle.position.x;

  useEffect(() => {
    if (bottle.enter && groupRef.current) {
      groupRef.current.position.set(startX, bottle.position.y, bottle.position.z);
      groupRef.current.rotation.set(
        THREE.MathUtils.degToRad(20 + Math.random() * 10),
        THREE.MathUtils.degToRad(Math.random() * 360),
        THREE.MathUtils.degToRad(10 + Math.random() * 10)
      );
    }
  }, [bottle.enter, startX, bottle.position.y, bottle.position.z]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const group = groupRef.current;
    const pos = group.position;
    const rot = group.rotation;

    pos.x = THREE.MathUtils.lerp(pos.x, targetX, delta * moveSpeed);
    pos.y = bottle.position.y + Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude;
    pos.z = bottle.position.z;
    rot.y += delta * rotateSpeed;

    const bottleMesh = group.children[0];
    const submerged = Math.max(0, waterLevel - (pos.y - 0.6));

    // Hover 시 살짝 키우고 색 강조
    if (hovered) {
      bottleMesh.scale.set(1.2, 1.2, 1.2);
      bottleMesh.material.color.set('#4dabf7'); // 하이라이트 색
      bottleMesh.material.opacity = 0.6;
    } else {
      bottleMesh.scale.set(1, 1, 1);
      if (submerged > 0) {
        bottleMesh.material.color.set('#70a0ff');
        bottleMesh.material.opacity = THREE.MathUtils.clamp(0.2 - submerged * 0.05, 0.05, 0.35);
        bottleMesh.scale.y = 1 + submerged * 0.3;
        bottleMesh.position.y = submerged * -0.15;
      } else {
        bottleMesh.material.color.set('#a3d5ff');
        bottleMesh.material.opacity = 0.35;
        bottleMesh.scale.y = 1;
        bottleMesh.position.y = 0;
      }
    }

    if (bottle.leave && pos.x >= leaveX - 0.1) removeBottle(bottle.id);
  });

  return (
<group
  ref={groupRef}
  onClick={() => {
    if (!bottle.leave && onClick) {
      onClick(bottle.id);
    }
  }}
  onPointerOver={() => setHovered(true)}
  onPointerOut={() => setHovered(false)}
  scale={1}
>
      {/* 유리병 본체 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.35, 1.2, 32]} />
        <meshPhysicalMaterial
          color="#a3d5ff"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.1}
          reflectivity={0.5}
          clearcoat={0.5}
          transmission={0.6}
          ior={1.3}
        />
      </mesh>

      {/* 병뚜껑 */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.1, 32]} />
        <meshStandardMaterial color="#ffb74d" metalness={0.5} roughness={0.3} />
      </mesh>

      {/* 편지 */}
      <mesh position={[0, 0, 0]} rotation={[THREE.MathUtils.degToRad(15), 0, THREE.MathUtils.degToRad(5)]}>
        <planeGeometry args={[0.5, 0.7, 4, 4]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

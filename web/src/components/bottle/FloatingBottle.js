import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function FloatingBottle({ bottle, removeBottle }) {
  const groupRef = useRef();
  const { camera } = useThree();

  const floatAmplitude = 0.25; // 위아래 흔들림
  const floatSpeed = 1.2;      // 흔들림 속도
  const moveSpeed = 0.05;      // 서서히 이동 속도
  const rotateSpeed = 0.2;     // 미세 회전 속도

  const waterLevel = 0;         // 바다 표면 높이
  const startX = camera.position.x - 50;
  const leaveX = camera.position.x + 50;
  const targetX = bottle.leave ? leaveX : bottle.position.x;

  // Enter 시 초기 위치 및 회전
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

  // X축 서서히 이동
  pos.x = THREE.MathUtils.lerp(pos.x, targetX, delta * moveSpeed);

  // Y축 둥둥 떠오르기
  pos.y = bottle.position.y + Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude;

  // Z축 고정
  pos.z = bottle.position.z;

  // 회전
  rot.y += delta * rotateSpeed;

  // 하단 물속 느낌 강화
  const bottleMesh = group.children[0];
  const submerged = Math.max(0, waterLevel - (pos.y - 0.6));
  if (submerged > 0) {
    // 색상 진하게, 투명도 낮춤
    bottleMesh.material.color.set('#70a0ff');
    bottleMesh.material.opacity = THREE.MathUtils.clamp(0.2 - submerged * 0.05, 0.05, 0.35);

    // 약간 늘려서 물속에 잠긴 느낌 강조
    bottleMesh.scale.y = 1 + submerged * 0.3;
    bottleMesh.position.y = submerged * -0.15; // 하단 내려가도록
  } else {
    bottleMesh.material.color.set('#a3d5ff');
    bottleMesh.material.opacity = 0.35;
    bottleMesh.scale.y = 1;
    bottleMesh.position.y = 0;
  }

  // 떠난 병 제거
  if (bottle.leave && pos.x >= leaveX - 0.1) {
    removeBottle(bottle.id);
  }
});

  return (
    <group ref={groupRef}>
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

      {/* 편지 (말린 느낌) */}
      <mesh position={[0, 0, 0]} rotation={[THREE.MathUtils.degToRad(15), 0, THREE.MathUtils.degToRad(5)]}>
        <planeGeometry args={[0.5, 0.7, 4, 4]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

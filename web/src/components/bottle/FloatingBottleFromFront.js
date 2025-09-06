// FloatingBottleFromFront.jsx
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function FloatingBottleFromFront({ bottle, removeBottle }) {
  const groupRef = useRef();
  const { camera } = useThree();

  const floatAmplitude = 0.3;
  const floatSpeed = 1;
  const moveSpeed = 0.01;
  const rotateSpeed = 0.1;

  const waterLevel = 0;
  const startX = camera.position.x + 2;
  const endX = camera.position.x + 200;

  useEffect(() => {
    if (bottle.enter && groupRef.current) {
      groupRef.current.position.set(startX, bottle.position.y, bottle.position.z);
      groupRef.current.rotation.set(
        THREE.MathUtils.degToRad(Math.random() * 20),
        THREE.MathUtils.degToRad(Math.random() * 360),
        THREE.MathUtils.degToRad(Math.random() * 10)
      );
    }
  }, [bottle.enter, startX, bottle.position.y, bottle.position.z]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const group = groupRef.current;
    const pos = group.position;
    const rot = group.rotation;

    pos.x = THREE.MathUtils.lerp(pos.x, endX, delta * moveSpeed);
    pos.y = bottle.position.y + Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude;
    rot.y += delta * rotateSpeed;

    const bottleMesh = group.children[0];
    const submerged = Math.max(0, waterLevel - (pos.y - 0.6));
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

    if (pos.x >= endX - 0.1) removeBottle(bottle.id);
  });

  return (
    <group ref={groupRef}>
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
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.1, 32]} />
        <meshStandardMaterial color="#ffb74d" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[THREE.MathUtils.degToRad(15), 0, THREE.MathUtils.degToRad(5)]}>
        <planeGeometry args={[0.5, 0.7, 4, 4]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

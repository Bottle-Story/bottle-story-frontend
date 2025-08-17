import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function RainyParticles() {
  const count = 1000;

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const length = 1 + Math.random() * 1; // 길이 랜덤
      const radius = 0.01 + Math.random() * 0.01; // 얇게
      arr.push({
        x: (Math.random() - 0.5) * 100,
        y: Math.random() * 50,
        z: (Math.random() - 0.5) * 100,
        speed: 0.8 + Math.random() * 1.2,
        length,
        radius,
        drift: (Math.random() - 0.5) * 0.05, // X좌표 흔들림
      });
    }
    return arr;
  }, [count]);

  return (
    <group>
      {particles.map((p, i) => (
        <Raindrop key={i} {...p} />
      ))}
    </group>
  );
}

function Raindrop({ x, y, z, speed, length, radius, drift }) {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y -= speed;
      ref.current.position.x += drift;
      if (ref.current.position.y < 0) {
        ref.current.position.y = 50;
        ref.current.position.x = (Math.random() - 0.5) * 100;
        ref.current.position.z = (Math.random() - 0.5) * 100;
      }
    }
  });

  return (
    <mesh ref={ref} position={[x, y, z]}>
      <cylinderGeometry args={[radius, radius, length, 6]} />
      <meshStandardMaterial
        color="#55aaff"
        transparent
        opacity={0.8}
        roughness={0.2}
        metalness={0.5}
      />
    </mesh>
  );
}

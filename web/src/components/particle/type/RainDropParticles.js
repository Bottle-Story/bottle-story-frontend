import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function RainDropParticles() {
  const count = 300;

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const length = 0.4 + Math.random() * 0.6; // 짧고 다양하게
      const radius = 0.008 + Math.random() * 0.007; // 얇게
      arr.push({
        x: (Math.random() - 0.5) * 100,
        y: Math.random() * 50,
        z: (Math.random() - 0.5) * 100,
        speed: 0.2 + Math.random() * 0.5,
        length,
        radius,
        drift: (Math.random() - 0.5) * 0.03,
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
        color="#88ccff"
        transparent
        opacity={0.5}
        roughness={0.2}
        metalness={0.3}
      />
    </mesh>
  );
}

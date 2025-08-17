import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SnowStormParticles({ count = 400 }) {
  const { scene } = useThree();
  const particlesRef = useRef([]);

  useEffect(() => {
    const temp = [];

    // CanvasTexture로 원형 눈송이 생성
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      alphaTest: 0.01,
    });

    for (let i = 0; i < count; i++) {
      const sprite = new THREE.Sprite(material);
      const scale = 0.2 + Math.random() * 0.6;
      sprite.scale.set(scale, scale, 1);
      sprite.position.set(
        Math.random() * 60 - 30,
        Math.random() * 30 + 5,
        Math.random() * 60 - 30
      );
      scene.add(sprite);
      temp.push({
        mesh: sprite,
        speed: 5 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 0.05,
        rotX: (Math.random() - 0.5) * 2,
        rotZ: (Math.random() - 0.5) * 2,
      });
    }

    particlesRef.current = temp;
    return () => temp.forEach(p => scene.remove(p.mesh));
  }, [scene, count]);

  useFrame((state, delta) => {
    particlesRef.current.forEach(p => {
      const { mesh, speed, drift, rotX, rotZ } = p;
      mesh.position.y -= speed * delta;
      mesh.position.x += Math.sin(state.clock.elapsedTime + mesh.position.z) * drift;
      mesh.rotation.x += rotX * delta;
      mesh.rotation.z += rotZ * delta;

      if (mesh.position.y < 0) {
        mesh.position.y = Math.random() * 30 + 5;
        mesh.position.x = Math.random() * 60 - 30;
        mesh.position.z = Math.random() * 60 - 30;
      }
    });
  });

  return null;
}

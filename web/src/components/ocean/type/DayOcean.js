// components/ocean/type/DAY_OCEAN.js
import React from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water';

export default function DayOcean() {
  const { scene } = useThree();
  const waterRef = React.useRef();

  React.useEffect(() => {
    const geometry = new THREE.PlaneGeometry(1000, 1000, 128, 128);

    // 낮 시간대 바다 색상과 반사
    const water = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        'https://threejs.org/examples/textures/waternormals.jpg',
        (texture) => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(0, 1, 0), // 위에서 비치는 태양
      sunColor: 0xffffff,                        // 햇빛 색상
      waterColor: 0x1e90ff,                      // 파란 하늘 반영
      distortionScale: 3.0,                      // 물결 변형 정도
      fog: false,
      side: THREE.DoubleSide
    });

    water.rotation.x = -Math.PI / 2;
    scene.add(water);
    waterRef.current = water;

    return () => scene.remove(water);
  }, [scene]);

  useFrame((state, delta) => {
    if (waterRef.current) {
      // 자연스러운 물결 애니메이션
      waterRef.current.material.uniforms.time.value += delta * 1.2;
    }
  });

  return null;
}

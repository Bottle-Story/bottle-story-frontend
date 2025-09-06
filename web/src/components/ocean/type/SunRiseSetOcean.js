import React from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water';

export default function SUN_RISE_SET_OCEAN() {
  const { scene } = useThree();
  const waterRef = React.useRef();

  React.useEffect(() => {
    const geometry = new THREE.PlaneGeometry(1000, 1000, 128, 128);

    const water = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        'https://threejs.org/examples/textures/waternormals.jpg',
        (texture) => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(-1, 1, -1),
      sunColor: 0xffc57f,       // 부드럽고 감성적인 노을빛
      waterColor: 0xffbbaa,     // 바다 위 반사도 은은하게
      distortionScale: 3.0,     // 물결 흔들림 강조
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
      waterRef.current.material.uniforms.time.value += delta * 1.3;
    }
  });

  // 몽환적 노을빛 햇살
  const sunLight = new THREE.DirectionalLight(0xffc57f, 1.1);
  sunLight.position.set(-500, 50, -300);
  scene.add(sunLight);

  // 바다와 하늘 톤 맞춤
  const hemiLight = new THREE.HemisphereLight(
    0xffe0d0,  // 하늘 쪽 은은한 분홍빛 섞임
    0x1f2233,  // 바다/지평선 쪽 진한 톤
    0.6
  );
  scene.add(hemiLight);

  // 살짝 은은한 보조광: 반사 강조용
  const ambient = new THREE.AmbientLight(0xffd8c0, 0.25);
  scene.add(ambient);

  return null;
}

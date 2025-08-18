import React from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water';

export default function NIGHT_OCEAN_MOON() {
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
      sunDirection: new THREE.Vector3(0, 1, 0),
      sunColor: 0xaaaaff,       // 달빛 느낌
      waterColor: 0x1f2a4f,     // 어두운 푸른밤톤
      distortionScale: 2.0,     // 은은한 물결
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
      // 달빛에 반사된 은은한 물결
      waterRef.current.material.uniforms.time.value += delta * 1.0;
    }
  });

  // 달빛 추가용 은은한 방향광
  const moonLight = new THREE.DirectionalLight(0xccccff, 0.3);
  moonLight.position.set(300, 200, -100);
  scene.add(moonLight);

  return null;
}

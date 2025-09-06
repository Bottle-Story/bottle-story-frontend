import React from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water';

export default function DAWN_FANTASY() {
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
      sunColor: 0xffe0a0,       // 은은한 새벽 주황빛 반사
      waterColor: 0x4a3f8f,     // 몽환적인 보라/블루톤
      distortionScale: 3.0,     // 살짝 더 반짝이도록
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
      // 물결이 은은하게 움직이는 몽환적 느낌
      waterRef.current.material.uniforms.time.value += delta * 1.2;
    }
  });

  return null;
}

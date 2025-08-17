// components/ocean/type/NormalOcean.js
import React from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water';

export default function NormalOcean() {
  const { scene } = useThree();
  const waterRef = React.useRef();

  React.useEffect(() => {
    const geometry = new THREE.PlaneGeometry(1000, 1000, 128, 128);
    const water = new Water(geometry, {
      textureWidth: 256,
      textureHeight: 256,
      waterNormals: new THREE.TextureLoader().load(
        'https://threejs.org/examples/textures/waternormals.jpg',
        (texture) => { texture.wrapS = texture.wrapT = THREE.RepeatWrapping; }
      ),
      sunDirection: new THREE.Vector3(0, 1, 0),
      sunColor: 0xffffff,
      waterColor: 0x1e90ff,
      distortionScale: 3.0,
      fog: false,
      side: THREE.DoubleSide
    });
    water.rotation.x = -Math.PI / 2;
    scene.add(water);
    waterRef.current = water;

    return () => scene.remove(water);
  }, [scene]);

  useFrame((state, delta) => {
    if (waterRef.current) waterRef.current.material.uniforms.time.value += delta * 1.5;
  });

  return null;
}
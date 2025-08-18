// src/components/Time.js
import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import * as THREE from 'three';

import { Text } from '@react-three/drei';

export default function TemperatureText({font,color,position}) {
  return (
    <Text
      position={position}
      font={font}
      fontSize={1.7}
      color={color}
      anchorX="center"
      anchorY="middle"
    >
     25℃ 
    </Text>
  );
}


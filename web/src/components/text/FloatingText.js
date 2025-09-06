import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSelector } from 'react-redux';

export default function FloatingText({
  startY = 0,
  endY = 3,
  delay = 0.5,
  font,
  fontcolor,
  fontSize = 1,
  gap = 0.3,
  maxCharsPerLine = 53,
  lineGap = 2,
}) {
  // ✅ Redux에서 textArray 가져오기
  const textArray = useSelector((state) => state.scene.textArray);

  // textArray 변경될 때마다 letters 초기화
  const [letters, setLetters] = useState([]);
  const [animationStartTime, setAnimationStartTime] = useState(0);

  useEffect(() => {
    console.log('FloatingText textArray 변경:', textArray);
    if (textArray && textArray.length > 0) {
      const newLetters = textArray.map((char, i) => ({
        char,
        y: startY,
        line: Math.floor(i / maxCharsPerLine),
        indexInLine: i % maxCharsPerLine,
        delay: i * delay,
      }));
      console.log('생성된 letters:', newLetters);
      setLetters(newLetters);
      setAnimationStartTime(Date.now());
    } else {
      setLetters([]);
    }
  }, [textArray, startY, delay, maxCharsPerLine]);

  const refs = useRef([]);

  useFrame((state) => {
    if (!letters.length || !animationStartTime) return;

    const currentTime = Date.now();
    const elapsedSeconds = (currentTime - animationStartTime) / 1000;

    letters.forEach((letter, i) => {
      if (!refs.current[i]) return;

      const letterDelay = letter.delay;
      const letterElapsed = elapsedSeconds - letterDelay;

      if (letterElapsed > 0) {
        const targetY = endY - letter.line * lineGap;
        
        if (elapsedSeconds < 60) { // 1분 동안 올라가기
          // 천천히 올라가기
          const progress = Math.min(letterElapsed * 0.3, 1);
          refs.current[i].position.y = THREE.MathUtils.lerp(
            letter.y,
            targetY,
            progress
          );
          
          // 페이드인
          if (refs.current[i].material) {
            refs.current[i].material.opacity = Math.min(1, letterElapsed * 2);
          }
        } else { // 1분 후 내려가기
          const fadeOutTime = elapsedSeconds - 60;
          
          // 아래로 내려가면서 페이드아웃
          refs.current[i].position.y = targetY + fadeOutTime * 2;
          
          if (refs.current[i].material) {
            refs.current[i].material.opacity = Math.max(0, 1 - fadeOutTime * 2);
          }
        }
      }
    });
  });

  // textArray가 비어있으면 아무것도 렌더링하지 않음
  if (!textArray || textArray.length === 0) {
    console.log('FloatingText: textArray가 비어있어서 null 반환');
    return null;
  }

  console.log('FloatingText 렌더링 중, letters 개수:', letters.length);

  return letters.map((letter, i) => {
    const charsInLine = Math.min(
      maxCharsPerLine,
      letters.length - letter.line * maxCharsPerLine
    );
    const lineStartX = -((charsInLine - 1) * (fontSize + gap)) / 2;

    return (
      <Text
        key={`${textArray.join('')}-${i}`}
        ref={(el) => (refs.current[i] = el)}
        position={[
          lineStartX + letter.indexInLine * (fontSize + gap),
          letter.y,
          -10,
        ]}
        fontSize={fontSize}
        font={font}
        color={fontcolor}
        anchorX="center"
        anchorY="middle"
        transparent
        opacity={0}
      >
        {letter.char}
      </Text>
    );
  });
}

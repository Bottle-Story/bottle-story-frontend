import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

export default function FloatingText({
  textArray = ['가', '나', '다', '라'],
  startY = 0,
  endY = 3,
  delay = 0.5,
  font,
  fontcolor,
  fontSize = 1,
  gap = 0.3,            // 글자 간 간격
  pauseTime = 60,        // 일시정지 시간 (초)
  maxCharsPerLine = 53,  // 한 줄 최대 글자 수
  lineGap = 2            // 줄 간격
}) {
  // 글자 상태 관리
  const [letters, setLetters] = useState(
    textArray.map((char, i) => ({
      char,
      y: startY + Math.random() * 0.5,
      opacity: 0,
      phase: 'fadeIn',           // fadeIn -> pause -> fadeOut
      delay: i * delay,
      line: Math.floor(i / maxCharsPerLine),   // 몇 번째 줄인지
      indexInLine: i % maxCharsPerLine,       // 줄 내 위치
      fadeOutStartTime: 0                        // 글자별 페이드아웃 시작 시간
    }))
  );

  const refs = useRef([]);
  const [allReached, setAllReached] = useState(false);
  const [pauseStart, setPauseStart] = useState(0);

  useFrame((state) => {
    letters.forEach((letter, i) => {
      const elapsed = state.clock.elapsedTime - letter.delay;
      if (!refs.current[i]) return;

      // FadeIn
      if (letter.phase === 'fadeIn' && elapsed > 0) {
        refs.current[i].position.y = THREE.MathUtils.lerp(
          letter.y,
          endY - letter.line * lineGap,
          elapsed * 0.2
        );
        refs.current[i].material.opacity = Math.min(1, elapsed * 0.5);

        // 목표 위치 도달 시 pause로 전환
        if (refs.current[i].position.y >= endY - letter.line * lineGap) {
          letters[i].phase = 'pause';
          setLetters([...letters]);
        }

      // FadeOut (글자별 순차적 페이드아웃)
      } else if (letter.phase === 'fadeOut') {
        const fadeElapsed = state.clock.elapsedTime - letter.fadeOutStartTime;
        if (fadeElapsed > 0) {
          // y 살짝 올리면서 페이드아웃
          refs.current[i].position.y += 0.01;
          refs.current[i].material.opacity = Math.max(0, 1 - fadeElapsed * 0.5); // 천천히 사라짐
        }
      }
    });

    // 모든 글자가 목표 Y 위치 도달 확인
    if (!allReached && letters.every((l, i) => refs.current[i]?.position.y >= endY - l.line * lineGap)) {
      setAllReached(true);
      setPauseStart(state.clock.elapsedTime);
    }

    // Pause 후 글자별 FadeOut 시작
    if (allReached && state.clock.elapsedTime - pauseStart >= pauseTime) {
      letters.forEach((l, i) => {
        if (l.phase !== 'fadeOut') {
          l.phase = 'fadeOut';
          l.fadeOutStartTime = state.clock.elapsedTime + i * 0.2; // 글자별 0.2초 지연
        }
      });
      setLetters([...letters]);
    }
  });

  return letters.map((letter, i) => {
    // 현재 줄에 남은 글자 수
    const charsInLine = Math.min(
      maxCharsPerLine,
      letters.length - letter.line * maxCharsPerLine
    );

    // 줄별 시작 X 위치 (중앙 정렬)
    const lineStartX = -((charsInLine - 1) * (fontSize + gap)) / 2;

    return (
      <Text
        key={i}
        ref={(el) => (refs.current[i] = el)}
        position={[
          lineStartX + letter.indexInLine * (fontSize + gap),
          letter.y,
          -10
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

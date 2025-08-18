import React, { useState, useEffect } from 'react';
import FloatingBottle from './FloatingBottle';

export default function FloatingBottleManager({ newBottleList = [] }) {
  const [bottles, setBottles] = useState([]);
  const maxBottles = 10;

  const generatePosition = (currentBottles) => {
    let pos;
    let tries = 0;
    const minDistance = 4;
    do {
      pos = {
        x: Math.random() * 10 - 5, // 중앙 화면 영역
        y: Math.random() * 3 + 1,
        z: Math.random() * 10 - 5
      };
      tries++;
    } while (
      currentBottles.some(
        (b) =>
          Math.hypot(b.position.x - pos.x, b.position.y - pos.y, b.position.z - pos.z) < minDistance
      ) && tries < 50
    );
    return pos;
  };

  useEffect(() => {
    setBottles((prev) => {
      let updated = [...prev];

      // 떠날 병 처리: 내부에 있는데 새 리스트에 없으면
      updated = updated.map((b) =>
        !newBottleList.some((nb) => nb.id === b.id) ? { ...b, leave: true } : b
      );

      // 새로 추가될 병 처리
      newBottleList.forEach((nb) => {
        if (!updated.some((b) => b.id === nb.id) && updated.length < maxBottles) {
          updated.push({
            ...nb,
            position: generatePosition(updated),
            leave: false,
            enter: true
          });
        }
      });

      return updated;
    });
  }, [newBottleList]);

  const removeBottle = (id) => {
    setBottles((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <>
      {bottles.map((b) => (
        <FloatingBottle key={b.id} bottle={b} removeBottle={removeBottle} />
      ))}
    </>
  );
}

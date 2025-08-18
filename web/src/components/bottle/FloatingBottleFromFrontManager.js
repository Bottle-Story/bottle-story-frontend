// FloatingBottleFromFrontManager.jsx
import React from 'react';
import FloatingBottleFromFront from './FloatingBottleFromFront';

export default function FloatingBottleFromFrontManager({ bottles, removeBottle }) {
  return (
    <>
      {bottles.map((b) => (
        <FloatingBottleFromFront
          key={b.id}
          bottle={b}
          removeBottle={removeBottle}
        />
      ))}
    </>
  );
}

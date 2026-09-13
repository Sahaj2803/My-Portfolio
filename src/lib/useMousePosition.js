import { useState, useEffect } from 'react';

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
    clientX: 0,
    clientY: 0,
  });

  useEffect(() => {
    let animationFrameId;

    const updateMousePosition = (e) => {
      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
          clientX: e.clientX,
          clientY: e.clientY,
        });
      });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return mousePosition;
}

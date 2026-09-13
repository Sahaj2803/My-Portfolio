import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '../lib/useMousePosition';
import { useCursor } from '../context/CursorContext';
import { useMediaQuery } from '../lib/useMediaQuery';
import { useReducedMotion } from '../lib/useReducedMotion';

const variants = {
  default: {
    width: 32,
    height: 32,
    backgroundColor: 'transparent',
    border: '2px solid #c4ff00',
    opacity: 1,
  },
  link: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(196, 255, 0, 0.1)',
    border: '2px solid #c4ff00',
    opacity: 1,
  },
  project: {
    width: 88,
    height: 88,
    backgroundColor: '#c4ff00',
    border: 'none',
    opacity: 1,
  },
  cta: {
    width: 56,
    height: 56,
    backgroundColor: 'transparent',
    border: '2px solid #c4ff00',
    opacity: 1,
    scale: 1.05,
  },
  hidden: {
    opacity: 0,
    width: 0,
    height: 0,
  },
};

const CustomCursor = () => {
  // clientX/clientY are the real pixel coordinates. (The `x`/`y` fields on
  // this hook are normalized 0-1 values for parallax math - using them
  // here as pixel offsets was why the cursor previously rendered stuck
  // near the top-left corner instead of following the pointer.)
  const { clientX, clientY } = useMousePosition();
  const { cursorType, cursorText } = useCursor();
  const isTouchDevice = useMediaQuery('(max-width: 768px) or (pointer: coarse)');
  const prefersReducedMotion = useReducedMotion();

  const active = !isTouchDevice && !prefersReducedMotion;

  // Hide the native cursor only while our custom cursor is actually
  // rendering, so touch users and reduced-motion users keep the OS cursor.
  useEffect(() => {
    document.documentElement.classList.toggle('custom-cursor-active', active);
    return () => document.documentElement.classList.remove('custom-cursor-active');
  }, [active]);

  if (!active) return null;

  const ringSize = variants[cursorType]?.width ?? 32;
  const dotHidden = cursorType === 'hidden' || cursorType === 'project';

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full flex items-center justify-center mix-blend-difference"
        animate={{
          ...variants[cursorType],
          x: clientX - ringSize / 2,
          y: clientY - ringSize / 2,
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 0.5,
        }}
      >
        {cursorType === 'project' && (
          <span className="text-[#0a0a0a] text-xs font-bold font-space tracking-widest pointer-events-none uppercase">
            {cursorText || 'VIEW'}
          </span>
        )}
      </motion.div>
      <div
        className="pointer-events-none fixed top-0 left-0 z-50 w-2 h-2 rounded-full bg-[#c4ff00] mix-blend-difference"
        style={{
          transform: `translate3d(${clientX - 4}px, ${clientY - 4}px, 0)`,
          opacity: dotHidden ? 0 : 1,
          transition: 'opacity 0.2s ease',
        }}
      />
    </>
  );
};

export default CustomCursor;

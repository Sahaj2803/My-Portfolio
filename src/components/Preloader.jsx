import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const STEPS = ['INITIALIZING', 'LOADING WORK', 'READY'];

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const progressLineRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const step = progress < 40 ? STEPS[0] : progress < 90 ? STEPS[1] : STEPS[2];

  useEffect(() => {
    const chars = textRef.current.children;
    const tl = gsap.timeline();

    const progressObj = { value: 0 };

    tl.fromTo(
      chars,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.04,
        ease: 'power3.out',
      }
    )
      .to(
        progressObj,
        {
          value: 100,
          duration: 1.0,
          ease: 'power2.inOut',
          onUpdate: () => {
            setProgress(Math.round(progressObj.value));
            if (progressLineRef.current) {
              progressLineRef.current.style.width = `${progressObj.value}%`;
            }
          },
        },
        '-=0.15'
      )
      .to(containerRef.current, {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        duration: 0.6,
        ease: 'power4.inOut',
        onComplete,
      });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="flex-1 flex items-center justify-center">
        <div ref={textRef} className="flex overflow-hidden pb-4">
          {'SAHAJ'.split('').map((char, index) => (
            <span
              key={index}
              className="font-space text-[#c4ff00] text-6xl md:text-8xl font-bold inline-block"
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      <div className="w-full max-w-sm px-6 pb-12 flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-between font-mono text-xs tracking-widest text-white/40 uppercase">
          <span>{step}</span>
          <span className="text-[#c4ff00]">{progress}%</span>
        </div>
        <div className="w-full h-[2px] bg-white/20 rounded-full overflow-hidden">
          <div ref={progressLineRef} className="h-full bg-[#c4ff00] w-0" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;

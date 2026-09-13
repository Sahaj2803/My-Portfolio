import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useMousePosition } from '../lib/useMousePosition';
import { createTextReveal } from '../lib/animations';
import MagneticButton from './MagneticButton';
import { ArrowDown } from 'lucide-react';
import { useCursor } from '../context/CursorContext';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);
  const gridRef = useRef(null);

  // clientX/clientY are real pixel coordinates - needed for the parallax
  // math below. (Using the hook's normalized `x`/`y` fields here, as the
  // previous version did, made the parallax offset collapse to a near-
  // constant value close to -1 regardless of pointer position.)
  const { clientX, clientY } = useMousePosition();
  const { setCursorType } = useCursor();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const tl = gsap.timeline({ delay: 0.15 });

    // 1. Name reveals character-by-character
    if (nameRef.current) {
      createTextReveal(nameRef.current, {
        duration: prefersReducedMotion ? 0.01 : 1.1,
        ease: 'expo.out',
        stagger: prefersReducedMotion ? 0 : 0.045,
      });
    }

    // 2. Role follows with a slight delay
    tl.fromTo(
      roleRef.current,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
      0.7
    );

    // 3. Supporting line reveals with a masked upward movement
    tl.fromTo(
      taglineRef.current,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.9, ease: 'power4.out' },
      1.0
    );

    // 4. CTA enters naturally
    tl.fromTo(
      ctaRef.current,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
      1.25
    );

    // 8. Hero content slightly compresses/parallaxes while scrolling away.
    // Skipped under reduced motion - the section just scrolls normally.
    let scrollTween;
    if (!prefersReducedMotion) {
      scrollTween = gsap.to(container, {
        yPercent: 20,
        scale: 0.96,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    return () => {
      tl.kill();
      scrollTween?.scrollTrigger?.kill();
      scrollTween?.kill();
    };
  }, [prefersReducedMotion]);

  // 6. Background reacts subtly to mouse (real pixel coordinates now).
  // Skipped entirely under reduced motion.
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!containerRef.current || !gridRef.current) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const normalizedX = (clientX - centerX) / centerX;
    const normalizedY = (clientY - centerY) / centerY;

    gsap.to(containerRef.current.querySelector('.hero-content'), {
      x: normalizedX * -18,
      y: normalizedY * -18,
      duration: 1,
      ease: 'power2.out',
    });

    gsap.to(gridRef.current, {
      x: normalizedX * 12,
      y: normalizedY * 12,
      duration: 1.5,
      ease: 'power2.out',
    });
  }, [clientX, clientY, prefersReducedMotion]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Grid */}
      <div
        ref={gridRef}
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="hero-content relative z-10 flex flex-col items-center text-center px-4 w-full max-w-5xl">
        {/* Name */}
        <h1
          ref={nameRef}
          className="font-space font-bold text-[clamp(3rem,10vw,10rem)] leading-[0.9] tracking-tighter uppercase mb-6"
        >
          Sahaj<br />Patel
        </h1>

        {/* Role & Tech Stack */}
        <div ref={roleRef} className="flex flex-col items-center gap-4 mb-10">
          <h2 className="text-xl md:text-2xl font-inter text-text-primary tracking-wide uppercase">
            Web Developer
          </h2>
          <div className="overflow-hidden">
            <p
              ref={taglineRef}
              className="text-xs md:text-sm font-inter text-text-secondary tracking-[0.25em] uppercase"
            >
              Building digital products with code <span className="text-accent">+</span> AI
            </p>
          </div>
        </div>

        {/* CTA */}
        <div ref={ctaRef}>
          <MagneticButton>
            <button
              className="group relative px-8 py-4 bg-transparent border border-border rounded-full overflow-hidden transition-colors hover:border-accent"
              onMouseEnter={() => setCursorType('cta')}
              onMouseLeave={() => setCursorType('default')}
              onClick={() => {
                const projectsSec = document.getElementById('projects');
                if (projectsSec) projectsSec.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="absolute inset-0 bg-accent translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 font-space font-medium text-sm tracking-wider uppercase group-hover:text-background transition-colors duration-300">
                View Projects
              </span>
            </button>
          </MagneticButton>
        </div>
      </div>

      {/* Scroll Indicator - restrained motion */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs font-inter uppercase tracking-widest">Scroll</span>
        <ArrowDown className="w-4 h-4 animate-[bounce_2.2s_ease-in-out_infinite]" />
      </div>
    </section>
  );
}

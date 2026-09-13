import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { personalInfo } from '../data/projectData';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current || !textRef.current) return;

    // Split text into words for animation
    const textElement = textRef.current;
    const text = personalInfo.summary;
    textElement.innerHTML = '';
    
    const words = text.split(' ').map(word => {
      const isAccent = word.includes('MERN') || word.includes('Stack') || word.includes('AI-powered');
      return `<span class="inline-block ${isAccent ? 'text-accent' : ''}" style="margin-right: 0.3em; will-change: opacity, transform, filter;">${word}</span>`;
    });
    textElement.innerHTML = words.join('');

    const wordElements = textElement.querySelectorAll('span');

    if (prefersReducedMotion) {
      // No pin, no scrub, no blur - the text is simply readable immediately.
      gsap.set(wordElements, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' });
      return;
    }

    // Scoped to this component - reverting only kills what was created
    // here, never other sections' ScrollTriggers (the previous
    // `ScrollTrigger.getAll().forEach(kill)` cleanup was global and unsafe
    // under StrictMode's double-invoked effects or any future remount).
    const ctx = gsap.context(() => {
      // Initial "unactivated" state - dim, slightly lowered, softly blurred.
      gsap.set(wordElements, { opacity: 0.15, y: 16, scale: 0.97, filter: 'blur(6px)' });

      // ScrollTrigger animation - words feel "activated" as they're scrolled
      // through: blur resolves to sharp, a slight lift, subtle scale.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=150%', // Pin for 150% of viewport height
            pin: true,
            scrub: 1,
          },
        })
        .to(wordElements, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          stagger: 0.1,
          duration: 1,
          ease: 'power1.inOut',
        });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`relative w-full flex items-center justify-center bg-background px-4 md:px-20 ${
        prefersReducedMotion ? 'py-32' : 'h-screen'
      }`}
    >
      <div className="max-w-5xl w-full">
        <div className="mb-12 opacity-50 text-sm font-inter tracking-widest uppercase">
          01 — About
        </div>
        <h2 
          ref={textRef}
          className="font-space font-medium text-3xl md:text-5xl lg:text-6xl leading-[1.3] text-text-primary"
        >
          {/* Text injected via JS for splitting */}
        </h2>
      </div>
    </section>
  );
}

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { personalInfo } from '../data/projectData';
import MagneticButton from './MagneticButton';
import { useCursor } from '../context/CursorContext';
import { useReducedMotion } from '../lib/useReducedMotion';
import { Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const linksRef = useRef(null);
  const { setCursorType } = useCursor();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const words = textRef.current.querySelectorAll('.word-line');
    const links = linksRef.current.querySelectorAll('.contact-link');

    if (prefersReducedMotion) {
      gsap.set(words, { y: 0, opacity: 1, scale: 1 });
      gsap.set(links, { y: 0, opacity: 1 });
      return;
    }

    // Scoped to this component - see About.jsx/ProjectShowcase.jsx for why
    // a global `ScrollTrigger.getAll().forEach(kill)` cleanup is unsafe.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'center center',
          scrub: 1,
        },
      });

      tl.fromTo(
        words,
        { y: 100, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 1, ease: 'power3.out' }
      );

      tl.fromTo(
        links,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'power2.out' },
        '-=0.5'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="contact" ref={sectionRef} className="w-full py-32 bg-background relative overflow-hidden min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-4 md:px-20 flex flex-col items-center text-center">
        
        <div ref={textRef} className="flex flex-col items-center gap-2 md:gap-4 mb-16">
          <div className="word-line font-space font-bold text-5xl md:text-8xl lg:text-[10rem] leading-[0.9] tracking-tighter uppercase overflow-hidden">
            Let's
          </div>
          <div className="word-line font-space font-bold text-5xl md:text-8xl lg:text-[10rem] leading-[0.9] tracking-tighter uppercase text-accent overflow-hidden">
            Build
          </div>
          <div className="word-line font-space font-bold text-5xl md:text-8xl lg:text-[10rem] leading-[0.9] tracking-tighter uppercase overflow-hidden">
            Something.
          </div>
        </div>

        <div ref={linksRef} className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
          <MagneticButton>
            <a 
              href={`mailto:${personalInfo.email}`}
              className="contact-link flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full border border-border bg-surface-2 hover:border-accent transition-colors duration-300"
              onMouseEnter={() => setCursorType('link')}
              onMouseLeave={() => setCursorType('default')}
            >
              <Mail className="w-5 h-5 text-accent" />
              <span className="font-space font-medium uppercase tracking-widest text-sm">Email</span>
            </a>
          </MagneticButton>

          <MagneticButton>
            <a 
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full border border-border bg-surface-2 hover:border-accent transition-colors duration-300"
              onMouseEnter={() => setCursorType('link')}
              onMouseLeave={() => setCursorType('default')}
            >
              <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              <span className="font-space font-medium uppercase tracking-widest text-sm">GitHub</span>
            </a>
          </MagneticButton>

          <MagneticButton>
            <a 
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-link flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-full border border-border bg-surface-2 hover:border-accent transition-colors duration-300"
              onMouseEnter={() => setCursorType('link')}
              onMouseLeave={() => setCursorType('default')}
            >
              <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              <span className="font-space font-medium uppercase tracking-widest text-sm">LinkedIn</span>
            </a>
          </MagneticButton>
        </div>

        <div className="contact-link font-inter text-text-secondary text-sm md:text-base tracking-widest">
          {personalInfo.email}
        </div>
        
      </div>
    </section>
  );
}

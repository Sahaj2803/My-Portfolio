import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { education, internship } from '../data/projectData';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Unify internship + education into a single ordered timeline so every
// entry goes through the exact same markup/animation path once - no
// duplicated content blocks, no elements permanently hidden by a static
// class that only JS can undo.
const timelineItems = [
  {
    key: 'internship',
    title: internship.title,
    subtitle: internship.company,
    meta: `${internship.duration} • ${internship.location}`,
    description: internship.description,
    featured: true,
  },
  ...education.map((edu) => ({
    key: edu.degree,
    title: edu.degree,
    subtitle: edu.institution,
    meta: [edu.period, edu.location].filter(Boolean).join(' • '),
    description: null,
    featured: false,
  })),
];

export default function Education() {
  const containerRef = useRef(null);
  const lineRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;

    const nodes = gsap.utils.toArray('.timeline-node');
    const contents = gsap.utils.toArray('.timeline-content');

    if (prefersReducedMotion) {
      // Line fully drawn, every entry visible immediately - no scrubbed
      // draw-in, no per-item reveal.
      gsap.set(lineRef.current, { scaleY: 1 });
      gsap.set(contents, { autoAlpha: 1, y: 0 });
      gsap.set(nodes, { scale: 1, backgroundColor: 'var(--color-accent)' });
      return;
    }

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.timeline-item');

      // Single line element, single ref - drawn once as the section scrolls.
      // (The previous version pointed two different DOM nodes at the same
      // ref, so only the last-mounted one ever animated.)
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
          },
        }
      );

      items.forEach((item, i) => {
        const node = nodes[i];
        const content = contents[i];
        if (!node || !content) return;

        // Initial "hidden" state lives entirely in JS/GSAP, never in a
        // static Tailwind class - so content can't end up permanently
        // invisible if a ScrollTrigger never fires.
        gsap.set(content, { autoAlpha: 0, y: 24 });
        gsap.set(node, { scale: 0 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: item,
              start: 'top center+=120',
              toggleActions: 'play none none reverse',
            },
          })
          .to(node, {
            scale: 1,
            backgroundColor: 'var(--color-accent)',
            duration: 0.4,
            ease: 'back.out(2)',
          })
          .to(
            content,
            { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.2'
          );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="education" className="w-full py-32 bg-surface-2 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 md:px-20 relative" ref={containerRef}>
        <div className="mb-16 opacity-50 text-sm font-inter tracking-widest uppercase">
          04 — Experience & Education
        </div>

        <div className="relative">
          {/* Static track */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

          {/* Animated draw-in overlay - one element, one ref */}
          <div
            ref={lineRef}
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-accent origin-top md:-translate-x-1/2"
          />

          <div className="flex flex-col gap-12">
            {timelineItems.map((item, i) => {
              const alignRight = i % 2 === 1; // zigzag: item 0 left, item 1 right, ...

              return (
                <div
                  key={item.key}
                  className="timeline-item relative flex flex-col md:flex-row items-start md:items-center w-full"
                >
                  <div
                    className="timeline-node absolute left-8 -translate-x-1/2 md:left-1/2 top-6 md:top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-background bg-surface z-10"
                  />

                  {/* Left slot */}
                  <div
                    className={`w-full md:w-[45%] pl-12 md:pl-0 md:pr-10 md:text-right ${
                      alignRight ? 'hidden md:block' : ''
                    }`}
                  >
                    {!alignRight && <TimelineCard item={item} />}
                  </div>

                  {/* Right slot */}
                  <div
                    className={`w-full md:w-[45%] pl-12 md:pl-10 ${
                      alignRight ? '' : 'hidden md:block'
                    }`}
                  >
                    {alignRight && <TimelineCard item={item} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ item }) {
  return (
    <div className="timeline-content">
      <h3
        className={`font-space font-bold ${
          item.featured ? 'text-2xl text-accent' : 'text-xl text-text-primary'
        }`}
      >
        {item.title}
      </h3>
      <p className="font-inter text-text-primary text-lg mt-1">{item.subtitle}</p>
      <p className="font-inter text-text-secondary text-sm mt-1">{item.meta}</p>
      {item.description && (
        <p className="font-inter text-text-secondary text-sm leading-relaxed border border-border/50 bg-surface/50 p-4 rounded-lg mt-4 text-left">
          {item.description}
        </p>
      )}
    </div>
  );
}

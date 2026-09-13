import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { projects } from '../data/projectData';
import { ProjectVisuals } from './ProjectVisuals';
import MagneticButton from './MagneticButton';
import { useCursor } from '../context/CursorContext';
import { useReducedMotion } from '../lib/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectShowcase() {
  const showcaseRef = useRef(null);
  const containerRef = useRef(null);
  const { setCursorType, setCursorText } = useCursor();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Reduced motion: skip the pinned scroll-hijack entirely. The section
    // instead renders as a normal stacked list (see the JSX below), so
    // there is nothing to animate here.
    if (prefersReducedMotion) return;

    // Scoped to this component - reverting the context only kills triggers
    // and tweens created here, never other sections' ScrollTriggers. (The
    // previous `ScrollTrigger.getAll().forEach(kill)` cleanup was global,
    // which is unsafe under StrictMode's double-invoked effects or any
    // future remount - it could wipe out Hero/About/Contact animations too.)
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.project-panel');

      // Panel 0's own entrance, played once as the section scrolls into
      // view - independent of the pinned scrub timeline below, which only
      // starts once the section is pinned at the top.
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
      const panel0Visual = panels[0]?.querySelector('.project-visual');
      const panel0Text = panels[0]?.querySelector('.project-text');
      gsap.set(panel0Visual, { clipPath: 'inset(0 100% 0 0)', x: 40 });
      gsap.set(panel0Text, { x: -40, opacity: 0 });
      introTl
        .to(panel0Visual, { clipPath: 'inset(0 0% 0 0)', x: 0, duration: 1 })
        .to(panel0Text, { x: 0, opacity: 1, duration: 0.9 }, '<0.1');

      // We create a ScrollTrigger that pins the entire showcase container
      // and creates a scrubbed timeline to transition between panels
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: 'top top',
          end: () => `+=${panels.length * 100}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // We start with Panel 0 visible.
      // As we scroll, we transition Panel 0 out, Panel 1 in, then Panel 1 out, Panel 2 in.
      panels.forEach((panel, i) => {
        const visual = panel.querySelector('.project-visual');
        const textGroup = panel.querySelector('.project-text');

        if (i > 0) {
          gsap.set(panel, { autoAlpha: 0 });

          if (i === 1) {
            // CampusIQ: radial reveal + scale/depth
            gsap.set(visual, { scale: 0.8, clipPath: 'circle(0% at 50% 50%)' });
            gsap.set(textGroup, { x: -50, opacity: 0 });
          } else if (i === 2) {
            // EventHub: vertical reveal with staggered visual layers
            gsap.set(visual, { y: 100, opacity: 0, rotateX: 6 });
            gsap.set(textGroup, { y: 50, opacity: 0 });
          }

          // Animate out previous panel
          const prevPanel = panels[i - 1];
          tl.to(prevPanel, { autoAlpha: 0, duration: 1 }, i * 2 - 1);

          // Animate in current panel
          tl.to(panel, { autoAlpha: 1, duration: 1 }, i * 2 - 1);

          if (i === 1) {
            tl.to(visual, { scale: 1, clipPath: 'circle(100% at 50% 50%)', duration: 1 }, i * 2 - 1);
            tl.to(textGroup, { x: 0, opacity: 1, duration: 1 }, i * 2 - 1);
          } else if (i === 2) {
            tl.to(visual, { y: 0, opacity: 1, rotateX: 0, duration: 1 }, i * 2 - 1);
            tl.to(textGroup, { y: 0, opacity: 1, duration: 1 }, i * 2 - 1);
          }
        }

        // Add a slight hold at the end of each panel so the user can read it
        tl.to({}, { duration: 0.5 });
      });
    }, showcaseRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section 
      id="projects" 
      ref={showcaseRef}
      className={`w-full bg-background relative overflow-hidden ${
        prefersReducedMotion ? '' : 'h-screen'
      }`}
    >
      <div 
        ref={containerRef}
        className={`w-full relative px-4 md:px-20 py-24 max-w-7xl mx-auto ${
          prefersReducedMotion ? '' : 'h-full'
        }`}
      >
        <div className={`${prefersReducedMotion ? 'relative mb-8' : 'absolute top-12'} left-4 md:left-20 z-20 opacity-50 text-sm font-inter tracking-widest uppercase`}>
          03 — Featured Projects
        </div>

        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className={
              prefersReducedMotion
                ? 'project-panel relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 py-16 md:py-24 px-0 md:px-20 border-b border-border/40 last:border-b-0'
                : 'project-panel absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pt-20 pb-12 px-4 md:px-20'
            }
            style={prefersReducedMotion ? undefined : { zIndex: projects.length - index }}
          >
            {/* Text Side */}
            <div className="project-text flex-1 flex flex-col items-start w-full max-w-xl z-10">
              <span className="font-space font-medium text-lg text-accent mb-2 tracking-widest uppercase">
                Project {project.number}
              </span>
              <h3 className="font-space font-bold text-4xl md:text-6xl uppercase leading-none tracking-tight mb-4">
                {project.title}
              </h3>
              <p className="font-inter text-text-secondary text-sm md:text-base tracking-widest uppercase mb-6">
                {project.subtitle}
              </p>
              <p className="font-inter text-text-primary mb-8 leading-relaxed max-w-md">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-10">
                {project.tech.map((tech) => (
                  <span key={tech} className="text-xs font-inter border border-border rounded-full px-3 py-1 bg-surface">
                    {tech}
                  </span>
                ))}
              </div>

              <MagneticButton>
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-6 py-3 bg-surface border border-border rounded-full overflow-hidden inline-flex items-center gap-3 transition-colors hover:border-accent"
                  onMouseEnter={() => setCursorType('link')}
                  onMouseLeave={() => setCursorType('default')}
                >
                  <div className="absolute inset-0 bg-accent translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 font-space font-medium text-sm tracking-wider uppercase group-hover:text-background transition-colors duration-300">
                    Live Demo
                  </span>
                  <svg className="relative z-10 w-4 h-4 group-hover:text-background transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </MagneticButton>
            </div>

            {/* Visual Side */}
            <ProjectVisualFrame
              project={project}
              setCursorType={setCursorType}
              setCursorText={setCursorText}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// Handles the "hover a project visual" interaction: cursor switches to a
// VIEW badge, the frame lifts slightly, and the inner composition drifts
// a few pixels opposite the pointer for a subtle sense of depth.
function ProjectVisualFrame({ project, setCursorType, setCursorText, prefersReducedMotion }) {
  const frameRef = useRef(null);
  const innerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    const el = frameRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(inner, {
      x: relX * -14,
      y: relY * -14,
      duration: 0.6,
      ease: 'power2.out',
    });
  };

  const handleMouseEnter = () => {
    setCursorType('project');
    setCursorText('VIEW');
    if (!prefersReducedMotion) {
      gsap.to(frameRef.current, { scale: 1.02, duration: 0.5, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = () => {
    setCursorType('default');
    setCursorText('');
    if (!prefersReducedMotion) {
      gsap.to(frameRef.current, { scale: 1, duration: 0.6, ease: 'power2.out' });
      gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
    }
  };

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      ref={frameRef}
      className="project-visual flex-1 w-full h-[40vh] md:h-[60vh] relative z-0 block rounded-2xl"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`Open the live ${project.title} demo`}
    >
      <div ref={innerRef} className="w-full h-full">
        <ProjectVisuals projectId={project.id} />
      </div>
    </a>
  );
}

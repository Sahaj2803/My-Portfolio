import React, { useEffect, useRef, useState } from 'react';
import { skills } from '../data/projectData';
import { useCursor } from '../context/CursorContext';
import { createMagneticEffect } from '../lib/animations';

const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  tools: 'Tooling',
};

function SkillWord({ skill, isHovered, isDimmed, pushX, onHover, onLeave }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    // Small, restrained magnetic displacement - just enough to feel alive,
    // never bouncy or childish.
    const cleanup = createMagneticEffect(el, { strength: 0.18, radius: 70 });
    return () => cleanup && cleanup();
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      className="relative px-4 py-2 md:px-5 md:py-3 cursor-pointer select-none bg-transparent border-0"
      onMouseEnter={() => onHover(skill.name)}
      onMouseLeave={onLeave}
      onFocus={() => onHover(skill.name)}
      onBlur={onLeave}
      style={{
        transform: `translateX(${pushX}px) scale(${isHovered ? 1.08 : 1})`,
        opacity: isDimmed ? 0.28 : 1,
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
      }}
    >
      <span
        className={`font-space font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight transition-colors duration-300 ${
          isHovered ? 'text-accent' : 'text-text-primary'
        }`}
      >
        {skill.name}
      </span>
      <span
        className="absolute left-4 right-4 md:left-5 md:right-5 -bottom-0.5 h-[2px] bg-accent origin-left"
        style={{
          transform: `scaleX(${isHovered ? 1 : 0})`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
    </button>
  );
}

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const { setCursorType } = useCursor();

  const handleHover = (name) => {
    setHoveredSkill(name);
    setCursorType('link');
  };

  const handleLeave = () => {
    setHoveredSkill(null);
    setCursorType('default');
  };

  const hoveredIndex = skills.findIndex((s) => s.name === hoveredSkill);
  const activeSkill = skills.find((s) => s.name === hoveredSkill);

  return (
    <section
      id="skills"
      className="relative w-full py-24 bg-surface-2 overflow-hidden flex flex-col justify-center min-h-[70vh]"
    >
      <div className="px-4 md:px-20 mb-12">
        <div className="opacity-50 text-sm font-inter tracking-widest uppercase">
          02 — Skills
        </div>
      </div>

      <div className="w-full flex flex-wrap items-center justify-center px-4 md:px-12 gap-y-2">
        {skills.map((skill, i) => {
          const isHovered = hoveredSkill === skill.name;
          const isDimmed = hoveredIndex !== -1 && !isHovered;
          const delta = hoveredIndex === -1 ? 0 : i - hoveredIndex;
          const pushX =
            hoveredIndex === -1 || isHovered
              ? 0
              : Math.sign(delta) * Math.max(0, 16 - Math.abs(delta) * 5);

          return (
            <SkillWord
              key={skill.name}
              skill={skill}
              isHovered={isHovered}
              isDimmed={isDimmed}
              pushX={pushX}
              onHover={handleHover}
              onLeave={handleLeave}
            />
          );
        })}
      </div>

      {/* Category readout below - reveals on hover */}
      <div className="h-12 mt-12 flex items-center justify-center">
        <div
          className={`font-inter text-text-secondary uppercase tracking-widest text-sm transition-all duration-300 ${
            activeSkill ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {activeSkill ? `${categoryLabels[activeSkill.category] ?? activeSkill.category} Technology` : 'Hover a skill'}
        </div>
      </div>
    </section>
  );
}

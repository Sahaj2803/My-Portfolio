import React from 'react';
import { personalInfo } from '../data/projectData';
import { ArrowUp } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { useCursor } from '../context/CursorContext';

export default function Footer() {
  const { setCursorType } = useCursor();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-surface py-8 px-4 md:px-20 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
        <span className="font-space font-bold uppercase tracking-widest text-text-primary">
          © {new Date().getFullYear()} {personalInfo.name}
        </span>
        <span className="hidden md:block text-border">•</span>
        <span className="font-inter text-text-secondary text-sm tracking-wider uppercase">
          {personalInfo.title}
        </span>
      </div>

      <MagneticButton>
        <button 
          onClick={handleScrollTop}
          className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors duration-300 group"
          onMouseEnter={() => setCursorType('link')}
          onMouseLeave={() => setCursorType('default')}
        >
          <span className="font-space font-medium uppercase tracking-widest text-xs">Back to top</span>
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-accent transition-colors duration-300">
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
          </div>
        </button>
      </MagneticButton>
    </footer>
  );
}

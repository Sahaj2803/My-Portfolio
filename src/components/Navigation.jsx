import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { useCursor } from '../context/CursorContext';

const navLinks = [
  { name: 'ABOUT', href: '#about' },
  { name: 'SKILLS', href: '#skills' },
  { name: 'PROJECTS', href: '#projects' },
  { name: 'CONTACT', href: '#contact' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { setCursorType } = useCursor();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Real active-section detection: whichever section is most centered in
  // the viewport gets the indicator, independent of hover state.
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const match = navLinks.find((link) => `#${visible.target.id}` === link.href);
          if (match) setActiveSection(match.name);
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const activeLink = hoveredLink || activeSection;

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.classList.toggle('no-scroll', isOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  const handleMouseEnter = () => setCursorType('link');
  const handleMouseLeave = () => setCursorType('default');

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-40 p-6 transition-all duration-300 ${
          scrolled ? 'bg-[#0a0a0a]/80 backdrop-blur-md py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a
            href="#home"
            className="font-space font-bold text-xl tracking-wider text-white z-50 relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsOpen(false)}
          >
            SAHAJ PATEL
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <MagneticButton
                key={link.name}
                className="relative font-inter text-sm font-medium text-gray-300 hover:text-white transition-colors py-2"
                aria-current={activeSection === link.name ? 'true' : undefined}
                onMouseEnter={() => {
                  setHoveredLink(link.name);
                  handleMouseEnter();
                }}
                onMouseLeave={() => {
                  setHoveredLink('');
                  handleMouseLeave();
                }}
                onClick={() => {
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {link.name}
                {activeLink === link.name && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#c4ff00]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </MagneticButton>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden z-50 relative text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className={`font-space text-4xl font-bold transition-colors ${
                    activeSection === link.name ? 'text-[#c4ff00]' : 'text-white hover:text-[#c4ff00]'
                  }`}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    // Let the exit transition clear before scrolling so the
                    // clip-path close animation isn't interrupted by the jump.
                    setTimeout(() => {
                      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                    }, 350);
                  }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;

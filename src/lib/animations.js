import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function splitTextIntoSpans(element) {
  if (!element) return { chars: [], words: [] };

  const text = element.innerText;
  element.innerHTML = '';
  
  const words = [];
  const chars = [];

  const wordStrings = text.split(' ');

  wordStrings.forEach((wordString, wordIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'word';
    wordSpan.style.display = 'inline-block';

    const charStrings = wordString.split('');
    charStrings.forEach((charString) => {
      const charSpan = document.createElement('span');
      charSpan.className = 'char';
      charSpan.style.display = 'inline-block';
      charSpan.innerText = charString;
      wordSpan.appendChild(charSpan);
      chars.push(charSpan);
    });

    element.appendChild(wordSpan);
    words.push(wordSpan);

    if (wordIndex < wordStrings.length - 1) {
      const spaceSpan = document.createElement('span');
      spaceSpan.className = 'char space';
      spaceSpan.style.display = 'inline-block';
      spaceSpan.innerHTML = '&nbsp;';
      element.appendChild(spaceSpan);
      chars.push(spaceSpan);
    }
  });

  return { chars, words };
}

export function createTextReveal(element, options = {}) {
  const {
    type = 'chars',
    stagger = 0.03,
    duration = 0.8,
    ease = 'power4.out',
    y = 40,
    ...rest
  } = options;

  const { chars, words } = splitTextIntoSpans(element);
  const targets = type === 'words' ? words : chars;

  // Initial state setup to prevent flash of unstyled content
  gsap.set(targets, { y, opacity: 0 });

  return gsap.to(targets, {
    y: 0,
    opacity: 1,
    duration,
    stagger,
    ease,
    ...rest,
  });
}

export function createStaggerReveal(elements, options = {}) {
  const {
    stagger = 0.1,
    duration = 0.6,
    ease = 'power3.out',
    y = 30,
    ...rest
  } = options;

  gsap.set(elements, { y, opacity: 0 });

  return gsap.to(elements, {
    y: 0,
    opacity: 1,
    duration,
    stagger,
    ease,
    ...rest,
  });
}

export function createParallax(element, options = {}) {
  const { speed = 0.5, direction = 'vertical', ...rest } = options;
  
  const yPercent = direction === 'vertical' ? speed * 100 : 0;
  const xPercent = direction === 'horizontal' ? speed * 100 : 0;

  return gsap.to(element, {
    yPercent,
    xPercent,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      ...rest,
    },
  });
}

export function createMagneticEffect(element, options = {}) {
  const { strength = 0.3, radius = 100 } = options;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {};
  }

  let isHovered = false;

  const onMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    if (distance < radius) {
      isHovered = true;
      gsap.to(element, {
        x: distX * strength,
        y: distY * strength,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else if (isHovered) {
      isHovered = false;
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)',
      });
    }
  };

  const onMouseLeave = () => {
    isHovered = false;
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  window.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);

  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseleave', onMouseLeave);
  };
}

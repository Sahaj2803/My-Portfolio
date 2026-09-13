import { useState, useEffect } from 'react';

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
    const documentChangeHandler = (e) => setPrefersReducedMotion(e.matches);

    // Set the initial value
    setPrefersReducedMotion(mediaQueryList.matches);

    if (mediaQueryList.addListener) {
      mediaQueryList.addListener(documentChangeHandler);
    } else {
      mediaQueryList.addEventListener('change', documentChangeHandler);
    }

    return () => {
      if (mediaQueryList.removeListener) {
        mediaQueryList.removeListener(documentChangeHandler);
      } else {
        mediaQueryList.removeEventListener('change', documentChangeHandler);
      }
    };
  }, []);

  return prefersReducedMotion;
}

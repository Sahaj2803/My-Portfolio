import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll(enabled = true) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    const ticker = (time) => {
      lenisInstance.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    setLenis(lenisInstance);

    return () => {
      lenisInstance.destroy();
      gsap.ticker.remove(ticker);
    };
  }, [enabled]);

  return lenis;
}

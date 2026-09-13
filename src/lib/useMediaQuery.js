import { useState, useEffect } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = (e) => setMatches(e.matches);

    // Set the initial value
    setMatches(mediaQueryList.matches);

    // Listen for changes
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
  }, [query]);

  return matches;
}

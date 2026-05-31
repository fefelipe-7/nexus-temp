import { useEffect } from 'react';

export function useViewportHeight() {
  useEffect(() => {
    const setHeight = () => {
      const vh = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${vh}px`);
    };

    setHeight();
    window.visualViewport?.addEventListener('resize', setHeight);
    window.addEventListener('orientationchange', () => setTimeout(setHeight, 150));

    return () => {
      window.visualViewport?.removeEventListener('resize', setHeight);
      window.removeEventListener('orientationchange', setHeight);
    };
  }, []);
}

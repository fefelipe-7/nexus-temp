import { useState, useEffect } from 'react';

export function useRotatingVariant<T>(variants: T[]): T {
  const [variant, setVariant] = useState<T>(() => {
    const hoursSinceEpoch = Math.floor(Date.now() / (3 * 60 * 60 * 1000));
    return variants[hoursSinceEpoch % variants.length];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const hoursSinceEpoch = Math.floor(Date.now() / (3 * 60 * 60 * 1000));
      setVariant(variants[hoursSinceEpoch % variants.length]);
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [variants]);

  return variant;
}

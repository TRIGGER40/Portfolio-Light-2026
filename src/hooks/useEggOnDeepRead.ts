import { useEffect } from 'react';
import { useEasterEgg } from '../context/EasterEggContext';

/**
 * Egg #1 — "The Deep Reader"
 * Auto-triggers 2 seconds after the user reaches 90% scroll depth
 * on any case study page. If they scroll back up before 2s, the
 * timer is cancelled and resets when they reach 90% again.
 */
export function useEggOnDeepRead(scrollProgress: number) {
  const { discover, isDiscovered } = useEasterEgg();
  const atBottom = scrollProgress >= 0.90;

  useEffect(() => {
    if (!atBottom || isDiscovered('architects-trace')) return;
    const timer = setTimeout(() => discover('architects-trace'), 2000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atBottom]);
}

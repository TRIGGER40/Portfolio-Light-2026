import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Disable browser's native scroll restoration — we handle it ourselves
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

const STORAGE_KEY = 'scroll_positions';

function getSavedPositions(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function savePosition(path: string, y: number) {
  const positions = getSavedPositions();
  positions[path] = y;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

/** Attempt to scroll to `target`, re-trying whenever the document grows taller (up to 2 s). */
function scrollTo(target: number) {
  const TIMEOUT_MS = 2000;
  const deadline = Date.now() + TIMEOUT_MS;

  const tryScroll = () => {
    window.scrollTo({ top: target, behavior: 'instant' });
  };

  // Initial attempt after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      tryScroll();

      // If still not there, watch for layout growth
      if (window.scrollY < target - 50) {
        const ro = new ResizeObserver(() => {
          if (Date.now() > deadline) { ro.disconnect(); return; }
          tryScroll();
          if (window.scrollY >= target - 50) ro.disconnect();
        });
        ro.observe(document.body);
        // Hard stop after timeout
        setTimeout(() => ro.disconnect(), TIMEOUT_MS);
      }
    });
  });
}

/** Call in pages that should save + restore their scroll position. */
export function useScrollRestoration() {
  const location = useLocation();
  const key = location.pathname + location.search;

  // Restore scroll on mount
  useEffect(() => {
    const saved = getSavedPositions()[key];
    if (saved !== undefined && saved > 0) {
      scrollTo(saved);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [key]);

  // Save scroll continuously while active and on unmount
  useEffect(() => {
    const onScroll = () => savePosition(key, window.scrollY);
    let t: ReturnType<typeof setTimeout> | null = null;
    const throttled = () => {
      if (t) return;
      t = setTimeout(() => { t = null; onScroll(); }, 300);
    };
    window.addEventListener('scroll', throttled, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttled);
    };
  }, [key]);
}

/** Explicit save before a programmatic navigation (belt + suspenders). */
export function saveScrollBeforeLeave() {
  savePosition(window.location.pathname + window.location.search, window.scrollY);
}

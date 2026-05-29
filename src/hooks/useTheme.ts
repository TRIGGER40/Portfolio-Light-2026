import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) return saved;
    // Default to light regardless of OS preference; user can still toggle.
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggle = (e?: React.MouseEvent<HTMLElement>) => {
    const x = e ? e.clientX : window.innerWidth - 44;
    const y = e ? e.clientY : window.innerHeight - 44;

    document.documentElement.style.setProperty('--vt-x', `${x}px`);
    document.documentElement.style.setProperty('--vt-y', `${y}px`);

    if (!('startViewTransition' in document)) {
      setTheme(t => (t === 'light' ? 'dark' : 'light'));
      return;
    }

    (document as any).startViewTransition(() => {
      flushSync(() => {
        setTheme(t => (t === 'light' ? 'dark' : 'light'));
      });
    });
  };

  return { theme, toggle };
}

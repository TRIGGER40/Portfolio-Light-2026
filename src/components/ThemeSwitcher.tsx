import { useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import styles from './ThemeSwitcher.module.css';

export function ThemeSwitcher() {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const onAskPage = pathname === '/ask';

  return (
    <button
      className={`${styles.btn}${onAskPage ? ' ' + styles.askTopRight : ''}`}
      onClick={(e) => toggle(e)}
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <i
        className={`bi ${theme === 'light' ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`}
        aria-hidden="true"
      />
    </button>
  );
}

import { useTheme } from '../hooks/useTheme';
import styles from './ThemeSwitcher.module.css';

export function ThemeSwitcher() {
  const { theme, toggle } = useTheme();

  return (
    <button
      className={styles.btn}
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

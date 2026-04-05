import { useNavigate } from 'react-router-dom';
import styles from './GoBackButton.module.css';

interface Props {
  fallback?: string;
  className?: string;
  label?: string;
}

export function GoBackButton({ fallback = '/', className, label = 'Go back' }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button className={`${styles.btn}${className ? ` ${className}` : ''}`} onClick={handleClick}>
      <span className={styles.arrow}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path d="M9.5 3L5 7.5L9.5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      {label}
    </button>
  );
}

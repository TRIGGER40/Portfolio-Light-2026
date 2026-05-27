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
        <i className="bi bi-chevron-left" style={{ fontSize: '15px' }} aria-hidden="true" />
      </span>
      {label}
    </button>
  );
}

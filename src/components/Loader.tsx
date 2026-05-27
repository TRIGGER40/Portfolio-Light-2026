import styles from './Loader.module.css';

interface LoaderProps {
  size?: number;   // diameter in px, default 28
  className?: string;
}

export function Loader({ size = 28, className }: LoaderProps) {
  return (
    <span
      className={`${styles.loader} ${className ?? ''}`}
      style={{ '--loader-size': `${size}px` } as React.CSSProperties}
      aria-label="Loading"
      role="status"
    />
  );
}

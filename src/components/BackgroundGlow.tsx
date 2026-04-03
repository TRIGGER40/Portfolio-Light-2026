import styles from './BackgroundGlow.module.css';

export function BackgroundGlow() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />
      <div className={styles.noise} />
    </div>
  );
}

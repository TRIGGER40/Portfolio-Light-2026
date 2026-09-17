import styles from './GridBreath.module.css';

/**
 * Overlays the background grid with 3 independently-breathing radial pulses
 * at different viewport origins. Each layer shares the same grid pattern as
 * body::before but is masked to a specific region and animated with a distinct
 * duration + phase offset — so they never sync and the effect reads as organic.
 */
export function GridBreath() {
  return (
    <div className={styles.root} aria-hidden="true">
      <div className={`${styles.layer} ${styles.layerA}`} />
      <div className={`${styles.layer} ${styles.layerB}`} />
      <div className={`${styles.layer} ${styles.layerC}`} />
    </div>
  );
}

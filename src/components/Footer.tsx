import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <span className={styles.name}>Midhun Krishnakumar</span>
          <span className={styles.copy}>© {year} · All rights reserved</span>
        </div>
        <div className={styles.right}>
          <span className={styles.built}>
            Imagined and built using Claude Code
          </span>
        </div>
      </div>
    </footer>
  );
}

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { GoBackButton } from '../components/GoBackButton';
import { Footer } from '../components/Footer';
import { useEasterEgg } from '../context/EasterEggContext';
import styles from './PanoramaPage.module.css';

export function PanoramaPage() {
  const { discover, isDiscovered } = useEasterEgg();

  /* Egg #3 — auto-triggers after 2s of genuine dwell time */
  useEffect(() => {
    if (isDiscovered('spatial-memory')) return;
    const timer = setTimeout(() => discover('spatial-memory'), 2000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <BackgroundGlow />
      <main style={{ paddingTop: '80px' }}>
        <div className="container">
          <GoBackButton fallback="/about" />

          <motion.div
            className={styles.header}
            initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label">Spatial Design · Side Experiment</span>
            <h1 className={`text-display ${styles.title}`}>
              Virtual Campus
              <br />
              <span className="gradient-text">in 360°</span>
            </h1>
            <p className={styles.desc}>
              This was a precursor to creating a Metaverse environment for a Virtual Campus
              Learning Area where students can log in and interact with other students and
              attend classes virtually walking through the campus.
            </p>
          </motion.div>
        </div>

        <motion.div
          className={styles.embedWrap}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'relative' }}
        >
          <iframe
            src="https://app.cloudpano.com/tours/eOHZZUTOdf"
            className={styles.iframe}
            allow="vr; gyroscope; accelerometer; fullscreen"
            allowFullScreen
            title="Virtual Campus 360° Walkthrough"
          />

        </motion.div>

        <Footer />
      </main>
    </>
  );
}

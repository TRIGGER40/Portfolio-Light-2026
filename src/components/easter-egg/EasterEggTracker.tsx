import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEasterEgg } from '../../context/EasterEggContext';
import { EggIcon } from './EggIcon';
import styles from './EasterEggTracker.module.css';

export function EasterEggTracker() {
  const { discoveredCount, isComplete, openProgress } = useEasterEgg();
  const prevCount = useRef(discoveredCount);

  /* Flash the tracker whenever the count goes up */
  const didIncrease = useRef(false);
  useEffect(() => {
    if (discoveredCount > prevCount.current) {
      didIncrease.current = true;
      const t = setTimeout(() => { didIncrease.current = false; }, 1000);
      prevCount.current = discoveredCount;
      return () => clearTimeout(t);
    }
    prevCount.current = discoveredCount;
  }, [discoveredCount]);

  const eggState = isComplete ? 'complete' : discoveredCount > 0 ? 'discovered' : 'undiscovered';

  return (
    <button
      className={`
        ${styles.tracker}
        ${discoveredCount > 0  ? styles.trackerActive   : ''}
        ${isComplete           ? styles.trackerComplete : ''}
      `}
      onClick={openProgress}
      aria-label={`Easter eggs: ${discoveredCount} of 3 discovered`}
      title="Hidden discoveries"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={discoveredCount}
          className={styles.iconWrap}
          initial={{ scale: discoveredCount > 0 ? 0.5 : 1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.34, 1.3, 0.64, 1] }}
        >
          <EggIcon size={16} state={eggState} />
        </motion.span>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.span
          key={discoveredCount}
          className={styles.count}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0,  opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {discoveredCount} of 3
        </motion.span>
      </AnimatePresence>

    </button>
  );
}

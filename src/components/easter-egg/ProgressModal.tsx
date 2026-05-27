import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEasterEgg } from '../../context/EasterEggContext';
import { EASTER_EGGS, TOTAL_EGGS } from '../../data/easterEggs';
import { EggIcon } from './EggIcon';
import styles from './ProgressModal.module.css';

export function ProgressModal() {
  const {
    progressOpen,
    closeProgress,
    discovered,
    isComplete,
    openManifesto,
    discoveredCount,
  } = useEasterEgg();

  /* lock scroll */
  useEffect(() => {
    if (progressOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [progressOpen]);

  /* Escape */
  useEffect(() => {
    if (!progressOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closeProgress(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [progressOpen, closeProgress]);

  const noneFound = discoveredCount === 0;

  return (
    <AnimatePresence>
      {progressOpen && (
        <motion.div
          className={`${styles.backdrop} ${isComplete ? styles.backdropGolden : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={closeProgress}
        >
          {isComplete && <div className={styles.goldenRays} />}

          <motion.div
            className={`${styles.modal} ${isComplete ? styles.modalGolden : ''}`}
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.96, y: 10  }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-label="Easter egg progress"
          >
            {/* ── Header ── */}
            <div className={styles.modalHeader}>
              <div className={styles.headerText}>
                <h2 className={`${styles.headerTitle} ${isComplete ? styles.headerTitleGolden : ''}`}>
                  Hidden discoveries
                </h2>
                <p className={`${styles.headerSub} ${isComplete ? styles.headerSubGolden : ''}`}>
                  {noneFound
                    ? 'Somewhere in this portfolio, hidden discoveries await.'
                    : isComplete
                      ? 'Every hidden layer has been revealed.'
                      : 'You\'ve uncovered secrets hidden throughout the portfolio.'}
                </p>
              </div>
              <button className={`${styles.closeBtn} ${isComplete ? styles.closeBtnGolden : ''}`} onClick={closeProgress} aria-label="Close">
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>

            {/* ── Teaser atmospheric (0 found) ── */}
            {noneFound && (
              <div className={styles.teaser}>
                <div className={styles.teaserGlow} />
                <div className={styles.teaserEggs}>
                  {EASTER_EGGS.map(e => (
                    <div key={e.id} className={styles.teaserEggWrap}>
                      <EggIcon size={100} state="undiscovered" eggIndex={e.index} />
                    </div>
                  ))}
                </div>
                <p className={styles.teaserHint}>Explore with curiosity.</p>
              </div>
            )}

            {/* ── Progress bar ── */}
            {!noneFound && (
              <div className={styles.progressSection}>
                <div className={styles.progressDots}>
                  {EASTER_EGGS.map(e => (
                    <div
                      key={e.id}
                      className={`${styles.progressEgg} ${discovered.includes(e.id) ? (isComplete ? styles.progressEggGolden : styles.progressEggFound) : ''}`}
                    >
                      <EggIcon
                        size={76}
                        state={discovered.includes(e.id) ? (isComplete ? 'complete' : 'discovered') : 'undiscovered'}
                        eggIndex={e.index}
                      />
                    </div>
                  ))}
                </div>
                <span className={styles.progressLabel}>
                  {discoveredCount} of {TOTAL_EGGS} discovered
                </span>
              </div>
            )}

            {/* ── Clue cards ── */}
            <div className={styles.cards}>
              {EASTER_EGGS.map((egg, i) => {
                const found = discovered.includes(egg.id);
                return (
                  <motion.div
                    key={egg.id}
                    className={`${styles.card} ${found ? (isComplete ? styles.cardGolden : styles.cardFound) : styles.cardHidden}`}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.35 }}
                  >
                    {/* Number */}
                    <span className={styles.cardNum}>{String(i + 1).padStart(2, '0')}</span>

                    {/* Title */}
                    <div className={styles.cardTitleRow}>
                      <h3 className={`${styles.cardTitle} ${!found ? styles.cardTitleBlur : ''}`}>
                        {found ? egg.title : egg.title}
                      </h3>
                      <span className={`${styles.cardBadge} ${found ? (isComplete ? styles.cardBadgeGolden : styles.cardBadgeFound) : ''}`}>
                        {found ? '✓ Discovered' : 'Not yet found'}
                      </span>
                    </div>

                    {/* Clue / lore */}
                    {found ? (
                      <p className={styles.cardLore}>{egg.lore}</p>
                    ) : (
                      <p className={styles.cardClue}>
                        <span className={styles.clueLabel}>Clue:</span> {egg.clue}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* ── Manifesto card — always visible, locked until all found ── */}
            <motion.div
              className={`${styles.manifestoCard} ${isComplete ? styles.manifestoCardActive : styles.manifestoCardLocked}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {isComplete && <div className={styles.rewardGlow} />}
              <div className={styles.manifestoIconWrap}>
                <i className={`bi ${isComplete ? 'bi-journal-richtext' : 'bi-lock'}`} aria-hidden="true" />
              </div>
              <div className={styles.manifestoInfo}>
                <p className={styles.manifestoTitle}>Personal Design Manifesto</p>
                <p className={styles.manifestoSub}>
                  {isComplete
                    ? 'All discoveries unlocked.'
                    : `Locked. Find all ${TOTAL_EGGS} hidden discoveries to unlock.`}
                </p>
              </div>
              {isComplete ? (
                <button
                  className={styles.rewardBtn}
                  onClick={() => { closeProgress(); setTimeout(openManifesto, 150); }}
                >
                  Unlock
                </button>
              ) : (
                <span className={styles.manifestoLockBadge}>
                  {discoveredCount}/{TOTAL_EGGS}
                </span>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SideExperiments.module.css';
import { ExperimentModal, type Experiment } from './ExperimentModal';
import { PhoneMoment } from './PhoneMoment';

const EXPERIMENTS: Experiment[] = [
  {
    num: '01',
    title: 'YouTube helping people set a routine',
    desc: 'Using the platform\'s pull to nudge people toward structured, healthy daily routines.',
    tag: 'Behaviour Design',
    thumb: { type: 'video', src: '/VIDEOS/youtube-routine-web.mp4' },
    cardImg: {
      light: '/images/experiments/youtube-routine-light.webp',
      dark: '/images/experiments/youtube-routine-dark.webp',
    },
  },
  {
    num: '02',
    title: 'Visualising money in digital transactions',
    desc: 'Reintroducing the emotional weight of physical currency into digital payment flows.',
    tag: 'Mobile UX',
    thumb: { type: 'video', src: '/VIDEOS/rethinking-money-web.mp4' },
    cardImg: {
      light: '/images/experiments/money-light.webp',
      dark: '/images/experiments/money-dark.webp',
    },
    portrait: true,
  },
  {
    num: '03',
    title: 'CampusLive',
    desc: 'A metaverse campus replicating the corridor learning that defines college life.',
    tag: 'Spatial Design',
    thumb: { type: 'video', src: '/VIDEOS/campus-live-web.mp4' },
    cardImg: {
      light: '/images/experiments/campus-live-light.webp',
      dark: '/images/experiments/campus-live-dark.webp',
    },
    ctaLink: '/campus-pano',
    ctaLabel: 'Walk through the campus',
  },
  {
    num: '04',
    title: 'Safe Routes in Google Maps',
    desc: 'Route safety badges based on lighting, incident history, and foot traffic data.',
    tag: 'Maps UX',
    thumb: { type: 'img', src: '/images/safe-routes-1.webp' },
    cardImg: {
      light: '/images/experiments/safe-routes-light.webp',
      dark: '/images/experiments/safe-routes-dark.webp',
    },
  },
];

const COUNT = EXPERIMENTS.length;
const AUTOPLAY_MS = 3200;

export function SideExperiments() {
  const [autoIndex, setAutoIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const activeIndex = hoverIndex ?? autoIndex;

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isMobile || hoverIndex !== null || modalIndex !== null) return;
    const id = setInterval(() => {
      setAutoIndex(i => (i + 1) % COUNT);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isMobile, hoverIndex, modalIndex]);

  return (
    <>
      <section className={styles.section}>
        <div className="container">
          <div className={styles.header}>
            <span className="section-label">Beyond Work</span>
            <h2 className={`text-display ${styles.title}`}>
              Things I explore<br />
              <span className="gradient-text">out of curiosity</span>
            </h2>
            <p className={styles.sub}>Side experiments where design meets a personal question.</p>
          </div>
        </div>

        <div className={`container ${styles.phoneMomentWrap}`}>
          <PhoneMoment />
        </div>

        <div className="container">
          {isMobile ? (
            <div className={styles.mobileList}>
              {EXPERIMENTS.map((exp, i) => (
                <button
                  key={exp.num}
                  className={styles.mobileCard}
                  onClick={() => setModalIndex(i)}
                  aria-label={`Open ${exp.title}`}
                >
                  <div className={styles.mobileThumb}>
                    <img
                      className={`${styles.panelImg} ${styles.panelImgLight}`}
                      src={exp.cardImg.light}
                      alt={exp.title}
                      loading="lazy"
                    />
                    <img
                      className={`${styles.panelImg} ${styles.panelImgDark}`}
                      src={exp.cardImg.dark}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                    />
                    <span className={styles.mobileNum}>{exp.num}</span>
                  </div>
                  <div className={styles.mobileText}>
                    <span className={styles.mobileTitle}>{exp.title}</span>
                    <span className={styles.mobileDesc}>{exp.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <motion.div
              className={styles.row}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {EXPERIMENTS.map((exp, i) => {
                const isActive = i === activeIndex;

                return (
                  <motion.button
                    key={exp.num}
                    className={styles.panel}
                    onClick={() => setModalIndex(i)}
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                    onFocus={() => setHoverIndex(i)}
                    onBlur={() => setHoverIndex(null)}
                    aria-label={`Open ${exp.title}`}
                    animate={{ scale: isActive ? 1.24 : 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ zIndex: isActive ? 5 : 1 }}
                  >
                    <img
                      className={`${styles.panelImg} ${styles.panelImgLight}`}
                      src={exp.cardImg.light}
                      alt={exp.title}
                      loading="lazy"
                    />
                    <img
                      className={`${styles.panelImg} ${styles.panelImgDark}`}
                      src={exp.cardImg.dark}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                    />

                    <span className={styles.panelNum}>{exp.num}</span>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          className={styles.panelOverlay}
                          initial={{ y: 12, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 12, opacity: 0 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <span className={styles.panelScrim} aria-hidden="true" />
                          <div className={styles.panelText}>
                            <span className={styles.panelTitle}>{exp.title}</span>
                            <span className={styles.panelDesc}>{exp.desc}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {modalIndex !== null && (
          <ExperimentModal
            experiments={EXPERIMENTS}
            activeIndex={modalIndex}
            onClose={() => setModalIndex(null)}
            onSelect={setModalIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}

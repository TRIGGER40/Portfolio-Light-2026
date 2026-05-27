import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SideExperiments.module.css';
import { ExperimentModal, type Experiment } from './ExperimentModal';

const EXPERIMENTS: Experiment[] = [
  {
    num: '01',
    title: 'YouTube helping people set a routine',
    desc: 'Using the platform\'s pull to nudge people toward structured, healthy daily routines.',
    tag: 'Behaviour Design',
    thumb: { type: 'video', src: '/VIDEOS/youtube-routine-web.mp4' },
  },
  {
    num: '02',
    title: 'Visualising money in digital transactions',
    desc: 'Reintroducing the emotional weight of physical currency into digital payment flows.',
    tag: 'Mobile UX',
    thumb: { type: 'video', src: '/VIDEOS/rethinking-money-web.mp4' },
    portrait: true,
  },
  {
    num: '03',
    title: 'CampusLive',
    desc: 'A metaverse campus replicating the corridor learning that defines college life.',
    tag: 'Spatial Design',
    thumb: { type: 'video', src: '/VIDEOS/campus-live-web.mp4' },
    ctaLink: '/campus-pano',
    ctaLabel: 'Walk through the campus',
  },
  {
    num: '04',
    title: 'Safe Routes in Google Maps',
    desc: 'Route safety badges based on lighting, incident history, and foot traffic data.',
    tag: 'Maps UX',
    thumb: { type: 'img', src: '/images/safe-routes-1.jpg' },
  },
];

export function SideExperiments() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

          <div className={styles.list}>
            {EXPERIMENTS.map((exp, i) => (
              <button
                key={exp.num}
                className={styles.row}
                onClick={() => setActiveIndex(i)}
              >
                <span className={styles.num}>{exp.num}</span>

                <div className={styles.thumb}>
                  {exp.thumb.type === 'video'
                    ? <video src={exp.thumb.src} muted playsInline preload="metadata" />
                    : <img src={exp.thumb.src} alt={exp.title} />
                  }
                </div>

                <div className={styles.text}>
                  <span className={styles.rowTitle}>{exp.title}</span>
                  <span className={styles.rowDesc}>{exp.desc}</span>
                </div>

                <span className={styles.tag}>{exp.tag}</span>

                <span className={styles.playIcon}>
                  <i className="bi bi-play-circle" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeIndex !== null && (
          <ExperimentModal
            experiments={EXPERIMENTS}
            activeIndex={activeIndex}
            onClose={() => setActiveIndex(null)}
            onSelect={setActiveIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
}

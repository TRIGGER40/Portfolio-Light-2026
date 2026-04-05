import { motion } from 'framer-motion';
import pStyles from '../pages/AboutPage.module.css';

export function SideExperiments() {
  return (
    <section className={pStyles.expLabSection}>
      <div className="container">
        <span className="section-label">Beyond Work</span>
        <h2 className={`text-display ${pStyles.expLabTitle}`}>
          Things I explore<br />
          <span className="gradient-text">out of curiosity</span>
        </h2>
        <p className={pStyles.expLabSub}>
          Side experiments where design meets a personal question worth exploring.
        </p>

        <div className={pStyles.expLabStack}>

          {/* ── 01 YouTube Routine ── */}
          <motion.div
            className={pStyles.labRow}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={pStyles.labRowVideo}>
              <video
                src="/VIDEOS/youtube-routine-web.mp4"
                autoPlay muted loop playsInline preload="auto"
                className={pStyles.labVideo}
              />
            </div>
            <div className={pStyles.labRowText}>
              <span className={pStyles.labNum}>01</span>
              <h3 className={pStyles.labTitle}>YouTube helping people set a routine</h3>
              <p className={pStyles.labDesc}>
                YouTube is more than an app,it's part of daily life. Why not transition that dependency into something fruitful? An exploration into using the platform's pull to nudge people toward structured, healthy routines.
              </p>
            </div>
          </motion.div>

          {/* ── 02 Visualising Money ── portrait video */}
          <motion.div
            className={`${pStyles.labRow} ${pStyles.labRowReverse}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={pStyles.labRowVideoPortrait}>
              <video
                src="/VIDEOS/rethinking-money-web.mp4"
                autoPlay muted loop playsInline preload="auto"
                className={pStyles.labVideoPortrait}
              />
            </div>
            <div className={pStyles.labRowText}>
              <span className={pStyles.labNum}>02</span>
              <h3 className={pStyles.labTitle}>Visualising money in digital transactions</h3>
              <p className={pStyles.labDesc}>
                Physically handling currency makes you think twice before spending. Digital transactions are just numbers,they strip out the emotional weight of money. This explores how to reintroduce that friction into digital payment flows.
              </p>
            </div>
          </motion.div>

          {/* ── 03 CampusLive,two stacked videos */}
          <motion.div
            className={pStyles.labRow}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={pStyles.labRowVideoStack}>
              <div className={pStyles.labStackItem}>
                <video
                  src="/VIDEOS/campus-live-web.mp4"
                  autoPlay muted loop playsInline preload="auto"
                  className={pStyles.labVideo}
                />
              </div>
              <div className={pStyles.labStackItem}>
                <video
                  src="/VIDEOS/exploration-web.mp4"
                  autoPlay muted loop playsInline preload="auto"
                  className={pStyles.labVideo}
                />
                <span className={pStyles.labVideoLabel}>SketchUp base model</span>
              </div>
            </div>
            <div className={pStyles.labRowText}>
              <span className={pStyles.labNum}>03</span>
              <h3 className={pStyles.labTitle}>CampusLive</h3>
              <p className={pStyles.labDesc}>
                During COVID-19 I asked: corridor learning accounts for 50–60% of the college experience,how do we replicate that remotely? The answer was an immersive digital campus built on a metaverse layer, letting students roam, bump into peers, and learn the way they would on a real campus.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

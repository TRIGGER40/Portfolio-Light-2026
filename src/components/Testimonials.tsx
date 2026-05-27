import { motion } from 'framer-motion';
import styles from './Testimonials.module.css';

const TESTIMONIALS = [
  {
    name: 'Abbas Dawood',
    role: 'Product & Design Head',
    company: 'Bizongo',
    quote: 'Midhun has an innate capability of going beyond product specifications and thinking like an end user. His speed, eye for user pain points, detail orientedness, lateral thinking and creativity has impressed me the most. He has the correct motivation to see through unobvious user pain points, and that makes him a champion and advocate for any user he is designing solutions for.',
    photo: '/images/testimonials/abbas.png',
    linkedin: 'https://www.linkedin.com/in/midhunkrishnakumar/',
  },
  {
    name: 'Varun Shyam',
    role: 'Associate Director, Experience Design',
    company: 'Bizongo',
    quote: 'He quickly became a star performer of the team, with appreciation flowing in from all quarters including the design team, his dev and product colleagues, and senior leadership. He showed exemplary drive, proactivity, critical thinking and an insatiable thirst to learn and grow. He will certainly be an invaluable asset to any team.',
    photo: '/images/testimonials/varun.png',
    linkedin: 'https://www.linkedin.com/in/midhunkrishnakumar/',
  },
  {
    name: 'Roshni Vaya',
    role: 'Leading Impactful Experiences',
    company: 'ZS',
    quote: 'I have worked with Midhun directly for a good amount of time and I must say he is a great thinker and critical problem solver. He is always on his toes to provide best/alternate solution for each problem. I admire his approach towards problems and deep analytical skills. I wish him very best for the future!',
    photo: '/images/testimonials/roshni.png',
    linkedin: 'https://www.linkedin.com/in/midhunkrishnakumar/',
  },
];

export function Testimonials() {
  return (
    <section className="section" id="testimonials">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 44, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Testimonials</span>
          <h2 className={`text-display ${styles.title}`}>
            What colleagues
            <br />
            <span className="gradient-text">say about working with me</span>
          </h2>
        </motion.div>

        <div className={styles.grid}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className={`${styles.card} glass-card`}
              initial={{ opacity: 0, y: 48, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Left — author */}
              <div className={styles.authorCol}>
                <img src={t.photo} alt={t.name} className={styles.avatar} loading="lazy" />
                <div className={styles.authorInfo}>
                  <span className={styles.name}>{t.name}</span>
                  <span className={styles.role}>{t.role}</span>
                  <span className={styles.company}>{t.company}</span>
                </div>
                <a
                  href={t.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedinBtn}
                  aria-label={`View ${t.name} on LinkedIn`}
                >
                  <i className="bi bi-linkedin" aria-hidden="true" />
                </a>
              </div>

              {/* Divider */}
              <div className={styles.divider} aria-hidden />

              {/* Right — quote */}
              <div className={styles.quoteCol}>
                <span className={styles.quoteIcon} aria-hidden>❝</span>
                <p className={styles.quote}>{t.quote}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

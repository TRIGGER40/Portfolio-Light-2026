import { motion } from 'framer-motion';
import pStyles from '../pages/AboutPage.module.css';

const PERSONAL = [
  {
    img: '/personal/vibe-coding.png',
    imgPosition: 'center center',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
        <line x1="12" y1="3" x2="12" y2="21" strokeOpacity="0.4"/>
      </svg>
    ),
    label: 'Vibe Coding',
    text: 'I spend a lot of time turning ideas into quick, tangible experiences. It helps me think through interactions faster, collaborate better with engineers, and push ideas beyond static screens. Some explorations turn into real features. Some become UX experiments that stay with me, evolve, and come back sharper.',
  },
  {
    img: '/personal/community.jpg',
    imgPosition: 'center center',
    gradient: 'linear-gradient(135deg, #0d1b2a 0%, #1b2838 40%, #2d4a6e 100%)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="6" r="3"/>
        <circle cx="17" cy="9" r="2.5"/>
        <path d="M2 19c0-3.3 3.1-6 7-6s7 2.7 7 6"/>
        <path d="M17 15c2.2.4 4 2 4 4"/>
      </svg>
    ),
    label: 'Community',
    text: "Naturally drawn to community, whether that's contributing to design conversations, sharing what I learn, or building things that enable others to do their best work. I believe good products don't just solve problems, they create ecosystems.",
  },
  {
    img: '/personal/balance.jpg',
    imgPosition: 'center top',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #122040 40%, #1e3a5f 100%)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
      </svg>
    ),
    label: 'Balance',
    text: 'Outside of work, I value great company and balance. I like working hard on things I care about, and switching off just as intentionally. That rhythm keeps me curious, grounded, and consistently improving.',
  },
  {
    img: '/personal/sundays.png',
    imgPosition: 'center center',
    gradient: 'linear-gradient(135deg, #12102a 0%, #1c1a3e 40%, #2e2b5a 100%)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
        <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
    label: 'Sundays',
    text: 'Sundays are reserved for side projects, small builds, experiments, and ideas that start with curiosity and no pressure. It is where I explore freely, break things, and sometimes discover directions that influence my core work.',
  },
];

export function PersonalSection() {
  return (
    <section className={pStyles.personalSection}>
      <div className="container">
        <div className={pStyles.personalHeader}>
          <span className="section-label">The person behind the work</span>
          <h2 className={`text-display ${pStyles.personalTitle}`}>
            A bit more<br />
            <span className="gradient-text">about me</span>
          </h2>
        </div>

        <div className={pStyles.personalGrid}>
        {PERSONAL.map((item, i) => (
          <motion.div
            key={i}
            className={pStyles.personalCard}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className={pStyles.personalCardImg}
              style={{ background: item.gradient }}
            >
              <img
                src={item.img}
                alt={item.label}
                className={pStyles.personalCardImgEl}
                style={{ objectPosition: item.imgPosition }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <div className={pStyles.personalCardImgIcon}>
                {item.icon}
              </div>
            </div>
            <div className={pStyles.personalCardBody}>
              <h4 className={pStyles.personalCardLabel}>{item.label}</h4>
              <p className={pStyles.personalCardText}>{item.text}</p>
            </div>
          </motion.div>
        ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import pStyles from '../pages/AboutPage.module.css';
import { HobbiesCarousel } from './HobbiesCarousel';

const PERSONAL = [
  {
    img: '/personal/vibe-coding.png',
    imgPosition: 'center center',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
    icon: <i className="bi bi-code-slash" style={{ fontSize: '22px' }} aria-hidden="true" />,
    label: 'Vibe coding',
    text: 'I spend a lot of time turning ideas into quick, tangible experiences. It helps me think through interactions faster, collaborate better with engineers, and push ideas beyond static screens. Some explorations turn into real features. Some become UX experiments that stay with me, evolve, and come back sharper.',
  },
  {
    img: '/personal/community.jpg',
    imgPosition: 'center center',
    gradient: 'linear-gradient(135deg, #0d1b2a 0%, #1b2838 40%, #2d4a6e 100%)',
    icon: <i className="bi bi-megaphone" style={{ fontSize: '22px' }} aria-hidden="true" />,
    label: 'Thought leadership',
    text: "I enjoy sharing perspectives on design, AI, and product thinking beyond just the work I ship. Whether writing, speaking, or contributing to conversations in the community, I believe articulating your thinking is as important as doing the work itself.",
  },
  {
    img: '/personal/balance.jpg',
    imgPosition: 'center top',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #122040 40%, #1e3a5f 100%)',
    icon: <i className="bi bi-heart" style={{ fontSize: '22px' }} aria-hidden="true" />,
    label: 'Giving back',
    text: 'I actively mentor aspiring designers, contribute to open design discussions, and build tools that help others grow. Giving back keeps me grounded and reminds me how far thoughtful guidance can go early in someone\'s career.',
  },
  {
    img: '/More about me/weekend.jpg',
    imgPosition: 'center center',
    gradient: 'linear-gradient(135deg, #12102a 0%, #1c1a3e 40%, #2e2b5a 100%)',
    icon: <i className="bi bi-calendar" style={{ fontSize: '22px' }} aria-hidden="true" />,
    label: 'Weekends',
    text: 'Weekends are reserved for side projects, small builds, experiments, and ideas that start with curiosity and no pressure. It is where I explore freely, break things, and sometimes discover directions that influence my core work.',
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

        {/* ── Hobbies carousel ── */}
        <HobbiesCarousel />
      </div>
    </section>
  );
}

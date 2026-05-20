import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import pStyles from '../pages/AboutPage.module.css';

const PERSONAL = [
  {
    img: '/personal/vibe-coding.png',
    imgPosition: 'center center',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
    icon: <i className="bi bi-code-slash" style={{ fontSize: '22px' }} aria-hidden="true" />,
    label: 'Vibe Coding',
    text: 'I spend a lot of time turning ideas into quick, tangible experiences. It helps me think through interactions faster, collaborate better with engineers, and push ideas beyond static screens. Some explorations turn into real features. Some become UX experiments that stay with me, evolve, and come back sharper.',
  },
  {
    img: '/personal/community.jpg',
    imgPosition: 'center center',
    gradient: 'linear-gradient(135deg, #0d1b2a 0%, #1b2838 40%, #2d4a6e 100%)',
    icon: <i className="bi bi-people" style={{ fontSize: '22px' }} aria-hidden="true" />,
    label: 'Community',
    text: "Naturally drawn to community, whether that's contributing to design conversations, sharing what I learn, or building things that enable others to do their best work. I believe good products don't just solve problems, they create ecosystems.",
  },
  {
    img: '/personal/balance.jpg',
    imgPosition: 'center top',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #122040 40%, #1e3a5f 100%)',
    icon: <i className="bi bi-sun" style={{ fontSize: '22px' }} aria-hidden="true" />,
    label: 'Balance',
    text: 'Outside of work, I value great company and balance. I like working hard on things I care about, and switching off just as intentionally. That rhythm keeps me curious, grounded, and consistently improving.',
  },
  {
    img: '/personal/sundays.png',
    imgPosition: 'center center',
    gradient: 'linear-gradient(135deg, #12102a 0%, #1c1a3e 40%, #2e2b5a 100%)',
    icon: <i className="bi bi-calendar" style={{ fontSize: '22px' }} aria-hidden="true" />,
    label: 'Sundays',
    text: 'Sundays are reserved for side projects, small builds, experiments, and ideas that start with curiosity and no pressure. It is where I explore freely, break things, and sometimes discover directions that influence my core work.',
  },
];

const HOBBIES = [
  { name: '3D Modelling',      img: '/hobbies/3d-modelling.png' },
  { name: 'Blogging',          img: '/hobbies/blogging.png' },
  { name: 'Community',         img: '/hobbies/community.png' },
  { name: 'Formula 1',         img: '/hobbies/f1.png' },
  { name: 'Football',          img: '/hobbies/football.png' },
  { name: 'Hockey',            img: '/hobbies/hockey.png' },
  { name: 'Interior Design',   img: '/hobbies/interior-design.png' },
  { name: 'Long Drives',       img: '/hobbies/long-drives.png' },
  { name: 'Singing',           img: '/hobbies/singing.png' },
  { name: 'Travelling',        img: '/hobbies/travelling.png' },
  { name: 'Vibe Coding',       img: '/hobbies/vibe-coding.png' },
];

const HOBBY_SPEED = 45; // px per second

export function PersonalSection() {
  const viewportRef  = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const pausedRef    = useRef(false);
  const prevTimeRef  = useRef(0);

  /* ── Auto-scroll ── */
  useEffect(() => {
    const tick = (t: number) => {
      const el = viewportRef.current;
      if (el && !pausedRef.current) {
        if (prevTimeRef.current) {
          el.scrollLeft += HOBBY_SPEED * (t - prevTimeRef.current) / 1000;
          const oneSet = el.scrollWidth / 2;
          if (el.scrollLeft >= oneSet) el.scrollLeft -= oneSet;
        }
      }
      prevTimeRef.current = t;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── Wheel: convert vertical → horizontal ── */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const oneSet = el.scrollWidth / 2;
      if (el.scrollLeft >= oneSet) el.scrollLeft -= oneSet;
      else if (el.scrollLeft < 0) el.scrollLeft += oneSet;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const pause  = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; prevTimeRef.current = 0; };

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
        <div className={pStyles.hobbiesWrap}>
          <span className="section-label">Beyond work</span>

          <div
            ref={viewportRef}
            className={pStyles.hobbiesViewport}
            onMouseEnter={pause}
            onMouseLeave={resume}
          >
            <div className={pStyles.hobbiesTrack}>
              {[...HOBBIES, ...HOBBIES].map((h, i) => (
                <div key={i} className={pStyles.hobbyCard}>
                  <img src={h.img} alt={h.name} className={pStyles.hobbyImg} draggable={false} />
                  <span className={pStyles.hobbyTooltip}>{h.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

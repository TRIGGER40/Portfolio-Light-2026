import { useEffect, useRef, useState } from 'react';
import { useScrollRestoration } from '../hooks/useScrollRestoration';
import { useLocation } from 'react-router-dom';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { Footer } from '../components/Footer';
import { SideExperiments } from '../components/SideExperiments';
import { PersonalSection } from '../components/PersonalSection';
import { CommunityCard } from '../components/CommunityCard';
import { FigmaAICard } from '../components/FigmaAICard';
import { SeeWorksCard } from '../components/SeeWorksCard';
import { MarkBoard } from '../components/MarkBoard';
import { useEasterEgg } from '../context/EasterEggContext';
import styles from './AboutPage.module.css';

/* ── Audio player UI (rendered inside overlay) ────────── */
function AudioPlayerUI({
  audioRef, muted, setMuted, progress,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  muted: boolean;
  setMuted: (fn: (m: boolean) => boolean) => void;
  progress: number;
}) {
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - rect.left) / rect.width) * el.duration;
  };
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const current = audioRef.current?.currentTime ?? 0;

  return (
    <div className={styles.audioPlayerWrap}>
      <div className={styles.audioPlayer}>
        <button
          className={styles.audioMuteBtn}
          onClick={() => setMuted(m => !m)}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          <i className={`bi ${muted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`} />
        </button>
        <div className={styles.audioTrack} onClick={handleSeek}>
          <div className={styles.audioFill} style={{ width: `${progress * 100}%` }} />
        </div>
        <span className={styles.audioTime}>{fmt(current)}</span>
      </div>
      <p className={styles.audioSubtext}>Audio recorded from the view point</p>
    </div>
  );
}

/* ── Mountain SVG icon ────────────────────────────────── */
function MountainIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 122.88 78.87" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ fillRule: 'evenodd' }}>
      <path d="M90.4,28.29l.08.24.22.62.08.24L91,30l.08.24.19.56.08.23.18.53.08.23.17.5.08.23L92,33l.07.23.15.44.08.23.14.4.08.23.13.38.08.22.12.35.07.22L93,36l.07.21.11.31.07.21.1.29.07.2.09.26.07.2.09.25.07.19.08.23.06.18.07.21.06.18.07.2.06.17.07.18,0,.17.06.16.06.16,0,.15,0,.16,0,.14.05.15,0,.12,0,.15,0,.11,0,.14,0,.1,0,.13,0,.1,0,.12,0,.09,0,.12,0,.08,0,.11,0,.07,0,.1,0,.07,0,.1,0,.06,0,.09v.06l0,.09,0,0,0,.08v0l0,.09,0,.11v.25h0l0,.18v.5h0V44h0v.08h0v.29h0v.35h0v.13h0v.13h0v.15h0v.16h0v.17h0v.18h0V46h0v.22h0v.24c.07,5,6.36,11,5.2,14.44s4.68,9.9,6.56,14.71H98.63a3.31,3.31,0,0,0-.6-1.91L79.93,44.76l3-4.85,3.65-3.66,3.69-8.1h0l.08.14ZM92.19,27l30.28,48.39a2.17,2.17,0,0,1,.41,1.28,2.21,2.21,0,0,1-2.21,2.21H3.28A3.28,3.28,0,0,1,.53,73.79L47.26,1.66A3.16,3.16,0,0,1,48.37.5,3.29,3.29,0,0,1,52.9,1.55L78.46,42.41l10-15.35a2.07,2.07,0,0,1,.75-.78,2.2,2.2,0,0,1,3,.71ZM52.44,75.58H3.9L14.33,61.79l16-28L39.47,23.2l4.65-10.28,6-9.64h0l.12.2c.88,2.66,1.26,4.11,2,6.25.44,1.23,2.3,3.91,2.67,4.93,5.31,14.76,2.62,9.34,2.69,15.88.08,7.51,9.47,16.45,7.74,21.53-1.93,5.62,8.38,16.22,10.31,23.51Z"/>
    </svg>
  );
}

/* ── Page ─────────────────────────────────────────────── */
export function AboutPage() {
  const location = useLocation();
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgExpanded, setBgExpanded] = useState(false);
  const [bgCollapsing, setBgCollapsing] = useState(false);
  const { discover, isDiscovered } = useEasterEgg();

  // Audio
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted]       = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (bgExpanded) {
      el.currentTime = 0;
      el.volume = 0;
      el.play().catch(() => {});
      let v = 0;
      const id = setInterval(() => {
        v = Math.min(v + 0.05, muted ? 0 : 0.7);
        el.volume = v;
        if (v >= 0.7) clearInterval(id);
      }, 60);
    } else {
      let v = el.volume;
      const id = setInterval(() => {
        v = Math.max(v - 0.07, 0);
        el.volume = v;
        if (v <= 0) { clearInterval(id); el.pause(); }
      }, 40);
    }
  }, [bgExpanded]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : 0.7;
  }, [muted]);

  /* Egg #2 — auto-triggers 2s after entering the photograph view */
  useEffect(() => {
    if (!bgExpanded || isDiscovered('through-my-lens')) return;
    const timer = setTimeout(() => discover('through-my-lens'), 2000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgExpanded]);

  const handleBackToContent = () => {
    setBgCollapsing(true);
    setBgExpanded(false);
    setTimeout(() => setBgCollapsing(false), 520);
  };

  // Always start at the top — clear any saved scroll for this path
  useEffect(() => {
    try {
      const positions = JSON.parse(sessionStorage.getItem('scroll_positions') || '{}');
      delete positions[location.pathname + location.search];
      sessionStorage.setItem('scroll_positions', JSON.stringify(positions));
    } catch { /* ignore */ }
    window.scrollTo({ top: 0, behavior: 'instant' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useScrollRestoration();

  // Lock / unlock scroll — compensate for scrollbar width to prevent layout shift
  useEffect(() => {
    if (bgExpanded) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [bgExpanded]);

  return (
    <>
      {!bgExpanded && <BackgroundGlow />}
      <main style={{ paddingTop: '80px' }} className={`${styles.pageRoot} ${bgExpanded ? styles.pageExpanded : ''}`}>

        {/* ── Full-page parallax background ── */}
        <div className={`${styles.pageBgWrap} ${bgExpanded ? styles.pageBgWrapExpanded : ''}`} aria-hidden={!bgExpanded}>
          <div className={styles.pageBgParallax}>
            <img
              src="/About me/Background.webp"
              alt="View of Kanchendzonga from Tsomgo Lake viewpoint"
              className={`${styles.pageBgImg} ${bgLoaded ? styles.pageBgImgLoaded : ''} ${bgExpanded ? styles.pageBgImgExpanded : ''} ${bgCollapsing ? styles.pageBgImgCollapsing : ''}`}
              onLoad={() => setBgLoaded(true)}
              draggable={false}
            />

          </div>
        </div>

        {/* ── Audio element — always mounted so fade-out completes ── */}
        <audio
          ref={audioRef}
          src="/About me/Kanchendzonga Tsomgo lake audio.mp3"
          loop
          onTimeUpdate={() => {
            const el = audioRef.current;
            if (el?.duration) setProgress(el.currentTime / el.duration);
          }}
          style={{ display: 'none' }}
        />

        {/* ── Full-view overlay ── */}
        {(bgExpanded || bgCollapsing) && (
          <div className={`${styles.bgViewOverlay} ${bgCollapsing ? styles.bgViewOverlayOut : ''}`}>

            {/* Spacer */}
            <div />

            {/* Bottom section */}
            <div className={styles.bgViewBottom}>
              {/* Left — back button + location + credit */}
              <div className={styles.bgViewLeft}>
                <button className={styles.bgViewBack} onClick={handleBackToContent}>
                  <i className="bi bi-arrow-left" aria-hidden="true" />
                  Back to content
                </button>
                <p className={styles.bgViewLocation}>Kanchendzonga</p>
                <div className={styles.bgViewCredit}>
                  <img src="/About me midhun.webp" alt="Midhun Krishnakumar" className={styles.bgViewAvatar} draggable={false} />
                  <div className={styles.bgViewCreditText}>
                    <p className={styles.bgViewName}>Midhun Krishnakumar</p>
                    <p className={styles.bgViewCaption}>Clicked from Tsomgo Lake view point, Sikkim, India</p>
                  </div>
                </div>
              </div>

              {/* Right — audio */}
              <AudioPlayerUI audioRef={audioRef} muted={muted} setMuted={setMuted} progress={progress} />
            </div>

          </div>
        )}

        {/* ── Intro hero ── */}
        <section className={`${styles.intro} ${bgExpanded ? styles.introHidden : ''}`}>
          <div className={`container ${styles.introInner}`}>

            <div className={styles.introText}>
              <h1 className={styles.introHeading}>
                Hey there! I'm
                <br />
                <span className={styles.introNameBreath}>Midhun<br />Krishnakumar.</span>
              </h1>
              <p className={styles.introPara}>
                I'm deeply curious about how people think, behave, and adapt to the systems around
                them. That curiosity has shaped almost everything I do, from the way I observe
                everyday experiences to the way I approach creativity, technology, and problem solving.
              </p>
              <p className={styles.introPara}>
                Outside of work, I'm drawn to earthy spaces, mountain landscapes, thoughtful
                interiors, photography, long walks, and anything that blends aesthetics with
                intention. I enjoy building things slowly, refining details obsessively, and
                exploring ideas far beyond the boundaries of design.
              </p>
              <p className={styles.introPara}>
                I believe the best experiences come from empathy, clarity, and an openness to
                constantly evolve.
              </p>
            </div>

            {/* ── Polaroid scatter ── */}
            <div className={styles.introPolaroidCluster}>

              {/* Row 1: left · main · right */}
              <div className={styles.introPolaroidRow}>

                {/* about-photo — flies out from behind main, left */}
                <div className={styles.introPolaroidWrap}
                  style={{ '--from-x': '120px', '--from-y': '0px', '--from-rot': '-40deg', '--delay': '0.25s' } as React.CSSProperties}>
                  <div className={styles.introPolaroid} style={{ '--rot': '-7deg' } as React.CSSProperties}>
                    <div className={styles.introPolaroidInner}>
                      <img src="/About me/about-photo.webp" alt="Midhun" className={styles.introPolaroidImg} draggable={false} />
                    </div>
                    <div className={styles.introPolaroidStrip} />
                  </div>
                </div>

                {/* main — scales up from center, always in front */}
                <div className={`${styles.introPolaroidWrap} ${styles.introPolaroidWrapMain}`}
                  style={{ '--from-x': '0px', '--from-y': '0px', '--from-rot': '0deg', '--delay': '0.05s' } as React.CSSProperties}>
                  <div className={`${styles.introPolaroid} ${styles.introPolaroidMain}`} style={{ '--rot': '1deg' } as React.CSSProperties}>
                    <div className={styles.introPolaroidInner}>
                      <img src="/About me midhun.webp" alt="Midhun Krishnakumar" className={styles.introPolaroidImg} draggable={false} />
                    </div>
                    <div className={styles.introPolaroidStrip} />
                  </div>
                </div>

                {/* Formula 1 — flies out from behind main, right */}
                <div className={styles.introPolaroidWrap}
                  style={{ '--from-x': '-120px', '--from-y': '0px', '--from-rot': '40deg', '--delay': '0.35s' } as React.CSSProperties}>
                  <div className={styles.introPolaroid} style={{ '--rot': '6deg' } as React.CSSProperties}>
                    <div className={styles.introPolaroidInner}>
                      <img src="/About me/Formula 1.webp" alt="Midhun at Formula 1" className={styles.introPolaroidImg} draggable={false} />
                    </div>
                    <div className={styles.introPolaroidStrip} />
                  </div>
                </div>

              </div>

              {/* Row 2: two photos centered below */}
              <div className={styles.introPolaroidRow}>

                {/* kayaking — flies out from behind main, lower-left */}
                <div className={styles.introPolaroidWrap}
                  style={{ '--from-x': '90px', '--from-y': '-100px', '--from-rot': '-35deg', '--delay': '0.45s' } as React.CSSProperties}>
                  <div className={styles.introPolaroid} style={{ '--rot': '-4deg' } as React.CSSProperties}>
                    <div className={styles.introPolaroidInner}>
                      <img src="/About me/kayaking.webp" alt="Midhun kayaking" className={styles.introPolaroidImg} draggable={false} />
                    </div>
                    <div className={styles.introPolaroidStrip} />
                  </div>
                </div>

                {/* IMG_2127 — flies out from behind main, lower-right */}
                <div className={styles.introPolaroidWrap}
                  style={{ '--from-x': '-90px', '--from-y': '-100px', '--from-rot': '35deg', '--delay': '0.55s' } as React.CSSProperties}>
                  <div className={styles.introPolaroid} style={{ '--rot': '5deg' } as React.CSSProperties}>
                    <div className={styles.introPolaroidInner}>
                      <img src="/About me/IMG_2127.webp" alt="Midhun" className={styles.introPolaroidImg} draggable={false} />
                    </div>
                    <div className={styles.introPolaroidStrip} />
                  </div>
                </div>

              </div>

            </div>

            {/* View background button — below polaroids, fades in after image loads */}
            {bgLoaded && (
              <div className={styles.viewBgBtnWrap}>
                <button
                  className={styles.viewBgBtn}
                  onClick={() => setBgExpanded(true)}
                  aria-label="View background image"
                >
                  <MountainIcon />
                  View background
                </button>
              </div>
            )}

          </div>
        </section>

        {/* ── Education ── */}
        <section className={styles.eduSection}>
          <div className="container">
            <span className="section-label">My Alma Maters</span>
            <h2 className={`text-display ${styles.eduTitle}`}>
              Where it all<br />
              <span className="gradient-text">began</span>
            </h2>

            <div className={styles.eduGrid}>

              {/* NID */}
              <div className={styles.eduCard}>
                <div className={styles.eduImageWrap}>
                  <img
                    src="/Education/College.webp"
                    alt="National Institute of Design, Andhra Pradesh"
                    className={styles.eduBanner}
                    draggable={false}
                  />
                  <img
                    src="/Education/College logo.webp"
                    alt="NID logo"
                    className={styles.eduLogo}
                    draggable={false}
                  />
                  <span className={styles.eduYear}>2015 – 2019</span>
                </div>
                <div className={styles.eduBody}>
                  <p className={styles.eduDegree}>Bachelor of Design, Industrial Design</p>
                  <h3 className={styles.eduInstitution}>National Institute of Design</h3>
                  <p className={styles.eduLocation}>
                    <i className="bi bi-geo-alt" aria-hidden="true" /> Andhra Pradesh, India
                  </p>
                  <p className={styles.eduDesc}>
                    Shifted to UI/UX from the second year and self-specialized in the discipline.
                    Shaped by design fundamentals across Communication, Textile, Industrial Design,
                    and ultimately UI/UX. The multidisciplinary foundation is what drives
                    how I approach every product problem today.
                  </p>
                </div>
              </div>

              {/* Sainik School */}
              <div className={styles.eduCard}>
                <div className={styles.eduImageWrap}>
                  <img
                    src="/Education/School.webp"
                    alt="Sainik School Kazhakootam"
                    className={styles.eduBanner}
                    draggable={false}
                  />
                  <img
                    src="/Education/school logo.webp"
                    alt="Sainik School logo"
                    className={styles.eduLogo}
                    draggable={false}
                  />
                  <span className={styles.eduYear}>2007 – 2014</span>
                </div>
                <div className={styles.eduBody}>
                  <p className={styles.eduDegree}>PCM + Computer Science</p>
                  <h3 className={styles.eduInstitution}>Sainik School Kazhakootam</h3>
                  <p className={styles.eduLocation}>
                    <i className="bi bi-geo-alt" aria-hidden="true" /> Trivandrum, India
                  </p>
                  <p className={styles.eduDesc}>
                    Seven years that built the foundation. Discipline, work ethic, and a deep
                    respect for collaboration and teamwork were the real curriculum. The structure
                    of a Sainik School education gave me the mental model I rely on every day.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {!bgExpanded && <PersonalSection />}
        {!bgExpanded && <CommunityCard />}
        {!bgExpanded && <FigmaAICard />}
        {!bgExpanded && <SideExperiments />}
        {!bgExpanded && <SeeWorksCard />}
        {!bgExpanded && <MarkBoard />}
        {!bgExpanded && <Footer />}
      </main>
    </>
  );
}

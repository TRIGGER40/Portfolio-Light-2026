import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { SUGGESTED_PROMPTS } from '../data/aiContext';
import styles from './Nav.module.css';
import { ANALYTICS_SECRET, triggerAnalyticsDashboard, track } from '../lib/analytics';

const loadResumePdf = () => import('../lib/resumePdf');

export function Nav({ hidden = false }: { hidden?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToWork = () => {
    if (location.pathname === '/') {
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/', { state: { scrollTo: 'work' } });
    }
  };
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery]       = useState('');
  const [focused, setFocused]   = useState(false);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const submit = (text: string) => {
    if (!text.trim()) return;
    setQuery('');
    setFocused(false);
    inputRef.current?.blur();
    // Secret analytics key
    if (text.trim() === ANALYTICS_SECRET) {
      triggerAnalyticsDashboard();
      return;
    }
    navigate(`/ask?q=${encodeURIComponent(text.trim())}`);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter')  submit(query);
    if (e.key === 'Escape') { setFocused(false); inputRef.current?.blur(); }
  };

  const showDropdown = focused;

  // Reset expanded state when dropdown closes
  useEffect(() => {
    if (!focused) setExpanded(false);
  }, [focused]);

  const ALL_PROMPTS = SUGGESTED_PROMPTS as unknown as string[];

  /* While typing: show filtered matches. Otherwise: show top 3 or all if expanded. */
  const filtered = query
    ? ALL_PROMPTS.filter(p => p.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : expanded ? ALL_PROMPTS : ALL_PROMPTS.slice(0, 3);

  const hasMore = !query && !expanded && ALL_PROMPTS.length > 3;

  return (
    <>
      <AnimatePresence>
        {focused && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setFocused(false)}
          />
        )}
      </AnimatePresence>

      <motion.header
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden ? -80 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] }}
      >
        <div className={styles.navInner}>
          {/* ── Pill ── */}
          <div className={`${styles.pill} ${focused ? styles.pillFocused : ''}`}>

            {/* Logo */}
            <a
              href="#"
              className={styles.logo}
              onClick={e => { e.preventDefault(); navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <img src="/Logo.webp" alt="MK" className={styles.logoImg} />
            </a>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Search */}
            <div className={styles.searchWrap} onClick={() => inputRef.current?.focus()}>
              <span className={styles.sparkle} aria-hidden="true">✦</span>

              <input
                ref={inputRef}
                className={styles.input}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onKeyDown={handleKey}
                placeholder="Ask AI about Midhun's work…"
                autoComplete="off"
                spellCheck={false}
                aria-label="Ask AI about Midhun"
              />
            </div>

            {/* Work */}
            <button
              className={styles.aboutBtn}
              onClick={scrollToWork}
            >
              Work
            </button>

            {/* About */}
            <button
              className={styles.aboutBtn}
              onClick={() => navigate('/about')}
            >
              About
            </button>

            {/* Resume */}
            <button
              className={styles.resumeBtn}
              onClick={() => { track('resume_click', { source: 'nav' }); loadResumePdf().then(({ downloadResumePdf }) => downloadResumePdf()); }}
            >
              <i className="bi bi-download" style={{ fontSize: '13px' }} aria-hidden="true" />
              <span className={styles.resumeText}>Resume</span>
            </button>
          </div>

          {/* ── Suggestions dropdown ── */}
          <AnimatePresence>
            {showDropdown && filtered.length > 0 && (
              <motion.div
                className={styles.dropdown}
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
              >
                <p className={styles.dropLabel}>
                  {query ? 'Suggestions' : 'Try asking'}
                </p>
                <div className={styles.chips}>
                  {filtered.map(prompt => (
                    <button
                      key={prompt}
                      className={styles.chip}
                      onMouseDown={e => { e.preventDefault(); submit(prompt); }}
                    >
                      <span className={styles.chipIcon}>✦</span>
                      {prompt}
                    </button>
                  ))}
                  {hasMore && (
                    <button
                      className={styles.viewMoreBtn}
                      onMouseDown={e => { e.preventDefault(); setExpanded(true); }}
                    >
                      <i className="bi bi-chevron-down" style={{ fontSize: '10px' }} aria-hidden="true" />
                      View more
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}

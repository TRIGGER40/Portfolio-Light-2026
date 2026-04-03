import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SUGGESTED_PROMPTS } from '../data/aiContext';
import styles from './Nav.module.css';

export function Nav({ hidden = false }: { hidden?: boolean }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery]       = useState('');
  const [focused, setFocused]   = useState(false);
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
    navigate(`/ask?q=${encodeURIComponent(text.trim())}`);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter')  submit(query);
    if (e.key === 'Escape') { setFocused(false); inputRef.current?.blur(); }
  };

  const showDropdown = focused;

  /* While typing filter prompts; otherwise show all */
  const filtered = query
    ? SUGGESTED_PROMPTS.filter(p => p.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : SUGGESTED_PROMPTS;

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
              <img src="/Logo.png" alt="MK" className={styles.logoImg} />
            </a>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Search */}
            <div className={styles.searchWrap} onClick={() => inputRef.current?.focus()}>
              <span className={styles.searchIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </span>

              <input
                ref={inputRef}
                className={styles.input}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onKeyDown={handleKey}
                placeholder="Ask anything about Midhun…"
                autoComplete="off"
                spellCheck={false}
                aria-label="Ask AI about Midhun"
              />

              <span className={styles.sparkle}>✦</span>
            </div>

            {/* About */}
            <button
              className={styles.aboutBtn}
              onClick={() => navigate('/about')}
            >
              About
            </button>

            {/* Resume */}
            <a
              href="/Midhun_Krishnakumar_Resume.pdf"
              download
              className={styles.resumeBtn}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span className={styles.resumeText}>Resume</span>
            </a>
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}

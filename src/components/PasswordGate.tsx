import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PasswordGate.module.css';

const HASH = '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b';
const SESSION_KEY = 'mkp_g_';

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

interface Props {
  id: string;
  loader: () => Promise<{ default: React.ComponentType }>;
}

export function PasswordGate({ id, loader }: Props) {
  const navigate = useNavigate();
  const [unlocked, setUnlocked]   = useState(false);
  const [Comp, setComp]           = useState<React.ComponentType | null>(null);
  const [value, setValue]         = useState('');
  const [shake, setShake]         = useState(false);
  const [error, setError]         = useState(false);
  const [checking, setChecking]   = useState(false);
  const [unlocking, setUnlocking] = useState(false); // success state before reveal
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY + id) === HASH.slice(0, 16)) {
      const LazyComp = lazy(loader);
      setComp(() => LazyComp);
      setUnlocked(true);
    }
  }, [id]);

  useEffect(() => {
    if (!unlocked) setTimeout(() => inputRef.current?.focus(), 400);
  }, [unlocked]);

  const attempt = async () => {
    if (!value.trim() || checking) return;
    setChecking(true);
    const hash = await sha256(value.trim());
    if (hash === HASH) {
      sessionStorage.setItem(SESSION_KEY + id, HASH.slice(0, 16));
      // Start success sequence
      const LazyComp = lazy(loader);
      setComp(() => LazyComp);
      setUnlocking(true);
      // Let toast show + gate fade out, then reveal
      setTimeout(() => setUnlocked(true), 1400);
    } else {
      setError(true);
      setShake(true);
      setValue('');
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2500);
    }
    setChecking(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') attempt();
  };

  if (unlocked && Comp) {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />}>
        <div className={styles.revealWrap}>
          <Comp />
        </div>
      </Suspense>
    );
  }

  return (
    <div className={`${styles.gate} ${unlocking ? styles.gateExit : ''}`}>

      {/* ── Success toast ── */}
      {unlocking && (
        <div className={styles.toast}>
          <span className={styles.toastIcon}>
            <i className="bi bi-check-circle-fill" />
          </span>
          Authenticated successfully
        </div>
      )}

      <button className={styles.backLink} onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left" /> Back
      </button>

      <div className={`${styles.cardOuter} ${shake ? styles.shake : ''} ${unlocking ? styles.cardUnlocking : ''}`}>
        <div className={styles.card}>

          {/* Hero image */}
          <div className={styles.imgWrap}>
            <img
              src="/ALMVC/ALMVC hero image.png"
              alt=""
              className={styles.heroImg}
              draggable={false}
            />
            <div className={styles.imgTags}>
              <span className={styles.tag}>0 to 1 Product</span>
              <span className={styles.tag}>Adobe Learning Manager</span>
            </div>
          </div>

          {/* Card body */}
          <div className={styles.body}>
            <div className={`${styles.lockBadge} ${unlocking ? styles.lockUnlocked : ''}`}>
              <i className={`bi ${unlocking ? 'bi-unlock-fill' : 'bi-lock-fill'}`} />
            </div>

            <p className={styles.eyebrow}>Case Study</p>
            <h1 className={styles.title}>Virtual classrooms reimagined.</h1>
            <p className={styles.teaser}>
              This project is releasing soon. Currently under wraps.
            </p>

            <div className={styles.inputWrap}>
              <div className={`${styles.inputPill} ${error ? styles.inputPillError : ''} ${unlocking ? styles.inputPillSuccess : ''}`}>
                <i className={`bi bi-key ${styles.keyIcon}`} />
                <input
                  ref={inputRef}
                  type="password"
                  className={styles.input}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  disabled={unlocking}
                />
                <button
                  className={`${styles.submitBtn} ${unlocking ? styles.submitSuccess : (value.trim() && !checking ? styles.submitActive : '')}`}
                  onClick={attempt}
                  disabled={unlocking || checking || !value.trim()}
                  aria-label="Submit password"
                >
                  {unlocking
                    ? <i className="bi bi-check" />
                    : checking
                      ? <span className={styles.spinner} />
                      : <i className="bi bi-arrow-right" />}
                </button>
              </div>

              {error && (
                <p className={styles.errorMsg}>
                  <i className="bi bi-x-circle-fill" /> Incorrect password
                </p>
              )}
            </div>

            <button className={styles.viewOthers} onClick={() => navigate(-1)}>
              View other projects <i className="bi bi-arrow-right" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PasswordGate.module.css';

// SHA-256 of the password — not reversible from source
const HASH = '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b';
const SESSION_KEY = 'mkp_g_';

async function sha256(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

interface Props {
  id: string;
  // Pass a dynamic import so the component chunk is never fetched until unlocked
  loader: () => Promise<{ default: React.ComponentType }>;
}

export function PasswordGate({ id, loader }: Props) {
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(false);
  const [Comp, setComp] = useState<React.ComponentType | null>(null);
  const [value, setValue] = useState('');
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY + id) === HASH.slice(0, 16)) {
      // Was unlocked this session — load the component
      const LazyComp = lazy(loader);
      setComp(() => LazyComp);
      setUnlocked(true);
    }
  }, [id]);

  useEffect(() => {
    if (!unlocked) setTimeout(() => inputRef.current?.focus(), 300);
  }, [unlocked]);

  const attempt = async () => {
    if (!value.trim() || checking) return;
    setChecking(true);
    const hash = await sha256(value.trim());
    if (hash === HASH) {
      sessionStorage.setItem(SESSION_KEY + id, HASH.slice(0, 16));
      const LazyComp = lazy(loader);
      setComp(() => LazyComp);
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setValue('');
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
    }
    setChecking(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') attempt();
  };

  if (unlocked && Comp) {
    return (
      <Suspense fallback={<div style={{ background: '#07070f', minHeight: '100vh' }} />}>
        <Comp />
      </Suspense>
    );
  }

  return (
    <div className={styles.gate}>
      <div className={styles.bg} aria-hidden />

      <button className={styles.back} onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left" /> Back
      </button>

      <div className={styles.card}>
        <div className={styles.lockWrap}>
          <i className="bi bi-lock-fill" />
        </div>

        <p className={styles.label}>Case Study</p>
        <h1 className={styles.title}>Virtual classrooms reimagined.</h1>
        <p className={styles.teaser}>This project is releasing soon — currently under wraps.</p>

        <div className={`${styles.inputRow} ${shake ? styles.shake : ''}`}>
          <input
            ref={inputRef}
            type="password"
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Enter password to view"
            autoComplete="new-password"
          />
          <button
            className={`${styles.btn} ${value.trim() ? styles.btnActive : ''}`}
            onClick={attempt}
            disabled={!value.trim() || checking}
          >
            {checking
              ? <span className={styles.spinner} />
              : <i className="bi bi-arrow-right" />}
          </button>
        </div>

        {error && <p className={styles.errorMsg}>Incorrect password</p>}
      </div>
    </div>
  );
}

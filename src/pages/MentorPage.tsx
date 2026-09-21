import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { GoBackButton } from '../components/GoBackButton';
import { track } from '../lib/analytics';
import styles from './MentorPage.module.css';

/* ── Session definition ───────────────────────────────── */
const SESSION_PRICE = 1000;
const SESSION_TITLE  = 'Portfolio review session';

const SLOTS = [
  { value: '18:00' as const, label: '6:00 PM – 7:00 PM' },
  { value: '19:30' as const, label: '7:30 PM – 8:30 PM' },
];

type SlotValue = typeof SLOTS[number]['value'];

interface DateAvailability {
  available: number;
  slots: Record<string, boolean>;
}

/* ── Date helpers ─────────────────────────────────────── */
function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function getMonday(d: Date): Date {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 = Sun .. 6 = Sat
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(x, diff);
}

/** Monday of the current week if `d` is a Monday, otherwise the next Monday. */
function getMondayOnOrAfter(d: Date): Date {
  const x = startOfDay(d);
  const day = x.getDay(); // 0 = Sun .. 6 = Sat
  const diff = (8 - day) % 7;
  return addDays(x, diff);
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

function formatDateShort(d: Date) {
  const dow = d.toLocaleDateString('en-IN', { weekday: 'short' });
  const num = d.getDate();
  const mon = d.toLocaleDateString('en-IN', { month: 'short' });
  return { dow, num, mon };
}

function formatDateFull(d: Date): string {
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}

/** First weekday (Mon–Fri) in [from, to], or null if the range holds none. */
function getFirstWeekdayInRange(from: Date, to: Date): Date | null {
  let d = startOfDay(from);
  const end = startOfDay(to);
  while (d.getTime() <= end.getTime()) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) return d;
    d = addDays(d, 1);
  }
  return null;
}

/* ── Razorpay types ───────────────────────────────────── */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (opts: any) => { open(): void };
  }
}

/* ── Fade-in section variant ──────────────────────────── */
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

/* ── Quote panel word-by-word reveal ─────────────────────
   Same word-by-word blur-in typing effect as the "In a nutshell" insight on
   the AI chat page (see WordTyping in AIPage.tsx). Quote reveals one word at
   a time on mount, then the author, metrics, and tags fade in once it's done. */
const QUOTE_TEXT =
  "I believe the right conversation at the right time can change your trajectory. " +
  "Whether you're navigating your career or building your next startup, I'll share " +
  'practical lessons from years of designing products and working with founders.';
const QUOTE_WORDS = QUOTE_TEXT.split(' ');
const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];
const WORD_DELAY_MS  = 110;
const WORD_FADE_SECS = 0.55;
const QUOTE_REVEAL_DURATION = (QUOTE_WORDS.length * WORD_DELAY_MS) / 1000 + WORD_FADE_SECS;
const AUTHOR_DELAY  = QUOTE_REVEAL_DURATION + 0.1;
const METRICS_DELAY = AUTHOR_DELAY + 0.45;
const TAGS_DELAY    = METRICS_DELAY + 0.4;

function WordReveal({ text, wordDelay = WORD_DELAY_MS }: { text: string; wordDelay?: number }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const words = useMemo(() => text.split(' '), [text]);

  useEffect(() => {
    setVisibleCount(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= words.length) clearInterval(id);
    }, wordDelay);
    return () => clearInterval(id);
  }, [words, wordDelay]);

  return (
    <>
      {words.map((word, i) => (
        <span key={i} className={`${styles.word} ${i < visibleCount ? styles.wordVisible : ''}`}>
          {word}
        </span>
      ))}
    </>
  );
}

interface Confirmation {
  name:     string;
  email:    string;
  date:     Date;
  slot:     SlotValue;
  meetLink?: string;
}

const CONFIRMATION_STORAGE_KEY = 'mentor-booking-confirmation';

interface StoredConfirmation {
  name:     string;
  email:    string;
  date:     string; // ISO date
  slot:     SlotValue;
  meetLink?: string;
}

/** Reads a pending confirmation left by a Razorpay redirect-triggered reload, then clears it. */
function readAndClearStoredConfirmation(): Confirmation | null {
  try {
    const raw = sessionStorage.getItem(CONFIRMATION_STORAGE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(CONFIRMATION_STORAGE_KEY);
    const parsed = JSON.parse(raw) as StoredConfirmation;
    return { ...parsed, date: new Date(`${parsed.date}T00:00:00`) };
  } catch {
    return null;
  }
}

/* ── Page ─────────────────────────────────────────────── */
export function MentorPage() {
  const today              = startOfDay(new Date());
  const minSelectableDate  = addDays(today, 1);
  const maxSelectableDate  = useMemo(() => {
    const x = new Date(today);
    x.setMonth(x.getMonth() + 1);
    return x;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const currentWeekMonday  = getMonday(today);
  const firstAvailableDate = getFirstWeekdayInRange(minSelectableDate, maxSelectableDate);

  const [weekStart, setWeekStart] = useState<Date>(() => (
    firstAvailableDate ? getMonday(firstAvailableDate) : getMonday(new Date())
  ));
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => firstAvailableDate);
  const [selectedSlot, setSelectedSlot] = useState<SlotValue | null>(null);
  const [hasReachedStep2, setHasReachedStep2] = useState(false);
  const [name,   setName]   = useState('');
  const [email,  setEmail]  = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [confirming, setConfirming] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(readAndClearStoredConfirmation);
  const [availability, setAvailability] = useState<Record<string, DateAvailability> | null>(null);

  const weekDays = [0, 1, 2, 3, 4].map(i => addDays(weekStart, i)); // Mon–Fri

  const monthOptions = useMemo(() => {
    const opts: { key: string; label: string }[] = [];
    const cursor = new Date(today.getFullYear(), today.getMonth(), 1);
    const end    = new Date(maxSelectableDate.getFullYear(), maxSelectableDate.getMonth(), 1);
    while (cursor.getTime() <= end.getTime()) {
      opts.push({ key: monthKey(cursor), label: monthLabel(cursor) });
      cursor.setMonth(cursor.getMonth() + 1);
    }
    return opts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canGoPrev = weekStart.getTime() > currentWeekMonday.getTime();
  const nextWeekMonday = addDays(weekStart, 7);
  const canGoNext = nextWeekMonday.getTime() <= maxSelectableDate.getTime();

  function goPrevWeek() {
    if (!canGoPrev) return;
    const next = addDays(weekStart, -7);
    setWeekStart(next.getTime() < currentWeekMonday.getTime() ? currentWeekMonday : next);
  }

  function goNextWeek() {
    if (!canGoNext) return;
    setWeekStart(nextWeekMonday);
  }

  function handleMonthChange(key: string) {
    const isCurrentMonth = key === monthKey(today);
    if (isCurrentMonth) {
      setWeekStart(currentWeekMonday);
    } else {
      const [y, m] = key.split('-').map(Number);
      setWeekStart(getMondayOnOrAfter(new Date(y, m, 1)));
    }
  }

  /* Always land at the top of the page, regardless of scroll position on
     whichever page linked here */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  /* Dim the background grid pattern on this page only */
  useEffect(() => {
    document.body.classList.add('subtle-grid');
    return () => document.body.classList.remove('subtle-grid');
  }, []);

  /* Load Razorpay checkout script */
  useEffect(() => {
    if (document.getElementById('razorpay-script')) return;
    const s = document.createElement('script');
    s.id  = 'razorpay-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(s);
  }, []);

  /* Fetch live slot availability for the visible week */
  useEffect(() => {
    let cancelled = false;
    setAvailability(null);
    const dates = weekDays.map(toISODate);
    fetch('/api/get-availability', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ dates }),
    })
      .then(r => (r.ok ? r.json() : Promise.reject(r)))
      .then((data: { availability: Record<string, DateAvailability> }) => {
        if (!cancelled) setAvailability(data.availability);
      })
      .catch(() => {
        if (!cancelled) setAvailability(null); // graceful degrade — hide counts, keep dates selectable
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart.getTime()]);

  /* If the chosen slot turns out to be booked once real data loads, clear it */
  useEffect(() => {
    if (!selectedDate || !selectedSlot || !availability) return;
    const info = availability[toISODate(selectedDate)];
    if (info && info.slots[selectedSlot] === false) setSelectedSlot(null);
  }, [availability, selectedDate, selectedSlot]);

  const canPay = !!selectedDate && !!selectedSlot
    && name.trim().length > 0
    && email.trim().includes('@')
    && reason.trim().length > 0;

  async function handlePay() {
    if (!canPay || !selectedDate || !selectedSlot) return;
    setError('');
    setLoading(true);

    try {
      /* 1. Create Razorpay order */
      const orderRes = await fetch('/api/create-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({}),
      });
      if (!orderRes.ok) throw new Error('Could not create order. Please try again.');
      const { orderId, amount, currency, keyId } = await orderRes.json() as {
        orderId: string; amount: number; currency: string; keyId: string;
      };

      /* 2. Open Razorpay checkout */
      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key:         keyId,
          amount,
          currency,
          order_id:    orderId,
          name:        'Midhun Krishnakumar',
          description: SESSION_TITLE,
          image:       '/Logo.webp',
          prefill:     { name, email },
          theme:       { color: '#234034' },
          modal:       { ondismiss: () => reject(new Error('Payment cancelled')) },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            /* 3. Confirm booking on server — sends the calendar invite + emails
                  right away, while a minimum 5s "confirming" screen keeps the
                  transition from feeling abrupt. */
            setConfirming(true);
            try {
              const confirmPromise = fetch('/api/confirm-booking', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({
                  razorpayOrderId:   response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  name: name.trim(),
                  email: email.trim(),
                  reason: reason.trim(),
                  date: toISODate(selectedDate),
                  slot: selectedSlot,
                }),
              });
              const minDelay = new Promise<void>(res => setTimeout(res, 5000));
              const [confirmRes] = await Promise.all([confirmPromise, minDelay]);
              if (!confirmRes.ok) throw new Error('Booking confirmation failed');
              const data = await confirmRes.json() as { meetLink?: string };
              track('cta_click', { label: 'Book a mentoring session' });
              const stored: StoredConfirmation = {
                name, email, date: toISODate(selectedDate), slot: selectedSlot, meetLink: data.meetLink,
              };
              sessionStorage.setItem(CONFIRMATION_STORAGE_KEY, JSON.stringify(stored));
              resolve();
              window.location.reload();
            } catch (e) {
              setConfirming(false);
              reject(e);
            }
          },
        });
        rzp.open();
      });
    } catch (e) {
      if (e instanceof Error && e.message !== 'Payment cancelled') {
        setError(e.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BackgroundGlow />
      <Nav />
      <main className={styles.page} style={{ paddingTop: '80px' }}>
        <div className={styles.splitPage}>

          {/* ── Left: booking form ── */}
          <div className={styles.formPanel}>

              {/* Hero */}
              <section className={styles.hero}>
                <GoBackButton fallback="/about" className={styles.backBtn} />
                <h1 className={styles.heroTitle}>
                  Book a session with <span className={styles.heroTitleAccent}>Midhun</span> today
                </h1>
                <p className={styles.heroDesc}>
                  A 60-minute Google Meet for portfolio reviews, career advice, and interview prep.
                </p>
              </section>

              {/* Step 1: Date & slot */}
              <div className={styles.stepSection}>
                <p className={styles.stepHeading}>Pick a date &amp; time</p>

                <div className={styles.weekNav}>
                  <div className={styles.monthSelectWrap}>
                    <select
                      className={styles.monthSelect}
                      value={monthKey(weekStart)}
                      onChange={e => handleMonthChange(e.target.value)}
                      aria-label="Select month"
                    >
                      {monthOptions.map(m => (
                        <option key={m.key} value={m.key}>{m.label}</option>
                      ))}
                    </select>
                    <i className={`bi bi-chevron-down ${styles.monthSelectChevron}`} aria-hidden="true" />
                  </div>
                  <div className={styles.weekChevrons}>
                    <button
                      className={styles.chevronBtn}
                      onClick={goPrevWeek}
                      disabled={!canGoPrev}
                      aria-label="Previous week"
                    >
                      <i className="bi bi-chevron-left" />
                    </button>
                    <button
                      className={styles.chevronBtn}
                      onClick={goNextWeek}
                      disabled={!canGoNext}
                      aria-label="Next week"
                    >
                      <i className="bi bi-chevron-right" />
                    </button>
                  </div>
                </div>

                <div className={styles.datePills}>
                  {weekDays.map(d => {
                    const { dow, num, mon } = formatDateShort(d);
                    const iso = toISODate(d);
                    const active = selectedDate && iso === toISODate(selectedDate);
                    const isOutOfRange = d.getTime() < minSelectableDate.getTime()
                      || d.getTime() > maxSelectableDate.getTime();
                    const info = availability?.[iso];
                    const availCount = info?.available;
                    const isLoadingAvailability = !isOutOfRange && availability === null;
                    const isFullyBooked = !isOutOfRange && !isLoadingAvailability && availCount === 0;
                    const isDisabled = isOutOfRange || isFullyBooked;
                    return (
                      <button
                        key={iso}
                        className={`${styles.datePill} ${active ? styles.datePillActive : ''} ${isDisabled ? styles.datePillDisabled : ''}`}
                        onClick={() => setSelectedDate(d)}
                        disabled={isDisabled}
                      >
                        <span className={styles.datePillDay}>{dow}</span>
                        <span className={styles.datePillNum}>{num}</span>
                        <span className={styles.datePillMon}>{mon}</span>
                        {isOutOfRange && (
                          <span className={`${styles.datePillAvail} ${styles.datePillAvailFull}`}>0 slots</span>
                        )}
                        {!isOutOfRange && isLoadingAvailability && (
                          <span className={styles.datePillLoader} aria-label="Loading availability">
                            <span /><span /><span />
                          </span>
                        )}
                        {!isOutOfRange && !isLoadingAvailability && availCount !== undefined && (
                          <span className={`${styles.datePillAvail} ${availCount === 0 ? styles.datePillAvailFull : ''}`}>
                            {availCount === 0 ? '0 slots' : `${availCount} slot${availCount === 1 ? '' : 's'}`}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {selectedDate && (
                    <motion.div key="slots" {...fadeUp} style={{ marginTop: 20 }}>
                      <p className={styles.subHeading}>Pick a slot</p>
                      <div className={styles.slotPills}>
                        {SLOTS.map(sl => {
                          const info = availability?.[toISODate(selectedDate)];
                          const slotAvailable = info ? info.slots[sl.value] !== false : true;
                          return (
                            <button
                              key={sl.value}
                              className={`${styles.slotPill} ${selectedSlot === sl.value ? styles.slotPillActive : ''} ${!slotAvailable ? styles.slotPillDisabled : ''}`}
                              onClick={() => { setSelectedSlot(sl.value); setHasReachedStep2(true); }}
                              disabled={!slotAvailable}
                            >
                              {sl.label}
                              {!slotAvailable && <span className={styles.slotPillBookedTag}>Booked</span>}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 2: Details + pay */}
              <AnimatePresence>
                {selectedDate && (selectedSlot || hasReachedStep2) && (
                  <motion.div key="details" {...fadeUp} className={styles.stepSection}>
                    <p className={styles.stepHeading}>Your details &amp; payment</p>

                    {/* Summary bar */}
                    <div className={styles.summaryBar}>
                      <span className={`${styles.summaryItem} ${styles.summaryProminent}`}>{formatDateFull(selectedDate)}</span>
                      {selectedSlot && (
                        <>
                          <span className={styles.summaryDot} />
                          <span className={`${styles.summaryItem} ${styles.summaryProminent}`}>
                            {SLOTS.find(s => s.value === selectedSlot)?.label} IST
                          </span>
                          <span className={styles.summaryDot} />
                          <span className={`${styles.summaryItem} ${styles.summaryProminent}`}>Google Meet</span>
                        </>
                      )}
                      {!selectedSlot && (
                        <>
                          <span className={styles.summaryDot} />
                          <span className={styles.summaryItem}>Select a time slot above</span>
                        </>
                      )}
                    </div>

                    <div className={styles.form}>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label} htmlFor="mentor-name">Full name</label>
                        <input
                          id="mentor-name"
                          className={styles.input}
                          type="text"
                          placeholder="Your name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          autoComplete="name"
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label} htmlFor="mentor-email">Gmail address</label>
                        <input
                          id="mentor-email"
                          className={styles.input}
                          type="email"
                          placeholder="you@gmail.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          autoComplete="email"
                        />
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.label} htmlFor="mentor-reason">Reason for booking</label>
                        <textarea
                          id="mentor-reason"
                          className={styles.textarea}
                          placeholder="What would you like to cover? e.g. portfolio review for a product design role, career pivot advice, case-study feedback."
                          value={reason}
                          onChange={e => setReason(e.target.value)}
                        />
                      </div>

                      {error && <p className={styles.errorMsg}>{error}</p>}

                      <button
                        className={styles.payBtn}
                        onClick={handlePay}
                        disabled={!canPay || loading}
                      >
                        {loading ? (
                          <>Processing…</>
                        ) : (
                          <>
                            <i className="bi bi-lock-fill" style={{ fontSize: '13px' }} />
                            Pay ₹{SESSION_PRICE.toLocaleString('en-IN')} to book your slot
                          </>
                        )}
                      </button>
                      <p className={styles.payDisclaimer}>
                        The payment step is included during booking to ensure that available slots
                        go to people who are genuinely committed to making the most of the session.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

          </div>

          {/* ── Right: quote panel ── */}
          <aside className={styles.quotePanel}>
            <div className={styles.quoteGlow} aria-hidden="true">
              <span className={styles.glowOrb1} />
              <span className={styles.glowOrb2} />
              <span className={styles.glowOrb3} />
            </div>
            <div className={styles.quotePanelInner}>
              <motion.span
                className={styles.quoteMark}
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                &quot;
              </motion.span>
              <p className={styles.quoteText}>
                <WordReveal text={QUOTE_TEXT} />
              </p>
              <motion.div
                className={styles.quoteAuthor}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.6, delay: AUTHOR_DELAY, ease: EASE_OUT }}
              >
                <img
                  src="/midhun-headshot.webp"
                  alt="Midhun Krishnakumar"
                  className={styles.quoteAvatar}
                />
                <div className={styles.quoteAuthorText}>
                  <span className={styles.quoteName}>Midhun Krishnakumar</span>
                  <span className={styles.quoteRole}>Product Designer, Adobe</span>
                </div>
              </motion.div>

              <motion.div
                className={styles.quoteMetrics}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.6, delay: METRICS_DELAY, ease: EASE_OUT }}
              >
                <div className={styles.metricItem}>
                  <span className={styles.metricNumber}>7+</span>
                  <span className={styles.metricLabel}>Years experience</span>
                </div>
                <span className={styles.metricDivider} />
                <div className={styles.metricItem}>
                  <span className={styles.metricNumber}>150+</span>
                  <span className={styles.metricLabel}>Hours of mentoring</span>
                </div>
              </motion.div>

              <motion.div
                className={styles.quoteTags}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.6, delay: TAGS_DELAY, ease: EASE_OUT }}
              >
                <span className={styles.quoteTag}>B2B</span>
                <span className={styles.quoteTag}>SaaS</span>
                <span className={styles.quoteTag}>Startups</span>
                <span className={styles.quoteTag}>Agency</span>
                <span className={styles.quoteTag}>Corporate</span>
              </motion.div>
            </div>
          </aside>

        </div>
      </main>
      <Footer />

      {/* ── "Confirming booking" wait screen ──────────────── */}
      <AnimatePresence>
        {confirming && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className={styles.confirmingCard}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.confirmingSpinner} aria-hidden="true" />
              <p className={styles.confirmingText}>Please wait while we confirm your booking. . .</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirmation modal ──────────────────────────── */}
      <AnimatePresence>
        {confirmation && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setConfirmation(null)}
          >
            <motion.div
              className={styles.modalCard}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className={styles.modalClose}
                onClick={() => setConfirmation(null)}
                aria-label="Close"
              >
                <i className="bi bi-x-lg" />
              </button>

              <div className={styles.successIcon}>✓</div>
              <h2 className={styles.successTitle}>You're all set!</h2>
              <p className={styles.successDesc}>
                A confirmation and a Google Calendar invite have been sent to <strong>{confirmation.email}</strong>.
              </p>

              <div className={styles.modalDetails}>
                <div className={styles.modalRow}>
                  <span className={styles.modalRowLabel}>Session</span>
                  <span className={styles.modalRowValue}>Session with Midhun Krishnakumar</span>
                </div>
                <div className={styles.modalRow}>
                  <span className={styles.modalRowLabel}>Date</span>
                  <span className={styles.modalRowValue}>{formatDateFull(confirmation.date)}</span>
                </div>
                <div className={styles.modalRow}>
                  <span className={styles.modalRowLabel}>Time</span>
                  <span className={styles.modalRowValue}>
                    {SLOTS.find(s => s.value === confirmation.slot)?.label} IST
                  </span>
                </div>
              </div>

              {confirmation.meetLink && (
                <div className={styles.meetLinkBox}>
                  <i className="bi bi-camera-video" style={{ color: 'var(--text-accent)' }} />
                  <a href={confirmation.meetLink} target="_blank" rel="noreferrer" className={styles.meetLinkText}>
                    {confirmation.meetLink}
                  </a>
                </div>
              )}

              <button className={styles.modalDoneBtn} onClick={() => setConfirmation(null)}>
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

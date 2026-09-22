import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { EASTER_EGGS, TOTAL_EGGS } from '../data/easterEggs';
import { track } from '../lib/analytics';

const LS_KEY    = 'ee_mkk_v1';      // discovered egg ids
const LS_CS_KEY = 'ee_mkk_cs_v1';   // completion-shown flag

// Single kill-switch for the whole easter egg system. Flip back to `true`
// to fully re-enable discovery, the floating tracker, and all modals.
export const EASTER_EGGS_ENABLED = false;

interface EasterEggCtxValue {
  /* ── state ── */
  discovered: string[];
  discovering: string | null;   // egg currently mid-reveal
  progressOpen: boolean;
  completionOpen: boolean;
  manifestoOpen: boolean;
  discoveredCount: number;
  isComplete: boolean;
  /* ── actions ── */
  discover: (id: string) => void;
  dismissDiscovery: () => void;
  openProgress: () => void;
  closeProgress: () => void;
  closeCompletion: () => void;
  openManifesto: () => void;
  closeManifesto: () => void;
  isDiscovered: (id: string) => boolean;
}

const EasterEggCtx = createContext<EasterEggCtxValue | null>(null);

export function EasterEggProvider({ children }: { children: ReactNode }) {
  /* ── persisted discoveries ── */
  const [discovered, setDiscovered] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]'); }
    catch { return []; }
  });

  /* ── transient UI state ── */
  const [discovering,    setDiscovering]    = useState<string | null>(null);
  const [progressOpen,   setProgressOpen]   = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [manifestoOpen,  setManifestoOpen]  = useState(false);

  /* ref mirror — avoids stale closures in callbacks */
  const discoveredRef  = useRef(discovered);
  const discoveringRef = useRef(discovering);
  useEffect(() => { discoveredRef.current  = discovered;  }, [discovered]);
  useEffect(() => { discoveringRef.current = discovering; }, [discovering]);

  /* persist */
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(discovered));
  }, [discovered]);

  /* ── actions ── */
  const discover = useCallback((id: string) => {
    if (!EASTER_EGGS_ENABLED)               return;   // system disabled
    if (discoveredRef.current.includes(id)) return;   // already found
    if (discoveringRef.current)             return;   // another reveal in progress
    setDiscovering(id);
  }, []);

  const dismissDiscovery = useCallback(() => {
    const id = discoveringRef.current;
    if (!id) return;

    setDiscovering(null);

    setDiscovered(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];

      // Track individual discovery
      const egg = EASTER_EGGS.find(e => e.id === id);
      if (egg) {
        track('egg_discovered', {
          egg_id:     egg.id,
          egg_title:  egg.title,
          egg_index:  egg.index,
          total_found: next.length,
        });
      }

      // Check completion *after* adding
      const completionShown = localStorage.getItem(LS_CS_KEY) === 'true';
      if (next.length >= TOTAL_EGGS && !completionShown) {
        localStorage.setItem(LS_CS_KEY, 'true');
        track('egg_all_found', { total_found: next.length });
        setTimeout(() => setCompletionOpen(true), 350);
      } else {
        setTimeout(() => setProgressOpen(true), 350);
      }

      return next;
    });
  }, []);

  const openProgress   = useCallback(() => setProgressOpen(true),   []);
  const closeProgress  = useCallback(() => setProgressOpen(false),  []);
  const closeCompletion= useCallback(() => { setCompletionOpen(false); setProgressOpen(true); }, []);
  const openManifesto  = useCallback(() => setManifestoOpen(true),  []);
  const closeManifesto = useCallback(() => setManifestoOpen(false), []);
  const isDiscovered   = useCallback((id: string) => discoveredRef.current.includes(id), []);

  const discoveredCount = discovered.length;
  const isComplete      = discoveredCount >= TOTAL_EGGS;

  return (
    <EasterEggCtx.Provider value={{
      discovered,
      discovering,
      progressOpen,
      completionOpen,
      manifestoOpen,
      discoveredCount,
      isComplete,
      discover,
      dismissDiscovery,
      openProgress,
      closeProgress,
      closeCompletion,
      openManifesto,
      closeManifesto,
      isDiscovered,
    }}>
      {children}
    </EasterEggCtx.Provider>
  );
}

export function useEasterEgg() {
  const ctx = useContext(EasterEggCtx);
  if (!ctx) throw new Error('useEasterEgg must be used inside <EasterEggProvider>');
  return ctx;
}

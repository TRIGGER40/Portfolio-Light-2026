import { useState, useEffect } from 'react';
import { initScrollTracking, initGeoTracking } from './lib/analytics';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { EasterEggProvider } from './context/EasterEggContext';
import { DiscoveryModal } from './components/easter-egg/DiscoveryModal';
import { ProgressModal } from './components/easter-egg/ProgressModal';
import { CompletionOverlay } from './components/easter-egg/CompletionOverlay';
import { ManifestoModal } from './components/easter-egg/ManifestoModal';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useScrollRestoration } from './hooks/useScrollRestoration';
import { AnimatePresence, motion } from 'framer-motion';
import { Nav } from './components/Nav';
import { ScrollFade } from './components/ScrollFade';
import { CursorEffect } from './components/CursorEffect';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { About } from './components/About';
import { Testimonials } from './components/Testimonials';
import { Insights } from './components/Insights';
import { Contact } from './components/Contact';
import { AboutMeCard } from './components/AboutMeCard';
import { Footer } from './components/Footer';
import { BackgroundGlow } from './components/BackgroundGlow';
import { AIPage } from './pages/AIPage';
import { AboutPage } from './pages/AboutPage';
import { CaseStudyQuiz } from './pages/CaseStudyQuiz';
import { CaseStudyJoining } from './pages/CaseStudyJoining';
import { PasswordGate } from './components/PasswordGate';
import { CaseStudyQC } from './pages/CaseStudyQC';
import { CaseStudyPPE } from './pages/CaseStudyPPE';
import { AllWorksPage } from './pages/AllWorksPage';
import { MinimalCaseStudyPage } from './pages/MinimalCaseStudyPage';
import { ArticlePage } from './pages/ArticlePage';
import { PanoramaPage } from './pages/PanoramaPage';
import { BoardPage } from './pages/BoardPage';

function BlogRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/', { replace: true, state: { scrollTo: 'insights' } });
  }, [navigate]);
  return null;
}

function HomePage() {
  const location = useLocation();
  useScrollRestoration();
  useEffect(() => { initScrollTracking(); initGeoTracking(); }, []);

  // Scroll to section if navigated here with a scrollTo state (e.g. from /blog)
  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <BackgroundGlow />
      <main>
        <Hero />
        <Work />
        <About />
        <Insights />
        <Testimonials />
        <AboutMeCard />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

const homeVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as [number,number,number,number] } },
};

// AI page uses position:fixed children — only fade, no y-transform
// (transforms on a parent change the containing block for fixed descendants)
const aiVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
  exit:    { opacity: 0,   transition: { duration: 0.25, ease: 'easeIn' as const } },
};

export default function App() {
  const location = useLocation();
  const isAIPage = location.pathname === '/ask';
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Global listener — triggered from Nav header OR AI page input
  useEffect(() => {
    const handler = () => setShowAnalytics(true);
    window.addEventListener('show-analytics', handler);
    return () => window.removeEventListener('show-analytics', handler);
  }, []);

  return (
    <EasterEggProvider>
      <CursorEffect />
      {showAnalytics && <AnalyticsDashboard onClose={() => setShowAnalytics(false)} />}
      {/* ── Easter Egg system — global modals ── */}
      <DiscoveryModal />
      <ProgressModal />
      <CompletionOverlay />
      <ManifestoModal />
      <Nav hidden={isAIPage} />
      {!isAIPage && <ScrollFade />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <HomePage />
            </motion.div>
          } />
          <Route path="/about" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <AboutPage />
            </motion.div>
          } />
          <Route path="/work/quiz" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <CaseStudyQuiz />
            </motion.div>
          } />
          <Route path="/work/joining" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <CaseStudyJoining />
            </motion.div>
          } />
          <Route path="/work/almvc" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <PasswordGate
                id="almvc"
                loader={() => import('./pages/CaseStudyALMVC').then(m => ({ default: m.CaseStudyALMVC }))}
              />
            </motion.div>
          } />
          <Route path="/work/qc" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <CaseStudyQC />
            </motion.div>
          } />
          <Route path="/work/ppe" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <CaseStudyPPE />
            </motion.div>
          } />
          <Route path="/work/all" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <AllWorksPage />
            </motion.div>
          } />
          <Route path="/work/:id" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <MinimalCaseStudyPage />
            </motion.div>
          } />
          <Route path="/board" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <BoardPage />
            </motion.div>
          } />
          <Route path="/campus-pano" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <PanoramaPage />
            </motion.div>
          } />
          <Route path="/blog" element={<BlogRedirect />} />
          <Route path="/articles/:slug" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <ArticlePage />
            </motion.div>
          } />
          <Route path="/ask" element={
            <motion.div
              variants={aiVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ position: 'fixed', inset: 0 }}
            >
              <AIPage />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </EasterEggProvider>
  );
}

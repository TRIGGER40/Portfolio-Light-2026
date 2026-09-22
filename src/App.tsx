import { useState, useEffect } from 'react';
import { initScrollTracking, initGeoTracking, initSessionEndTracking, initPageScrollTracking } from './lib/analytics';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { EasterEggProvider, EASTER_EGGS_ENABLED } from './context/EasterEggContext';
import { DiscoveryModal } from './components/easter-egg/DiscoveryModal';
import { ProgressModal } from './components/easter-egg/ProgressModal';
import { CompletionOverlay } from './components/easter-egg/CompletionOverlay';
import { ManifestoModal } from './components/easter-egg/ManifestoModal';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useScrollRestoration } from './hooks/useScrollRestoration';
import { ARTICLES } from './data/articles';
import { CASE_STUDIES } from './data/portfolioData';
import { AnimatePresence, motion } from 'framer-motion';
import { Nav } from './components/Nav';
import { ScrollFade } from './components/ScrollFade';
import { CursorEffect } from './components/CursorEffect';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { EasterEggTracker } from './components/easter-egg/EasterEggTracker';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { About } from './components/About';
import { Testimonials } from './components/Testimonials';
import { Insights } from './components/Insights';
import { Contact } from './components/Contact';
import { AboutMeCard } from './components/AboutMeCard';
import { Footer } from './components/Footer';
import { BackgroundGlow } from './components/BackgroundGlow';
import { GridBreath } from './components/GridBreath';
import { AIPage } from './pages/AIPage';
import { AboutPage } from './pages/AboutPage';
import { CaseStudyQuiz } from './pages/CaseStudyQuiz';
import { CaseStudyJoining } from './pages/CaseStudyJoining';
import { CaseStudyALMVC } from './pages/CaseStudyALMVC';
import { CaseStudyQC } from './pages/CaseStudyQC';
import { CaseStudyPPE } from './pages/CaseStudyPPE';
import { AllWorksPage } from './pages/AllWorksPage';
import { MinimalCaseStudyPage } from './pages/MinimalCaseStudyPage';
import { ArticlePage } from './pages/ArticlePage';
import { PanoramaPage } from './pages/PanoramaPage';
import { BoardPage } from './pages/BoardPage';
import { MentorPage } from './pages/MentorPage';

// ── Per-route page meta ────────────────────────────────────────────────────
const STATIC_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Midhun Krishnakumar | Product Designer',
    description: 'AI-first Product Designer with 7+ years building enterprise and AI-native products at Adobe, Bizongo, and more.',
  },
  '/about': {
    title: 'About | Midhun Krishnakumar',
    description: 'Background, design philosophy, and experience of Midhun Krishnakumar, AI-first Product Designer at Adobe.',
  },
  '/work/all': {
    title: 'All Projects | Midhun Krishnakumar',
    description: 'Product design and UX case studies by Midhun Krishnakumar, spanning Adobe, Bizongo, DRDO, and more.',
  },
  '/work/almvc': {
    title: "Building Adobe's Native Virtual Classroom | Midhun Krishnakumar",
    description: '0 to 1 design of Adobe Learning Manager virtual classroom: session lifecycle, breakout rooms, AI-assisted engagement, and recording viewer.',
  },
  '/work/quiz': {
    title: 'Real-time Quiz Delivery in Live Sessions | Midhun Krishnakumar',
    description: 'Case study: designing real-time quiz delivery inside Adobe Connect live sessions for active learning at scale.',
  },
  '/work/joining': {
    title: 'Enhancing the Event Joining Experience | Midhun Krishnakumar',
    description: 'Case study: reducing friction in the pre-session joining flow for Adobe Connect virtual events.',
  },
  '/work/qc': {
    title: 'Quality Control for Flexible Packaging | Midhun Krishnakumar',
    description: 'Case study: designing a mobile QC workflow for Bizongo flexible packaging supply chain operations.',
  },
  '/work/ppe': {
    title: 'AI-powered PPE Compliance Detection | Midhun Krishnakumar',
    description: 'Case study: designing UX for an AI system that detects PPE compliance on factory floors in real time.',
  },
  '/ask': {
    title: 'Ask Midhun | AI Portfolio Assistant',
    description: 'An AI assistant trained on Midhun Krishnakumar portfolio and design thinking. Ask anything about his work, process, or experience.',
  },
  '/book-a-session': {
    title: 'Book a 1:1 Session with Midhun Krishnakumar | Mentorship & Portfolio Review',
    description: 'Book a focused 60-minute mentorship session with Midhun Krishnakumar, Lead Product Designer at Adobe. Portfolio review, career guidance, and interview prep over Google Meet.',
  },
  '/mentor': {
    title: 'Book a 1:1 Session with Midhun Krishnakumar | Mentorship & Portfolio Review',
    description: 'Book a focused 60-minute mentorship session with Midhun Krishnakumar, Lead Product Designer at Adobe. Portfolio review, career guidance, and interview prep over Google Meet.',
  },
};

function setPageMeta(title: string, description: string) {
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
}

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
  useEffect(() => { initScrollTracking(); initGeoTracking(); initSessionEndTracking(); }, []);
  useEffect(() => initPageScrollTracking('work'), []);

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

  // Dynamic page title + meta description per route
  useEffect(() => {
    const path = location.pathname;

    if (STATIC_META[path]) {
      const { title, description } = STATIC_META[path];
      setPageMeta(title, description);
      return;
    }

    // /articles/:slug
    if (path.startsWith('/articles/')) {
      const slug = path.replace('/articles/', '');
      const article = ARTICLES.find(a => a.slug === slug);
      if (article) {
        setPageMeta(
          `${article.title} | Midhun Krishnakumar`,
          article.subtitle,
        );
      }
      return;
    }

    // /work/:id  (MinimalCaseStudyPage)
    if (path.startsWith('/work/')) {
      const id = path.replace('/work/', '');
      const project = CASE_STUDIES.find(cs => cs.id === id);
      if (project) {
        const desc = project.cardDesc ?? project.opportunity.slice(0, 160);
        setPageMeta(
          `${project.title} | Midhun Krishnakumar`,
          desc,
        );
      }
      return;
    }
  }, [location.pathname]);

  return (
    <EasterEggProvider>
      <GridBreath />
      <CursorEffect />
      {/* Fixed bottom-right cluster: egg counter + theme toggle.
          On /ask mobile: moves to top-right and hides egg counter. */}
      <div className={`floating-controls${isAIPage ? ' floating-controls--ask' : ''}`}>
        {!isAIPage && EASTER_EGGS_ENABLED && <EasterEggTracker floating />}
        <ThemeSwitcher />
      </div>
      {showAnalytics && <AnalyticsDashboard onClose={() => setShowAnalytics(false)} />}
      {/* ── Easter Egg system — global modals. Gated by EASTER_EGGS_ENABLED
          in EasterEggContext.tsx; flip that back to re-enable everything. ── */}
      {EASTER_EGGS_ENABLED && (
        <>
          <DiscoveryModal />
          <ProgressModal />
          <CompletionOverlay />
          <ManifestoModal />
        </>
      )}
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
              <CaseStudyALMVC />
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
          <Route path="/mentor" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <MentorPage />
            </motion.div>
          } />
          <Route path="/book-a-session" element={
            <motion.div variants={homeVariants} initial="initial" animate="animate" exit="exit">
              <MentorPage />
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

import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useScrollRestoration } from './hooks/useScrollRestoration';
import { AnimatePresence, motion } from 'framer-motion';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { About } from './components/About';
import { Insights } from './components/Insights';
import { Contact } from './components/Contact';
import { HobbiesCarousel } from './components/HobbiesCarousel';
import { Footer } from './components/Footer';
import { BackgroundGlow } from './components/BackgroundGlow';
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

function HomePage() {
  useScrollRestoration();
  return (
    <>
      <BackgroundGlow />
      <main>
        <Hero />
        <div className="divider" />
        <Work />
        <div className="divider" />
        <About />
        <div className="divider" />
        <section style={{ padding: '64px 0' }}>
          <div className="container">
            <HobbiesCarousel />
          </div>
        </section>
        <div className="divider" />
        <Insights />
        <div className="divider" />
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

  return (
    <>
      <Nav hidden={isAIPage} />
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
    </>
  );
}

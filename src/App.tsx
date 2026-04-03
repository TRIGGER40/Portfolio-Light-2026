import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { About } from './components/About';
import { Insights } from './components/Insights';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { BackgroundGlow } from './components/BackgroundGlow';
import { AIPage } from './pages/AIPage';

function HomePage() {
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
        <Insights />
        <div className="divider" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
};

export default function App() {
  const [navHidden, setNavHidden] = useState(false);
  const location = useLocation();

  return (
    <>
      <Nav hidden={navHidden} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <HomePage />
            </motion.div>
          } />
          <Route path="/ask" element={
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <AIPage onChatActive={setNavHidden} />
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </>
  );
}

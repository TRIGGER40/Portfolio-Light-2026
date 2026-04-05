import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ARTICLES } from '../data/articles';
import type { Article } from '../data/articles';
import { saveScrollBeforeLeave } from '../hooks/useScrollRestoration';
import styles from './Insights.module.css';

function FadeCard({ article }: { article: Article; index: number }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => { saveScrollBeforeLeave(); navigate(`/articles/${article.slug}`); }}
      className={`glass-card ${styles.card}`}
      style={{ border: 'none', cursor: 'pointer', textAlign: 'left' }}
    >
      {/* Thumbnail */}
      <div className={styles.imgWrap}>
        <img
          src={article.coverSrc}
          alt={article.coverAlt}
          className={styles.img}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLElement).closest(`.${styles.imgWrap}`)?.remove();
          }}
        />
      </div>

      <div className={styles.body}>
        {/* Tags */}
        <div className={styles.tags}>
          {article.tags.slice(0, 2).map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        {/* Title */}
        <h3 className={styles.cardTitle}>{article.title}</h3>

        {/* Excerpt */}
        <p className={styles.excerpt}>{article.subtitle}</p>

        {/* Footer */}
        <div className={styles.cardFooter}>
          <span className={styles.date}>{article.published}</span>
          <span className={styles.readMore}>Read →</span>
        </div>
      </div>
    </button>
  );
}

export function Insights() {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - 24, behavior: 'smooth' });
    setActiveIndex(index);
  };

  const prev = () => scrollToIndex(Math.max(0, activeIndex - 1));
  const next = () => scrollToIndex(Math.min(ARTICLES.length - 1, activeIndex + 1));

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[0] as HTMLElement;
    if (!card) return;
    const cardWidth = card.offsetWidth + 20;
    setActiveIndex(Math.round(track.scrollLeft / cardWidth));
  };

  return (
    <section className="section" id="insights">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Insights</span>
          <div className={styles.titleRow}>
            <div>
              <h2 className={`text-display ${styles.title}`}>
                Thinking on AI,
                <br />
                <span className="gradient-text">design &amp; craft</span>
              </h2>
              <p className={`text-body ${styles.subtitle}`}>
                Short, high-signal thoughts on where design is heading and how to stay sharp.
              </p>
            </div>

            {/* Nav arrows */}
            <div className={styles.navBtns}>
              <button
                className={`${styles.navBtn} ${activeIndex === 0 ? styles.navBtnDisabled : ''}`}
                onClick={prev}
                aria-label="Previous article"
                disabled={activeIndex === 0}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className={`${styles.navBtn} ${activeIndex === ARTICLES.length - 1 ? styles.navBtnDisabled : ''}`}
                onClick={next}
                aria-label="Next article"
                disabled={activeIndex === ARTICLES.length - 1}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Carousel — mask fades cards at horizontal edges */}
        <div className={styles.carouselWrap}>
          <div ref={trackRef} className={styles.track} onScroll={handleScroll}>
            {ARTICLES.map((article, i) => (
              <FadeCard key={article.slug} article={article} index={i} />
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className={styles.dots}>
          {ARTICLES.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to article ${i + 1}`}
            />
          ))}
        </div>

        <motion.div
          className={styles.allRow}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <button
            className="btn btn-secondary"
            onClick={() => { saveScrollBeforeLeave(); navigate(`/articles/${ARTICLES[0].slug}`); }}
          >
            Read articles
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}

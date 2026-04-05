import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getArticleBySlug, getArticleNeighbors } from '../data/articles';
import type { Article } from '../data/articles';
import { GoBackButton } from '../components/GoBackButton';
import { saveScrollBeforeLeave } from '../hooks/useScrollRestoration';
import { Footer } from '../components/Footer';
import { BackgroundGlow } from '../components/BackgroundGlow';
import styles from './ArticlePage.module.css';

/* ── Article nav card (prev / next) ────────────────── */
function NavCard({ article, direction }: { article: Article; direction: 'prev' | 'next' }) {
  const navigate = useNavigate();
  const isNext = direction === 'next';

  return (
    <button
      className={`${styles.navCard} ${isNext ? styles.navCardReverse : ''}`}
      onClick={() => { saveScrollBeforeLeave(); navigate(`/articles/${article.slug}`); }}
    >
      <img src={article.coverSrc} alt={article.title} className={styles.navCardImg} />
      <div className={styles.navCardText}>
        <span className={styles.navCardDir}>{isNext ? 'Next →' : '← Previous'}</span>
        <span className={styles.navCardTitle}>{article.title}</span>
      </div>
    </button>
  );
}

/* ── Main page ──────────────────────────────────────── */
export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug);
  const { prev, next } = getArticleNeighbors(slug ?? '');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  if (!article) {
    return (
      <div className={styles.page} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Article not found.</p>
          <GoBackButton fallback="/" />
        </div>
      </div>
    );
  }

  const hasPrev = !!prev;
  const hasNext = !!next;
  const navGridClass = hasPrev && hasNext ? '' : hasNext ? styles.singleNext : styles.singlePrev;

  return (
    <>
      <BackgroundGlow />
      <div className={styles.page}>

        {/* Top bar */}
        <div className={styles.topBar}>
          <GoBackButton fallback="/articles" />
          <span className={styles.published}>{article.published}</span>
        </div>

        {/* Cover image */}
        <motion.div
          className={styles.coverWrap}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={article.coverSrc}
            alt={article.coverAlt}
            className={styles.cover}
          />
        </motion.div>

        {/* Article header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.tags}>
            {article.tags.map(t => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>

          <h1 className={styles.title}>{article.title}</h1>
          <p className={styles.subtitle}>{article.subtitle}</p>

          <div className={styles.divider} />

          <div className={styles.byline}>
            <img src="/About me midhun.png" alt="Midhun Krishnakumar" className={styles.authorAvatar} />
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{article.author}</span>
              <span className={styles.authorRole}>{article.roleLine}</span>
            </div>
          </div>
        </motion.div>

        {/* Body */}
        <motion.div
          className={styles.body}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {article.blocks.map((block, i) => {
            if (block.type === 'h2') {
              return <h2 key={i} className={styles.bodyH2}>{block.text}</h2>;
            }
            if (block.type === 'p') {
              return <p key={i} className={styles.bodyP}>{block.text}</p>;
            }
            if (block.type === 'ul') {
              return (
                <ul key={i} className={styles.bodyUl}>
                  {block.items.map((item, j) => (
                    <li key={j} className={styles.bodyLi}>
                      <span className={styles.bodyLiBullet} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.type === 'figure') {
              return (
                <div key={i} className={styles.bodyFigure}>
                  <p className={styles.bodyFigureCaption}>{block.caption}</p>
                </div>
              );
            }
            if (block.type === 'link') {
              return (
                <a
                  key={i}
                  href={block.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.bodyLink}
                >
                  <div className={styles.bodyLinkIcon}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9M9 2h5m0 0v5m0-5L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={styles.bodyLinkText}>
                    <span className={styles.bodyLinkLabel}>{block.label}</span>
                    {block.description && (
                      <span className={styles.bodyLinkDesc}>{block.description}</span>
                    )}
                  </div>
                </a>
              );
            }
            return null;
          })}
        </motion.div>

        {/* Article navigation */}
        {(hasPrev || hasNext) && (
          <div className={styles.articleNav}>
            <div className={styles.navDivider} />
            <p className={styles.navLabel}>Continue reading</p>
            <div className={`${styles.navCards} ${navGridClass}`}>
              {hasPrev && <NavCard article={prev!} direction="prev" />}
              {hasNext && <NavCard article={next!} direction="next" />}
            </div>
          </div>
        )}

        <div className={styles.footerGap} />
        <Footer />
      </div>
    </>
  );
}

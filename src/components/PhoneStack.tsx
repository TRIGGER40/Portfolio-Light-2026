import { useEffect, useRef } from 'react';
import styles from './PhoneStack.module.css';

function IPhone({ imgSrc, imgAlt, className }: { imgSrc: string; imgAlt: string; className: string }) {
  return (
    <div className={`${styles.phone} ${className}`}>
      {/* Left side buttons */}
      <div className={styles.btnAction} />
      <div className={styles.btnVolUp} />
      <div className={styles.btnVolDown} />
      {/* Right side button */}
      <div className={styles.btnPower} />

      {/* Screen + Dynamic Island */}
      <div className={styles.screen}>
        <img src={imgSrc} alt={imgAlt} draggable={false} />
        <div className={styles.dynamicIsland} />
      </div>

      {/* Bottom footer: speaker · USB-C · speaker */}
      <div className={styles.footer}>
        <div className={styles.speakerGrille} />
        <div className={styles.usbC} />
        <div className={styles.speakerGrille} />
      </div>
    </div>
  );
}

export function PhoneStack() {
  const backRef  = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = window.scrollY;
          if (backRef.current)  backRef.current.style.translate  = `0 ${y * -0.06}px`;
          if (frontRef.current) frontRef.current.style.translate = `0 ${y * -0.14}px`;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.stack}>
      {/* Back — IBM Connect (event joining) */}
      <div className={`${styles.phoneWrap} ${styles.back}`} ref={backRef}>
        <IPhone
          imgSrc="/images/phone-ibm.png"
          imgAlt="IBM Connect – event joining"
          className={styles.phoneBack}
        />
      </div>

      {/* Front — Adobe Connect (larger, in front) */}
      <div className={`${styles.phoneWrap} ${styles.front}`} ref={frontRef}>
        <IPhone
          imgSrc="/images/phone-adobe.png"
          imgAlt="Adobe Connect – welcome screen"
          className={styles.phoneFront}
        />
      </div>
    </div>
  );
}

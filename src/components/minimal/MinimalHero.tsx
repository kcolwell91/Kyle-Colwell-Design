'use client';

import { useEffect, useRef } from 'react';
import { MINIMAL_HERO } from '@/data/minimalContent';
import styles from './MinimalHero.module.css';

export default function MinimalHero() {
  const { video, title } = MINIMAL_HERO;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    const play = () => {
      void element.play().catch(() => {
        /* Autoplay may be blocked until user interaction. */
      });
    };

    if (element.readyState >= 2) {
      play();
      return;
    }

    element.addEventListener('loadeddata', play, { once: true });
    return () => element.removeEventListener('loadeddata', play);
  }, []);

  return (
    <section className={styles.hero} aria-label="Hero">
      <div className={styles.media} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={video.poster}
        >
          <source src={video.src} type={video.type} />
        </video>
        <div className={styles.scrim} />
      </div>
      <header className={styles.copy}>
        <p className={styles.eyebrow}>{MINIMAL_HERO.name}</p>
        <h1 className={styles.title}>
          {title.map((line) => (
            <span key={line} className={styles.titleLine}>
              {line}
            </span>
          ))}
        </h1>
      </header>
    </section>
  );
}

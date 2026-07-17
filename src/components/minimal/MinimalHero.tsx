'use client';

import { useEffect, useRef } from 'react';
import { MINIMAL_HERO } from '@/data/minimalContent';
import styles from './MinimalHero.module.css';

const HERO_VIDEO_RATE = 0.85;

export default function MinimalHero() {
  const { video, title, selectedWork } = MINIMAL_HERO;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    element.playbackRate = HERO_VIDEO_RATE;

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
        >
          <source src={video.src} type={video.type} />
        </video>
        <div className={styles.scrim} />
      </div>
      <header className={styles.copy}>
        <div className={styles.copyBackdrop} aria-hidden="true" />
        <h1 className={styles.title}>
          {title.map((line) => (
            <span key={line} className={styles.titleLine}>
              {line}
            </span>
          ))}
        </h1>
        <a href={selectedWork.href} className={styles.cta}>
          <span className={styles.ctaText}>
            <span>{selectedWork.label}</span>
            <span className={styles.ctaUnderline} aria-hidden="true" />
          </span>
          <span className={styles.ctaArrow} aria-hidden="true">
            →
          </span>
        </a>
      </header>
    </section>
  );
}

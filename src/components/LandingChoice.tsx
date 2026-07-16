'use client';

import Link from 'next/link';
import { IMMERSIVE_HOME_PATH, MINIMAL_HOME_PATH } from '@/config/siteRoutes';
import { LANDING_CHOICE } from '@/data/landingContent';
import styles from './LandingChoice.module.css';

const CHOICES = [
  {
    label: 'Immersive',
    href: IMMERSIVE_HOME_PATH,
  },
  {
    label: 'Minimal',
    href: MINIMAL_HOME_PATH,
  },
] as const;

export default function LandingChoice() {
  return (
    <main className={styles.page}>
      <section className={styles.section} aria-label="Choose your journey">
        <div className={styles.media} aria-hidden="true">
          <video
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={LANDING_CHOICE.video.poster}
          >
            <source src={LANDING_CHOICE.video.src} type={LANDING_CHOICE.video.type} />
          </video>
          <div className={styles.scrim} />
        </div>

        <div className={styles.inner}>
          <header className={styles.header}>
            <p className={styles.identity}>
              <span className={styles.name}>{LANDING_CHOICE.name}</span>
              <span className={styles.title}>{LANDING_CHOICE.title}</span>
            </p>
            <h1 className={styles.headline}>{LANDING_CHOICE.headline}</h1>
          </header>
          <ul className={styles.choices}>
            {CHOICES.map(({ label, href }) => (
              <li key={href} className={styles.choiceItem}>
                <Link href={href} className={styles.choice}>
                  <span className={styles.choiceLabel}>{label}</span>
                  <span className={styles.choiceUnderline} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

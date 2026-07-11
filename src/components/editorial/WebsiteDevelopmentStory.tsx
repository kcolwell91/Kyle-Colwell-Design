'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useEditorialReveal } from '@/hooks/useEditorialReveal';
import {
  WEBSITE_DEV_CLOSING,
  WEBSITE_DEV_CRAFT,
  WEBSITE_DEV_HERO,
  WEBSITE_DEV_INDEX,
  WEBSITE_DEV_OUTCOMES,
  WEBSITE_DEV_PILLARS,
  WEBSITE_DEV_STATEMENT,
  WEBSITE_DEV_VISION,
} from '@/data/websiteDevelopmentStory';
import styles from './WebsiteDevelopmentStory.module.css';

type PlaceholderProps = {
  label: string;
  caption: string;
  aspect: `${number} / ${number}`;
  variant?: 'dark' | 'light';
  fullBleed?: boolean;
};

function MediaPlaceholder({
  label,
  caption,
  aspect,
  variant = 'dark',
  fullBleed = false,
}: PlaceholderProps) {
  return (
    <figure
      className={`${styles.placeholder} ${variant === 'light' ? styles.placeholderLight : ''}`}
      style={fullBleed ? undefined : { aspectRatio: aspect }}
      data-editorial-reveal={fullBleed ? undefined : true}
    >
      <div className={styles.placeholderInner}>
        <span className={styles.placeholderMark} aria-hidden="true" />
        <p className={styles.placeholderLabel}>{label}</p>
        <p className={styles.placeholderCaption}>{caption}</p>
      </div>
    </figure>
  );
}

export default function WebsiteDevelopmentStory() {
  const rootRef = useRef<HTMLElement>(null);
  useEditorialReveal(rootRef);

  return (
    <main ref={rootRef} className={styles.story}>
      <nav className={styles.nav} aria-label="Project navigation">
        <Link href="/#selected-worlds" className={styles.navLink}>
          ← Selected Worlds
        </Link>
        <span className={styles.navIndex}>{WEBSITE_DEV_INDEX}</span>
      </nav>

      <section className={styles.hero} aria-label="Website development hero">
        <div className={styles.heroMedia}>
          <MediaPlaceholder
            label="Opening experience"
            caption="Replace with hero motion, depth, or first-load sequence"
            aspect="16 / 10"
            fullBleed
          />
          <div className={styles.heroScrim} aria-hidden="true" />
        </div>
        <div className={styles.heroCopy} data-editorial-reveal>
          <p className={styles.heroEyebrow}>{WEBSITE_DEV_HERO.eyebrow}</p>
          <h1 className={styles.heroTitle}>{WEBSITE_DEV_HERO.title}</h1>
        </div>
      </section>

      <section className={styles.section} aria-label="The first heartbeat">
        <div className={styles.sectionInner}>
          <div className={styles.split}>
            <div className={styles.splitCopy}>
              <p className={styles.kicker} data-editorial-reveal>
                {WEBSITE_DEV_VISION.kicker}
              </p>
              <div className={styles.prose} data-editorial-reveal>
                {WEBSITE_DEV_VISION.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>
            <MediaPlaceholder
              label={WEBSITE_DEV_VISION.placeholder.label}
              caption={WEBSITE_DEV_VISION.placeholder.caption}
              aspect={WEBSITE_DEV_VISION.placeholder.aspect}
            />
          </div>
        </div>
      </section>

      <section className={styles.sectionMuted} aria-label="Statement">
        <div className={styles.sectionInner}>
          <p className={styles.statement} data-editorial-reveal>
            {WEBSITE_DEV_STATEMENT}
          </p>
        </div>
      </section>

      <section className={styles.section} aria-label="The environment">
        <div className={styles.sectionInner}>
          <div className={styles.splitReverse}>
            <MediaPlaceholder
              label={WEBSITE_DEV_CRAFT.placeholder.label}
              caption={WEBSITE_DEV_CRAFT.placeholder.caption}
              aspect={WEBSITE_DEV_CRAFT.placeholder.aspect}
            />
            <div className={styles.splitCopy}>
              <p className={styles.kicker} data-editorial-reveal>
                {WEBSITE_DEV_CRAFT.kicker}
              </p>
              <div className={styles.prose} data-editorial-reveal>
                {WEBSITE_DEV_CRAFT.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionMuted} aria-label="Business outcomes">
        <div className={styles.sectionInner}>
          <p className={`${styles.kicker} ${styles.kickerCenter}`} data-editorial-reveal>
            {WEBSITE_DEV_OUTCOMES.kicker}
          </p>
          <div className={styles.outcomeBlock}>
            <div className={styles.prose} data-editorial-reveal>
              {WEBSITE_DEV_OUTCOMES.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <MediaPlaceholder
              label={WEBSITE_DEV_OUTCOMES.placeholder.label}
              caption={WEBSITE_DEV_OUTCOMES.placeholder.caption}
              aspect={WEBSITE_DEV_OUTCOMES.placeholder.aspect}
              variant="light"
            />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-label="The craft behind the experience">
        <div className={styles.sectionInner}>
          <h2 className={styles.pillarsHeader} data-editorial-reveal>
            The craft behind the experience
          </h2>
          <div className={styles.pillarsGrid}>
            {WEBSITE_DEV_PILLARS.map((pillar) => (
              <article key={pillar.title} className={styles.pillar}>
                <MediaPlaceholder
                  label={pillar.placeholder.label}
                  caption={pillar.placeholder.caption}
                  aspect={pillar.placeholder.aspect}
                  variant="light"
                />
                <p className={styles.pillarTitle} data-editorial-reveal>
                  {pillar.title}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionDark} aria-label="Closing">
        <div className={`${styles.sectionInner} ${styles.closingInner}`}>
          <p className={styles.closingLine} data-editorial-reveal>
            {WEBSITE_DEV_CLOSING.line}
          </p>
          <Link href="/#contact" className={styles.closingCta} data-editorial-reveal>
            {WEBSITE_DEV_CLOSING.cta} →
          </Link>
        </div>
      </section>
    </main>
  );
}

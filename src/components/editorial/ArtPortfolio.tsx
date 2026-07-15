'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ART_COMMISSION,
  ART_PORTFOLIO_INTRO,
  ART_WORKS,
} from '@/data/artPortfolio';
import { useEditorialReveal } from '@/hooks/useEditorialReveal';
import styles from './ArtPortfolio.module.css';

export default function ArtPortfolio() {
  const rootRef = useRef<HTMLElement>(null);
  useEditorialReveal(rootRef);

  return (
    <main ref={rootRef} className={styles.page}>
      <header className={styles.header} data-editorial-reveal>
        <Link href="/" className={styles.backLink}>
          ← Home
        </Link>
        <span className={styles.headerMark}>Kyle Colwell</span>
        <Link href="/portfolio/interior-design" className={styles.backLinkMuted}>
          Interior Design
        </Link>
      </header>

      <section className={styles.intro} aria-label="Art portfolio">
        <p className={styles.eyebrow} data-editorial-reveal>
          {ART_PORTFOLIO_INTRO.eyebrow}
        </p>
        <h1 className={styles.title} data-editorial-reveal>
          {ART_PORTFOLIO_INTRO.title}
        </h1>
        <p className={styles.dek} data-editorial-reveal>
          {ART_PORTFOLIO_INTRO.dek}
        </p>
      </section>

      <section className={styles.works} aria-label="Selected works">
        {ART_WORKS.map((work, index) => (
          <article
            key={work.id}
            className={`${styles.work} ${index % 2 === 1 ? styles.workReversed : ''}`}
            aria-label={work.title}
            data-editorial-reveal
          >
            <div className={styles.workInner}>
              <figure className={styles.workMedia}>
                <div className={styles.imageFrame}>
                  <div
                    className={`${styles.imageMat} ${
                      work.medium === 'canvas' ? styles.imageMatCanvas : styles.imageMatMural
                    }`}
                  >
                    <Image
                      src={work.image.src}
                      alt={work.image.alt}
                      fill
                      sizes="(max-width: 900px) 100vw, 58vw"
                      quality={92}
                      style={{ objectPosition: work.image.position }}
                      className={styles.image}
                    />
                  </div>
                </div>
              </figure>

              <div className={styles.workCopy}>
                <span className={styles.workIndex}>
                  {String(index + 1).padStart(2, '0')} · {work.medium}
                </span>
                <h2 className={styles.workTitle}>{work.title}</h2>
                <p className={styles.workMeta}>
                  {work.material} · {work.year}
                </p>
                <p className={styles.workStatement}>{work.statement}</p>
                {work.context ? (
                  <Link href={work.context.href} className={styles.contextLink}>
                    {work.context.label} →
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.commission} aria-label="Commissions" data-editorial-reveal>
        <p className={styles.eyebrow}>{ART_COMMISSION.eyebrow}</p>
        <h2 className={styles.commissionTitle}>{ART_COMMISSION.title}</h2>
        <p className={styles.commissionCopy}>{ART_COMMISSION.copy}</p>
        <Link href={ART_COMMISSION.href} className={styles.commissionLink}>
          {ART_COMMISSION.cta} →
        </Link>
      </section>
    </main>
  );
}

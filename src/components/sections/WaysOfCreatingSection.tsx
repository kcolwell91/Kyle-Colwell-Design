'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { WAYS_OF_CREATING } from '@/data/waysOfCreating';
import styles from './WaysOfCreatingSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function WaysOfCreatingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const eyebrow = section.querySelector<HTMLElement>('[data-ways-eyebrow]');
      const headline = section.querySelector<HTMLElement>('[data-ways-headline]');
      const columns = section.querySelectorAll<HTMLElement>('[data-ways-column]');

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set([eyebrow, headline, columns], { opacity: 1, y: 0 });
        return;
      }

      gsap.set([eyebrow, headline, ...columns], { opacity: 0, y: 36 });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          const timeline = gsap.timeline();

          timeline.to(eyebrow, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
          });

          timeline.to(
            headline,
            {
              opacity: 1,
              y: 0,
              duration: 1.15,
              ease: 'power3.out',
            },
            '-=0.72'
          );

          timeline.to(
            columns,
            {
              opacity: 1,
              y: 0,
              duration: 1.05,
              stagger: 0.18,
              ease: 'power3.out',
            },
            '-=0.55'
          );
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="ways-of-creating"
      aria-label="Ways of Creating"
    >
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.paperTexture} />
        <div className={styles.radialLight} />
      </div>

      <div className={styles.inner}>
        <header className={styles.statement}>
          <p className={styles.eyebrow} data-ways-eyebrow>
            {WAYS_OF_CREATING.eyebrow}
          </p>
          <h2 className={styles.headline} data-ways-headline>
            {WAYS_OF_CREATING.headline}{' '}
            <span className={styles.headlineEmphasis}>{WAYS_OF_CREATING.headlineEmphasis}</span>{' '}
            {WAYS_OF_CREATING.headlineEnd}
          </h2>
        </header>

        <div className={styles.columns}>
          {WAYS_OF_CREATING.columns.map((column) => (
            <article
              key={column.id}
              id={column.id}
              className={styles.column}
              data-ways-column
            >
              <span className={styles.columnIndex}>{column.index}</span>
              <h3 className={styles.columnTitle}>{column.title}</h3>
              <p className={styles.columnDescription}>{column.description}</p>
              <Link href={column.href} className={styles.columnCta}>
                {column.cta}
                <span className={styles.columnCtaArrow} aria-hidden="true">
                  →
                </span>
              </Link>
              <figure className={styles.columnFigure}>
                <div
                  className={`${styles.imageMask} ${
                    column.mask === 'circle' ? styles.imageMaskCircle : styles.imageMaskArch
                  }`}
                >
                  <Image
                    src={column.image.src}
                    alt={column.image.alt}
                    fill
                    sizes="(max-width: 960px) 90vw, 320px"
                    quality={90}
                    className={styles.image}
                  />
                </div>
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

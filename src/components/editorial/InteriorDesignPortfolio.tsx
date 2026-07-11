'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { INTERIOR_PORTFOLIO_CHAPTERS } from '@/data/interiorPortfolio';
import { useEditorialReveal } from '@/hooks/useEditorialReveal';
import styles from './InteriorDesignPortfolio.module.css';

const CHAPTER_LAYOUT: Record<
  string,
  { sectionClass: string; imageSizes: string }
> = {
  featured: {
    sectionClass: styles.chapterFeatured,
    imageSizes: '(max-width: 768px) 100vw, 1180px',
  },
  bedrooms: {
    sectionClass: styles.chapterBedrooms,
    imageSizes: '(max-width: 768px) 100vw, 820px',
  },
  bathrooms: {
    sectionClass: styles.chapterBathrooms,
    imageSizes: '(max-width: 768px) 100vw, 760px',
  },
  living: {
    sectionClass: styles.chapterLiving,
    imageSizes: '(max-width: 768px) 100vw, 760px',
  },
  kitchens: {
    sectionClass: styles.chapterKitchens,
    imageSizes: '(max-width: 768px) 100vw, 760px',
  },
};

export default function InteriorDesignPortfolio() {
  const rootRef = useRef<HTMLElement>(null);
  useEditorialReveal(rootRef);

  return (
    <main ref={rootRef} className={styles.page}>
      <header className={styles.header} data-editorial-reveal>
        <Link href="/work/hawaiian-airbnb" className={styles.backLink}>
          ← Volcano House
        </Link>
        <span className={styles.headerMark}>Kyle Colwell</span>
        <Link href="/#selected-worlds" className={styles.backLinkMuted}>
          Selected Worlds
        </Link>
      </header>

      <section className={styles.intro} aria-label="Interior design portfolio">
        <p className={styles.eyebrow} data-editorial-reveal>
          Interior Design Portfolio
        </p>
        <h1 className={styles.title} data-editorial-reveal>
          Spaces shaped by feeling.
        </h1>
        <p className={styles.dek} data-editorial-reveal>
          A curated selection of interiors, hospitality, and regenerative design work across
          Hawai&apos;i and beyond.
        </p>
      </section>

      {INTERIOR_PORTFOLIO_CHAPTERS.map((chapter, chapterIndex) => {
        const layout = CHAPTER_LAYOUT[chapter.id] ?? CHAPTER_LAYOUT.featured;

        return (
        <section
          key={chapter.id}
          className={`${chapterIndex % 2 === 0 ? styles.chapter : styles.chapterAlt} ${layout.sectionClass}`}
          aria-label={chapter.title}
        >
          <div className={styles.chapterInner}>
            <div className={styles.chapterHeader} data-editorial-reveal>
              <span className={styles.chapterIndex}>{String(chapterIndex + 1).padStart(2, '0')}</span>
              <h2 className={styles.chapterTitle}>{chapter.title}</h2>
            </div>

            <div
              className={`${styles.grid} ${
                chapter.images.length === 1 ? styles.gridSingle : ''
              } ${chapterIndex % 2 === 1 ? styles.gridStagger : ''}`}
            >
              {chapter.images.map((image, imageIndex) => (
                <figure
                  key={`${chapter.id}-${image.src}`}
                  className={styles.card}
                  data-editorial-reveal
                  data-parallax={imageIndex % 2 === 0 ? '-12' : '-8'}
                >
                  <div className={styles.imageFrame}>
                    <div className={styles.imageMat}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes={layout.imageSizes}
                        quality={92}
                        className={styles.image}
                      />
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>
        );
      })}

      <footer className={styles.footer} data-editorial-reveal>
        <p className={styles.footerEyebrow}>Work together</p>
        <Link href="/#contact" className={styles.footerLink}>
          Begin a project →
        </Link>
      </footer>
    </main>
  );
}

'use client';

import { useRef } from 'react';
import { WordSpans } from '@/components/WordSpans';
import { useScrollWordReveal } from '@/hooks/useScrollWordReveal';
import { philosophyRevealFadeZone, splitWords } from '@/utils/wordReveal';
import styles from './sections.module.css';

const INTRO_COPY =
  'We inherited a world built around separation. From the land. From one another. From ourselves. We were taught to call this progress. But beneath the noise, an older intelligence remained. A knowing rooted deep in the body. We are not here simply to build beautiful places. We are here to remember how to belong.';

const WORD_COUNT = splitWords(INTRO_COPY).length;

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useScrollWordReveal(sectionRef, contentRef, {
    fadeZone: philosophyRevealFadeZone(WORD_COUNT),
    progressOffset: 0.12,
  });

  return (
    <section
      ref={sectionRef}
      id="intro"
      className={`${styles.revealSection} ${styles.introSection}`}
      aria-label="Introduction"
    >
      <div ref={contentRef} className={styles.revealContent}>
        <p className={`${styles.revealText} ${styles.revealTextParagraph}`}>
          <WordSpans text={INTRO_COPY} startIndex={0} className={styles.wordRevealWord} />
        </p>
      </div>
    </section>
  );
}

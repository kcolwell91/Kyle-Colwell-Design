'use client';

import { type RefObject, useRef } from 'react';
import { WordSpans } from '@/components/WordSpans';
import { useScrollWordReveal } from '@/hooks/useScrollWordReveal';
import { philosophyRevealFadeZone, splitWords } from '@/utils/wordReveal';
import styles from './sections.module.css';

const HEADLINE = 'Design is a field of influence.';
const WORD_COUNT = splitWords(HEADLINE).length;

type ManifestoSectionProps = {
  sectionRef?: RefObject<HTMLElement | null>;
};

export default function ManifestoSection({ sectionRef: sectionRefProp }: ManifestoSectionProps) {
  const localSectionRef = useRef<HTMLElement>(null);
  const sectionRef = sectionRefProp ?? localSectionRef;
  const contentRef = useRef<HTMLDivElement>(null);

  useScrollWordReveal(sectionRef, contentRef, {
    fadeZone: philosophyRevealFadeZone(WORD_COUNT),
  });

  return (
    <section
      ref={sectionRef}
      className={`${styles.revealSection} ${styles.manifesto}`}
      id="what-i-do"
      aria-label="Manifesto"
    >
      <div ref={contentRef} className={styles.revealContent}>
        <h2 className={`${styles.revealText} ${styles.manifestoHeadline}`}>
          <WordSpans text={HEADLINE} startIndex={0} className={styles.wordRevealWord} />
        </h2>
      </div>
    </section>
  );
}

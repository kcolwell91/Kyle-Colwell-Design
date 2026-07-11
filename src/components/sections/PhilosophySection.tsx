'use client';

import { type RefObject, useRef } from 'react';
import { WordSpans } from '@/components/WordSpans';
import { useScrollWordReveal } from '@/hooks/useScrollWordReveal';
import { philosophyRevealFadeZone, splitWords } from '@/utils/wordReveal';
import styles from './sections.module.css';

const BODY =
  'The spaces we enter, the brands we trust, and the stories we live inside shape how we feel, relate, remember, and become. My work begins with that understanding.';

const PILLARS = [
  'Beauty is strategy.',
  'Nature is intelligence.',
  'Feeling is the metric.',
] as const;

const BODY_COUNT = splitWords(BODY).length;
const TOTAL_WORD_COUNT =
  BODY_COUNT + PILLARS.reduce((sum, pillar) => sum + splitWords(pillar).length, 0);
const PILLAR_OFFSETS = PILLARS.map((_, i) => {
  let offset = BODY_COUNT;
  for (let j = 0; j < i; j += 1) {
    offset += splitWords(PILLARS[j]).length;
  }
  return offset;
});

type PhilosophySectionProps = {
  sectionRef?: RefObject<HTMLElement | null>;
};

export default function PhilosophySection({
  sectionRef: sectionRefProp,
}: PhilosophySectionProps) {
  const localSectionRef = useRef<HTMLElement>(null);
  const localContentRef = useRef<HTMLDivElement>(null);
  const sectionRef = sectionRefProp ?? localSectionRef;
  const contentRef = localContentRef;

  useScrollWordReveal(sectionRef, contentRef, {
    fadeZone: philosophyRevealFadeZone(TOTAL_WORD_COUNT),
  });

  return (
    <section
      ref={sectionRef}
      id="who-i-am"
      className={`${styles.revealSection} ${styles.philosophySection}`}
      aria-label="Philosophy"
    >
      <div ref={contentRef} className={styles.revealContent}>
        <p className={styles.philosophyBodyReveal}>
          <WordSpans text={BODY} startIndex={0} className={styles.wordRevealWord} />
        </p>
        <ul className={styles.philosophyPillars}>
          {PILLARS.map((pillar, i) => (
            <li key={pillar} className={styles.philosophyPillar}>
              <WordSpans
                text={pillar}
                startIndex={PILLAR_OFFSETS[i]}
                className={styles.wordRevealWord}
                revealAccent="burgundy"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

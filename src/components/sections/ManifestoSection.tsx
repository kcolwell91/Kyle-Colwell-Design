'use client';

import { useRef } from 'react';
import { useCinematicSequence } from '@/hooks/useCinematicSequence';
import styles from './sections.module.css';

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useCinematicSequence({
    sectionRef,
    itemRefs: [line1Ref, line2Ref, line3Ref, bodyRef],
  });

  return (
    <section
      ref={sectionRef}
      className={`${styles.cinematicSection} pinned-section`}
      id="what-i-do"
      data-cinematic
    >
      <div className={`${styles.cinematicPin} ${styles.manifesto}`}>
        <div className={`${styles.cinematicContent} ${styles.manifestoInner}`}>
          <h2 className={styles.manifestoHeadline}>
            <span ref={line1Ref} className={`${styles.cinematicItem} ${styles.manifestoLine}`}>
              I create living worlds
            </span>
            <span ref={line2Ref} className={`${styles.cinematicItem} ${styles.manifestoLine}`}>
              for people building the future
            </span>
            <span ref={line3Ref} className={`${styles.cinematicItem} ${styles.manifestoLine}`}>
              beautifully.
            </span>
          </h2>

          <p ref={bodyRef} className={`${styles.cinematicItem} ${styles.manifestoBody}`}>
            My work sits at the intersection of regenerative design, spatial
            storytelling, brand identity, and creative direction — shaping places,
            visuals, and experiences that feel alive, intentional, and deeply
            memorable.
          </p>
        </div>
      </div>
    </section>
  );
}

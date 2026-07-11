'use client';

import { useMemo, useRef, type ReactNode } from 'react';
import { useScrollWordReveal } from '@/hooks/useScrollWordReveal';
import { useSectionEntrance } from '@/hooks/useSectionEntrance';
import { philosophyRevealFadeZone, splitWords } from '@/utils/wordReveal';
import sectionStyles from '@/components/sections/sections.module.css';
import styles from './ScrollRevealStory.module.css';

export type ScrollRevealStoryProps = {
  children: ReactNode;
  sectionId?: string;
  className?: string;
  enableEntrance?: boolean;
};

function extractText(children: ReactNode): string {
  if (typeof children === 'string') return children.trim();
  return '';
}

export default function ScrollRevealStory({
  children,
  sectionId,
  className,
  enableEntrance = true,
}: ScrollRevealStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const compositionRef = useRef<HTMLDivElement>(null);

  const text = extractText(children);
  const words = useMemo(() => splitWords(text), [text]);

  useSectionEntrance(sectionRef, enableEntrance);

  useScrollWordReveal(sectionRef, compositionRef, {
    fadeZone: philosophyRevealFadeZone(words.length),
  });

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className={[sectionStyles.revealSection, className].filter(Boolean).join(' ')}
      aria-label="Introduction"
    >
      <div ref={compositionRef} className={sectionStyles.revealContent}>
        <p className={`${sectionStyles.revealText} ${styles.paragraph}`}>
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className={sectionStyles.wordRevealWord}
              data-word-index={index}
            >
              {word}
              {index < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

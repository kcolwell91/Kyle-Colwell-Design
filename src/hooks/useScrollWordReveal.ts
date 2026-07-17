'use client';

import { type RefObject, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { HERO_SCROLL_READY_EVENT } from '@/components/ScrollTriggerManager';
import {
  applyWordReveal,
  setWordsFullyRevealed,
  WORD_REVEAL_TUNING,
  type WordRevealPalette,
} from '@/utils/wordReveal';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type ScrollWordRevealOptions = {
  palette?: WordRevealPalette;
  fadeZone?: number;
  scrollStart?: string;
  scrollEnd?: string;
  progressOffset?: number;
  /** Multiplier for scroll-linked reveal progress (e.g. 1.18 ≈ 18% faster). */
  progressScale?: number;
  onProgress?: (progress: number) => void;
};

export function useScrollWordReveal(
  sectionRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  options: ScrollWordRevealOptions = {}
) {
  const {
    palette = 'light',
    fadeZone = WORD_REVEAL_TUNING.fadeZonePhilosophy,
    scrollStart = WORD_REVEAL_TUNING.scrollStart,
    scrollEnd = WORD_REVEAL_TUNING.scrollEnd,
    progressOffset = 0,
    progressScale = 1,
    onProgress,
  } = options;

  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      if (!section || !content) return;

      const wordEls = content.querySelectorAll<HTMLElement>('[data-word-index]');
      if (wordEls.length === 0) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const updateReveal = (scrollProgress: number) => {
        const progress = Math.min(1, Math.max(0, (scrollProgress + progressOffset) * progressScale));
        applyWordReveal(wordEls, progress, fadeZone, palette);
        onProgressRef.current?.(progress);
      };

      if (reduced) {
        setWordsFullyRevealed(wordEls, palette);
        return;
      }

      // Same scroll-linked word fade on mobile and desktop.
      // (Previous mobile path used a one-shot opacity tween that often never fired
      // after hero pin refreshes, leaving the copy invisible.)
      gsap.set(content, { clearProps: 'opacity,transform' });
      updateReveal(0);

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: scrollStart,
        end: scrollEnd,
        scrub: WORD_REVEAL_TUNING.scrub,
        invalidateOnRefresh: true,
        onUpdate: (self) => updateReveal(self.progress),
        onRefresh: (self) => updateReveal(self.progress),
      });

      const onHeroReady = () => {
        ScrollTrigger.refresh();
        updateReveal(trigger.progress);
      };

      window.addEventListener(HERO_SCROLL_READY_EVENT, onHeroReady);
      updateReveal(trigger.progress);

      return () => {
        window.removeEventListener(HERO_SCROLL_READY_EVENT, onHeroReady);
      };
    },
    {
      scope: sectionRef,
      dependencies: [palette, fadeZone, scrollStart, scrollEnd, progressOffset, progressScale],
    }
  );
}

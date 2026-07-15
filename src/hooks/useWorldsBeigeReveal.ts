'use client';

import { type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { HERO_SCROLL_READY_EVENT } from '@/components/ScrollTriggerManager';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const WORLDS_BEIGE_REVEAL_TUNING = {
  start: 'top bottom',
  end: 'top 10%',
  scrub: 0.8,
  panelOffset: 0.24,
  contentStart: 0.62,
} as const;

export function useWorldsBeigeReveal(
  sectionRef: RefObject<HTMLElement | null>,
  beigeRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>
) {
  useGSAP(
    () => {
      const section = sectionRef.current;
      const beige = beigeRef.current;
      const content = contentRef.current;
      if (!section || !beige || !content) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set(beige, { y: 0 });
        gsap.set(content, { opacity: 1, y: 0 });
        return;
      }

      gsap.set(beige, {
        y: () => window.innerHeight * WORLDS_BEIGE_REVEAL_TUNING.panelOffset,
      });
      gsap.set(content, { opacity: 0, y: 28 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'worlds-beige-reveal',
          trigger: section,
          start: WORLDS_BEIGE_REVEAL_TUNING.start,
          end: WORLDS_BEIGE_REVEAL_TUNING.end,
          scrub: WORLDS_BEIGE_REVEAL_TUNING.scrub,
          invalidateOnRefresh: true,
        },
      });

      timeline.fromTo(
        beige,
        {
          y: () => window.innerHeight * WORLDS_BEIGE_REVEAL_TUNING.panelOffset,
        },
        { y: 0, ease: 'none', duration: 1 },
        0
      );

      timeline.fromTo(
        content,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, ease: 'none', duration: 0.45 },
        WORLDS_BEIGE_REVEAL_TUNING.contentStart
      );

      const onHeroReady = () => ScrollTrigger.refresh();
      window.addEventListener(HERO_SCROLL_READY_EVENT, onHeroReady);
      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener(HERO_SCROLL_READY_EVENT, onHeroReady);
      };
    },
    { scope: sectionRef, dependencies: [] }
  );
}

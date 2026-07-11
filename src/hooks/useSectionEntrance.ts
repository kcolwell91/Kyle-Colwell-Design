'use client';

import { type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { HERO_SCROLL_READY_EVENT } from '@/components/ScrollTriggerManager';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const SECTION_ENTRANCE_TUNING = {
  start: 'top 80%',
  fromY: 40,
  duration: 0.95,
  ease: 'power3.out',
} as const;

export function useSectionEntrance(
  targetRef: RefObject<HTMLElement | null>,
  enabled = true
) {
  useGSAP(
    () => {
      const el = targetRef.current;
      if (!el || !enabled) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }

      const animation = gsap.fromTo(
        el,
        { opacity: 0, y: SECTION_ENTRANCE_TUNING.fromY },
        {
          opacity: 1,
          y: 0,
          duration: SECTION_ENTRANCE_TUNING.duration,
          ease: SECTION_ENTRANCE_TUNING.ease,
          scrollTrigger: {
            trigger: el,
            start: SECTION_ENTRANCE_TUNING.start,
            once: true,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              if (self.progress > 0) {
                gsap.set(el, { opacity: 1, y: 0 });
              }
            },
          },
        }
      );

      const ensureVisibleIfPastTrigger = () => {
        const st = animation.scrollTrigger;
        if (st && st.progress > 0) {
          gsap.set(el, { opacity: 1, y: 0 });
        }
      };

      const onHeroReady = () => {
        ScrollTrigger.refresh();
        ensureVisibleIfPastTrigger();
      };

      window.addEventListener(HERO_SCROLL_READY_EVENT, onHeroReady);
      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener(HERO_SCROLL_READY_EVENT, onHeroReady);
      };
    },
    { scope: targetRef, dependencies: [enabled] }
  );
}

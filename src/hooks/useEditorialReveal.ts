'use client';

import { type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type EditorialRevealOptions = {
  y?: number;
  duration?: number;
  parallax?: number;
  start?: string;
};

export function useEditorialReveal(
  scopeRef: RefObject<HTMLElement | null>,
  selector = '[data-editorial-reveal]',
  options: EditorialRevealOptions = {}
) {
  const { y = 48, duration = 1.1, parallax = 0, start = 'top 88%' } = options;

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const items = scope.querySelectorAll<HTMLElement>(selector);
      if (items.length === 0) return;

      if (reduced) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }

      items.forEach((el) => {
        const parallaxAmount = Number(el.dataset.parallax ?? parallax);

        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start,
              once: true,
              invalidateOnRefresh: true,
            },
          }
        );

        if (parallaxAmount) {
          const target = el.querySelector('img, video') ?? el;
          gsap.to(target, {
            y: parallaxAmount,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });

      ScrollTrigger.refresh();
    },
    { scope: scopeRef, dependencies: [selector, y, duration, parallax, start] }
  );
}

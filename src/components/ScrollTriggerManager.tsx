'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const HERO_SCROLL_READY_EVENT = 'hero-scroll-ready';

function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}

function refreshAfterLayout() {
  requestAnimationFrame(() => {
    requestAnimationFrame(refreshScrollTriggers);
  });
}

export default function ScrollTriggerManager() {
  useEffect(() => {
    refreshAfterLayout();

    window.addEventListener('load', refreshAfterLayout);
    window.addEventListener('resize', refreshAfterLayout);

    const timers: number[] = [];

    const onHeroReady = () => {
      refreshAfterLayout();
      for (const ms of [100, 600, 1500]) {
        timers.push(window.setTimeout(refreshAfterLayout, ms));
      }
    };

    window.addEventListener(HERO_SCROLL_READY_EVENT, onHeroReady);

    timers.push(window.setTimeout(refreshAfterLayout, 600));

    if (document.fonts?.ready) {
      void document.fonts.ready.then(refreshAfterLayout);
    }

    return () => {
      for (const id of timers) window.clearTimeout(id);
      window.removeEventListener('load', refreshAfterLayout);
      window.removeEventListener('resize', refreshAfterLayout);
      window.removeEventListener(HERO_SCROLL_READY_EVENT, onHeroReady);
    };
  }, []);

  return null;
}

'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const HERO_SCROLL_READY_EVENT = 'hero-scroll-ready';

let refreshTimer: number | null = null;

function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}

/** Debounced refresh — avoids mid-scroll layout jumps from stacked refresh calls. */
function scheduleRefresh(delayMs = 0) {
  if (refreshTimer !== null) window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    refreshTimer = null;
    requestAnimationFrame(() => {
      requestAnimationFrame(refreshScrollTriggers);
    });
  }, delayMs);
}

export default function ScrollTriggerManager() {
  useEffect(() => {
    scheduleRefresh(0);

    const onLoad = () => scheduleRefresh(50);
    const onResize = () => scheduleRefresh(120);
    const onHeroReady = () => scheduleRefresh(80);

    window.addEventListener('load', onLoad);
    window.addEventListener('resize', onResize);
    window.addEventListener(HERO_SCROLL_READY_EVENT, onHeroReady);

    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => scheduleRefresh(60));
    }

    return () => {
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      window.removeEventListener('load', onLoad);
      window.removeEventListener('resize', onResize);
      window.removeEventListener(HERO_SCROLL_READY_EVENT, onHeroReady);
    };
  }, []);

  return null;
}

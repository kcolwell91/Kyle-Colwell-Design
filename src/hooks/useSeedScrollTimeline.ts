'use client';

import { type RefObject, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SEED_NARRATIVE_CONFIG } from '@/config/seedNarrative';
import { SEED_FRAME_COUNT } from '@/data/seedFrameSequence';
import {
  frameIndexFromProgress,
  resetSeedNarrativeState,
  seedNarrativeState,
} from '@/components/seed/seedNarrativeState';

gsap.registerPlugin(ScrollTrigger);

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function segmentT(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

function easeInOut(t: number) {
  return t * t * (3 - 2 * t);
}

function getScrubTrackVh() {
  if (typeof window === 'undefined') return SEED_NARRATIVE_CONFIG.scrubInterstitialVh;
  return window.innerWidth <= 768
    ? SEED_NARRATIVE_CONFIG.scrubInterstitialVhMobile
    : SEED_NARRATIVE_CONFIG.scrubInterstitialVh;
}

function getScrubBoundaries() {
  const breathe = SEED_NARRATIVE_CONFIG.scrubBreathePortion;
  const fadeIn = SEED_NARRATIVE_CONFIG.scrubFadeInPortion;
  const animation = SEED_NARRATIVE_CONFIG.scrubAnimationPortion;
  const hold = SEED_NARRATIVE_CONFIG.scrubHoldPortion;
  const fadeOut = SEED_NARRATIVE_CONFIG.scrubFadeOutPortion;
  return {
    fadeInStart: breathe,
    scrubStart: breathe + fadeIn,
    holdStart: breathe + fadeIn + animation,
    fadeOutStart: breathe + fadeIn + animation + hold,
    endStart: breathe + fadeIn + animation + hold + fadeOut,
  };
}

function updateScrubInterstitial(progress: number, reduced: boolean) {
  const bounds = getScrubBoundaries();
  seedNarrativeState.interstitialProgress = progress;

  if (progress < bounds.fadeInStart) {
    seedNarrativeState.phase = 'hidden';
    seedNarrativeState.shouldRender = progress > 0.02;
    seedNarrativeState.idleEnabled = false;
    seedNarrativeState.scrubAnimationProgress = 0;
    seedNarrativeState.frameIndex = 0;
    seedNarrativeState.canvasOpacity = 0;
    seedNarrativeState.seedOpacity = 0;
    return;
  }

  if (progress < bounds.scrubStart) {
    const t = easeInOut(segmentT(progress, bounds.fadeInStart, bounds.scrubStart));
    seedNarrativeState.phase = 'scrub';
    seedNarrativeState.shouldRender = true;
    seedNarrativeState.idleEnabled = false;
    seedNarrativeState.scrubAnimationProgress = t * 0.06;
    seedNarrativeState.frameIndex = frameIndexFromProgress(t * 0.06, SEED_FRAME_COUNT, reduced);
    seedNarrativeState.canvasOpacity = t;
    seedNarrativeState.seedOpacity = t;
    return;
  }

  if (progress < bounds.holdStart) {
    const animT = segmentT(progress, bounds.scrubStart, bounds.holdStart);
    seedNarrativeState.phase = 'scrub';
    seedNarrativeState.shouldRender = true;
    seedNarrativeState.idleEnabled = false;
    seedNarrativeState.scrubAnimationProgress = animT;
    seedNarrativeState.frameIndex = frameIndexFromProgress(animT, SEED_FRAME_COUNT, reduced);
    seedNarrativeState.canvasOpacity = 1;
    seedNarrativeState.seedOpacity = 1;
    return;
  }

  if (progress < bounds.fadeOutStart) {
    seedNarrativeState.phase = 'hold';
    seedNarrativeState.shouldRender = true;
    seedNarrativeState.idleEnabled = false;
    seedNarrativeState.scrubAnimationProgress = 1;
    seedNarrativeState.frameIndex = SEED_FRAME_COUNT - 1;
    seedNarrativeState.canvasOpacity = 1;
    seedNarrativeState.seedOpacity = 1;
    return;
  }

  if (progress < bounds.endStart) {
    const t = easeInOut(segmentT(progress, bounds.fadeOutStart, bounds.endStart));
    seedNarrativeState.phase = 'fadeout';
    seedNarrativeState.shouldRender = true;
    seedNarrativeState.idleEnabled = false;
    seedNarrativeState.scrubAnimationProgress = 1;
    seedNarrativeState.frameIndex = SEED_FRAME_COUNT - 1;
    seedNarrativeState.canvasOpacity = 1 - t;
    seedNarrativeState.seedOpacity = 1 - t;
    return;
  }

  seedNarrativeState.phase = progress >= 0.998 ? 'done' : 'hidden';
  seedNarrativeState.shouldRender = false;
  seedNarrativeState.idleEnabled = false;
  seedNarrativeState.scrubAnimationProgress = 1;
  seedNarrativeState.frameIndex = SEED_FRAME_COUNT - 1;
  seedNarrativeState.canvasOpacity = 0;
  seedNarrativeState.seedOpacity = 0;
}

type SeedTimelineRefs = {
  preloadRef: RefObject<HTMLElement | null>;
  philosophyRef: RefObject<HTMLElement | null>;
  scrubTrackRef: RefObject<HTMLElement | null>;
};

export function useSeedScrollTimeline({
  preloadRef,
  philosophyRef,
  scrubTrackRef,
}: SeedTimelineRefs) {
  useEffect(() => {
    const preloadEl = preloadRef.current;
    const philosophy = philosophyRef.current;
    const scrubTrack = scrubTrackRef.current;
    if (!scrubTrack) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    seedNarrativeState.reducedMotion = reduced;

    scrubTrack.style.height = `${getScrubTrackVh()}vh`;

    const triggers: ScrollTrigger[] = [];

    const preloadTrigger = ScrollTrigger.create({
      trigger: preloadEl ?? philosophy ?? scrubTrack,
      start: 'top bottom',
      once: true,
      onEnter: () => {
        seedNarrativeState.shouldLoad = true;
      },
    });
    triggers.push(preloadTrigger);

    const scrubInterstitial = ScrollTrigger.create({
      trigger: scrubTrack,
      start: 'top top',
      end: 'bottom bottom',
      scrub: SEED_NARRATIVE_CONFIG.scrubSmoothing,
      onEnter: () => {
        seedNarrativeState.shouldRender = true;
        seedNarrativeState.idleEnabled = false;
      },
      onEnterBack: () => {
        seedNarrativeState.shouldRender = true;
        seedNarrativeState.idleEnabled = false;
      },
      onLeave: () => {
        seedNarrativeState.phase = 'done';
        seedNarrativeState.shouldRender = false;
        seedNarrativeState.canvasOpacity = 0;
        seedNarrativeState.seedOpacity = 0;
        seedNarrativeState.idleEnabled = false;
      },
      onLeaveBack: () => {
        seedNarrativeState.phase = 'hidden';
        seedNarrativeState.shouldRender = false;
        seedNarrativeState.canvasOpacity = 0;
        seedNarrativeState.seedOpacity = 0;
      },
      onUpdate: (self) => {
        updateScrubInterstitial(clamp01(self.progress), reduced);
      },
    });
    triggers.push(scrubInterstitial);

    const onGlbReady = () => ScrollTrigger.refresh();
    window.addEventListener('seed-glb-ready', onGlbReady);
    window.addEventListener('seed-frames-ready', onGlbReady);

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('seed-glb-ready', onGlbReady);
      window.removeEventListener('seed-frames-ready', onGlbReady);
      triggers.forEach((trigger) => trigger.kill());
      resetSeedNarrativeState();
    };
  }, [preloadRef, philosophyRef, scrubTrackRef]);
}

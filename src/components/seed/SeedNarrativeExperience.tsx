'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import PhilosophySection from '@/components/sections/PhilosophySection';
import ManifestoSection from '@/components/sections/ManifestoSection';
import { useSeedScrollTimeline } from '@/hooks/useSeedScrollTimeline';
import { seedNarrativeState } from '@/components/seed/seedNarrativeState';
import styles from './SeedNarrativeExperience.module.css';

const SeedScrubCanvas = dynamic(() => import('@/components/seed/SeedScrubCanvas'), {
  ssr: false,
});

export default function SeedNarrativeExperience() {
  const manifestoRef = useRef<HTMLElement>(null);
  const philosophyRef = useRef<HTMLElement>(null);
  const scrubTrackRef = useRef<HTMLDivElement>(null);

  useSeedScrollTimeline({
    preloadRef: manifestoRef,
    philosophyRef,
    scrubTrackRef,
  });

  const [visual, setVisual] = useState({
    shouldLoad: false,
    shouldRender: false,
    canvasOpacity: 0,
    seedOpacity: 0,
    phase: seedNarrativeState.phase,
  });

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const needsSync =
        seedNarrativeState.shouldLoad ||
        seedNarrativeState.shouldRender ||
        seedNarrativeState.phase !== 'hidden';

      if (needsSync) {
        setVisual((prev) => {
          const next = {
            shouldLoad: seedNarrativeState.shouldLoad,
            shouldRender: seedNarrativeState.shouldRender,
            canvasOpacity: seedNarrativeState.canvasOpacity,
            seedOpacity: seedNarrativeState.seedOpacity,
            phase: seedNarrativeState.phase,
          };
          if (
            prev.shouldLoad === next.shouldLoad &&
            prev.shouldRender === next.shouldRender &&
            prev.phase === next.phase &&
            Math.abs(prev.canvasOpacity - next.canvasOpacity) < 0.002 &&
            Math.abs(prev.seedOpacity - next.seedOpacity) < 0.002
          ) {
            return prev;
          }
          return next;
        });
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const combinedOpacity = visual.canvasOpacity * visual.seedOpacity;

  return (
    <>
      {visual.shouldRender ? (
        <Suspense fallback={null}>
          <SeedScrubCanvas
            shouldRender={visual.shouldRender}
            combinedOpacity={combinedOpacity}
          />
        </Suspense>
      ) : null}

      <ManifestoSection sectionRef={manifestoRef} />

      <PhilosophySection sectionRef={philosophyRef} />

      <div
        ref={scrubTrackRef}
        className={styles.scrubInterstitial}
        data-seed-interstitial="scrub"
        aria-hidden="true"
      />
    </>
  );
}

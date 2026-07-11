'use client';

import { Suspense, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SEED_NARRATIVE_CONFIG } from '@/config/seedNarrative';
import { SEED_ORBIT_CONFIG } from '@/config/seedOrbit';
import styles from './SeedStaticDivider.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SeedOrbitCanvas = dynamic(() => import('@/components/seed/SeedOrbitCanvas'), {
  ssr: false,
});

const SEED_SCALE = 2.2;

function getOrbitTrackVh() {
  if (typeof window === 'undefined') return SEED_ORBIT_CONFIG.orbitTrackVh;
  return window.innerWidth <= 768
    ? SEED_ORBIT_CONFIG.orbitTrackVhMobile
    : SEED_ORBIT_CONFIG.orbitTrackVh;
}

export default function SeedStaticDivider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [orbitProgress, setOrbitProgress] = useState(0);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      track.style.height = `${getOrbitTrackVh()}vh`;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        setOrbitProgress(0);
        return;
      }

      const trigger = ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        scrub: SEED_ORBIT_CONFIG.scrollScrub,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setOrbitProgress(self.progress);
        },
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: trackRef }
  );

  const baseHeight = SEED_NARRATIVE_CONFIG.modelViewportHeightIdle * SEED_SCALE;

  return (
    <div className={styles.divider} aria-hidden="true">
      <div ref={trackRef} className={styles.orbitTrack}>
        <div
          className={styles.orbitSticky}
          style={{ ['--seed-static-height' as string]: `${baseHeight * 100}vh` }}
        >
          <div className={styles.orbitViewport}>
            <Suspense fallback={null}>
              <SeedOrbitCanvas orbitProgress={orbitProgress} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

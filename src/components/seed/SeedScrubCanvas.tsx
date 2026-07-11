'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { SEED_NARRATIVE_CONFIG } from '@/config/seedNarrative';
import { SEED_ORBIT_CONFIG } from '@/config/seedOrbit';
import { SEED_FRAME_COUNT } from '@/data/seedFrameSequence';
import { seedNarrativeState } from '@/components/seed/seedNarrativeState';
import type { SeedGlbBounds } from '@/components/seed/SeedGlbModel';
import { SeedScrubCamera, SeedScrubModel } from '@/components/seed/SeedOrbitModel';
import SeedStageLighting from '@/components/seed/SeedStageLighting';
import { enableSeedRendererShading } from '@/components/seed/seedMaterials';
import styles from './SeedNarrativeExperience.module.css';

type SeedScrubCanvasProps = {
  shouldRender: boolean;
  combinedOpacity: number;
};

function animationProgressFromState() {
  const { scrubAnimationProgress, frameIndex, reducedMotion } = seedNarrativeState;
  if (reducedMotion) {
    return frameIndex >= SEED_FRAME_COUNT - 1 ? 1 : 0;
  }
  return scrubAnimationProgress;
}

function SeedScrubScene({ animationProgress }: { animationProgress: number }) {
  const [bounds, setBounds] = useState<SeedGlbBounds | null>(null);
  const progressRef = useRef(animationProgress);
  progressRef.current = animationProgress;

  const handleBoundsReady = useCallback((next: SeedGlbBounds) => {
    setBounds(next);
  }, []);

  return (
    <>
      <SeedScrubCamera bounds={bounds} />
      <SeedStageLighting />
      <Suspense fallback={null}>
        <SeedScrubModel
          animationProgress={animationProgress}
          onBoundsReady={handleBoundsReady}
        />
      </Suspense>
    </>
  );
}

export default function SeedScrubCanvas({ shouldRender, combinedOpacity }: SeedScrubCanvasProps) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!shouldRender) return;

    let raf = 0;
    const tick = () => {
      if (!shouldRender) return;

      setAnimationProgress((prev) => {
        const next = animationProgressFromState();
        return Math.abs(prev - next) < 0.001 ? prev : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shouldRender]);

  useEffect(() => {
    const onReady = () => setIsReady(true);
    if (seedNarrativeState.shouldLoad) setIsReady(true);
    window.addEventListener('seed-glb-ready', onReady);
    return () => window.removeEventListener('seed-glb-ready', onReady);
  }, []);

  const visible = shouldRender && combinedOpacity > 0.001 && isReady;

  if (!shouldRender) return null;

  return (
    <div
      className={styles.canvasShell}
      style={{
        opacity: combinedOpacity,
        visibility: visible ? 'visible' : 'hidden',
        ['--seed-model-height' as string]: `${SEED_NARRATIVE_CONFIG.modelViewportHeightScrub * 50}vh`,
      }}
      aria-hidden="true"
    >
      <div className={styles.canvasStage}>
        <div className={styles.orbitCanvasWrap}>
          <Canvas
            frameloop={visible ? 'always' : 'demand'}
            className={styles.glbCanvas}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
            camera={{
              fov: SEED_ORBIT_CONFIG.cameraFov,
              near: 0.05,
              far: 200,
              position: [0, 0, 6],
            }}
            onCreated={({ gl }) => {
              gl.setClearColor(0x000000, 0);
              enableSeedRendererShading(gl);
            }}
          >
            <SeedScrubScene animationProgress={animationProgress} />
          </Canvas>
        </div>
      </div>
    </div>
  );
}

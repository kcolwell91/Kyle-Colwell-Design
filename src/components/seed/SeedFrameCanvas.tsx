'use client';

import { useEffect, useRef, useState } from 'react';
import { SEED_NARRATIVE_CONFIG } from '@/config/seedNarrative';
import {
  SEED_FRAME_COUNT,
  SEED_FRAME_NUMBERS,
  seedFrameUrl,
} from '@/data/seedFrameSequence';
import {
  type SeedPhase,
  seedNarrativeState,
} from '@/components/seed/seedNarrativeState';
import styles from './SeedNarrativeExperience.module.css';

type SeedFrameCanvasProps = {
  shouldRender: boolean;
  combinedOpacity: number;
  phase: SeedPhase;
};

function isScrubPhase(phase: SeedPhase) {
  return phase === 'scrub' || phase === 'hold' || phase === 'fadeout';
}

export default function SeedFrameCanvas({
  shouldRender,
  combinedOpacity,
  phase,
}: SeedFrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const drawnIndexRef = useRef(-1);
  const idlePhaseRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [innerTransform, setInnerTransform] = useState('');

  useEffect(() => {
    if (!seedNarrativeState.shouldLoad) return;

    let cancelled = false;
    const images: HTMLImageElement[] = new Array(SEED_FRAME_COUNT);
    let loaded = 0;

    const onDone = () => {
      if (cancelled) return;
      loaded += 1;
      if (loaded >= SEED_FRAME_COUNT) {
        imagesRef.current = images;
        seedNarrativeState.framesReady = true;
        setIsLoading(false);
        window.dispatchEvent(new CustomEvent('seed-frames-ready'));
      }
    };

    SEED_FRAME_NUMBERS.forEach((frameNumber, index) => {
      const img = new Image();
      img.onload = onDone;
      img.onerror = onDone;
      img.src = seedFrameUrl(frameNumber);
      images[index] = img;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let raf = 0;

    const drawFrame = (index: number) => {
      const canvas = canvasRef.current;
      const images = imagesRef.current;
      if (!canvas || !images.length) return;

      const img = images[index];
      if (!img?.complete || img.naturalWidth === 0) return;
      if (drawnIndexRef.current === index) return;

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;

      drawnIndexRef.current = index;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, 0, 0, cw, ch);
    };

    const tick = () => {
      const state = seedNarrativeState;
      drawFrame(state.frameIndex);

      if (state.idleEnabled && state.phase === 'idle' && !state.reducedMotion) {
        idlePhaseRef.current += 0.016;
        const holdStart = SEED_NARRATIVE_CONFIG.idleBreathePortion + SEED_NARRATIVE_CONFIG.idleFadeInPortion;
        const holdEnd =
          holdStart + SEED_NARRATIVE_CONFIG.idleHoldPortion;
        const holdT = Math.min(
          1,
          Math.max(0, (state.interstitialProgress - holdStart) / (holdEnd - holdStart))
        );
        const rot = (SEED_NARRATIVE_CONFIG.idleRotationDeg * holdT).toFixed(3);
        const float = Math.sin(idlePhaseRef.current * 0.85) * SEED_NARRATIVE_CONFIG.idleFloatPx;
        const breath =
          1 + Math.sin(idlePhaseRef.current * 0.65) * SEED_NARRATIVE_CONFIG.idleBreathScale;
        setInnerTransform(
          `translate3d(0, ${float.toFixed(2)}px, 0) rotate(${rot}deg) scale(${breath.toFixed(4)})`
        );
      } else {
        setInnerTransform('translate3d(0, 0, 0) rotate(0deg) scale(1)');
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const visible = shouldRender && combinedOpacity > 0.001 && !isLoading;
  const modelHeight = isScrubPhase(phase)
    ? SEED_NARRATIVE_CONFIG.modelViewportHeightScrub
    : SEED_NARRATIVE_CONFIG.modelViewportHeightIdle;

  return (
    <div
      className={styles.canvasShell}
      style={{
        opacity: combinedOpacity,
        visibility: visible ? 'visible' : 'hidden',
        ['--seed-model-height' as string]: `${modelHeight * 100}vh`,
      }}
      aria-hidden="true"
    >
      <div className={styles.canvasStage}>
        <div className={styles.canvasInner} style={{ transform: innerTransform }}>
          <canvas
            ref={canvasRef}
            className={styles.frameCanvas}
            width={900}
            height={900}
          />
        </div>
      </div>
    </div>
  );
}

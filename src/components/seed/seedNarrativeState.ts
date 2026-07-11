export type SeedPhase = 'hidden' | 'idle' | 'scrub' | 'hold' | 'fadeout' | 'done';

export type SeedNarrativeState = {
  phase: SeedPhase;
  shouldLoad: boolean;
  shouldRender: boolean;
  canvasOpacity: number;
  seedOpacity: number;
  interstitialProgress: number;
  scrubAnimationProgress: number;
  frameIndex: number;
  idleEnabled: boolean;
  reducedMotion: boolean;
  framesReady: boolean;
};

export const seedNarrativeState: SeedNarrativeState = {
  phase: 'hidden',
  shouldLoad: false,
  shouldRender: false,
  canvasOpacity: 0,
  seedOpacity: 0,
  interstitialProgress: 0,
  scrubAnimationProgress: 0,
  frameIndex: 0,
  idleEnabled: false,
  reducedMotion: false,
  framesReady: false,
};

export function resetSeedNarrativeState() {
  seedNarrativeState.phase = 'hidden';
  seedNarrativeState.shouldLoad = false;
  seedNarrativeState.shouldRender = false;
  seedNarrativeState.canvasOpacity = 0;
  seedNarrativeState.seedOpacity = 0;
  seedNarrativeState.interstitialProgress = 0;
  seedNarrativeState.scrubAnimationProgress = 0;
  seedNarrativeState.frameIndex = 0;
  seedNarrativeState.idleEnabled = false;
  seedNarrativeState.framesReady = false;
}

export function frameIndexFromProgress(progress: number, frameCount: number, reduced: boolean) {
  if (frameCount <= 1) return 0;
  const clamped = Math.min(1, Math.max(0, progress));
  if (reduced) {
    return clamped > 0.55 ? frameCount - 1 : 0;
  }
  return Math.round(clamped * (frameCount - 1));
}

/** Re-export from scripts/blender/export_sanctuary_seed.py using sanctuary-prototype-v02-animation.blend */
export { SEED_GLB_PATH, SEED_BLEND_SOURCE } from '@/config/seedModel';

export const SEED_ORBIT_CONFIG = {
  /** Horizontal orbit radius — scaled from model bounds when loaded. */
  radiusMultiplier: 1.62,
  /** Fixed camera distance for blossom scroll scrub. */
  scrubRadiusMultiplier: 1.85,
  /** Camera field of view — lower feels more cinematic. */
  cameraFov: 32,
  /** Subtle vertical camera drift amplitude (world units). */
  verticalDriftAmplitude: 0.05,
  /** Speed of vertical drift oscillation. */
  verticalDriftSpeed: 0.25,
  /** Full revolutions per orbit pass (1 = single 360°). */
  orbitRevolutions: 1,
  /** Scroll range where the single orbit occurs (0–1 of track). */
  orbitSpinStart: 0.12,
  orbitSpinEnd: 0.88,
  /** ScrollTrigger scrub smoothing for orbit progress. */
  scrollScrub: 0.85,
  /** Damping when syncing scroll progress to camera (0–1, higher = smoother). */
  progressDamping: 0.08,
  /** Tall scroll track for one slow 360° orbit (~35s feel at moderate scroll). */
  orbitTrackVh: 320,
  orbitTrackVhMobile: 260,
} as const;

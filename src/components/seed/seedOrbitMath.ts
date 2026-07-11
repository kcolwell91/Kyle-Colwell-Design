import { SEED_ORBIT_CONFIG } from '@/config/seedOrbit';

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** Maps scroll progress to a single 0→1 orbit (one revolution only). */
export function scrollProgressToOrbit(scrollProgress: number) {
  const start = SEED_ORBIT_CONFIG.orbitSpinStart;
  const end = SEED_ORBIT_CONFIG.orbitSpinEnd;
  if (scrollProgress <= start) return 0;
  if (scrollProgress >= end) return 1;
  return clamp01((scrollProgress - start) / (end - start));
}

export function orbitAngleFromProgress(orbitProgress: number) {
  return scrollProgressToOrbit(orbitProgress) * Math.PI * 2 * SEED_ORBIT_CONFIG.orbitRevolutions;
}

'use client';

import { useCallback, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { orbitAngleFromProgress } from '@/components/seed/seedOrbitMath';
import SeedGlbModel, { type SeedGlbBounds } from '@/components/seed/SeedGlbModel';
import { SEED_ORBIT_CONFIG } from '@/config/seedOrbit';

type SeedOrbitCameraProps = {
  bounds: SeedGlbBounds | null;
  orbitProgress: number;
  smoothedProgressRef: MutableRefObject<number>;
};

export default function SeedOrbitCamera({
  bounds,
  orbitProgress,
  smoothedProgressRef,
}: SeedOrbitCameraProps) {
  const { camera } = useThree();
  const driftTimeRef = useRef(0);
  const lookTargetRef = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!bounds) return;

    const damping = SEED_ORBIT_CONFIG.progressDamping;
    smoothedProgressRef.current +=
      (orbitProgress - smoothedProgressRef.current) * Math.min(1, damping + delta * 2);

    driftTimeRef.current += delta;
    const angle = orbitAngleFromProgress(smoothedProgressRef.current);
    const radius = bounds.radius * SEED_ORBIT_CONFIG.radiusMultiplier;

    camera.position.x = bounds.center.x + Math.sin(angle) * radius;
    camera.position.z = bounds.center.z + Math.cos(angle) * radius;
    camera.position.y =
      bounds.center.y +
      Math.sin(driftTimeRef.current * SEED_ORBIT_CONFIG.verticalDriftSpeed) *
        SEED_ORBIT_CONFIG.verticalDriftAmplitude;

    lookTargetRef.current.copy(bounds.center);
    camera.lookAt(lookTargetRef.current);
  });

  return null;
}

type SeedOrbitModelProps = {
  onBoundsReady: (bounds: SeedGlbBounds) => void;
};

export function SeedOrbitModel({ onBoundsReady }: SeedOrbitModelProps) {
  return <SeedGlbModel animationProgress={0} onBoundsReady={onBoundsReady} />;
}

export function SeedScrubCamera({ bounds }: { bounds: SeedGlbBounds | null }) {
  const { camera } = useThree();

  useFrame(() => {
    if (!bounds) return;

    const radius = bounds.radius * SEED_ORBIT_CONFIG.scrubRadiusMultiplier;
    camera.position.set(0, bounds.radius * 0.08, radius);
    camera.lookAt(bounds.center);
  });

  return null;
}

export function SeedScrubModel({
  animationProgress,
  onBoundsReady,
}: {
  animationProgress: number;
  onBoundsReady: (bounds: SeedGlbBounds) => void;
}) {
  const handleBounds = useCallback(
    (bounds: SeedGlbBounds) => {
      onBoundsReady(bounds);
    },
    [onBoundsReady]
  );

  return <SeedGlbModel animationProgress={animationProgress} onBoundsReady={handleBounds} />;
}

'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { SEED_GLB_PATH } from '@/config/seedModel';
import { applyOrganicSeedMaterials } from '@/components/seed/seedMaterials';

useGLTF.preload(SEED_GLB_PATH);

export type SeedGlbBounds = {
  center: THREE.Vector3;
  radius: number;
  clipDuration: number;
  minY: number;
  groundY: number;
};

type SeedGlbModelProps = {
  animationProgress: number;
  onBoundsReady?: (bounds: SeedGlbBounds) => void;
};

function pickAnimationClip(clips: THREE.AnimationClip[]) {
  const actionClip = clips.find((clip) => /action/i.test(clip.name));
  if (actionClip) return actionClip;
  return clips.reduce(
    (longest, clip) => (clip.duration > longest.duration ? clip : longest),
    clips[0]
  );
}

export default function SeedGlbModel({ animationProgress, onBoundsReady }: SeedGlbModelProps) {
  const { scene, animations } = useGLTF(SEED_GLB_PATH);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);
  const boundsSentRef = useRef(false);
  const progressRef = useRef(animationProgress);

  progressRef.current = animationProgress;

  const { model, bounds, clip } = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const minY = box.min.y - center.y;

    cloned.position.sub(center);
    cloned.position.y -= minY;

    applyOrganicSeedMaterials(cloned);

    const animationClip = animations.length ? pickAnimationClip(animations) : null;

    return {
      model: cloned,
      clip: animationClip,
      bounds: {
        center: new THREE.Vector3(0, size.y * 0.5, 0),
        radius: maxDim,
        clipDuration: animationClip?.duration ?? 1,
        minY: 0,
        groundY: 0,
      } satisfies SeedGlbBounds,
    };
  }, [animations, scene]);

  useEffect(() => {
    if (!boundsSentRef.current && onBoundsReady) {
      boundsSentRef.current = true;
      onBoundsReady(bounds);
      window.dispatchEvent(new CustomEvent('seed-glb-ready'));
    }
  }, [bounds, onBoundsReady]);

  useEffect(() => {
    if (!clip) return;

    const mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(clip);
    action.play();
    action.paused = true;
    action.time = 0;
    mixerRef.current = mixer;
    actionRef.current = action;

    return () => {
      mixer.stopAllAction();
      mixerRef.current = null;
      actionRef.current = null;
    };
  }, [clip, model]);

  useFrame(() => {
    const action = actionRef.current;
    const mixer = mixerRef.current;
    if (!action || !mixer) return;

    const duration = action.getClip().duration;
    const clamped = Math.min(1, Math.max(0, progressRef.current));
    action.time = clamped * duration;
    mixer.update(0);
  });

  return <primitive object={model} />;
}

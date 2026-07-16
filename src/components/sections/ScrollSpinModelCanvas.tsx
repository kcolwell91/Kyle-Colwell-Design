'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATH = '/models/closing-scroll-sculpture.glb';
const MODEL_SIZE = 2.527;
const ROTATIONS = 0.5;

type ScrollSpinModelCanvasProps = {
  progressRef: MutableRefObject<number>;
  isActive: boolean;
  onInvalidateReady: (invalidate: () => void) => void;
  onModelReady: () => void;
};

function ScrollSpinModel({
  progressRef,
  onModelReady,
}: Pick<ScrollSpinModelCanvasProps, 'progressRef' | 'onModelReady'>) {
  const spinRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  const model = useMemo(() => scene.clone(true), [scene]);
  const placement = useMemo(() => {
    model.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(model);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const longestSide = Math.max(size.x, size.y, size.z) || 1;
    const scale = MODEL_SIZE / longestSide;

    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = false;
      child.receiveShadow = false;
    });

    return {
      scale,
      position: [-center.x * scale, -center.y * scale, -center.z * scale] as [
        number,
        number,
        number,
      ],
    };
  }, [model]);

  useEffect(() => {
    onModelReady();
  }, [onModelReady]);

  useFrame(() => {
    const group = spinRef.current;
    if (!group) return;

    const progress = progressRef.current;
    group.rotation.y = -Math.PI * 0.16 + progress * Math.PI * 2 * ROTATIONS;
    group.rotation.x = 0.08 + Math.sin(progress * Math.PI) * 0.06;
    group.scale.setScalar(0.9 + progress * 0.1);
  });

  return (
    <group ref={spinRef}>
      <primitive
        object={model}
        scale={placement.scale}
        position={placement.position}
      />
    </group>
  );
}

export default function ScrollSpinModelCanvas({
  progressRef,
  isActive,
  onInvalidateReady,
  onModelReady,
}: ScrollSpinModelCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={isActive ? 'always' : 'demand'}
      camera={{ fov: 30, near: 0.05, far: 100, position: [0, 0, 5.6] }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor(0x000000, 0);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        onInvalidateReady(invalidate);
        invalidate();
      }}
    >
      <ambientLight intensity={0.85} color="#f8f3ec" />
      <hemisphereLight args={['#fffaf4', '#8a7358', 1.25]} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} color="#fff7eb" />
      <directionalLight position={[-4, 2, -4]} intensity={1.1} color="#d7c5b5" />

      <Suspense fallback={null}>
        <ScrollSpinModel progressRef={progressRef} onModelReady={onModelReady} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(MODEL_PATH);

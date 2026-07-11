'use client';

import { Suspense, useCallback, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { SEED_ORBIT_CONFIG } from '@/config/seedOrbit';
import SeedOrbitCamera, {
  SeedOrbitModel,
} from '@/components/seed/SeedOrbitModel';
import SeedStageLighting from '@/components/seed/SeedStageLighting';
import { enableSeedRendererShading } from '@/components/seed/seedMaterials';
import type { SeedGlbBounds } from '@/components/seed/SeedGlbModel';
import styles from './SeedOrbitCanvas.module.css';

type SeedOrbitCanvasProps = {
  orbitProgress: number;
  className?: string;
};

function SeedOrbitScene({
  orbitProgress,
  smoothedProgressRef,
}: {
  orbitProgress: number;
  smoothedProgressRef: React.MutableRefObject<number>;
}) {
  const [bounds, setBounds] = useState<SeedGlbBounds | null>(null);

  const handleBoundsReady = useCallback((next: SeedGlbBounds) => {
    setBounds(next);
  }, []);

  return (
    <>
      <SeedOrbitCamera
        bounds={bounds}
        orbitProgress={orbitProgress}
        smoothedProgressRef={smoothedProgressRef}
      />
      <SeedStageLighting />
      <Suspense fallback={null}>
        <SeedOrbitModel onBoundsReady={handleBoundsReady} />
      </Suspense>
    </>
  );
}

export default function SeedOrbitCanvas({ orbitProgress, className }: SeedOrbitCanvasProps) {
  const smoothedProgressRef = useRef(orbitProgress);

  return (
    <div className={`${styles.shell} ${className ?? ''}`}>
      <Canvas
        className={styles.canvas}
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
        <SeedOrbitScene
          orbitProgress={orbitProgress}
          smoothedProgressRef={smoothedProgressRef}
        />
      </Canvas>
    </div>
  );
}

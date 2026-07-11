'use client';

/** Minimal studio lighting for the seed GLB. */
export default function SeedStageLighting() {
  return (
    <>
      <ambientLight intensity={0.45} color="#f5f0e8" />
      <directionalLight position={[4, 6, 5]} intensity={1.2} color="#fff8ee" />
      <directionalLight position={[-4, 3, -3]} intensity={0.35} color="#e5dbd0" />
    </>
  );
}

import * as THREE from 'three';

/** Uniform organic seed surface — warm lotus pod tan. */
export const SEED_SURFACE_COLOR = new THREE.Color('#C9A882');

export function applyOrganicSeedMaterials(object: THREE.Object3D) {
  const material = new THREE.MeshStandardMaterial({
    color: SEED_SURFACE_COLOR,
    roughness: 0.6,
    metalness: 0,
  });

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const name = child.name.toLowerCase();
    if (!name.includes('petal') && !name.includes('core')) return;

    child.material = material;
  });
}

export function enableSeedRendererShading(gl: THREE.WebGLRenderer) {
  gl.outputColorSpace = THREE.SRGBColorSpace;
}

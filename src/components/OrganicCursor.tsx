'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MINIMAL_HOME_PATH } from '@/config/siteRoutes';
import styles from './OrganicCursor.module.css';

const RING_LERP = 0.14;
const HOVER_LERP = 0.12;
const LABEL_LERP = 0.16;
const RING_DEFAULT = 32;
const RING_HOVER = 48;
const SEED_SIZE = 8;
const SEED_HOVER = 6;

type HoverMode = 'default' | 'interactive' | 'enter';

function canUseOrganicCursor() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return false;
  return true;
}

function resolveHoverMode(target: EventTarget | null): HoverMode {
  if (!(target instanceof Element)) return 'default';
  if (target.closest('[data-cursor="enter"]')) return 'enter';
  if (
    target.closest(
      'a, button, [role="button"], input, textarea, select, summary, [tabindex]:not([tabindex="-1"])'
    )
  ) {
    return 'interactive';
  }
  return 'default';
}

function hoverTargets(mode: HoverMode) {
  const isHover = mode === 'interactive' || mode === 'enter';
  return {
    ring: isHover ? RING_HOVER : RING_DEFAULT,
    seed: isHover ? SEED_HOVER : SEED_SIZE,
    label: mode === 'enter' ? 'ENTER' : '',
    labelOpacity: mode === 'enter' ? 1 : 0,
  };
}

export default function OrganicCursor() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const seedRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const pointer = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const anim = useRef({
    ringSize: RING_DEFAULT,
    seedSize: SEED_SIZE,
    labelOpacity: 0,
  });
  const targets = useRef({
    ringSize: RING_DEFAULT,
    seedSize: SEED_SIZE,
    label: '',
    labelOpacity: 0,
  });
  const visible = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (pathname === MINIMAL_HOME_PATH) return;
    if (!canUseOrganicCursor()) return;

    const root = rootRef.current;
    const seed = seedRef.current;
    const ringEl = ringRef.current;
    const label = labelRef.current;
    if (!root || !seed || !ringEl || !label) return;

    document.documentElement.classList.add('organic-cursor-active');

    const applyHoverMode = (mode: HoverMode) => {
      const next = hoverTargets(mode);
      targets.current.ringSize = next.ring;
      targets.current.seedSize = next.seed;
      targets.current.label = next.label;
      targets.current.labelOpacity = next.labelOpacity;
      root.classList.toggle(
        styles.isInteractive,
        mode === 'interactive' || mode === 'enter'
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX;
      pointer.current.y = event.clientY;

      if (!visible.current) {
        visible.current = true;
        ring.current.x = event.clientX;
        ring.current.y = event.clientY;
        root.classList.add(styles.isVisible);
      }
    };

    const onPointerOver = (event: PointerEvent) => {
      applyHoverMode(resolveHoverMode(event.target));
    };

    const onPointerLeave = () => {
      visible.current = false;
      root.classList.remove(styles.isVisible);
    };

    const onMediaChange = () => {
      if (!canUseOrganicCursor()) {
        document.documentElement.classList.remove('organic-cursor-active');
        root.classList.remove(styles.isVisible);
      }
    };

    const tick = () => {
      anim.current.ringSize +=
        (targets.current.ringSize - anim.current.ringSize) * HOVER_LERP;
      anim.current.seedSize +=
        (targets.current.seedSize - anim.current.seedSize) * HOVER_LERP;
      anim.current.labelOpacity +=
        (targets.current.labelOpacity - anim.current.labelOpacity) * LABEL_LERP;

      ring.current.x += (pointer.current.x - ring.current.x) * RING_LERP;
      ring.current.y += (pointer.current.y - ring.current.y) * RING_LERP;

      const seedScale = anim.current.seedSize / SEED_SIZE;
      seed.style.width = `${SEED_SIZE}px`;
      seed.style.height = `${SEED_SIZE}px`;
      seed.style.transform = `translate3d(${pointer.current.x}px, ${pointer.current.y}px, 0) translate(-50%, -50%) scale(${seedScale})`;

      const ringSize = anim.current.ringSize;
      ringEl.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      ringEl.style.width = `${ringSize}px`;
      ringEl.style.height = `${ringSize}px`;

      if (label.textContent !== targets.current.label) {
        label.textContent = targets.current.label;
      }
      label.style.opacity = String(anim.current.labelOpacity);

      rafId.current = requestAnimationFrame(tick);
    };

    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    pointerQuery.addEventListener('change', onMediaChange);

    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove('organic-cursor-active');
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      pointerQuery.removeEventListener('change', onMediaChange);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [pathname]);

  if (pathname === MINIMAL_HOME_PATH) return null;

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div ref={ringRef} className={styles.ringWrap}>
        <svg
          className={styles.ringSvg}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M32 3.5C46.8 4.2 59.8 15.6 60.5 30.2C61.2 44.8 50.2 58.2 35.8 60.1C21.4 62 7.8 52.4 4.8 38.2C1.8 24 11.2 9.8 25.4 5.2C28.1 4.3 30.2 3.6 32 3.5Z"
            stroke="currentColor"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span ref={labelRef} className={styles.label} />
      </div>
      <span ref={seedRef} className={styles.seed} />
    </div>
  );
}

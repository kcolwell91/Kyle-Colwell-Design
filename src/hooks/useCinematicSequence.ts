'use client';

import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HIDDEN = { opacity: 0, y: 24, filter: 'blur(4px)' };
const VISIBLE = { opacity: 1, y: 0, filter: 'blur(0px)' };

const FADE_IN_END = 0.28;
const READ_HOLD_END = 0.78;
const FADE_OUT_END = 1;

function getElements(refs: RefObject<HTMLElement | null>[]) {
  return refs.map((r) => r.current).filter(Boolean) as HTMLElement[];
}

export function sectionScrollEnd(section: HTMLElement) {
  return `+=${section.offsetHeight * 1.75}`;
}

function buildPinnedSequence(
  elements: HTMLElement[],
  options: { fadeOutLast?: boolean } = {}
) {
  const { fadeOutLast = true } = options;
  const tl = gsap.timeline();
  const count = elements.length;
  if (count === 0) return tl;

  const inDur = (FADE_IN_END / count) * 0.88;

  elements.forEach((el, i) => {
    tl.fromTo(
      el,
      HIDDEN,
      { ...VISIBLE, duration: inDur, ease: 'power3.out' },
      (i / count) * FADE_IN_END
    );
  });

  if (fadeOutLast) {
    const last = elements[count - 1];
    const exitDur = FADE_OUT_END - READ_HOLD_END;
    tl.fromTo(
      last,
      VISIBLE,
      { ...HIDDEN, duration: exitDur, ease: 'power2.in' },
      READ_HOLD_END
    );
  }

  return tl;
}

function createSectionPin(section: HTMLElement, animation?: gsap.core.Animation) {
  return ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => sectionScrollEnd(section),
    pin: true,
    pinSpacing: true,
    scrub: animation ? 0.85 : undefined,
    anticipatePin: 1,
    animation,
  });
}

/** Pin all `.pinned-section` elements (pin-only, no text animation). */
export function initPinnedSections(root: HTMLElement | Document = document) {
  const sections = gsap.utils.toArray<HTMLElement>('.pinned-section', root);

  return sections
    .filter((section) => section.id !== 'hero' && !section.dataset.cinematic)
    .map((section) => createSectionPin(section));
}

/**
 * Pin section + stagger text animation; holds until last line fades out.
 */
export function useCinematicSequence({
  sectionRef,
  itemRefs,
  fadeOutLast = true,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  itemRefs: RefObject<HTMLElement | null>[];
  fadeOutLast?: boolean;
}) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = getElements(itemRefs);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      gsap.set(elements, VISIBLE);
      return;
    }

    gsap.set(elements, HIDDEN);

    const ctx = gsap.context(() => {
      const tl = buildPinnedSequence(elements, { fadeOutLast });
      createSectionPin(section, tl);
      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useCinematicPanels({
  panels,
  fadeOutLast = true,
}: {
  panels: {
    sectionRef: RefObject<HTMLElement | null>;
    itemRefs: RefObject<HTMLElement | null>[];
  }[];
  fadeOutLast?: boolean;
}) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      panels.forEach(({ sectionRef, itemRefs }) => {
        const section = sectionRef.current;
        const elements = getElements(itemRefs);
        if (!section || elements.length === 0) return;

        if (reduced) {
          gsap.set(elements, VISIBLE);
          return;
        }

        gsap.set(elements, HIDDEN);
        const tl = buildPinnedSequence(elements, { fadeOutLast });
        createSectionPin(section, tl);
      });
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

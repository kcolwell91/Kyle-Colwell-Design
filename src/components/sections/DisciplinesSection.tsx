'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCinematicSequence, sectionScrollEnd } from '@/hooks/useCinematicSequence';
import LotusWatermark from '@/components/sections/LotusWatermark';
import styles from './sections.module.css';

gsap.registerPlugin(ScrollTrigger);

const DISCIPLINES = [
  {
    label: 'Spaces',
    text: 'Interiors, retreat concepts, hospitality environments, and regenerative design visions.',
    id: 'story-spaces',
  },
  {
    label: 'Brands',
    text: 'Visual worlds, creative direction, storytelling, and identity systems.',
    id: 'story-brands',
  },
  {
    label: 'Experiences',
    text: 'Immersive environments, rituals, retreats, launches, and emotionally resonant journeys.',
    id: 'story-experiences',
  },
] as const;

export default function DisciplinesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lotusRef = useRef<SVGSVGElement>(null);

  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);

  useCinematicSequence({
    sectionRef,
    itemRefs: [col1Ref, col2Ref, col3Ref],
  });

  useEffect(() => {
    const section = sectionRef.current;
    const lotus = lotusRef.current;
    if (!section || !lotus) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const petals = lotus.querySelectorAll<SVGGElement>('[data-petal]');
    const core = lotus.querySelector<SVGCircleElement>('[data-core]');

    if (reduced) {
      gsap.set(petals, { scale: 1, opacity: 0.12 });
      if (core) gsap.set(core, { scale: 1, opacity: 0.2 });
      return;
    }

    gsap.set(petals, { scale: 0.35, opacity: 0.06, svgOrigin: '100 100' });
    if (core) gsap.set(core, { scale: 0.5, opacity: 0.08, svgOrigin: '100 100' });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => sectionScrollEnd(section),
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          petals.forEach((petal, i) => {
            const delay = i * 0.035;
            const t = gsap.utils.clamp(0, 1, (p - delay) / (1 - delay * 2));
            gsap.set(petal, {
              scale: 0.35 + t * 0.72,
              opacity: 0.06 + t * 0.14,
              svgOrigin: '100 100',
            });
          });
          if (core) {
            gsap.set(core, {
              scale: 0.5 + p * 0.55,
              opacity: 0.08 + p * 0.18,
              svgOrigin: '100 100',
            });
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const colRefs = [col1Ref, col2Ref, col3Ref];

  return (
    <section
      ref={sectionRef}
      className={`${styles.cinematicSection} pinned-section`}
      id="disciplines"
      data-cinematic
    >
      <div className={`${styles.cinematicPin} ${styles.disciplines}`}>
        <LotusWatermark ref={lotusRef} className={styles.lotusWatermark} />

        <div className={`${styles.cinematicContent} ${styles.disciplinesInner}`}>
          <div className={styles.disciplinesColumns}>
            {DISCIPLINES.map((item, i) => (
              <div
                key={item.label}
                id={item.id}
                ref={colRefs[i]}
                className={`${styles.cinematicItem} ${styles.disciplineCard}`}
              >
                <span className={styles.disciplineIndex}>{String(i + 1).padStart(2, '0')}</span>
                <h2 className={styles.disciplineLabel}>{item.label}</h2>
                <p className={styles.disciplineText}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

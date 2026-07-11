'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSectionEntrance } from '@/hooks/useSectionEntrance';
import ServicesClosingSection from '@/components/sections/ServicesClosingSection';
import styles from './sections.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SERVICES = [
  {
    title: 'Creative Direction',
    desc: 'For founders, developers, and visionaries creating places people remember.',
  },
  {
    title: 'Signature Brand Experience',
    desc: 'A complete creative partnership from strategy to story to execution.',
  },
  {
    title: 'Hospitality & Regenerative Design',
    desc: 'Creative direction for retreats, boutique hospitality, and places rooted in nature.',
  },
] as const;

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useSectionEntrance(contentRef);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const frame = frameRef.current;
      const texture = frame?.querySelector<HTMLElement>('[data-services-texture]');
      if (!section || !frame || !texture) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      gsap.fromTo(
        texture,
        { yPercent: 3 },
        {
          yPercent: -5,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 3.2,
            invalidateOnRefresh: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={styles.servicesSection}
      id="contact"
      aria-label="Ways to Work Together"
    >
      <div ref={frameRef} className={styles.servicesFrame}>
        <div
          className={styles.servicesTexture}
          data-services-texture
          aria-hidden="true"
        />
        <div ref={contentRef} className={styles.servicesBoxInner}>
          <header className={styles.servicesBoxHeader}>
            <p className={styles.servicesEyebrow}>Ways to Work Together</p>
          </header>

          <ul className={styles.servicesOfferings}>
            {SERVICES.map((service, index) => (
              <li key={service.title} className={styles.serviceOffering}>
                <p className={styles.serviceOfferingIndex}>
                  {String(index + 1).padStart(2, '0')} —
                </p>
                <h3 className={`${styles.revealText} ${styles.serviceOfferingTitle}`}>
                  {service.title}
                </h3>
                <p className={`${styles.philosophyBodyReveal} ${styles.serviceOfferingDesc}`}>
                  {service.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ServicesClosingSection />
    </section>
  );
}

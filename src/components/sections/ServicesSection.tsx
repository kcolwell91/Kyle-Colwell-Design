'use client';

import { useRef, useState } from 'react';
import { useCinematicSequence } from '@/hooks/useCinematicSequence';
import styles from './sections.module.css';

const SERVICES = [
  {
    title: 'Creative Direction',
    desc: 'For founders, visionaries, and brands ready to translate their essence into a visual and experiential world.',
  },
  {
    title: 'Spatial & Interior Concepts',
    desc: 'For retreats, homes, hospitality spaces, and regenerative environments that need atmosphere, story, and soul.',
  },
  {
    title: 'Brand World Building',
    desc: 'For projects that need identity, messaging, imagery, website direction, and a cohesive creative ecosystem.',
  },
  {
    title: 'Invest in Regenerative Living',
    desc: 'For land, retreat, wellness, and design projects seeking a more beautiful and living-system-aligned direction.',
  },
] as const;

export default function ServicesSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const sectionRef = useRef<HTMLElement>(null);

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);
  const row4Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useCinematicSequence({
    sectionRef,
    itemRefs: [headlineRef, row1Ref, row2Ref, row3Ref, row4Ref, ctaRef],
  });

  const rowRefs = [row1Ref, row2Ref, row3Ref, row4Ref];

  return (
    <section
      ref={sectionRef}
      className={`${styles.cinematicSection} pinned-section`}
      id="contact"
      data-cinematic
    >
      <div className={`${styles.cinematicPin} ${styles.services}`}>
        <div className={`${styles.cinematicContent} ${styles.servicesInner}`}>
          <h2 ref={headlineRef} className={`${styles.cinematicItem} ${styles.servicesHeadline}`}>
            Ways to Work Together
          </h2>

          <div className={styles.serviceList}>
            {SERVICES.map((service, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={service.title}
                  ref={rowRefs[i]}
                  className={`${styles.cinematicItem} ${styles.serviceRow}`}
                >
                  <button
                    type="button"
                    className={styles.serviceButton}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.serviceIndex}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className={styles.serviceTitle}>{service.title}</h3>
                    <span
                      className={`${styles.serviceToggle} ${isOpen ? styles.serviceToggleOpen : ''}`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className={styles.serviceBody}>
                      <div className={styles.serviceBodyInner}>
                        <p className={styles.serviceDesc}>{service.desc}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <a
            ref={ctaRef}
            href="mailto:studio@kylecolwell.com"
            className={`${styles.cinematicItem} ${styles.servicesCta}`}
          >
            Begin a Conversation
          </a>
        </div>
      </div>
    </section>
  );
}

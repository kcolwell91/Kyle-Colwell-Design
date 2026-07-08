'use client';

import { useRef, type RefObject } from 'react';
import Image from 'next/image';
import { useCinematicPanels } from '@/hooks/useCinematicSequence';
import styles from './sections.module.css';

const PROJECTS = [
  {
    title: "Build and Design of a 5 Star Airbnb in Hawai'i",
    desc: 'Luxury biophilic hospitality — full design and build.',
    image: '/work/biophilic-retreat.png',
    floatClass: styles.projectFloat1,
    index: '01',
  },
  {
    title: 'Website Development',
    desc: 'Strategy, design, and development for considered digital worlds.',
    image: '/work/anna-naturalista.png',
    floatClass: styles.projectFloat2,
    index: '02',
  },
  {
    title: 'Restaurant Project Management',
    desc: 'Concept through opening — atmosphere and hospitality experience.',
    image: '/work/besos.png',
    floatClass: styles.projectFloat3,
    index: '03',
  },
  {
    title: 'Retreat Center Development Project',
    desc: 'Master planning and spatial vision for regenerative retreat.',
    image: '/work/visionary-interiors.png',
    floatClass: styles.projectFloat4,
    index: '04',
  },
] as const;

type Project = (typeof PROJECTS)[number];

function ProjectCard({
  project,
  cardRef,
}: {
  project: Project;
  cardRef: RefObject<HTMLAnchorElement | null>;
}) {
  return (
    <a
      ref={cardRef}
      href="#"
      className={`${styles.cinematicItem} ${styles.projectCard}`}
    >
      <div className={`${styles.projectCardInner} ${project.floatClass}`}>
        <div className={styles.projectImageWrap}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.projectImage}
          />
          <div className={styles.projectScrim} aria-hidden="true" />
          <span className={styles.projectIndex}>{project.index}</span>
          <div className={styles.projectMetaOverlay}>
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <p className={styles.projectDesc}>{project.desc}</p>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function SelectedWorldsSection() {
  const panel1SectionRef = useRef<HTMLElement>(null);
  const panel2SectionRef = useRef<HTMLElement>(null);

  const headlineRef = useRef<HTMLHeadingElement>(null);
  const card1Ref = useRef<HTMLAnchorElement>(null);
  const card2Ref = useRef<HTMLAnchorElement>(null);
  const card3Ref = useRef<HTMLAnchorElement>(null);
  const card4Ref = useRef<HTMLAnchorElement>(null);

  useCinematicPanels({
    panels: [
      {
        sectionRef: panel1SectionRef,
        itemRefs: [headlineRef, card1Ref, card2Ref],
      },
      {
        sectionRef: panel2SectionRef,
        itemRefs: [card3Ref, card4Ref],
      },
    ],
  });

  return (
    <div className={styles.worldsSection} id="selected-worlds">
      <section
        ref={panel1SectionRef}
        className={`${styles.cinematicSection} pinned-section`}
        data-cinematic
      >
        <div className={`${styles.cinematicPin} ${styles.worlds}`}>
          <div className={`${styles.cinematicContent} ${styles.worldsInner}`}>
            <h2 ref={headlineRef} className={`${styles.cinematicItem} ${styles.worldsTitle}`}>
              Selected Worlds
            </h2>
            <div className={styles.worldsGrid}>
              <ProjectCard project={PROJECTS[0]} cardRef={card1Ref} />
              <ProjectCard project={PROJECTS[1]} cardRef={card2Ref} />
            </div>
          </div>
        </div>
      </section>

      <section
        ref={panel2SectionRef}
        className={`${styles.cinematicSection} pinned-section`}
        data-cinematic
        aria-label="Selected worlds continued"
      >
        <div className={`${styles.cinematicPin} ${styles.worlds}`}>
          <div className={`${styles.cinematicContent} ${styles.worldsInner}`}>
            <div className={styles.worldsGrid}>
              <ProjectCard project={PROJECTS[2]} cardRef={card3Ref} />
              <ProjectCard project={PROJECTS[3]} cardRef={card4Ref} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

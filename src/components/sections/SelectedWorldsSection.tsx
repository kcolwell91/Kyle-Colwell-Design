'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS, type Project } from '@/data/projects';
import { getProjectWorkHref } from '@/lib/projectMedia';
import { useWorldsBeigeReveal } from '@/hooks/useWorldsBeigeReveal';
import styles from './sections.module.css';

const FLOAT_CLASSES = {
  projectFloat1: styles.projectFloat1,
  projectFloat2: styles.projectFloat2,
  projectFloat3: styles.projectFloat3,
  projectFloat4: styles.projectFloat4,
} as const;

function ProjectCard({ project }: { project: Project }) {
  const floatClass = FLOAT_CLASSES[project.floatClass];

  return (
    <Link href={getProjectWorkHref(project.slug, 'immersive')} className={styles.projectCard}>
      <div className={`${styles.projectCardInner} ${floatClass}`}>
        <div className={styles.projectImageWrap}>
          {project.media.type === 'video' ? (
            <video
              className={styles.projectVideo}
              src={project.media.src}
              poster={project.media.poster}
              autoPlay
              muted
              loop
              playsInline
              aria-label={project.title}
            />
          ) : (
            <Image
              src={project.media.src}
              alt={project.title}
              fill
              sizes="(max-width: 900px) 50vw, 25vw"
              className={styles.projectImage}
            />
          )}
          <div className={styles.projectScrim} aria-hidden="true" />
          <span className={styles.projectIndex}>{project.index}</span>
          <div className={styles.projectMetaOverlay}>
            <h3 className={styles.projectTitle}>{project.title}</h3>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SelectedWorldsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const beigeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useWorldsBeigeReveal(sectionRef, beigeRef, contentRef);

  return (
    <section
      ref={sectionRef}
      className={styles.worldsSection}
      id="selected-worlds"
      aria-label="Selected Worlds"
    >
      <div ref={beigeRef} className={styles.worldsBeigeLayer} aria-hidden="true" />
      <div ref={contentRef} className={styles.worldsInner}>
        <h2 className={`${styles.revealText} ${styles.worldsTitle}`}>Selected Worlds</h2>
        <div className={styles.worldsGrid}>
          {PROJECTS.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

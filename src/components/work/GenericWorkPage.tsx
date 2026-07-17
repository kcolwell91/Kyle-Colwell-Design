import Image from 'next/image';
import WorkBackLink from '@/components/work/WorkBackLink';
import type { Project } from '@/data/projects';
import styles from './GenericWorkPage.module.css';

type GenericWorkPageProps = {
  project: Project;
};

export default function GenericWorkPage({ project }: GenericWorkPageProps) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <WorkBackLink className={styles.backLink} />
        <span className={styles.index}>{project.index}</span>
      </header>

      <article className={styles.article}>
        <div className={styles.mediaFrame}>
          {project.media.type === 'video' ? (
            <video
              className={styles.media}
              src={project.media.src}
              poster={project.media.poster}
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          ) : (
            <Image
              src={project.media.src}
              alt={project.title}
              width={project.media.width}
              height={project.media.height}
              className={styles.media}
              priority
              sizes="(max-width: 960px) 100vw, 960px"
            />
          )}
        </div>

        <div className={styles.copy}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.summary}>{project.summary}</p>
          {project.partnerInquiry ? (
            <div className={styles.partnerInquiry}>
              <p className={styles.partnerCopy}>{project.partnerInquiry.copy}</p>
              <a
                href={`mailto:${project.partnerInquiry.email}`}
                className={styles.partnerLink}
              >
                <span>{project.partnerInquiry.cta}</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          ) : null}
        </div>
      </article>
    </main>
  );
}

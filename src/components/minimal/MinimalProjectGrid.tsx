import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS } from '@/data/projects';
import { getProjectStillImage, getProjectWorkHref } from '@/lib/projectMedia';
import styles from './MinimalProjectGrid.module.css';

export default function MinimalProjectGrid() {
  return (
    <section className={styles.grid} aria-label="Projects" id="selected-work">
      <div className={styles.inner}>
        <p className={styles.kicker}>Selected work</p>
        <ul className={styles.list}>
          {PROJECTS.map((project) => {
            const image = getProjectStillImage(project);

            return (
              <li key={project.slug} className={styles.item}>
                <Link href={getProjectWorkHref(project.slug, 'classic')} className={styles.card}>
                  <figure className={styles.media}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(max-width: 768px) 100vw, 46vw"
                      className={styles.image}
                    />
                  </figure>
                  <div className={styles.meta}>
                    <span className={styles.index}>{project.index}</span>
                    <div className={styles.text}>
                      <h2 className={styles.title}>
                        <span className={styles.titleLabel}>{project.title}</span>
                        <span className={styles.titleUnderline} aria-hidden="true" />
                      </h2>
                      <p className={styles.line}>{project.minimalCaption}</p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

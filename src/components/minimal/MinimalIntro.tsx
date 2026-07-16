import Image from 'next/image';
import { MINIMAL_ABOUT } from '@/data/minimalContent';
import styles from './MinimalIntro.module.css';

export default function MinimalIntro() {
  const { portrait } = MINIMAL_ABOUT;

  return (
    <section className={styles.intro} aria-label="About">
      <div className={styles.inner}>
        <p className={styles.kicker}>{MINIMAL_ABOUT.kicker}</p>
        <div className={styles.layout}>
          <figure className={styles.portrait}>
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              quality={92}
              sizes="(max-width: 900px) 72vw, 380px"
              className={styles.portraitImage}
            />
          </figure>
          <div className={styles.copy}>
            {MINIMAL_ABOUT.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

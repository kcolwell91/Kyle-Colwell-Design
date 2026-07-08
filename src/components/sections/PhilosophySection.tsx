'use client';

import ScrollRevealStory from '@/components/ScrollRevealStory';
import styles from './sections.module.css';

const PILLARS = [
  'Beauty is strategy.',
  'Nature is intelligence.',
  'Feeling is the metric.',
] as const;

export default function PhilosophySection() {
  return (
    <>
      <ScrollRevealStory sectionId="who-i-am" variant="statement" showMarker={false}>
        Design is a field of influence.
      </ScrollRevealStory>

      <section className={styles.philosophyFollow} aria-label="Philosophy details">
        <div className={styles.philosophyFollowInner}>
          <p className={styles.philosophyBody}>
            The spaces we enter, the brands we trust, and the stories we live
            inside shape how we feel, relate, remember, and become. My work
            begins with that understanding.
          </p>
          <ul className={styles.philosophyPillars}>
            {PILLARS.map((pillar) => (
              <li key={pillar} className={styles.philosophyPillar}>
                {pillar}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

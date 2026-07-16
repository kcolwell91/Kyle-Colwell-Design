import { MINIMAL_WORK } from '@/data/minimalContent';
import styles from './MinimalWork.module.css';

export default function MinimalWork() {
  return (
    <section className={styles.work} aria-label="The work">
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.inner}>
        <p className={styles.kicker}>{MINIMAL_WORK.kicker}</p>
        <ul className={styles.list}>
          {MINIMAL_WORK.items.map((item, index) => (
            <li key={item.title} className={styles.item}>
              <article className={styles.card}>
                <span className={styles.index}>{item.index}</span>
                <div className={styles.copy}>
                  <h2 className={styles.title}>{item.title}</h2>
                  <p className={styles.line}>{item.line}</p>
                </div>
              </article>
              {index < MINIMAL_WORK.items.length - 1 ? (
                <div className={styles.divider} aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

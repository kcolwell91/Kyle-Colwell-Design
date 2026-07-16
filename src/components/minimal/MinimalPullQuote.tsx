import { MINIMAL_PULL_QUOTE } from '@/data/minimalContent';
import styles from './MinimalPullQuote.module.css';

export default function MinimalPullQuote() {
  return (
    <section className={styles.quote} aria-label="Statement">
      <div className={styles.inner}>
        <p className={styles.line}>
          <em>{MINIMAL_PULL_QUOTE.line}</em>
        </p>
      </div>
    </section>
  );
}

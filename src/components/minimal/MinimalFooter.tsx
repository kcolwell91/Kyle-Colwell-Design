import { MINIMAL_FOOTER } from '@/data/minimalContent';
import styles from './MinimalFooter.module.css';

export default function MinimalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} aria-label="Footer">
      <div className={styles.inner}>
        <p className={styles.line}>
          <span>
            © {year} {MINIMAL_FOOTER.name}
          </span>
          <span className={styles.divider} aria-hidden="true">
            ·
          </span>
          <span>{MINIMAL_FOOTER.locations}</span>
        </p>
      </div>
    </footer>
  );
}

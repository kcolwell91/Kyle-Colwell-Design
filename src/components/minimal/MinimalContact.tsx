import { MINIMAL_CONTACT } from '@/data/minimalContent';
import { SITE_CONTACT, SITE_CONTACT_MAILTO, SITE_CONTACT_TEL } from '@/data/siteContact';
import styles from './MinimalContact.module.css';

export default function MinimalContact() {
  return (
    <section className={styles.contact} aria-label="Contact" id="contact">
      <div className={styles.inner}>
        <p className={styles.kicker}>{MINIMAL_CONTACT.kicker}</p>
        <a href={SITE_CONTACT_MAILTO} className={styles.email}>
          {SITE_CONTACT.email}
        </a>
        <div className={styles.meta}>
          <a href={SITE_CONTACT_TEL} className={styles.phone}>
            {SITE_CONTACT.phoneDisplay}
          </a>
          <span className={styles.divider} aria-hidden="true">
            ·
          </span>
          <span className={styles.location}>{SITE_CONTACT.location}</span>
        </div>
        <a href={SITE_CONTACT_MAILTO} className={styles.cta}>
          {MINIMAL_CONTACT.cta}
        </a>
      </div>
    </section>
  );
}

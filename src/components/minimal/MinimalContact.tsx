import Link from 'next/link';
import { IMMERSIVE_HOME_PATH } from '@/config/siteRoutes';
import { MINIMAL_CONTACT } from '@/data/minimalContent';
import { SITE_CONTACT, SITE_CONTACT_MAILTO, SITE_CONTACT_TEL } from '@/data/siteContact';
import styles from './MinimalContact.module.css';

export default function MinimalContact() {
  return (
    <section className={styles.contact} aria-label="Contact" id="contact">
      <div className={styles.inner}>
        <p className={styles.kicker}>{MINIMAL_CONTACT.kicker}</p>
        <a href={SITE_CONTACT_MAILTO} className={styles.email}>
          <span className={styles.emailLabel}>{SITE_CONTACT.email}</span>
          <span className={styles.linkUnderline} aria-hidden="true" />
        </a>
        <div className={styles.meta}>
          <a href={SITE_CONTACT_TEL} className={styles.phone}>
            <span className={styles.phoneLabel}>{SITE_CONTACT.phoneDisplay}</span>
            <span className={styles.linkUnderline} aria-hidden="true" />
          </a>
        </div>
        <a href={SITE_CONTACT_MAILTO} className={styles.cta}>
          <span className={styles.ctaLabel}>{MINIMAL_CONTACT.cta}</span>
          <span className={styles.linkUnderline} aria-hidden="true" />
        </a>
      </div>

      <div className={styles.journey}>
        <Link href={IMMERSIVE_HOME_PATH} className={styles.journeyLink}>
          <span className={styles.journeyEyebrow}>Experience</span>
          <span className={styles.journeyDest}>
            <span className={styles.journeyName}>Immersive</span>
            <span className={styles.journeyArrow} aria-hidden="true">
              →
            </span>
          </span>
          <span className={styles.journeyRule} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

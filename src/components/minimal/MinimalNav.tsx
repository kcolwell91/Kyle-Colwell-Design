'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CLASSIC_HOME_PATH } from '@/config/siteRoutes';
import { MINIMAL_NAV } from '@/data/minimalContent';
import styles from './MinimalNav.module.css';

export default function MinimalNav() {
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setElevated(window.scrollY > window.innerHeight * 0.14);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`${styles.header} ${elevated ? styles.headerElevated : styles.headerOnHero}`}
      aria-label="Site navigation"
    >
      <Link href={CLASSIC_HOME_PATH} className={styles.logo}>
        <span className={styles.logoLabel}>Kyle Colwell</span>
        <span className={styles.linkUnderline} aria-hidden="true" />
      </Link>
      <nav className={styles.nav} aria-label="Primary">
        {MINIMAL_NAV.map((item, index) => (
          <span key={item.href} className={styles.navItem}>
            <a href={item.href} className={styles.navLink}>
              <span className={styles.navLabel}>{item.label}</span>
              <span className={styles.linkUnderline} aria-hidden="true" />
            </a>
            {index < MINIMAL_NAV.length - 1 ? (
              <span className={styles.divider} aria-hidden="true">
                ·
              </span>
            ) : null}
          </span>
        ))}
      </nav>
    </header>
  );
}

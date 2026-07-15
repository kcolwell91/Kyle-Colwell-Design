'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { HERO_SCROLL_READY_EVENT } from '@/components/ScrollTriggerManager';
import { NAV_LINKS } from '@/data/siteNav';
import styles from './SiteNav.module.css';

export default function SiteNav() {
  const pathname = usePathname();
  const [heroActive, setHeroActive] = useState(true);

  useEffect(() => {
    let trigger: { kill: () => void; isActive: boolean } | null = null;
    let mounted = true;

    const attach = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      const hero = document.getElementById('hero');
      if (!hero || !mounted) return;

      trigger?.kill();

      trigger = ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom bottom',
        onEnter: () => setHeroActive(true),
        onEnterBack: () => setHeroActive(true),
        onLeave: () => setHeroActive(false),
        onLeaveBack: () => setHeroActive(false),
      });

      setHeroActive(trigger.isActive);
    };

    void attach();
    window.addEventListener(HERO_SCROLL_READY_EVENT, attach);

    return () => {
      mounted = false;
      trigger?.kill();
      window.removeEventListener(HERO_SCROLL_READY_EVENT, attach);
    };
  }, []);

  if (pathname === '/work/website-development') return null;

  return (
    <header
      className={`${styles.header} ${heroActive ? '' : styles.headerHidden}`}
      aria-label="Site navigation"
      aria-hidden={!heroActive}
    >
      <a href="#" className={styles.logo}>
        Kyle Colwell
      </a>
      <nav className={styles.nav} aria-label="Primary">
        {NAV_LINKS.map(({ label, href }) => (
          <a key={label} href={href} className={styles.navLink}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HERO_SCROLL_READY_EVENT } from '@/components/ScrollTriggerManager';
import { IMMERSIVE_HOME_PATH } from '@/config/siteRoutes';
import {
  NAV_INTERIOR_DESIGN,
  NAV_VIEW_ALL_WORLDS,
  NAV_WORK_ITEMS,
  NAV_WORK_LABEL,
  NAV_WORK_TOGETHER,
} from '@/data/siteNav';
import styles from './SiteNav.module.css';

export default function SiteNav() {
  const pathname = usePathname();
  const menuId = useId();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [heroActive, setHeroActive] = useState(true);
  const [workOpen, setWorkOpen] = useState(false);

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

  useEffect(() => {
    if (!workOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setWorkOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setWorkOpen(false);
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [workOpen]);

  if (pathname !== IMMERSIVE_HOME_PATH) return null;

  return (
    <header
      className={`${styles.header} ${heroActive ? '' : styles.headerHidden}`}
      aria-label="Site navigation"
      aria-hidden={!heroActive}
    >
      <Link href={IMMERSIVE_HOME_PATH} className={styles.logo}>
        Kyle Colwell
      </Link>
      <nav className={styles.nav} aria-label="Primary">
        <Link href={NAV_INTERIOR_DESIGN.href} className={styles.navLink}>
          {NAV_INTERIOR_DESIGN.label}
        </Link>

        <div
          ref={dropdownRef}
          className={`${styles.navDropdown} ${workOpen ? styles.navDropdownOpen : ''}`}
          onMouseEnter={() => setWorkOpen(true)}
          onMouseLeave={() => setWorkOpen(false)}
        >
          <button
            type="button"
            className={styles.navDropdownTrigger}
            aria-expanded={workOpen}
            aria-controls={menuId}
            onClick={() => setWorkOpen((open) => !open)}
          >
            {NAV_WORK_LABEL}
            <span className={styles.navDropdownCaret} aria-hidden="true" />
          </button>
          <div
            id={menuId}
            className={styles.navDropdownMenu}
            role="menu"
            aria-label="Selected work"
            hidden={!workOpen}
          >
            <ul className={styles.navDropdownList}>
              {NAV_WORK_ITEMS.map(({ index, label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={styles.navDropdownItem}
                    role="menuitem"
                    onClick={() => setWorkOpen(false)}
                  >
                    <span className={styles.navDropdownIndex}>{index}</span>
                    <span className={styles.navDropdownLabel}>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className={styles.navDropdownDivider} aria-hidden="true" />
            <Link
              href={NAV_VIEW_ALL_WORLDS.href}
              className={styles.navDropdownFooter}
              role="menuitem"
              onClick={() => setWorkOpen(false)}
            >
              {NAV_VIEW_ALL_WORLDS.label}
            </Link>
          </div>
        </div>

        <Link href={NAV_WORK_TOGETHER.href} className={styles.navLink}>
          {NAV_WORK_TOGETHER.label}
        </Link>
      </nav>
    </header>
  );
}

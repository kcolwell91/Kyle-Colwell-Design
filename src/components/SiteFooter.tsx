'use client';

import { useRef } from 'react';
import { useSectionEntrance } from '@/hooks/useSectionEntrance';
import styles from '@/components/sections/sections.module.css';

export default function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  useSectionEntrance(footerRef);

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.footerInner}>
        <span className={styles.footerMark}>Kyle Colwell</span>
        <span className={styles.footerNote}>
          Regenerative Design & Creative Direction
        </span>
      </div>
    </footer>
  );
}

'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './MinimalReveal.module.css';

type MinimalRevealProps = {
  children: ReactNode;
  className?: string;
};

export default function MinimalReveal({ children, className }: MinimalRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reveal = () => setVisible(true);

    // If this section (or a descendant) matches the URL hash, show immediately.
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const target = document.getElementById(hash);
      if (target && element.contains(target)) {
        reveal();
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.01, rootMargin: '0px 0px -4% 0px' }
    );

    observer.observe(element);

    const onHashChange = () => {
      const nextHash = window.location.hash.replace('#', '');
      if (!nextHash) return;
      const target = document.getElementById(nextHash);
      if (target && element.contains(target)) {
        reveal();
      }
    };

    window.addEventListener('hashchange', onHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.visible : ''} ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

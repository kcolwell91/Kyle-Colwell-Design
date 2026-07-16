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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
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

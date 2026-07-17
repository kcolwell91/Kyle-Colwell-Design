'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useGLTF } from '@react-three/drei';
import ScrollSpinModelCanvas from '@/components/sections/ScrollSpinModelCanvas';
import styles from './ScrollSpinModelSection.module.css';

const MODEL_PATH = '/models/closing-scroll-sculpture.glb';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ScrollSpinModelSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const whitePanelRef = useRef<HTMLDivElement>(null);
  const coralPanelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const invalidateRef = useRef<(() => void) | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    useGLTF.preload(MODEL_PATH);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { rootMargin: '30% 0px', threshold: 0.01 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isActive) return;
    invalidateRef.current?.();
  }, [isActive, isMobile]);

  const handleInvalidateReady = useCallback((invalidate: () => void) => {
    invalidateRef.current = invalidate;
    invalidate();
  }, []);

  const handleModelReady = useCallback(() => {
    invalidateRef.current?.();
    ScrollTrigger.refresh();

    let frame = 0;
    const warmFrames = () => {
      invalidateRef.current?.();
      frame += 1;
      if (frame < 12) requestAnimationFrame(warmFrames);
    };
    requestAnimationFrame(warmFrames);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const whitePanel = whitePanelRef.current;
      const coralPanel = coralPanelRef.current;
      if (!section || !stage || !whitePanel || !coralPanel) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set(whitePanel, { yPercent: 0 });
        gsap.set(coralPanel, { xPercent: 0 });
        progressRef.current = 0.1;
        invalidateRef.current?.();
        return;
      }

      const spinState = { progress: 0 };
      gsap.set([whitePanel, coralPanel], { clearProps: 'transform' });

      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'closing-model-spin',
          trigger: stage,
          start: 'top top',
          end: () => `+=${window.innerHeight * 1.4}`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline.fromTo(
        whitePanel,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.34, ease: 'none' },
        0
      );
      timeline.fromTo(
        coralPanel,
        { xPercent: -100 },
        { xPercent: 0, duration: 0.66, ease: 'none' },
        0.34
      );
      timeline.to(
        spinState,
        {
          progress: 1,
          duration: 1,
          ease: 'none',
          onUpdate: () => {
            progressRef.current = spinState.progress;
            invalidateRef.current?.();
          },
        },
        0
      );

      progressRef.current = spinState.progress;
      invalidateRef.current?.();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="scroll-sculpture"
      className={styles.section}
      data-scroll-spin-model
      aria-label="Scroll-trigger movement with 3D form"
    >
      <div ref={stageRef} className={styles.stage}>
        <div ref={whitePanelRef} className={styles.whitePanel} aria-hidden="true" />
        <div ref={coralPanelRef} className={styles.coralPanel} aria-hidden="true" />
        <div className={styles.groundShadow} aria-hidden="true" />
        <div className={styles.modelViewport} aria-hidden="true">
          <ScrollSpinModelCanvas
            progressRef={progressRef}
            isActive={isActive}
            isMobile={isMobile}
            onInvalidateReady={handleInvalidateReady}
            onModelReady={handleModelReady}
          />
        </div>
        <p className={styles.caption}>
          <span>Object Study 01</span>
          Scroll-trigger movement with 3D form
        </p>
      </div>
    </section>
  );
}

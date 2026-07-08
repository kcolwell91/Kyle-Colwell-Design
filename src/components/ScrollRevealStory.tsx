'use client';

import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import styles from './ScrollRevealStory.module.css';

export type ScrollRevealStoryProps = {
  children: ReactNode;
  sectionId?: string;
  scrollMinHeight?: string;
  className?: string;
  variant?: 'intro' | 'statement';
  fadeOutOnExit?: boolean;
  fadeOutStart?: number;
  showMarker?: boolean;
};

const PALE = { r: 20, g: 20, b: 18, a: 0.1 };
const DARK = { r: 10, g: 10, b: 9, a: 1 };

function extractText(children: ReactNode): string {
  if (typeof children === 'string') return children.trim();
  return '';
}

function splitWords(text: string) {
  return text.split(/\s+/).filter(Boolean);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerpColor(t: number, pale = PALE, dark = DARK) {
  const p = clamp(t, 0, 1);
  const r = Math.round(pale.r + (dark.r - pale.r) * p);
  const g = Math.round(pale.g + (dark.g - pale.g) * p);
  const b = Math.round(pale.b + (dark.b - pale.b) * p);
  const a = pale.a + (dark.a - pale.a) * p;
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
}

function wordRevealAmount(
  index: number,
  progress: number,
  wordCount: number,
  fadeZone: number
) {
  const readHead = progress * (wordCount + fadeZone * 0.35);
  return clamp((readHead - index) / fadeZone, 0, 1);
}

export default function ScrollRevealStory({
  children,
  sectionId,
  scrollMinHeight = '250vh',
  className,
  variant = 'statement',
  fadeOutOnExit = false,
  fadeOutStart = 0.82,
  showMarker = true,
}: ScrollRevealStoryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const compositionRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  const text = extractText(children);
  const words = useMemo(() => splitWords(text), [text]);

  useEffect(() => {
    const section = sectionRef.current;
    const composition = compositionRef.current;
    if (!section || !composition || words.length === 0) return;

    let mounted = true;
    let gsapCtx: { revert: () => void } | null = null;

    const fadeZone = variant === 'intro' ? 14 : 8;
    const pale =
      variant === 'intro'
        ? { r: 20, g: 20, b: 18, a: 0.38 }
        : { r: 20, g: 20, b: 18, a: 0.12 };

    const syncScrollHeight = () => {
      const textHeight = composition.offsetHeight;
      const minVh = variant === 'intro' ? 3 : 2.5;
      const minPx = window.innerHeight * minVh;
      const extraVh = variant === 'intro' ? 2.2 : 1.75;
      const trackPx = Math.max(minPx, textHeight + window.innerHeight * extraVh);
      section.style.minHeight = `${trackPx}px`;
    };

    const setExitOpacity = (progress: number) => {
      if (!fadeOutOnExit) {
        section.style.setProperty('--exit-opacity', '1');
        return;
      }
      if (progress <= fadeOutStart) {
        section.style.setProperty('--exit-opacity', '1');
        return;
      }
      const t = (progress - fadeOutStart) / (1 - fadeOutStart);
      section.style.setProperty('--exit-opacity', String(Math.max(0, 1 - t)));
    };

    const updateWords = (progress: number) => {
      const wordEls = composition.querySelectorAll<HTMLElement>(`[data-word-index]`);
      const count = wordEls.length;
      if (count === 0) return;

      const readHead = progress * (count + fadeZone * 0.35);
      let markerIndex = 0;
      let closestDistance = Infinity;

      wordEls.forEach((el, index) => {
        const t = wordRevealAmount(index, progress, count, fadeZone);
        el.style.color = lerpColor(t, pale, DARK);

        const distance = Math.abs(readHead - (index + 0.5));
        if (distance < closestDistance) {
          closestDistance = distance;
          markerIndex = index;
        }
      });

      const marker = markerRef.current;
      if (marker && showMarker) {
        const activeWord = wordEls[markerIndex];
        if (activeWord) {
          const compRect = composition.getBoundingClientRect();
          const wordRect = activeWord.getBoundingClientRect();
          marker.style.opacity = progress > 0 && progress < 0.995 ? '1' : '0';
          marker.style.transform = `translate(${wordRect.right - compRect.left + 10}px, ${wordRect.top - compRect.top + wordRect.height / 2}px) translateY(-50%)`;
        }
      }
    };

    const setup = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!mounted) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      syncScrollHeight();
      gsapCtx?.revert();

      if (reduced) {
        updateWords(1);
        return;
      }

      gsapCtx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            updateWords(self.progress);
            setExitOpacity(self.progress);
          },
        });

        updateWords(0);
        setExitOpacity(0);
        ScrollTrigger.refresh();
      }, section);
    };

    void setup();

    const onResize = () => {
      syncScrollHeight();
      void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    };

    const onLoad = () => {
      syncScrollHeight();
      void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('load', onLoad);

    return () => {
      mounted = false;
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onLoad);
      gsapCtx?.revert();
    };
  }, [words, variant, fadeOutOnExit, fadeOutStart, showMarker]);

  const variantClass = variant === 'intro' ? styles.intro : styles.statement;

  return (
    <section
      ref={sectionRef}
      id={sectionId}
      className={[styles.section, variantClass, className].filter(Boolean).join(' ')}
      style={{ ['--story-scroll-min-height' as string]: scrollMinHeight }}
      aria-label={variant === 'intro' ? 'Introduction' : 'Story'}
    >
      <div className={styles.sticky}>
        <div className={styles.stage}>
          <div ref={compositionRef} className={styles.composition}>
            <p className={styles.paragraph}>
              {words.map((word, index) => (
                <span key={`${word}-${index}`} className={styles.word} data-word-index={index}>
                  {word}
                  {index < words.length - 1 ? ' ' : ''}
                </span>
              ))}
            </p>
            {showMarker ? (
              <span ref={markerRef} className={styles.marker} aria-hidden="true" />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

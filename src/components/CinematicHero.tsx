'use client';

import { useEffect, useRef } from 'react';
import styles from './CinematicHero.module.css';

const HERO_VIDEO_MP4 = '/videos/hero.mp4';
const HERO_VIDEO_MOV = '/videos/hero.mov';
const HERO_VIDEO_DURATION = 22;
const SCROLL_PX_PER_VIDEO_SECOND = 320;

const NAV_LINKS = [
  { label: 'Philosophy', href: '#who-i-am' },
  { label: 'Manifesto', href: '#what-i-do' },
  { label: 'Disciplines', href: '#disciplines' },
  { label: 'Worlds', href: '#selected-worlds' },
  { label: 'Work together', href: '#contact' },
] as const;

function fadeRange(progress: number, start: number, end: number) {
  if (progress <= start) return 1;
  if (progress >= end) return 0;
  return 1 - (progress - start) / (end - start);
}

function isVideoReady(video: HTMLVideoElement) {
  const { duration } = video;
  return Number.isFinite(duration) && duration > 0;
}

export default function CinematicHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const video = videoRef.current;
    if (!track || !viewport || !video) return;

    let mounted = true;
    let scrollReady = false;
    let usingFallback = false;
    let gsapCtx: { revert: () => void } | null = null;
    let heroTrigger: { kill: () => void } | null = null;

    const getDuration = () =>
      isVideoReady(video) ? video.duration : HERO_VIDEO_DURATION;

    const setTrackHeight = () => {
      const scrollPx = getDuration() * SCROLL_PX_PER_VIDEO_SECOND;
      track.style.setProperty('--hero-scroll-px', `${scrollPx}px`);
    };

    const scrubVideo = (progress: number) => {
      if (!isVideoReady(video)) return;
      const clamped = Math.min(Math.max(progress, 0), 1);
      video.currentTime = clamped * video.duration;
    };

    const updateOverlay = (p: number) => {
      if (line1Ref.current) {
        line1Ref.current.style.opacity = String(fadeRange(p, 0.04, 0.12));
      }
      if (line2Ref.current) {
        line2Ref.current.style.opacity = String(fadeRange(p, 0.1, 0.18));
      }
      if (line3Ref.current) {
        line3Ref.current.style.opacity = String(fadeRange(p, 0.16, 0.24));
      }
      if (bodyRef.current) {
        bodyRef.current.style.opacity = String(fadeRange(p, 0.22, 0.32));
      }
    };

    const hideHero = () => {
      track.classList.add(styles.heroComplete);
      viewport.style.display = 'none';
      video.pause();
      video.style.display = 'none';
    };

    const showHero = () => {
      track.classList.remove(styles.heroComplete);
      viewport.style.display = '';
      video.style.display = '';
      video.pause();
      video.currentTime = 0;
    };

    const setupScrollTrigger = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!mounted || !isVideoReady(video)) return;

      setTrackHeight();
      gsapCtx?.revert();
      heroTrigger?.kill();

      gsapCtx = gsap.context(() => {
        heroTrigger = ScrollTrigger.create({
          id: 'hero-video',
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          pin: viewport,
          pinSpacing: true,
          pinReparent: false,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!self.isActive) return;
            scrubVideo(self.progress);
            updateOverlay(self.progress);
          },
          onLeave: () => {
            if (isVideoReady(video)) {
              video.currentTime = video.duration;
            }
            hideHero();
            void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
          },
          onEnterBack: () => {
            showHero();
            scrubVideo(0);
            updateOverlay(0);
          },
        });

        scrubVideo(0);
        updateOverlay(0);
        ScrollTrigger.refresh();
      }, track);
    };

    const onVideoReady = () => {
      if (!mounted || scrollReady || !isVideoReady(video)) return;
      scrollReady = true;
      video.pause();
      video.currentTime = 0;
      void setupScrollTrigger();
    };

    const onVideoError = () => {
      if (!mounted || usingFallback) return;
      usingFallback = true;
      scrollReady = false;
      video.src = HERO_VIDEO_MOV;
      video.load();
    };

    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.pause();

    video.addEventListener('loadedmetadata', onVideoReady);
    video.addEventListener('durationchange', onVideoReady);
    video.addEventListener('error', onVideoError);

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA && isVideoReady(video)) {
      onVideoReady();
    }

    const onResize = async () => {
      setTrackHeight();
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', onResize);

    return () => {
      mounted = false;
      video.removeEventListener('loadedmetadata', onVideoReady);
      video.removeEventListener('durationchange', onVideoReady);
      video.removeEventListener('error', onVideoError);
      window.removeEventListener('resize', onResize);
      heroTrigger?.kill();
      gsapCtx?.revert();
    };
  }, []);

  return (
    <div ref={trackRef} id="hero" className={styles.track} aria-label="Hero">
      <div ref={viewportRef} className={styles.viewport}>
        <video
          ref={videoRef}
          id="heroVideo"
          className={styles.video}
          src={HERO_VIDEO_MP4}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        <div className={styles.overlay} aria-hidden="true" />

        <header className={styles.header}>
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

        <div className={styles.content}>
          <h1 className={styles.headline}>
            <span ref={line1Ref} className={styles.headlineLine}>
              Regenerative
            </span>
            <span ref={line2Ref} className={styles.headlineLine}>
              Designer &amp;
            </span>
            <span ref={line3Ref} className={styles.headlineLine}>
              Creative Director
            </span>
          </h1>
          <p ref={bodyRef} className={styles.body}>
            I design places, brands, and experiences that people don&apos;t just
            see—they feel. Inspired by living systems, crafted for lasting
            impact.
          </p>
        </div>

        <div className={styles.scrollCue} aria-hidden="true">
          <span className={styles.scrollCueText}>Scroll to discover</span>
          <svg
            className={styles.scrollCueArrow}
            width="16"
            height="22"
            viewBox="0 0 14 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 1v16M7 17l-5-5M7 17l5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

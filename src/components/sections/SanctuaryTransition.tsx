'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { HERO_SCROLL_READY_EVENT } from '@/components/ScrollTriggerManager';
import sectionStyles from './sections.module.css';
import styles from './SanctuaryTransition.module.css';

const SANCTUARY_VIDEO = '/videos/sanctuary.mp4';
const SANCTUARY_POSTER = '/videos/sanctuary-poster.jpg';
const MANIFESTO_HEADLINE = 'Design is a field of influence.';

const SCRUB_PX_PER_SECOND = 300;
const REVEAL_SECONDS = 3;
const FALLBACK_DURATION = 15;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function smoother(t: number) {
  const p = clamp(t, 0, 1);
  return p * p * p * (p * (p * 6 - 15) + 10);
}

function isVideoReady(video: HTMLVideoElement) {
  return Number.isFinite(video.duration) && video.duration > 0;
}

export default function SanctuaryTransition() {
  const trackRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const whiteBackdropRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const video = videoRef.current;
    const poster = posterRef.current;
    const glow = glowRef.current;
    const whiteBackdrop = whiteBackdropRef.current;
    const manifesto = manifestoRef.current;
    if (!track || !viewport || !video || !poster || !glow || !whiteBackdrop || !manifesto) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const applyReveal = (revealProgress: number) => {
      const m = smoother(revealProgress);
      manifesto.style.opacity = String(m);
      whiteBackdrop.style.opacity = String(m);
      glow.style.opacity = String(0.42 * m);
    };

    if (reduced) {
      track.dataset.reduced = 'true';
      poster.style.opacity = '0';
      applyReveal(1);
      return;
    }

    applyReveal(0);

    let mounted = true;
    let scrollReady = false;
    let scrubEndRatio = 0.85;
    let ctx: { revert: () => void } | null = null;
    let trigger: { kill: () => void; progress: number } | null = null;
    let mediaUnlocked = false;
    let unlockPromise: Promise<void> | null = null;

    const getDuration = () => (isVideoReady(video) ? video.duration : FALLBACK_DURATION);

    const setTrackHeight = () => {
      const scrubPx = getDuration() * SCRUB_PX_PER_SECOND;
      const holdPx = window.innerHeight * 0.45;
      track.style.setProperty('--sanctuary-scroll-px', `${scrubPx + holdPx}px`);
      document.documentElement.style.setProperty('--sanctuary-hold-px', `${holdPx}px`);
      scrubEndRatio = scrubPx / (scrubPx + holdPx);
    };

    const hidePoster = () => {
      poster.style.opacity = '0';
    };

    const unlockMedia = async () => {
      if (mediaUnlocked) return;
      if (unlockPromise) {
        await unlockPromise;
        return;
      }

      unlockPromise = (async () => {
        try {
          await video.play();
          video.pause();
          video.currentTime = 0;
          mediaUnlocked = true;
        } catch {
          mediaUnlocked = false;
        } finally {
          unlockPromise = null;
        }
      })();

      await unlockPromise;
    };

    const seekVideo = (videoTime: number) => {
      if (!isVideoReady(video)) return;
      if (Math.abs(video.currentTime - videoTime) <= 0.001) return;

      video.currentTime = videoTime;
      if (Math.abs(video.currentTime - videoTime) > 0.05 && !mediaUnlocked) {
        void unlockMedia().then(() => {
          video.currentTime = videoTime;
        });
      }
    };

    const primeFirstFrame = () => {
      if (!isVideoReady(video)) return;
      if (video.currentTime < 0.001) {
        video.currentTime = 0.001;
      }
    };

    const update = (progress: number) => {
      const duration = getDuration();
      const scrubT = clamp(progress / scrubEndRatio, 0, 1);
      const videoTime = scrubT * duration;

      if (isVideoReady(video)) {
        if (scrubT > 0.001) {
          hidePoster();
          void unlockMedia();
        } else {
          poster.style.opacity = '1';
        }
        seekVideo(videoTime);
      }

      const revealStart = duration - REVEAL_SECONDS;
      const revealProgress = clamp((videoTime - revealStart) / REVEAL_SECONDS, 0, 1);
      applyReveal(revealProgress);
    };

    const setup = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      if (!mounted) return;

      setTrackHeight();
      ctx?.revert();

      ctx = gsap.context(() => {
        trigger = ScrollTrigger.create({
          id: 'sanctuary-transition',
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          pin: viewport,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => setTrackHeight(),
          onUpdate: (self) => update(self.progress),
          onEnter: (self) => update(self.progress),
          onEnterBack: (self) => update(self.progress),
          onLeaveBack: () => update(0),
          onLeave: () => update(1),
        });
        update(trigger.progress);
        ScrollTrigger.refresh();
      }, track);
    };

    const initScroll = async () => {
      if (!mounted || scrollReady) return;
      scrollReady = true;
      void unlockMedia();
      primeFirstFrame();
      video.pause();
      await setup();
    };

    const onReady = () => {
      if (!mounted || scrollReady || !isVideoReady(video)) return;
      void initScroll();
    };

    const onFirstInteraction = () => {
      if (mediaUnlocked) return;
      void unlockMedia().then(() => {
        if (trigger) update(trigger.progress);
      });
    };

    const onLoadedData = () => {
      primeFirstFrame();
    };

    const onError = () => {
      poster.style.opacity = '1';
    };

    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.pause();

    video.addEventListener('loadedmetadata', onReady);
    video.addEventListener('durationchange', onReady);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('error', onError);

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA && isVideoReady(video)) {
      onReady();
    } else {
      video.load();
    }

    const fallbackTimer = window.setTimeout(() => {
      if (!mounted || scrollReady) return;
      void initScroll();
    }, 2500);

    window.addEventListener('wheel', onFirstInteraction, { once: true, passive: true });
    window.addEventListener('scroll', onFirstInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });

    const refresh = () => {
      setTrackHeight();
      void (async () => {
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        ScrollTrigger.refresh();
        if (trigger) update(trigger.progress);
      })();
    };

    const onHeroReady = () => refresh();
    window.addEventListener('resize', refresh);
    window.addEventListener(HERO_SCROLL_READY_EVENT, onHeroReady);

    return () => {
      mounted = false;
      window.clearTimeout(fallbackTimer);
      video.removeEventListener('loadedmetadata', onReady);
      video.removeEventListener('durationchange', onReady);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('error', onError);
      window.removeEventListener('resize', refresh);
      window.removeEventListener(HERO_SCROLL_READY_EVENT, onHeroReady);
      trigger?.kill();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={trackRef}
      id="what-i-do"
      className={styles.track}
      aria-label="Living sanctuary"
    >
      <div ref={viewportRef} className={styles.viewport}>
        <video
          ref={videoRef}
          className={styles.video}
          src={SANCTUARY_VIDEO}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div ref={posterRef} className={styles.poster}>
          <Image
            src={SANCTUARY_POSTER}
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className={styles.posterImage}
            aria-hidden="true"
          />
        </div>
        <div className={styles.vignette} aria-hidden="true" />
        <div ref={glowRef} className={styles.glow} aria-hidden="true" />
        <div ref={whiteBackdropRef} className={styles.whiteBackdrop} aria-hidden="true" />

        <div className={styles.copyStage}>
          <div ref={manifestoRef} className={styles.manifestoLayer}>
            <div className={sectionStyles.revealContent}>
              <h2
                className={`${sectionStyles.revealText} ${sectionStyles.manifestoHeadline} ${styles.manifestoHeadline}`}
              >
                {MANIFESTO_HEADLINE}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

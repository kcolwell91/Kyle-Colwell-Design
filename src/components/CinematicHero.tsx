'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './CinematicHero.module.css';
import { HERO_SCROLL_READY_EVENT } from '@/components/ScrollTriggerManager';

const HERO_VIDEO_MP4 = '/videos/hero.mp4';
const HERO_VIDEO_MOBILE_MP4 = '/videos/hero-mobile.mp4';
const HERO_VIDEO_MOV = '/videos/hero.mov';
const HERO_POSTER = '/hero-poster.JPEG';
const MOBILE_VIDEO_MEDIA = '(max-width: 768px) and (pointer: coarse)';
const HERO_VIDEO_DURATION = 22;
// Match sanctuary pacing density so scrub feels equally steady.
const SCROLL_PX_PER_VIDEO_SECOND = 300;
const MOBILE_SCROLL_PX_PER_VIDEO_SECOND = 280;
const POSTER_FADE_END = 0.015;
const BOX_MORPH_START = 0.72;
const BOX_FRAME_WIDTH = 666;
const BOX_ASPECT = 16 / 10;
const BOX_MAT_PADDING = 20;
const SURFACE_COLOR = { r: 240, g: 233, b: 223 };
const HERO_BG_COLOR = { r: 10, g: 8, b: 6 };

function fadeRange(progress: number, start: number, end: number) {
  if (progress <= start) return 1;
  if (progress >= end) return 0;
  return 1 - (progress - start) / (end - start);
}

function dramaticFade(progress: number, start: number, end: number) {
  const linear = fadeRange(progress, start, end);
  return linear * linear * linear;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpRgb(
  from: { r: number; g: number; b: number },
  to: { r: number; g: number; b: number },
  t: number
) {
  return `rgb(${Math.round(lerp(from.r, to.r, t))}, ${Math.round(lerp(from.g, to.g, t))}, ${Math.round(lerp(from.b, to.b, t))})`;
}

function isVideoReady(video: HTMLVideoElement) {
  const { duration } = video;
  return Number.isFinite(duration) && duration > 0;
}

function isMobileViewport() {
  return window.matchMedia('(max-width: 768px)').matches;
}

export default function CinematicHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameShellRef = useRef<HTMLDivElement>(null);
  const frameMatRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentScrimRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const dekRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const frameShell = frameShellRef.current;
    const frameMat = frameMatRef.current;
    const overlay = overlayRef.current;
    const content = contentRef.current;
    const contentScrim = contentScrimRef.current;
    const scrollCue = scrollCueRef.current;
    const video = videoRef.current;
    const poster = posterRef.current;
    if (
      !track ||
      !viewport ||
      !frameShell ||
      !frameMat ||
      !overlay ||
      !content ||
      !contentScrim ||
      !scrollCue ||
      !video ||
      !poster
    ) {
      return;
    }

    let mounted = true;
    let scrollReady = false;
    let usingFallback = false;
    let gsapCtx: { revert: () => void } | null = null;
    let heroTrigger: { kill: () => void; progress: number } | null = null;
    let mediaUnlocked = false;
    let unlockPromise: Promise<void> | null = null;
    let morphAtRest = false;
    let mobileMode = isMobileViewport();

    const getDuration = () =>
      isVideoReady(video) ? video.duration : HERO_VIDEO_DURATION;

    const setTrackHeight = () => {
      const scrollPx =
        getDuration() *
        (mobileMode ? MOBILE_SCROLL_PX_PER_VIDEO_SECOND : SCROLL_PX_PER_VIDEO_SECOND);
      track.style.setProperty('--hero-scroll-px', `${scrollPx}px`);
    };

    setTrackHeight();

    const ensurePaused = () => {
      if (!video.paused) video.pause();
    };

    // Same unlock pattern as SanctuaryTransition — play once, pause, then scrub.
    const unlockMedia = async () => {
      if (mediaUnlocked) return;
      if (unlockPromise) {
        await unlockPromise;
        return;
      }

      unlockPromise = (async () => {
        try {
          video.muted = true;
          video.playsInline = true;
          await video.play();
          video.pause();
          mediaUnlocked = true;
        } catch {
          mediaUnlocked = false;
        } finally {
          unlockPromise = null;
        }
      })();

      await unlockPromise;
    };

    // Direct seek — identical to the smooth sanctuary/seed scrub.
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

    const updateHeadline = (p: number, uiFade: number) => {
      if (line1Ref.current) {
        line1Ref.current.style.opacity = String(dramaticFade(p, 0.1, 0.42) * uiFade);
      }
      if (line2Ref.current) {
        line2Ref.current.style.opacity = String(dramaticFade(p, 0.16, 0.52) * uiFade);
      }
      if (dekRef.current) {
        dekRef.current.style.opacity = String(dramaticFade(p, 0.22, 0.62) * uiFade);
      }
    };

    const updateBoxMorph = (progress: number) => {
      const boxT = clamp((progress - BOX_MORPH_START) / (1 - BOX_MORPH_START), 0, 1);
      const eased = boxT * boxT * (3 - 2 * boxT);
      const textFade = 1 - clamp(boxT * 1.2, 0, 1);
      const scrimFade = 1 - clamp((boxT - 0.12) * 1.25, 0, 1);

      if (boxT <= 0) {
        if (!morphAtRest) {
          frameShell.style.width = '100%';
          frameShell.style.height = '100%';
          frameMat.style.padding = '0px';
          frameMat.style.borderRadius = '0px';
          frameMat.style.boxShadow = '0 0 0 rgba(26, 22, 18, 0)';
          viewport.style.background = lerpRgb(HERO_BG_COLOR, SURFACE_COLOR, 0);
          overlay.style.opacity = '1';
          morphAtRest = true;
        }
        content.style.opacity = '1';
        contentScrim.style.opacity = '1';
        scrollCue.style.opacity = '1';
        updateHeadline(progress, 1);
        return;
      }

      morphAtRest = false;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mediaW = Math.min(BOX_FRAME_WIDTH, vw * 0.88);
      const mediaH = mediaW / BOX_ASPECT;
      const matPad = BOX_MAT_PADDING * eased;
      const targetW = mediaW + matPad * 2;
      const targetH = mediaH + matPad * 2;

      frameShell.style.width = `${lerp(vw, targetW, eased)}px`;
      frameShell.style.height = `${lerp(vh, targetH, eased)}px`;
      frameMat.style.padding = `${matPad}px`;
      frameMat.style.borderRadius = `${lerp(0, 2, eased)}px`;
      frameMat.style.boxShadow = `0 ${lerp(0, 24, eased)}px ${lerp(0, 64, eased)}px rgba(26, 22, 18, ${lerp(0, 0.1, eased)})`;

      viewport.style.background = lerpRgb(HERO_BG_COLOR, SURFACE_COLOR, eased);
      overlay.style.opacity = String(lerp(1, 0, eased));
      content.style.opacity = String(textFade);
      contentScrim.style.opacity = String(scrimFade);
      scrollCue.style.opacity = String(textFade);

      updateHeadline(progress, textFade);
    };

    const update = (progress: number) => {
      const posterFade = clamp(progress / POSTER_FADE_END, 0, 1);
      poster.style.opacity = String(1 - posterFade);

      if (isVideoReady(video)) {
        if (progress > 0.001) {
          void unlockMedia();
        }
        const videoProgress = clamp(progress / BOX_MORPH_START, 0, 1);
        seekVideo(videoProgress * video.duration);
      }

      updateBoxMorph(progress);
    };

    const setupScrollTrigger = async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (!mounted) return;

      setTrackHeight();
      gsapCtx?.revert();
      heroTrigger?.kill();

      gsapCtx = gsap.context(() => {
        // Same scrub mechanics as SanctuaryTransition (direct seek + scrub: true).
        // pinSpacing stays false — track height already owns the scrub distance.
        heroTrigger = ScrollTrigger.create({
          id: 'hero-video',
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          pin: viewport,
          pinSpacing: false,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => setTrackHeight(),
          onUpdate: (self) => update(self.progress),
          onEnter: (self) => update(self.progress),
          onEnterBack: (self) => update(self.progress),
          onLeave: () => update(1),
          onLeaveBack: () => update(0),
        });

        update(heroTrigger.progress);
        window.dispatchEvent(new Event(HERO_SCROLL_READY_EVENT));
      }, track);
    };

    const initScrollTrigger = () => {
      if (!mounted || scrollReady) return;
      scrollReady = true;
      video.loop = false;
      video.autoplay = false;
      ensurePaused();
      void unlockMedia();
      if (isVideoReady(video) && video.currentTime > 0) {
        video.currentTime = 0;
      }
      void setupScrollTrigger();
    };

    const onVideoReady = () => {
      if (!mounted || scrollReady || !isVideoReady(video)) return;
      setTrackHeight();
      initScrollTrigger();
    };

    const onVideoError = () => {
      if (!mounted || usingFallback) return;
      usingFallback = true;
      scrollReady = false;
      video.src = HERO_VIDEO_MOV;
      video.load();
    };

    const onFirstInteraction = () => {
      if (mediaUnlocked) return;
      void unlockMedia().then(() => {
        if (heroTrigger) update(heroTrigger.progress);
      });
    };

    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.preload = 'auto';
    video.loop = false;
    video.autoplay = false;
    video.removeAttribute('autoplay');
    ensurePaused();

    video.addEventListener('loadedmetadata', onVideoReady);
    video.addEventListener('durationchange', onVideoReady);
    video.addEventListener('error', onVideoError);
    window.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });
    window.addEventListener('wheel', onFirstInteraction, { once: true, passive: true });
    window.addEventListener('scroll', onFirstInteraction, { once: true, passive: true });
    window.addEventListener('pointerdown', onFirstInteraction, { once: true });

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA && isVideoReady(video)) {
      onVideoReady();
    } else {
      video.load();
    }

    const fallbackTimer = window.setTimeout(() => {
      if (!mounted || scrollReady) return;
      usingFallback = true;
      initScrollTrigger();
    }, 2500);

    const onResize = async () => {
      const nextMobileMode = isMobileViewport();
      if (nextMobileMode !== mobileMode) {
        mobileMode = nextMobileMode;
        ensurePaused();
        await setupScrollTrigger();
        return;
      }

      setTrackHeight();
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      ScrollTrigger.refresh();
      if (heroTrigger) update(heroTrigger.progress);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    return () => {
      mounted = false;
      window.clearTimeout(fallbackTimer);
      video.removeEventListener('loadedmetadata', onVideoReady);
      video.removeEventListener('durationchange', onVideoReady);
      video.removeEventListener('error', onVideoError);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('wheel', onFirstInteraction);
      window.removeEventListener('scroll', onFirstInteraction);
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      heroTrigger?.kill();
      gsapCtx?.revert();
    };
  }, []);

  return (
    <div ref={trackRef} id="hero" className={styles.track} aria-label="Hero">
      <div ref={viewportRef} className={styles.viewport}>
        <div className={styles.stage}>
          <div ref={frameShellRef} className={styles.frameShell}>
            <div ref={frameMatRef} className={styles.frameMat}>
              <div className={styles.mediaLayer}>
                <video
                  ref={videoRef}
                  id="heroVideo"
                  className={styles.video}
                  muted
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                >
                  <source
                    src={HERO_VIDEO_MOBILE_MP4}
                    type="video/mp4"
                    media={MOBILE_VIDEO_MEDIA}
                  />
                  <source src={HERO_VIDEO_MP4} type="video/mp4" />
                </video>
                <div ref={posterRef} className={styles.poster}>
                  <Image
                    src={HERO_POSTER}
                    alt=""
                    fill
                    preload
                    unoptimized
                    sizes="100vw"
                    className={styles.posterImage}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={overlayRef} className={styles.overlay} aria-hidden="true" />

        <div ref={contentScrimRef} className={styles.contentScrim} aria-hidden="true" />

        <div ref={contentRef} className={styles.content}>
          <h1 className={styles.headline}>
            <span ref={line1Ref} className={styles.headlineLine}>
              Creative Director &amp;
            </span>
            <span ref={line2Ref} className={styles.headlineLine}>
              Regenerative Designer
            </span>
          </h1>
          <p ref={dekRef} className={styles.dek}>
            Designing spaces, brands, and experiences that reconnect people with nature,
            purpose, and place.
          </p>
        </div>

        <div ref={scrollCueRef} className={styles.scrollCue} aria-hidden="true">
          <span className={styles.scrollCueText}>Scroll to discover</span>
          <svg
            className={styles.scrollCueArrow}
            width="22"
            height="30"
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

'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './CinematicHero.module.css';
import { HERO_SCROLL_READY_EVENT } from '@/components/ScrollTriggerManager';

const HERO_VIDEO_MP4 = '/videos/hero.mp4';
const HERO_VIDEO_MOV = '/videos/hero.mov';
const HERO_POSTER = '/hero-poster.JPEG';
const HERO_VIDEO_DURATION = 22;
const SCROLL_PX_PER_VIDEO_SECOND = 360;
const MOBILE_SCROLL_PX_PER_VIDEO_SECOND = 120;
const POSTER_FADE_END = 0.015;
const BOX_MORPH_START = 0.58;
const BOX_FRAME_WIDTH = 666;
const BOX_ASPECT = 16 / 10;
const BOX_MAT_PADDING = 20;
const VIDEO_SMOOTHING = 0.14;
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

export default function CinematicHero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const frameShellRef = useRef<HTMLDivElement>(null);
  const frameMatRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const frameShell = frameShellRef.current;
    const frameMat = frameMatRef.current;
    const overlay = overlayRef.current;
    const content = contentRef.current;
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
    let heroTrigger: { kill: () => void } | null = null;
    let targetVideoTime = 0;
    let videoRafId: number | null = null;
    let mobileMode = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;

    const getDuration = () =>
      isVideoReady(video) ? video.duration : HERO_VIDEO_DURATION;

    const setTrackHeight = () => {
      const scrollPx =
        getDuration() *
        (mobileMode ? MOBILE_SCROLL_PX_PER_VIDEO_SECOND : SCROLL_PX_PER_VIDEO_SECOND);
      track.style.setProperty('--hero-scroll-px', `${scrollPx}px`);
    };

    const smoothVideoFrame = () => {
      if (!isVideoReady(video)) {
        videoRafId = null;
        return;
      }

      const delta = targetVideoTime - video.currentTime;
      if (Math.abs(delta) > 0.015) {
        video.currentTime += delta * VIDEO_SMOOTHING;
        videoRafId = requestAnimationFrame(smoothVideoFrame);
        return;
      }

      video.currentTime = targetVideoTime;
      videoRafId = null;
    };

    const startMobilePlayback = () => {
      if (!mobileMode) return;
      video.loop = true;
      void video.play().catch(() => {
        // Muted inline playback is supported on modern mobile browsers;
        // the poster remains visible if a browser still blocks playback.
      });
    };

    const scrubVideo = (progress: number) => {
      const posterFade = clamp(progress / POSTER_FADE_END, 0, 1);
      poster.style.opacity = String(1 - posterFade);

      if (mobileMode) return;
      if (!isVideoReady(video)) return;
      const videoProgress = clamp(progress / BOX_MORPH_START, 0, 1);
      targetVideoTime = videoProgress * video.duration;
      if (videoRafId === null) {
        videoRafId = requestAnimationFrame(smoothVideoFrame);
      }
    };

    const updateHeadline = (p: number, uiFade: number) => {
      if (line1Ref.current) {
        line1Ref.current.style.opacity = String(dramaticFade(p, 0.1, 0.24) * uiFade);
      }
      if (line2Ref.current) {
        line2Ref.current.style.opacity = String(dramaticFade(p, 0.05, 0.16) * uiFade);
      }
      if (line3Ref.current) {
        line3Ref.current.style.opacity = String(dramaticFade(p, 0.01, 0.08) * uiFade);
      }
    };

    const updateBoxMorph = (progress: number) => {
      const boxT = clamp((progress - BOX_MORPH_START) / (1 - BOX_MORPH_START), 0, 1);
      const eased = boxT < 0.5 ? 2 * boxT * boxT : 1 - Math.pow(-2 * boxT + 2, 2) / 2;
      const uiFade = 1 - clamp(boxT * 1.35, 0, 1);

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
      content.style.opacity = String(uiFade);
      scrollCue.style.opacity = String(uiFade);

      updateHeadline(progress, uiFade);
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
        heroTrigger = ScrollTrigger.create({
          id: 'hero-video',
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          pin: viewport,
          pinSpacing: true,
          pinReparent: false,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!self.isActive) return;
            scrubVideo(self.progress);
            updateBoxMorph(self.progress);
          },
          onLeave: () => {
            if (!mobileMode && isVideoReady(video)) {
              video.currentTime = video.duration;
            }
            updateBoxMorph(1);
            video.pause();
          },
          onEnterBack: (self) => {
            if (mobileMode) {
              startMobilePlayback();
            } else {
              scrubVideo(self.progress);
            }
            updateBoxMorph(self.progress);
          },
          onLeaveBack: () => {
            video.pause();
            if (mobileMode && isVideoReady(video)) {
              video.currentTime = 0;
            }
            scrubVideo(0);
            updateBoxMorph(0);
          },
        });

        scrubVideo(0);
        updateBoxMorph(0);
        ScrollTrigger.refresh();
        window.dispatchEvent(new Event(HERO_SCROLL_READY_EVENT));
      }, track);
    };

    const initScrollTrigger = () => {
      if (!mounted || scrollReady) return;
      scrollReady = true;
      if (mobileMode) {
        startMobilePlayback();
      } else {
        video.pause();
        video.currentTime = 0;
      }
      void setupScrollTrigger();
    };

    const onVideoReady = () => {
      if (!mounted || scrollReady || !isVideoReady(video)) return;
      initScrollTrigger();
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

    const fallbackTimer = window.setTimeout(() => {
      if (!mounted || scrollReady) return;
      usingFallback = true;
      initScrollTrigger();
    }, 2000);

    const onResize = async () => {
      const nextMobileMode = window.matchMedia(
        '(max-width: 768px), (pointer: coarse)'
      ).matches;
      if (nextMobileMode !== mobileMode) {
        mobileMode = nextMobileMode;
        video.loop = mobileMode;
        if (mobileMode) {
          startMobilePlayback();
        } else {
          video.pause();
        }
        await setupScrollTrigger();
        return;
      }

      setTrackHeight();
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const hero = ScrollTrigger.getById('hero-video');
      updateBoxMorph(hero?.progress ?? 0);
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', onResize);

    return () => {
      mounted = false;
      window.clearTimeout(fallbackTimer);
      video.removeEventListener('loadedmetadata', onVideoReady);
      video.removeEventListener('durationchange', onVideoReady);
      video.removeEventListener('error', onVideoError);
      window.removeEventListener('resize', onResize);
      if (videoRafId !== null) cancelAnimationFrame(videoRafId);
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
                  src={HERO_VIDEO_MP4}
                  muted
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                />
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

        <div ref={contentRef} className={styles.content}>
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
        </div>

        <div ref={scrollCueRef} className={styles.scrollCue} aria-hidden="true">
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

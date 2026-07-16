'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useEditorialReveal } from '@/hooks/useEditorialReveal';
import ScrollSpinModelSection from '@/components/sections/ScrollSpinModelSection';
import {
  IMMERSIVE_CONTACT_HREF,
  IMMERSIVE_SELECTED_WORLDS_HREF,
} from '@/config/siteRoutes';
import {
  WEBSITE_DEV_CLOSING,
  WEBSITE_DEV_CRAFT,
  WEBSITE_DEV_HERO,
  WEBSITE_DEV_HERO_VIDEO,
  WEBSITE_DEV_OUTCOMES,
  WEBSITE_DEV_PILLARS,
  WEBSITE_DEV_PILLARS_HEADER,
  WEBSITE_DEV_STATEMENT,
  WEBSITE_DEV_VISION,
} from '@/data/websiteDevelopmentStory';
import styles from './WebsiteDevelopmentStory.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HERO_FRAME_WIDTH = 720;
const HERO_FRAME_ASPECT = 16 / 10;
const HERO_MAT_PADDING = 20;

export default function WebsiteDevelopmentStory() {
  const rootRef = useRef<HTMLElement>(null);
  const heroTrackRef = useRef<HTMLElement>(null);
  const heroViewportRef = useRef<HTMLDivElement>(null);
  const heroFrameRef = useRef<HTMLDivElement>(null);
  const heroMatRef = useRef<HTMLDivElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroScrimRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const returnLinkRef = useRef<HTMLAnchorElement>(null);
  const visionSectionRef = useRef<HTMLElement>(null);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  useEditorialReveal(rootRef);

  useEffect(() => {
    window.scrollTo(0, 0);

    const video = heroVideoRef.current;
    if (!video) return;

    const reveal = () => setHeroVideoReady(true);
    video.addEventListener('playing', reveal, { once: true });

    if (!video.paused && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setHeroVideoReady(true);
    }

    return () => {
      video.removeEventListener('playing', reveal);
    };
  }, []);

  useGSAP(
    () => {
      const returnLink = returnLinkRef.current;
      const visionSection = visionSectionRef.current;
      if (!returnLink || !visionSection) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      gsap.fromTo(
        returnLink,
        { opacity: 0.76 },
        {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: visionSection,
            start: 'top 92%',
            end: 'top 72%',
            scrub: 0.6,
            invalidateOnRefresh: true,
            onLeave: () => {
              returnLink.style.pointerEvents = 'none';
            },
            onEnterBack: () => {
              returnLink.style.pointerEvents = 'auto';
            },
          },
        }
      );
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      const viewport = heroViewportRef.current;
      const frame = heroFrameRef.current;
      const mat = heroMatRef.current;
      const video = heroVideoRef.current;
      const scrim = heroScrimRef.current;
      const copy = heroCopyRef.current;
      if (!viewport || !frame || !mat || !video || !scrim || !copy) return;

      let framed = false;

      const getFrameDimensions = () => {
        const viewportWidth = window.innerWidth;
        const mediaWidth = Math.min(HERO_FRAME_WIDTH, viewportWidth * 0.88);
        const mediaHeight = mediaWidth / HERO_FRAME_ASPECT;
        return {
          width: mediaWidth + HERO_MAT_PADDING * 2,
          height: mediaHeight + HERO_MAT_PADDING * 2,
        };
      };

      const showFramedVideo = () => {
        if (framed) return;
        framed = true;
        const dimensions = getFrameDimensions();

        gsap
          .timeline({ defaults: { ease: 'power3.inOut' } })
          .to(copy, { opacity: 0, duration: 0.8 }, 0)
          .to(scrim, { opacity: 0, duration: 1.4 }, 0)
          .to(viewport, { backgroundColor: '#f0e9df', duration: 2.6 }, 0)
          .to(
            frame,
            {
              width: dimensions.width,
              height: dimensions.height,
              duration: 2.6,
            },
            0
          )
          .to(
            mat,
            {
              padding: HERO_MAT_PADDING,
              boxShadow: '0 24px 64px rgba(26, 22, 18, 0.12)',
              duration: 2.6,
            },
            0
          );
      };

      video.muted = true;
      video.playsInline = true;
      video.loop = false;

      gsap.set(frame, { width: '100%', height: '100%' });
      gsap.set(mat, { padding: 0, boxShadow: '0 24px 64px rgba(26, 22, 18, 0)' });
      gsap.set(viewport, { backgroundColor: '#14110e' });
      gsap.set([scrim, copy], { opacity: 1 });

      const startPlayback = () => {
        video.currentTime = 0;
        void video.play().catch(() => {
          // The autoplay attribute provides the same muted fallback path.
        });
      };

      const onResize = () => {
        if (!framed) return;
        gsap.set(frame, getFrameDimensions());
      };

      video.addEventListener('ended', showFramedVideo);
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        startPlayback();
      } else {
        video.addEventListener('canplay', startPlayback, { once: true });
      }
      window.addEventListener('resize', onResize);

      return () => {
        video.removeEventListener('ended', showFramedVideo);
        video.removeEventListener('canplay', startPlayback);
        window.removeEventListener('resize', onResize);
      };
    },
    { scope: heroTrackRef }
  );

  return (
    <main ref={rootRef} className={styles.story}>
      <Link ref={returnLinkRef} href={IMMERSIVE_SELECTED_WORLDS_HREF} className={styles.returnLink}>
        <span className={styles.returnArrow} aria-hidden="true">
          ←
        </span>
        <span>Return to Selected Worlds</span>
      </Link>

      <section
        ref={heroTrackRef}
        className={styles.hero}
        aria-label="Website development hero"
      >
        <div ref={heroViewportRef} className={styles.heroViewport}>
          <div className={styles.heroStage}>
            <div ref={heroFrameRef} className={styles.heroFrame}>
              <div ref={heroMatRef} className={styles.heroMat}>
                <div className={styles.heroMedia}>
                  <video
                    ref={heroVideoRef}
                    className={`${styles.heroVisual} ${heroVideoReady ? styles.heroVisualReady : ''}`}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden="true"
                  >
                    <source
                      src={WEBSITE_DEV_HERO_VIDEO.src}
                      type="video/mp4"
                    />
                  </video>
                  <div ref={heroScrimRef} className={styles.heroScrim} aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
          <div ref={heroCopyRef} className={styles.heroCopy}>
            <p className={styles.heroEyebrow}>{WEBSITE_DEV_HERO.eyebrow}</p>
            <h1 className={styles.heroTitle}>{WEBSITE_DEV_HERO.title}</h1>
          </div>
        </div>
      </section>

      <section
        ref={visionSectionRef}
        className={`${styles.section} ${styles.visionSection}`}
        aria-label="What we are here to solve"
      >
        <div className={styles.sectionInner}>
          <div className={styles.visionLayout}>
            <div className={`${styles.splitCopy} ${styles.visionCopy}`}>
              <p className={styles.kicker} data-editorial-reveal>
                {WEBSITE_DEV_VISION.kicker}
              </p>
              <div className={styles.prose} data-editorial-reveal>
                {WEBSITE_DEV_VISION.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>
            <figure
              className={styles.storyMedia}
              style={{ aspectRatio: WEBSITE_DEV_VISION.placeholder.aspect }}
              data-editorial-reveal
            >
              <video
                className={styles.storyVideo}
                src="/work/website-development/first-heartbeat.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Branded digital story opening sequence"
              />
              <div className={styles.videoTextCover} aria-hidden="true" />
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.sectionMuted} aria-label="Statement">
        <div className={styles.sectionInner}>
          <p className={styles.statement} data-editorial-reveal>
            {WEBSITE_DEV_STATEMENT}
          </p>
        </div>
      </section>

      <section className={styles.section} aria-label="Brand environment">
        <div className={styles.sectionInner}>
          <div className={`${styles.splitReverse} ${styles.craftLayout}`}>
            <figure className={styles.craftMedia} data-editorial-reveal>
              <Image
                src={WEBSITE_DEV_CRAFT.image.src}
                alt={WEBSITE_DEV_CRAFT.image.alt}
                width={WEBSITE_DEV_CRAFT.image.width}
                height={WEBSITE_DEV_CRAFT.image.height}
                sizes="(max-width: 900px) 100vw, 68vw"
                quality={100}
                unoptimized
                className={styles.craftImage}
              />
            </figure>
            <div className={styles.splitCopy}>
              <p className={styles.kicker} data-editorial-reveal>
                {WEBSITE_DEV_CRAFT.kicker}
              </p>
              <div className={styles.prose} data-editorial-reveal>
                {WEBSITE_DEV_CRAFT.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionMuted} aria-label="Business outcomes">
        <div className={styles.sectionInner}>
          <p className={`${styles.kicker} ${styles.kickerCenter}`} data-editorial-reveal>
            {WEBSITE_DEV_OUTCOMES.kicker}
          </p>
          <div className={styles.outcomeCopy} data-editorial-reveal>
            {WEBSITE_DEV_OUTCOMES.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className={styles.prose}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.pillarsSection}`} aria-label="Four parts of the work">
        <div className={styles.sectionInner}>
          <h2 className={styles.pillarsHeader} data-editorial-reveal>
            {WEBSITE_DEV_PILLARS_HEADER}
          </h2>
          <div className={styles.pillarsList}>
            {WEBSITE_DEV_PILLARS.map((pillar, index) => (
              <article
                key={pillar.image.src}
                className={`${styles.pillar} ${index % 2 === 1 ? styles.pillarReversed : ''}`}
              >
                <div className={styles.pillarInner}>
                  <figure className={styles.pillarMedia} data-editorial-reveal>
                    <div className={styles.pillarMat}>
                      <Image
                        src={pillar.image.src}
                        alt={pillar.image.alt}
                        width={pillar.image.width}
                        height={pillar.image.height}
                        sizes="(max-width: 900px) 100vw, 72vw"
                        quality={100}
                        unoptimized
                        className={styles.pillarImage}
                      />
                    </div>
                  </figure>
                  <div className={styles.pillarCopy} data-editorial-reveal>
                    <span className={styles.pillarIndex}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className={styles.pillarTitle}>{pillar.title}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ScrollSpinModelSection />

      <section className={styles.sectionDark} aria-label="Closing">
        <div className={`${styles.sectionInner} ${styles.closingInner}`}>
          <p className={styles.closingLine} data-editorial-reveal>
            {WEBSITE_DEV_CLOSING.line}
          </p>
          <Link href={IMMERSIVE_CONTACT_HREF} className={styles.closingCta} data-editorial-reveal>
            {WEBSITE_DEV_CLOSING.cta} →
          </Link>
        </div>
      </section>
    </main>
  );
}

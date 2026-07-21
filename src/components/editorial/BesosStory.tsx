'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IMMERSIVE_CONTACT_HREF } from '@/config/siteRoutes';
import WorkBackLink from '@/components/work/WorkBackLink';
import { useEditorialReveal } from '@/hooks/useEditorialReveal';
import {
  BESOS_CLOSING,
  BESOS_CONSTRUCTION,
  BESOS_DIGITAL,
  BESOS_HERO,
  BESOS_INDEX,
  BESOS_INTRO,
  BESOS_MARKETING,
  BESOS_MEDIA,
  BESOS_MENU,
  BESOS_STATEMENT,
} from '@/data/besosStory';
import styles from './BesosStory.module.css';

export default function BesosStory() {
  const rootRef = useRef<HTMLElement>(null);
  useEditorialReveal(rootRef);

  return (
    <main ref={rootRef} className={styles.story}>
      <nav className={styles.nav} aria-label="Project navigation">
        <WorkBackLink className={styles.navLink} />
        <span className={styles.navIndex}>{BESOS_INDEX}</span>
      </nav>

      <section className={styles.hero} aria-label="BESOS hero">
        <div className={styles.heroMedia} data-parallax="-28">
          <Image
            src={BESOS_MEDIA.hero.src}
            alt={BESOS_MEDIA.hero.alt}
            width={BESOS_MEDIA.hero.width}
            height={BESOS_MEDIA.hero.height}
            className={styles.heroImage}
            priority
            sizes="100vw"
          />
          <div className={styles.heroScrim} aria-hidden="true" />
        </div>
        <div className={styles.heroCopy} data-editorial-reveal>
          <p className={styles.heroEyebrow}>{BESOS_HERO.eyebrow}</p>
          <h1 className={styles.heroTitle}>{BESOS_HERO.title}</h1>
          <p className={styles.heroSubtitle}>{BESOS_HERO.subtitle}</p>
        </div>
      </section>

      <section className={styles.section} aria-label="Introduction">
        <div className={styles.sectionInner}>
          <div className={styles.split}>
            <div className={styles.splitCopy}>
              <p className={styles.kicker} data-editorial-reveal>
                {BESOS_INTRO.kicker}
              </p>
              <p className={styles.prose} data-editorial-reveal>
                {BESOS_INTRO.copy}
              </p>
            </div>
            <figure className={styles.videoFrame} data-editorial-reveal data-parallax="-16">
              <video
                className={styles.mediaVideo}
                src={BESOS_MEDIA.brandReel.src}
                poster={BESOS_MEDIA.brandReel.poster}
                autoPlay
                muted
                loop
                playsInline
                aria-label="BESOS brand motion"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.sectionMuted} aria-label="Statement">
        <div className={styles.sectionInner}>
          <p className={styles.statement} data-editorial-reveal>
            {BESOS_STATEMENT}
          </p>
        </div>
      </section>

      <section className={styles.section} aria-label="Building the space">
        <div className={styles.sectionInner}>
          <div className={styles.splitReverse}>
            <figure
              className={`${styles.matFrame} ${styles.matFrameSmall}`}
              data-editorial-reveal
              data-parallax="-18"
            >
              <div className={styles.photoMat}>
                <Image
                  src={BESOS_MEDIA.construction.src}
                  alt={BESOS_MEDIA.construction.alt}
                  width={BESOS_MEDIA.construction.width}
                  height={BESOS_MEDIA.construction.height}
                  className={styles.photoMatImage}
                  sizes="(max-width: 560px) 80vw, 300px"
                />
              </div>
            </figure>
            <div className={styles.splitCopy}>
              <p className={styles.kicker} data-editorial-reveal>
                {BESOS_CONSTRUCTION.kicker}
              </p>
              <p className={styles.prose} data-editorial-reveal>
                {BESOS_CONSTRUCTION.copy}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionMuted} aria-label="Brand presence">
        <div className={styles.sectionInnerWide}>
          <p className={`${styles.kicker} ${styles.kickerCenter}`} data-editorial-reveal>
            {BESOS_MARKETING.kicker}
          </p>
          <p className={styles.proseCenter} data-editorial-reveal>
            {BESOS_MARKETING.copy}
          </p>
          <figure className={styles.matFrame} data-editorial-reveal data-parallax="-12">
            <div className={styles.photoMat}>
              <Image
                src={BESOS_MEDIA.socialGrid.src}
                alt={BESOS_MEDIA.socialGrid.alt}
                width={BESOS_MEDIA.socialGrid.width}
                height={BESOS_MEDIA.socialGrid.height}
                className={styles.photoMatImage}
                sizes="(max-width: 960px) 92vw, 880px"
              />
            </div>
          </figure>
        </div>
      </section>

      <section className={styles.section} aria-label="Print and design">
        <div className={styles.sectionInner}>
          <div className={styles.split}>
            <div className={styles.splitCopy}>
              <p className={styles.kicker} data-editorial-reveal>
                {BESOS_MENU.kicker}
              </p>
              <p className={styles.prose} data-editorial-reveal>
                {BESOS_MENU.copy}
              </p>
            </div>
            <figure className={styles.matFrame} data-editorial-reveal data-parallax="-14">
              <div className={styles.photoMat}>
                <Image
                  src={BESOS_MEDIA.menu.src}
                  alt={BESOS_MEDIA.menu.alt}
                  width={BESOS_MEDIA.menu.width}
                  height={BESOS_MEDIA.menu.height}
                  className={styles.photoMatImage}
                  sizes="(max-width: 560px) 100vw, 420px"
                />
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.sectionMuted} aria-label="Digital experience">
        <div className={styles.sectionInner}>
          <div className={styles.digitalStack}>
            <div className={styles.digitalCopy} data-editorial-reveal>
              <p className={styles.kicker}>{BESOS_DIGITAL.kicker}</p>
              <p className={styles.prose}>{BESOS_DIGITAL.copy}</p>
            </div>
            <figure className={styles.matFrame} data-editorial-reveal data-parallax="-14">
              <div className={styles.photoMat}>
                <Image
                  src={BESOS_MEDIA.website.src}
                  alt={BESOS_MEDIA.website.alt}
                  width={BESOS_MEDIA.website.width}
                  height={BESOS_MEDIA.website.height}
                  className={styles.photoMatImage}
                  sizes="(max-width: 720px) 92vw, 480px"
                />
              </div>
            </figure>
            <figure className={styles.videoBelow} data-editorial-reveal data-parallax="-10">
              <video
                className={styles.mediaVideo}
                src={BESOS_MEDIA.walkthrough.src}
                poster={BESOS_MEDIA.walkthrough.poster}
                autoPlay
                muted
                loop
                playsInline
                controls
                aria-label="BESOS space walkthrough"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className={styles.sectionDark} aria-label="Closing">
        <div className={`${styles.sectionInner} ${styles.closingInner}`}>
          <p className={styles.closingLine} data-editorial-reveal>
            {BESOS_CLOSING.line}
          </p>
          <Link href={IMMERSIVE_CONTACT_HREF} className={styles.closingCta} data-editorial-reveal>
            {BESOS_CLOSING.cta} →
          </Link>
        </div>
      </section>
    </main>
  );
}

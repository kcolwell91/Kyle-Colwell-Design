'use client';

import { useRef } from 'react';
import { Italianno } from 'next/font/google';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SITE_CONTACT, SITE_CONTACT_MAILTO, SITE_CONTACT_TEL } from '@/data/siteContact';
import styles from './ServicesClosingSection.module.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const italianno = Italianno({
  subsets: ['latin'],
  weight: '400',
});

const HEADLINE = "Let's build a more beautiful world together";
const HEADLINE_LINES = ["Let's build a more", 'beautiful world together'] as const;

export default function ServicesClosingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const lines = section.querySelectorAll<HTMLElement>('[data-closing-line]');
      const cta = section.querySelector<HTMLElement>('[data-closing-cta]');
      const divider = section.querySelector<HTMLElement>('[data-closing-divider]');
      const contactItems = section.querySelectorAll<HTMLElement>('[data-closing-contact]');

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set([lines, cta, divider, contactItems], { opacity: 1, y: 0, scaleX: 1 });
        return;
      }

      gsap.set(lines, { opacity: 0, y: 36 });
      gsap.set(cta, { opacity: 0, y: 20 });
      gsap.set(divider, { opacity: 0, scaleX: 0 });
      gsap.set(contactItems, { opacity: 0, y: 18 });

      let trigger: ScrollTrigger | undefined;

      const init = async () => {
        if (document.fonts?.ready) {
          await document.fonts.ready;
        }
        ScrollTrigger.refresh();

        trigger = ScrollTrigger.create({
          trigger: section,
          start: 'top 78%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.to(lines, {
              opacity: 1,
              y: 0,
              duration: 1.4,
              stagger: 0.28,
            })
              .to(
                cta,
                {
                  opacity: 1,
                  y: 0,
                  duration: 1.05,
                },
                '-=0.55'
              )
              .to(
                divider,
                {
                  opacity: 1,
                  scaleX: 1,
                  duration: 1.35,
                  ease: 'power2.inOut',
                },
                '-=0.35'
              )
              .to(
                contactItems,
                {
                  opacity: 1,
                  y: 0,
                  duration: 1.1,
                  stagger: 0.14,
                },
                '-=0.75'
              );
          },
        });

        if (trigger.isActive) {
          gsap.set(lines, { opacity: 1, y: 0 });
          gsap.set(cta, { opacity: 1, y: 0 });
          gsap.set(divider, { opacity: 1, scaleX: 1 });
          gsap.set(contactItems, { opacity: 1, y: 0 });
        }
      };

      void init();

      return () => {
        trigger?.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className={styles.closing}
      aria-label="Closing invitation"
    >
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.radialLight} />
        <div className={styles.paperTexture} />
      </div>

      <div className={styles.content}>
        <div className={styles.headlineWrap}>
          <p
            className={`${styles.headline} ${italianno.className}`}
            aria-label={HEADLINE}
          >
            {HEADLINE_LINES.map((line) => (
              <span key={line} data-closing-line className={styles.headlineLine}>
                {line}
              </span>
            ))}
          </p>
        </div>

        <div className={styles.ctaWrap}>
          <a
            href={SITE_CONTACT_MAILTO}
            className={styles.ctaLink}
            data-closing-cta
          >
            <span className={styles.ctaLabel}>Start a conversation</span>
            <span className={styles.ctaArrow} aria-hidden="true">
              →
            </span>
            <span className={styles.ctaUnderline} aria-hidden="true" />
          </a>
        </div>

        <div className={styles.transition}>
          <div className={styles.divider} data-closing-divider aria-hidden="true" />
        </div>

        <address className={styles.contact}>
          <p className={styles.contactEyebrow} data-closing-contact>
            Contact
          </p>
          <div className={styles.contactPrimary}>
            <a
              href={SITE_CONTACT_MAILTO}
              className={styles.contactEmail}
              data-closing-contact
            >
              {SITE_CONTACT.email}
            </a>
          </div>
          <div className={styles.contactMeta} data-closing-contact>
            <a href={SITE_CONTACT_TEL} className={styles.contactPhone}>
              {SITE_CONTACT.phoneDisplay}
            </a>
            <span className={styles.contactDivider} aria-hidden="true">
              ·
            </span>
            <span className={styles.contactLocation}>{SITE_CONTACT.location}</span>
          </div>
        </address>
      </div>
    </section>
  );
}

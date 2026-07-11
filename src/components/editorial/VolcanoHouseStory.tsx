'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useEditorialReveal } from '@/hooks/useEditorialReveal';
import { VOLCANO_EXPERIENCE_GALLERY, VOLCANO_HOUSE_IMAGES, VOLCANO_HOUSE_VIDEO } from '@/data/volcanoHouseStory';
import styles from './VolcanoHouseStory.module.css';

export default function VolcanoHouseStory() {
  const rootRef = useRef<HTMLElement>(null);
  useEditorialReveal(rootRef);

  return (
    <main ref={rootRef} className={styles.story}>
      <nav className={styles.nav} data-editorial-reveal>
        <Link href="/#selected-worlds" className={styles.navLink}>
          ← Selected Worlds
        </Link>
        <span className={styles.navIndex}>01</span>
      </nav>

      <section className={styles.hero} aria-label="Volcano House hero">
        <div className={styles.heroMedia} data-parallax="-36">
          <video
            className={styles.heroVideo}
            src={VOLCANO_HOUSE_VIDEO.src}
            poster={VOLCANO_HOUSE_VIDEO.poster}
            autoPlay
            muted
            loop
            playsInline
            aria-label="Volcano House"
          />
          <div className={styles.heroScrim} aria-hidden="true" />
        </div>
        <div className={styles.heroCopy} data-editorial-reveal>
          <p className={styles.heroEyebrow}>Build &amp; Design · Volcano, Hawai&apos;i</p>
          <h1 className={styles.heroTitle}>
            Build and Design of a 5 Star Airbnb in Hawai&apos;i
          </h1>
          <p className={styles.heroSubtitle}>The project that changed everything.</p>
        </div>
      </section>

      <section className={styles.section} aria-label="The beginning">
        <div className={styles.sectionInner}>
          <div className={styles.split}>
            <div className={styles.splitCopy}>
              <p className={styles.kicker} data-editorial-reveal>
                The Beginning
              </p>
              <div className={styles.prose} data-editorial-reveal>
                <p>
                  In 2018 I started building something that was not just a rental. I wanted a
                  place where people could slow down and be somewhere real.
                </p>
                <p>
                  That became Volcano House in Volcano, Hawai&apos;i. Fully off-grid, solar power,
                  rainwater catchment. I designed it and built it myself, from structure to the last
                  detail.
                </p>
              </div>
            </div>
            <div className={styles.splitMediaStack}>
              <figure className={styles.splitPhoto} data-editorial-reveal>
                <div className={styles.photoMat}>
                  <Image
                    src={VOLCANO_HOUSE_IMAGES.bedroom}
                    alt="Bedroom with hand-painted mural and rainforest view"
                    width={900}
                    height={1200}
                    sizes="(max-width: 560px) 100vw, 512px"
                    className={styles.photoMatImage}
                  />
                </div>
              </figure>
              <figure className={styles.splitPhoto} data-editorial-reveal>
                <div className={styles.photoMat}>
                  <Image
                    src={VOLCANO_HOUSE_IMAGES.kitchen}
                    alt="Kitchen looking out to the rainforest"
                    width={1200}
                    height={800}
                    sizes="(max-width: 560px) 100vw, 512px"
                    className={styles.photoMatImage}
                  />
                </div>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionMuted} aria-label="Building the project">
        <div className={styles.sectionInner}>
          <p className={styles.kickerCenter} data-editorial-reveal>
            Building
          </p>
          <p className={styles.ledeCenter} data-editorial-reveal>
            I was on site from day one, working through structure, systems, and what the stay
            should feel like.
          </p>

          <figure className={styles.figureBuildingOrigin} data-editorial-reveal data-parallax="-20">
            <div className={styles.photoMatWide}>
              <Image
                src={VOLCANO_HOUSE_IMAGES.buildingOrigin}
                alt="Early construction of Volcano House in the rainforest"
                width={1600}
                height={900}
                sizes="(max-width: 720px) 90vw, 512px"
                className={styles.photoMatImage}
              />
            </div>
          </figure>

          <figure className={styles.figureBoxed} data-editorial-reveal data-parallax="-14">
            <div className={styles.photoMat}>
              <Image
                src={VOLCANO_HOUSE_IMAGES.lanaiBuild}
                alt="Lanai framing under construction, open to the forest"
                width={1024}
                height={963}
                sizes="(max-width: 560px) 100vw, 512px"
                className={styles.photoMatImage}
                unoptimized
              />
            </div>
          </figure>

          <div className={styles.copyBlock} data-editorial-reveal>
            <p className={styles.prose}>
              From the rain catchment, solar, materials that looked and felt like it belonged in
              the Ohia forest, to rooms that had expansive outdoor views. Every decision came back
              to the land and the feeling.
            </p>
            <p className={styles.prose}>
              What came out of it was proof that hospitality could be an experience that inspires
              connection to ourselves and the land by living regeneratively.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.sectionGallery} aria-label="Designing the experience">
        <div className={styles.sectionInner}>
          <p className={styles.kickerCenter} data-editorial-reveal>
            Designing the Experience
          </p>
          <p className={styles.ledeCenter} data-editorial-reveal>
            I thought about each room as a specific feeling. Light, cocoon, texture, quiet.
          </p>

          <div className={styles.gallery}>
            {VOLCANO_EXPERIENCE_GALLERY.map((item) => (
              <figure
                key={item.src}
                className={`${styles.galleryBox} ${
                  item.layout === 'portrait' ? styles.galleryBoxPortrait : styles.galleryBoxLandscape
                }`}
                data-editorial-reveal
              >
                <div className={styles.photoMat}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 900px) 85vw, 512px"
                    quality={92}
                    className={styles.photoMatImage}
                  />
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.reflection} aria-label="Reflection">
        <div className={styles.sectionInner}>
          <figure className={styles.reflectionFigure} data-editorial-reveal>
            <div className={styles.photoMat}>
              <Image
                src={VOLCANO_HOUSE_IMAGES.bathroom}
                alt="Moody bathroom with stone and water"
                width={1200}
                height={800}
                sizes="(max-width: 560px) 100vw, 512px"
                className={styles.photoMatImage}
              />
            </div>
          </figure>
          <div className={styles.reflectionCopy} data-editorial-reveal>
            <p className={styles.kickerCenter}>Reflection</p>
            <p className={styles.reflectionText}>
              Volcano House changed how I think about design. Spaces should shift how people feel, not
              just how they look. When someone walks in and exhales, that is the job.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.transition} aria-label="Explore more work">
        <div className={styles.transitionInner} data-editorial-reveal>
          <h2 className={styles.transitionTitle}>Explore More Work</h2>
          <p className={styles.transitionBody}>
            Volcano House is still the root of how I work: hospitality, interiors, land, and the
            story around all of it. More projects below.
          </p>
          <Link href="/portfolio/interior-design" className={styles.transitionButton}>
            View Interior Design Portfolio →
          </Link>
        </div>
      </section>
    </main>
  );
}

import IntroSection from '@/components/sections/IntroSection';
import CinematicHero from '@/components/CinematicHero';
import DisciplinesSection from '@/components/sections/DisciplinesSection';
import ManifestoSection from '@/components/sections/ManifestoSection';
import SelectedWorldsSection from '@/components/sections/SelectedWorldsSection';
import PhilosophySection from '@/components/sections/PhilosophySection';
import ServicesSection from '@/components/sections/ServicesSection';
import styles from '@/components/sections/sections.module.css';

export default function Home() {
  return (
    <>
      <div className={styles.heroShell} data-hero-shell>
        <CinematicHero />
      </div>
      <main className={styles.mainStory}>
        <IntroSection />
        <PhilosophySection />
        <ManifestoSection />
        <DisciplinesSection />
        <SelectedWorldsSection />
        <ServicesSection />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerMark}>Kyle Colwell</span>
          <span className={styles.footerNote}>
            Regenerative Design & Creative Direction
          </span>
        </div>
      </footer>
    </>
  );
}

import IntroSection from '@/components/sections/IntroSection';
import CinematicHero from '@/components/CinematicHero';
import ManifestoSection from '@/components/sections/ManifestoSection';
import PhilosophySection from '@/components/sections/PhilosophySection';
import SelectedWorldsSection from '@/components/sections/SelectedWorldsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import SiteFooter from '@/components/SiteFooter';
import styles from '@/components/sections/sections.module.css';

export default function Home() {
  return (
    <>
      <div className={styles.heroShell} data-hero-shell>
        <CinematicHero />
      </div>
      <main className={styles.mainStory}>
        <IntroSection />
        <ManifestoSection />
        <PhilosophySection />
        <SelectedWorldsSection />
        <ServicesSection />
      </main>
      <SiteFooter />
    </>
  );
}

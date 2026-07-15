import IntroSection from '@/components/sections/IntroSection';
import CinematicHero from '@/components/CinematicHero';
import PhilosophySection from '@/components/sections/PhilosophySection';
import SanctuaryTransition from '@/components/sections/SanctuaryTransition';
import SelectedWorldsSection from '@/components/sections/SelectedWorldsSection';
import ScrollSpinModelSection from '@/components/sections/ScrollSpinModelSection';
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
        <SanctuaryTransition />
        <PhilosophySection />
        <SelectedWorldsSection />
        <ScrollSpinModelSection />
        <ServicesSection />
      </main>
      <SiteFooter />
    </>
  );
}

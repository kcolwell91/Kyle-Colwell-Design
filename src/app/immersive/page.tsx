import IntroSection from '@/components/sections/IntroSection';
import CinematicHero from '@/components/CinematicHero';
import PhilosophySection from '@/components/sections/PhilosophySection';
import SanctuaryTransition from '@/components/sections/SanctuaryTransition';
import SelectedWorldsSection from '@/components/sections/SelectedWorldsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import SiteFooter from '@/components/SiteFooter';
import styles from '@/components/sections/sections.module.css';

export default function ImmersiveHome() {
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
        <ServicesSection />
      </main>
      <SiteFooter />
    </>
  );
}

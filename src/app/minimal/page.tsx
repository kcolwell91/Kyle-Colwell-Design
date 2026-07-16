import MinimalContact from '@/components/minimal/MinimalContact';
import MinimalHero from '@/components/minimal/MinimalHero';
import MinimalIntro from '@/components/minimal/MinimalIntro';
import MinimalProjectGrid from '@/components/minimal/MinimalProjectGrid';
import MinimalWork from '@/components/minimal/MinimalWork';
import '@/components/minimal/minimal.tokens.css';

export default function MinimalPage() {
  return (
    <main className="minimalPage">
      <MinimalHero />
      <MinimalIntro />
      <MinimalWork />
      <MinimalProjectGrid />
      <MinimalContact />
    </main>
  );
}

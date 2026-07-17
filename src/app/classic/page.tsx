import MinimalContact from '@/components/minimal/MinimalContact';
import MinimalFooter from '@/components/minimal/MinimalFooter';
import MinimalHero from '@/components/minimal/MinimalHero';
import MinimalIntro from '@/components/minimal/MinimalIntro';
import MinimalNav from '@/components/minimal/MinimalNav';
import MinimalProjectGrid from '@/components/minimal/MinimalProjectGrid';
import MinimalPullQuote from '@/components/minimal/MinimalPullQuote';
import MinimalReveal from '@/components/minimal/MinimalReveal';
import MinimalWork from '@/components/minimal/MinimalWork';
import '@/components/minimal/minimal.tokens.css';

export default function ClassicPage() {
  return (
    <main className="minimalPage">
      <MinimalNav />
      <MinimalHero />
      <MinimalReveal>
        <MinimalIntro />
      </MinimalReveal>
      <MinimalReveal>
        <MinimalPullQuote />
      </MinimalReveal>
      <MinimalReveal>
        <MinimalWork />
      </MinimalReveal>
      <MinimalReveal>
        <MinimalProjectGrid />
      </MinimalReveal>
      <MinimalReveal>
        <MinimalContact />
      </MinimalReveal>
      <MinimalFooter />
    </main>
  );
}

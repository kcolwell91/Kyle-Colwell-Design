import type { Metadata } from 'next';
import InteriorDesignPortfolio from '@/components/editorial/InteriorDesignPortfolio';

export const metadata: Metadata = {
  title: 'Interior Design Portfolio — Kyle Colwell',
  description:
    'A curated editorial portfolio of interiors, hospitality, and regenerative design work.',
};

export default function InteriorDesignPortfolioPage() {
  return <InteriorDesignPortfolio />;
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import InteriorDesignPortfolio from '@/components/editorial/InteriorDesignPortfolio';

export const metadata: Metadata = {
  title: 'Interior Design Portfolio — Kyle Colwell',
  description:
    'A curated editorial portfolio of interiors, hospitality, and regenerative design work.',
};

export default function InteriorDesignPortfolioPage() {
  return (
    <Suspense fallback={null}>
      <InteriorDesignPortfolio />
    </Suspense>
  );
}

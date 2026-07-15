import type { Metadata } from 'next';
import ArtPortfolio from '@/components/editorial/ArtPortfolio';

export const metadata: Metadata = {
  title: 'Original Art | Kyle Colwell',
  description:
    'Murals and canvas work by Kyle Colwell, available by private commission for homes and hospitality.',
};

export default function ArtPortfolioPage() {
  return <ArtPortfolio />;
}

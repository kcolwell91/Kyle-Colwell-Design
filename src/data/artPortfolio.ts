const A = '/portfolio/art';

export type ArtMedium = 'mural' | 'canvas';

export type ArtWork = {
  id: string;
  title: string;
  medium: ArtMedium;
  material: string;
  year: string;
  statement: string;
  image: {
    src: string;
    alt: string;
    position?: string;
  };
  context?: {
    label: string;
    href: string;
  };
};

export const ART_PORTFOLIO_IMAGES = {
  moonlitGardenStudio: `${A}/canvas-moonlit-garden-studio.png`,
  cosmicJaguar: `${A}/canvas-cosmic-jaguar.png`,
  summitSky: `${A}/canvas-summit-sky.png`,
} as const;

export const ART_PORTFOLIO_INTRO = {
  eyebrow: 'Original Art',
  title: 'Original paintings.',
  dek: 'Canvas and mural work, available by commission for homes and hospitality.',
} as const;

export const ART_COMMISSION = {
  eyebrow: 'Commissions',
  title: 'Interested in a commission?',
  copy: 'I take on a small number of mural and canvas projects each year. Share your space, timeline, and what you have in mind.',
  cta: 'Get in touch',
  href: '/#contact',
} as const;

export const ART_WORKS: ArtWork[] = [
  {
    id: 'sisters-pele-namaka',
    title: 'Sisters, Pele and Namaka',
    medium: 'canvas',
    material: 'Acrylic on canvas',
    year: 'Commission',
    statement: 'Sisters, Pele and Namaka.',
    image: {
      src: ART_PORTFOLIO_IMAGES.moonlitGardenStudio,
      alt: 'Sisters, Pele and Namaka acrylic painting in a gold frame',
      position: 'center 42%',
    },
    context: {
      label: 'Murals in interior portfolio',
      href: '/portfolio/interior-design',
    },
  },
  {
    id: 'cosmic-jaguar',
    title: 'Cosmic Jaguar',
    medium: 'canvas',
    material: 'Acrylic on canvas · gold frame',
    year: 'Commission',
    statement: 'Gold and blue leopard motif.',
    image: {
      src: ART_PORTFOLIO_IMAGES.cosmicJaguar,
      alt: 'Cosmic Jaguar canvas painting with gold and blue leopard motif',
      position: 'center 55%',
    },
  },
  {
    id: 'summit-sky',
    title: 'Summit Sky',
    medium: 'canvas',
    material: 'Acrylic on canvas · wide mat frame',
    year: 'Commission',
    statement: 'A study on clouds.',
    image: {
      src: ART_PORTFOLIO_IMAGES.summitSky,
      alt: 'Summit Sky cloud painting in a wide mat frame above a credenza',
      position: '74% 32%',
    },
    context: {
      label: 'Interior portfolio',
      href: '/portfolio/interior-design',
    },
  },
];

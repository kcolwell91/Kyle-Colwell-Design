export type WaysColumnMask = 'arch' | 'circle';

export type WaysColumn = {
  id: string;
  index: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: {
    src: string;
    alt: string;
  };
  mask: WaysColumnMask;
};

export const WAYS_OF_CREATING = {
  eyebrow: 'What I Create',
  headline: 'I design spaces, brands, and experiences that',
  headlineEmphasis: 'inspire',
  headlineEnd: 'a more beautiful world.',
  columns: [
    {
      id: 'story-spaces',
      index: '01',
      title: 'Spaces',
      description:
        'Interiors, retreat concepts, hospitality environments, and regenerative design visions.',
      cta: 'Explore Spaces',
      href: '/portfolio/interior-design',
      image: {
        src: '/portfolio/interior-design/bathroom-zen-garden.png',
        alt: 'Indoor-outdoor bath opening to a zen garden',
      },
      mask: 'arch',
    },
    {
      id: 'story-brands',
      index: '02',
      title: 'Brands',
      description:
        'Visual worlds, creative direction, storytelling, and identity systems.',
      cta: 'Explore Brands',
      href: '/work/website-development',
      image: {
        src: '/work/anna-naturalista.png',
        alt: 'Natural wellness brand visual world',
      },
      mask: 'circle',
    },
    {
      id: 'story-experiences',
      index: '03',
      title: 'Experiences',
      description:
        'Immersive environments, rituals, retreats, launches, and emotionally resonant journeys.',
      cta: 'Explore Experiences',
      href: '/work/hawaiian-airbnb',
      image: {
        src: '/work/biophilic-retreat.png',
        alt: 'Biophilic retreat environment',
      },
      mask: 'arch',
    },
  ] satisfies WaysColumn[],
} as const;

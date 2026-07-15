export const WEBSITE_DEV_INDEX = '02';

export const WEBSITE_DEV_HERO_VIDEO = {
  src: '/work/website-development/hero-20260714.mp4',
} as const;

export const WEBSITE_DEV_HERO = {
  eyebrow: 'Brand & Digital Story',
  title: 'Your brand deserves a world worth walking into.',
} as const;

export const WEBSITE_DEV_VISION = {
  kicker: 'What we are here to solve',
  paragraphs: [
    'Most businesses have a story worth telling. Few have a digital presence that tells it. I build branded worlds that carry who you are from the first second.',
  ],
  placeholder: {
    label: 'Opening story',
    caption: 'Replace with hero sequence or brand world demo',
    aspect: '16 / 10' as const,
  },
};

export const WEBSITE_DEV_STATEMENT = 'Story first. Everything else follows.' as const;

export const WEBSITE_DEV_CRAFT = {
  kicker: 'Brand environment',
  paragraphs: [
    'Motion, texture, and pace in service of the story. The technology stays invisible.',
  ],
  image: {
    src: '/work/website-development/brand-environment.png',
    alt: 'Minimalist villa interior with circular arch framing a sunset view over the sea',
    width: 1024,
    height: 576,
  },
} as const;

export const WEBSITE_DEV_OUTCOMES = {
  kicker: 'What changes',
  paragraphs: [
    'Visitors arrive already leaning in. Your brand does the emotional work before the first conversation.',
  ],
} as const;

export const WEBSITE_DEV_PILLARS_HEADER = 'Four parts of the work' as const;

export const WEBSITE_DEV_PILLARS = [
  {
    title: 'Story and voice, defined first',
    image: {
      src: '/work/website-development/pillars/narrative-framework.png',
      alt: 'Narrative framework booklet open to essence, perspective, promise, and voice',
      width: 1024,
      height: 682,
    },
  },
  {
    title: 'Visual worlds that feel authored',
    image: {
      src: '/work/website-development/pillars/visual-identity.png',
      alt: 'Visual identity mood board with palette, layout study, and material samples',
      width: 1024,
      height: 682,
    },
  },
  {
    title: 'Motion and pacing that guide the narrative',
    image: {
      src: '/work/website-development/pillars/motion-rhythm.png',
      alt: 'Seed to sanctuary progression diagram showing six stages of growth',
      width: 1024,
      height: 439,
    },
  },
  {
    title: 'Built to grow without losing its character',
    image: {
      src: '/work/website-development/pillars/lasting-structure.png',
      alt: 'Sanctuary Retreat Center brand map with purpose, offerings, values, and community',
      width: 1024,
      height: 576,
    },
  },
] as const;

export const WEBSITE_DEV_CLOSING = {
  line: 'Your story deserves more than a page.',
  cta: "Let's talk",
} as const;

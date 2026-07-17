export const MINIMAL_HERO = {
  title: ['Brands and places', 'people remember.'],
  selectedWork: {
    label: 'Selected Work',
    href: '#selected-work',
  },
  video: {
    src: '/videos/minimal-hero.mp4',
    type: 'video/mp4',
  },
} as const;

export const MINIMAL_ABOUT = {
  kicker: 'About',
  portrait: {
    src: '/images/kyle-colwell-portrait.png',
    alt: 'Kyle Colwell seated in a minimalist interior with warm architectural lighting',
    width: 777,
    height: 1024,
  },
  paragraphs: [
    'My journey began in 2018 with an off-grid Airbnb on the slopes of a volcano in Hawai‘i. The property reached 90% occupancy within the first 3 days of launching it on Airbnb, earned 5 star reviews, and led to twelve additional vacation rental commissions.',
    'Since then, my work has expanded into retreat centers, restaurants, branding, and guest experience.',
    'Today, I help visionary hospitality founders turn their ideas into cohesive spaces, brands, and experiences people remember.',
  ],
} as const;

export const MINIMAL_PULL_QUOTE = {
  line: 'Designed to be felt.',
} as const;

export const MINIMAL_FOOTER = {
  name: 'Kyle Colwell',
  locations: 'Austin · Hawaiʻi',
} as const;

export const MINIMAL_NAV = [
  { label: 'Work', href: '#selected-work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

export const MINIMAL_CONTACT = {
  kicker: 'Contact',
  cta: 'Start a conversation',
} as const;

export const MINIMAL_WORK = {
  kicker: 'The work',
  items: [
    {
      index: '01',
      title: 'Creative Direction',
      line: 'For founders shaping places people remember.',
    },
    {
      index: '02',
      title: 'Signature Brand Experience',
      line: 'From strategy through story to execution.',
    },
    {
      index: '03',
      title: 'Hospitality & Regenerative Design',
      line: 'Retreats and hospitality rooted in nature.',
    },
  ],
} as const;

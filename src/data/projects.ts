export type ProjectImageMedia = {
  type: 'image';
  src: string;
  width: number;
  height: number;
};

export type ProjectVideoMedia = {
  type: 'video';
  src: string;
  poster?: string;
};

export type ProjectMedia = ProjectImageMedia | ProjectVideoMedia;

export type Project = {
  slug: string;
  title: string;
  index: string;
  floatClass: 'projectFloat1' | 'projectFloat2' | 'projectFloat3' | 'projectFloat4';
  media: ProjectMedia;
  summary: string;
  partnerInquiry?: {
    copy: string;
    email: string;
    cta: string;
  };
};

export const PROJECTS: Project[] = [
  {
    slug: 'hawaiian-airbnb',
    title: 'Hospitality Design & Build',
    index: '01',
    floatClass: 'projectFloat1',
    media: {
      type: 'video',
      src: '/work/hawaiian-airbnb.mov',
      poster: '/work/volcano-house/lanai.png',
    },
    summary:
      'A biophilic hospitality environment shaped around light, material warmth, and the rhythm of the island — designed to feel like a five-star retreat rooted in place.',
  },
  {
    slug: 'website-development',
    title: 'Digital Platform Design',
    index: '02',
    floatClass: 'projectFloat2',
    media: {
      type: 'image',
      src: '/work/anna-naturalista.png',
      width: 1024,
      height: 682,
    },
    summary:
      'A digital brand world built with editorial clarity, organic texture, and a calm conversion path for a natural wellness founder.',
  },
  {
    slug: 'restaurant-project-management',
    title: 'Restaurant Management & Marketing',
    index: '03',
    floatClass: 'projectFloat3',
    media: {
      type: 'image',
      src: '/work/besos/bar-interior.png',
      width: 1024,
      height: 1024,
    },
    summary:
      'Project management and marketing for an ambitious hospitality launch — from bar to brand.',
  },
  {
    slug: 'retreat-center-development',
    title: 'Retreat Concept Development',
    index: '04',
    floatClass: 'projectFloat4',
    media: {
      type: 'image',
      src: '/work/biophilic-retreat.png',
      width: 1024,
      height: 682,
    },
    summary:
      'A regenerative retreat concept integrating biophilic interiors, land-based programming, and a long-view vision for wellness hospitality.',
    partnerInquiry: {
      copy:
        'For those interested in shaping this vision as a partner, we welcome a private inquiry.',
      email: 'kyle@elevatedglobe.com',
      cta: 'Inquire by email',
    },
  },
];

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}

export function getAllProjectSlugs() {
  return PROJECTS.map((project) => project.slug);
}

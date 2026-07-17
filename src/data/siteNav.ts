import { PROJECTS } from '@/data/projects';
import {
  IMMERSIVE_CONTACT_HREF,
  IMMERSIVE_SELECTED_WORLDS_HREF,
} from '@/config/siteRoutes';
import { withJourney } from '@/lib/journey';
import { getProjectWorkHref } from '@/lib/projectMedia';

export const NAV_WORK_LABEL = 'Work' as const;

export const NAV_WORK_ITEMS = [
  ...PROJECTS.map(({ index, title, slug }) => ({
    index,
    label: title,
    href: getProjectWorkHref(slug, 'immersive'),
  })),
  {
    index: '05',
    label: 'Interior Design',
    href: withJourney('/portfolio/interior-design', 'immersive'),
  },
  {
    index: '06',
    label: 'Bespoke Art',
    href: withJourney('/portfolio/art', 'immersive'),
  },
] as const;

export const NAV_VIEW_ALL_WORLDS = {
  label: 'View all worlds',
  href: IMMERSIVE_SELECTED_WORLDS_HREF,
} as const;

export const NAV_CONTACT = {
  label: 'Contact',
  href: IMMERSIVE_CONTACT_HREF,
} as const;

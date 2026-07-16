import { PROJECTS } from '@/data/projects';
import {
  IMMERSIVE_CONTACT_HREF,
  IMMERSIVE_SELECTED_WORLDS_HREF,
} from '@/config/siteRoutes';
import { getProjectWorkHref } from '@/lib/projectMedia';

export const NAV_WORK_LABEL = 'Work' as const;

export const NAV_WORK_ITEMS = PROJECTS.map(({ index, title, slug }) => ({
  index,
  label: title,
  href: getProjectWorkHref(slug),
}));

export const NAV_VIEW_ALL_WORLDS = {
  label: 'View all worlds',
  href: IMMERSIVE_SELECTED_WORLDS_HREF,
} as const;

export const NAV_INTERIOR_DESIGN = {
  label: 'Interior Design',
  href: '/portfolio/interior-design',
} as const;

export const NAV_WORK_TOGETHER = {
  label: 'Work together',
  href: IMMERSIVE_CONTACT_HREF,
} as const;

import {
  CLASSIC_SELECTED_WORK_HREF,
  IMMERSIVE_SELECTED_WORLDS_HREF,
} from '@/config/siteRoutes';

export const JOURNEY_QUERY = 'from' as const;

export type SiteJourney = 'immersive' | 'classic';

export function parseSiteJourney(value: string | null | undefined): SiteJourney {
  // Accept legacy "signature" query values from older links.
  return value === 'classic' || value === 'signature' ? 'classic' : 'immersive';
}

export function getSelectedWorkHref(journey: SiteJourney) {
  return journey === 'classic'
    ? CLASSIC_SELECTED_WORK_HREF
    : IMMERSIVE_SELECTED_WORLDS_HREF;
}

export function getSelectedWorkLabel(journey: SiteJourney) {
  return journey === 'classic' ? 'Selected work' : 'Selected Worlds';
}

export function withJourney(href: string, journey: SiteJourney) {
  const [pathAndQuery, hash = ''] = href.split('#');
  const [pathname, existingQuery = ''] = pathAndQuery.split('?');
  const params = new URLSearchParams(existingQuery);
  params.set(JOURNEY_QUERY, journey);
  const query = params.toString();
  const hashSuffix = hash ? `#${hash}` : '';
  return `${pathname}?${query}${hashSuffix}`;
}

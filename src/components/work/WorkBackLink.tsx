'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getSelectedWorkHref,
  getSelectedWorkLabel,
  parseSiteJourney,
  JOURNEY_QUERY,
} from '@/lib/journey';
import { IMMERSIVE_SELECTED_WORLDS_HREF } from '@/config/siteRoutes';

type WorkBackLinkProps = {
  className?: string;
  showArrow?: boolean;
};

function WorkBackLinkInner({ className, showArrow = true }: WorkBackLinkProps) {
  const searchParams = useSearchParams();
  const journey = parseSiteJourney(searchParams.get(JOURNEY_QUERY));
  const href = getSelectedWorkHref(journey);
  const label = getSelectedWorkLabel(journey);

  return (
    <Link href={href} className={className}>
      {showArrow ? `← ${label}` : label}
    </Link>
  );
}

export default function WorkBackLink(props: WorkBackLinkProps) {
  const fallbackLabel = props.showArrow === false ? 'Selected Worlds' : '← Selected Worlds';

  return (
    <Suspense
      fallback={
        <Link href={IMMERSIVE_SELECTED_WORLDS_HREF} className={props.className}>
          {fallbackLabel}
        </Link>
      }
    >
      <WorkBackLinkInner {...props} />
    </Suspense>
  );
}

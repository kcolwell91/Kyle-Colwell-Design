'use client';

import Link from 'next/link';
import { Suspense, type ComponentProps } from 'react';
import { useSearchParams } from 'next/navigation';
import { JOURNEY_QUERY, parseSiteJourney, withJourney } from '@/lib/journey';

type JourneyAwareLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: string;
};

function JourneyAwareLinkInner({ href, ...props }: JourneyAwareLinkProps) {
  const searchParams = useSearchParams();
  const journey = parseSiteJourney(searchParams.get(JOURNEY_QUERY));

  return <Link href={withJourney(href, journey)} {...props} />;
}

/** Preserves the current journey (?from=) when linking between work/portfolio pages. */
export default function JourneyAwareLink(props: JourneyAwareLinkProps) {
  return (
    <Suspense fallback={<Link {...props} />}>
      <JourneyAwareLinkInner {...props} />
    </Suspense>
  );
}

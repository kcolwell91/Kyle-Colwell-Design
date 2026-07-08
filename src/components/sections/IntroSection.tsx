'use client';

import ScrollRevealStory from '@/components/ScrollRevealStory';

const INTRO_COPY =
  'We inherited a world built around separation. From the land. From one another. From ourselves. We were taught to call this progress. But beneath the noise, an older intelligence remained. A knowing rooted deep in the body. We are not here simply to build beautiful places. We are here to remember how to belong.';

export default function IntroSection() {
  return (
    <ScrollRevealStory
      sectionId="intro"
      variant="intro"
      fadeOutOnExit
      fadeOutStart={0.78}
      scrollMinHeight="300vh"
    >
      {INTRO_COPY}
    </ScrollRevealStory>
  );
}

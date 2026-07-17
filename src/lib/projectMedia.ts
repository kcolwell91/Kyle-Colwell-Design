import type { Project, ProjectImageMedia } from '@/data/projects';

export type ProjectStillImage = ProjectImageMedia & {
  alt: string;
};

const FALLBACK_STILL = {
  width: 1024,
  height: 682,
} as const;

export function getProjectWorkHref(
  slug: string,
  journey: 'immersive' | 'classic' = 'immersive'
) {
  return `/work/${slug}?from=${journey}`;
}

export function getProjectStillImage(project: Project): ProjectStillImage {
  if (project.media.type === 'image') {
    return {
      type: 'image',
      src: project.media.src,
      width: project.media.width,
      height: project.media.height,
      alt: project.title,
    };
  }

  return {
    type: 'image',
    src: project.media.poster ?? project.media.src,
    width: FALLBACK_STILL.width,
    height: FALLBACK_STILL.height,
    alt: project.title,
  };
}

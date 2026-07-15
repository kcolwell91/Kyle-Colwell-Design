import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BesosStory from '@/components/editorial/BesosStory';
import VolcanoHouseStory from '@/components/editorial/VolcanoHouseStory';
import WebsiteDevelopmentStory from '@/components/editorial/WebsiteDevelopmentStory';
import { getAllProjectSlugs, getProjectBySlug } from '@/data/projects';
import GenericWorkPage from '@/components/work/GenericWorkPage';

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: 'Project — Kyle Colwell' };

  if (slug === 'hawaiian-airbnb') {
    return {
      title: 'Volcano House — Kyle Colwell',
      description:
        'The off-grid Hawai\'i sanctuary that shaped an approach to hospitality, interiors, and regenerative design.',
    };
  }

  if (slug === 'website-development') {
    return {
      title: 'Digital Storytelling — Kyle Colwell',
      description:
        'Branded digital worlds for founders and creative businesses. Story, voice, and atmosphere first, with technology used to carry the narrative.',
    };
  }

  if (slug === 'restaurant-project-management') {
    return {
      title: 'BESOS — Kyle Colwell',
      description:
        'Project management and marketing for an ambitious hospitality launch — coordinating design, construction, operations, and brand storytelling.',
    };
  }

  return {
    title: `${project.title} — Kyle Colwell`,
    description: project.summary,
  };
}

export default async function WorkProjectPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  if (slug === 'hawaiian-airbnb') {
    return <VolcanoHouseStory />;
  }

  if (slug === 'website-development') {
    return <WebsiteDevelopmentStory />;
  }

  if (slug === 'restaurant-project-management') {
    return <BesosStory />;
  }

  return <GenericWorkPage project={project} />;
}

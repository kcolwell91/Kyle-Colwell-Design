export const WEBSITE_DEV_INDEX = '02';

export const WEBSITE_DEV_HERO = {
  eyebrow: 'Website Development',
  title: 'Every great business deserves a digital home worth walking into.',
} as const;

export const WEBSITE_DEV_VISION = {
  kicker: 'The first heartbeat',
  paragraphs: [
    'Picture a website that feels alive. One that greets a visitor with motion, depth, and intention within the first heartbeat of the page loading. One that guides them through your story like a hand on the small of their back, leading them exactly where you want them to go: toward trust, toward action, toward becoming a client.',
  ],
  placeholder: {
    label: 'Hero experience',
    caption: 'Replace with motion, depth, or opening sequence demo',
    aspect: '16 / 10' as const,
  },
};

export const WEBSITE_DEV_STATEMENT = "That's the world I build." as const;

export const WEBSITE_DEV_CRAFT = {
  kicker: 'The environment',
  paragraphs: [
    'Using modern frameworks, AI accelerated development, and cinematic 3D design crafted in Blender, I create digital experiences that feel less like a website and more like an environment. Something with texture. Something with movement. Something that lingers in a visitor\'s mind long after they close the tab.',
  ],
  placeholder: {
    label: '3D world & motion',
    caption: 'Replace with Blender scene, WebGL, or cinematic reel',
    aspect: '4 / 5' as const,
  },
};

export const WEBSITE_DEV_OUTCOMES = {
  kicker: 'What this creates for your business',
  paragraphs: [
    'Visitors who arrive on your site step into a world that already feels premium, already feels trustworthy, already feels like the obvious choice. That feeling converts. It turns curiosity into inquiries, inquiries into clients, and clients into long term revenue.',
    'Every integration, every animation, every line of code is placed with intention, built to carry weight toward one outcome: a stronger return on the investment you make in your online presence.',
  ],
  placeholder: {
    label: 'Conversion journey',
    caption: 'Replace with user flow, analytics story, or client outcome demo',
    aspect: '16 / 9' as const,
  },
};

export const WEBSITE_DEV_PILLARS = [
  {
    title: 'Full stack development across modern frameworks, engineered for speed and precision',
    placeholder: {
      label: 'Framework & architecture',
      caption: 'Replace with stack diagram or build demo',
      aspect: '3 / 2' as const,
    },
  },
  {
    title: 'Seamless integrations that connect your business tools into one fluid system',
    placeholder: {
      label: 'Integrations',
      caption: 'Replace with API / tooling ecosystem visual',
      aspect: '3 / 2' as const,
    },
  },
  {
    title: 'Custom 3D worlds and motion design, sculpted in Blender to give your brand a signature feel',
    placeholder: {
      label: 'Blender & motion',
      caption: 'Replace with 3D asset or animation preview',
      aspect: '3 / 2' as const,
    },
  },
  {
    title: 'Scalable deployment and infrastructure, so the world you build today grows effortlessly tomorrow',
    placeholder: {
      label: 'Deployment & scale',
      caption: 'Replace with infrastructure or performance demo',
      aspect: '3 / 2' as const,
    },
  },
] as const;

export const WEBSITE_DEV_CLOSING = {
  line: 'Your website should feel like a place, not a page.',
  cta: "Let's build yours.",
} as const;

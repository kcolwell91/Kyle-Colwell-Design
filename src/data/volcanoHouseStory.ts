export const VOLCANO_HOUSE_VIDEO = {
  src: '/work/hawaiian-airbnb.mov',
  poster: '/work/biophilic-retreat.png',
} as const;

export const VOLCANO_HOUSE_IMAGES = {
  kitchen: '/work/volcano-house/kitchen.png',
  bedroom: '/work/volcano-house/bedroom.png',
  bathroom: '/work/volcano-house/bathroom.png',
  shower: '/work/volcano-house/shower-moody.jpg',
  lanai: '/work/volcano-house/lanai.png',
  lanaiBuild: '/work/volcano-house/lanai-build.jpg',
  buildingOrigin: '/work/volcano-house/building-origin.png',
  buildingProcess: '/work/volcano-house/building-process.png',
} as const;

/** Gallery images not used elsewhere on the story page. */
export const VOLCANO_EXPERIENCE_GALLERY = [
  {
    src: VOLCANO_HOUSE_IMAGES.shower,
    alt: 'Walk-in shower with dark marble tile',
    width: 683,
    height: 1024,
    layout: 'portrait' as const,
  },
  {
    src: VOLCANO_HOUSE_IMAGES.lanai,
    alt: 'Lanai open to the forest',
    width: 1024,
    height: 667,
    layout: 'landscape' as const,
  },
] as const;

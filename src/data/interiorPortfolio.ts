export type PortfolioImage = {
  src: string;
  alt: string;
};

export type PortfolioChapter = {
  id: string;
  title: string;
  images: PortfolioImage[];
};

const P = '/portfolio/interior-design';

export const INTERIOR_PORTFOLIO_IMAGES = {
  bedroomPlumeria: `${P}/bedroom-plumeria.png`,
  showerBlueTile: `${P}/shower-blue-tile.png`,
  kitchenForestView: `${P}/kitchen-forest-view.png`,
  bedroomMuralRoundPillow: `${P}/bedroom-mural-round-pillow.png`,
  bedroomJungleMural: `${P}/bedroom-jungle-mural.png`,
  bathroomClawfootTrees: `${P}/bathroom-clawfoot-trees.png`,
  bedroomBurgundyZebra: `${P}/bedroom-burgundy-zebra.png`,
  bedroomCoastalCanopy: `${P}/bedroom-coastal-canopy.png`,
  bedroomTropicalHula: `${P}/bedroom-tropical-hula.png`,
  bathroomZenGarden: `${P}/bathroom-zen-garden.png`,
  livingArtwork: `${P}/living-artwork.png`,
  livingEmeraldGreen: `${P}/living-emerald-green.png`,
} as const;

export const INTERIOR_PORTFOLIO_CHAPTERS: PortfolioChapter[] = [
  {
    id: 'featured',
    title: 'Featured Projects',
    images: [
      {
        src: INTERIOR_PORTFOLIO_IMAGES.bathroomZenGarden,
        alt: 'Indoor-outdoor bath opening to a zen garden',
      },
    ],
  },
  {
    id: 'bedrooms',
    title: 'Bedrooms',
    images: [
      { src: INTERIOR_PORTFOLIO_IMAGES.bedroomPlumeria, alt: 'Bedroom with plumeria mural and forest view' },
      { src: INTERIOR_PORTFOLIO_IMAGES.bedroomJungleMural, alt: 'Bedroom with jungle mural and garden doors' },
      { src: INTERIOR_PORTFOLIO_IMAGES.bedroomMuralRoundPillow, alt: 'Bedroom nook with mural and round pillow' },
      { src: INTERIOR_PORTFOLIO_IMAGES.bedroomTropicalHula, alt: 'Tropical bedroom with hula art' },
      { src: INTERIOR_PORTFOLIO_IMAGES.bedroomBurgundyZebra, alt: 'Burgundy bedroom with velvet drapes' },
      { src: INTERIOR_PORTFOLIO_IMAGES.bedroomCoastalCanopy, alt: 'Coastal bedroom with lace canopy' },
    ],
  },
  {
    id: 'bathrooms',
    title: 'Bathrooms',
    images: [
      { src: INTERIOR_PORTFOLIO_IMAGES.bathroomClawfootTrees, alt: 'Clawfoot tub with tree mural' },
      { src: INTERIOR_PORTFOLIO_IMAGES.showerBlueTile, alt: 'Blue tile walk-in shower' },
    ],
  },
  {
    id: 'living',
    title: 'Living Spaces',
    images: [
      { src: INTERIOR_PORTFOLIO_IMAGES.livingArtwork, alt: 'Living room with large-scale artwork' },
      { src: INTERIOR_PORTFOLIO_IMAGES.livingEmeraldGreen, alt: 'Emerald green living room with mustard sofa' },
    ],
  },
  {
    id: 'kitchens',
    title: 'Kitchens',
    images: [
      { src: INTERIOR_PORTFOLIO_IMAGES.kitchenForestView, alt: 'Compact kitchen with forest view' },
    ],
  },
];

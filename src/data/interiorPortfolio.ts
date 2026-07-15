export type PortfolioImage = {
  src: string;
  alt: string;
  fit?: 'cover' | 'contain';
  crop?: 'left-edge';
  position?: string;
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
  bedroomSheerCanopy: `${P}/bedroom-sheer-canopy.png`,
  diningBirdOfParadiseMural: `${P}/dining-bird-of-paradise-mural.png`,
  tropicalPoolTerrace: `${P}/tropical-pool-terrace.png`,
  bathBlackStone: `${P}/bath-black-stone.png`,
  illuminatedGarden: `${P}/outdoor-space-img-0118-v2.png`,
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
      { src: INTERIOR_PORTFOLIO_IMAGES.bedroomSheerCanopy, alt: 'Serene bedroom framed by sheer canopy curtains' },
    ],
  },
  {
    id: 'bathrooms',
    title: 'Bathrooms',
    images: [
      { src: INTERIOR_PORTFOLIO_IMAGES.bathroomClawfootTrees, alt: 'Clawfoot tub with tree mural' },
      {
        src: INTERIOR_PORTFOLIO_IMAGES.showerBlueTile,
        alt: 'Blue tile walk-in shower',
        fit: 'cover',
        crop: 'left-edge',
      },
      {
        src: INTERIOR_PORTFOLIO_IMAGES.bathBlackStone,
        alt: 'Sunken black bath with sculptural wall-mounted faucet',
      },
    ],
  },
  {
    id: 'living',
    title: 'Living Spaces',
    images: [
      { src: INTERIOR_PORTFOLIO_IMAGES.livingArtwork, alt: 'Living room with large-scale artwork' },
      { src: INTERIOR_PORTFOLIO_IMAGES.livingEmeraldGreen, alt: 'Emerald green living room with mustard sofa' },
      { src: INTERIOR_PORTFOLIO_IMAGES.diningBirdOfParadiseMural, alt: 'Dining room with bird of paradise mural and emerald seating' },
    ],
  },
  {
    id: 'kitchens',
    title: 'Kitchens',
    images: [
      { src: INTERIOR_PORTFOLIO_IMAGES.kitchenForestView, alt: 'Compact kitchen with forest view' },
    ],
  },
  {
    id: 'outdoor',
    title: 'Outdoor Spaces',
    images: [
      {
        src: INTERIOR_PORTFOLIO_IMAGES.tropicalPoolTerrace,
        alt: 'Tropical pool terrace with illuminated landscaping and shaded loungers',
      },
      {
        src: INTERIOR_PORTFOLIO_IMAGES.illuminatedGarden,
        alt: 'Tropical garden illuminated with red light around a Buddha sculpture',
      },
    ],
  },
];

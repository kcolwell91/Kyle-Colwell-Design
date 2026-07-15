export type WordRevealPalette = 'light' | 'dark' | 'white';

export type RgbaColor = { r: number; g: number; b: number; a: number };

export const WORD_REVEAL_ACCENTS = {
  burgundy: {
    pale: { r: 255, g: 255, b: 255, a: 1 },
    dark: { r: 61, g: 36, b: 36, a: 1 },
  },
} as const;

export const WORD_REVEAL_PALETTES: Record<
  WordRevealPalette,
  { pale: RgbaColor; dark: RgbaColor }
> = {
  light: {
    pale: { r: 240, g: 233, b: 223, a: 1 },
    dark: { r: 0, g: 0, b: 0, a: 1 },
  },
  dark: {
    pale: { r: 247, g: 242, b: 234, a: 0.22 },
    dark: { r: 247, g: 242, b: 234, a: 1 },
  },
  white: {
    pale: { r: 255, g: 255, b: 255, a: 1 },
    dark: { r: 0, g: 0, b: 0, a: 1 },
  },
};

export const WORD_REVEAL_TUNING = {
  scrollStart: 'top 88%',
  scrollEnd: 'bottom 12%',
  scrub: true as const,
  fadeZonePhilosophy: 44,
  mobileBreakpoint: 768,
} as const;

export function philosophyRevealFadeZone(wordCount: number) {
  return scaledFadeZone(WORD_REVEAL_TUNING.fadeZonePhilosophy, wordCount);
}

export function scaledFadeZone(base: number, wordCount: number) {
  return Math.max(base, Math.round(wordCount * 0.72));
}

function smootherstep(t: number) {
  const p = clamp(t, 0, 1);
  return p * p * p * (p * (p * 6 - 15) + 10);
}

/** Keeps words fully hidden longer, then eases seamlessly into full ink. */
export function revealEase(t: number) {
  const p = clamp(t, 0, 1);
  return smootherstep(Math.pow(p, 1.42));
}

export function splitWords(text: string) {
  return text.split(/\s+/).filter(Boolean);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function lerpColor(t: number, pale: RgbaColor, dark: RgbaColor) {
  const p = clamp(t, 0, 1);
  const r = Math.round(pale.r + (dark.r - pale.r) * p);
  const g = Math.round(pale.g + (dark.g - pale.g) * p);
  const b = Math.round(pale.b + (dark.b - pale.b) * p);
  const a = pale.a + (dark.a - pale.a) * p;
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
}

export function wordRevealAmount(
  index: number,
  progress: number,
  wordCount: number,
  fadeZone: number
) {
  const readHead = progress * (wordCount + fadeZone);
  return clamp((readHead - index) / fadeZone, 0, 1);
}

export function applyWordReveal(
  wordEls: NodeListOf<HTMLElement> | HTMLElement[],
  progress: number,
  fadeZone: number,
  palette: WordRevealPalette
) {
  const { pale, dark } = WORD_REVEAL_PALETTES[palette];
  const count = wordEls.length;
  if (count === 0) return;

  wordEls.forEach((el, index) => {
    const t = wordRevealAmount(index, progress, count, fadeZone);
    const eased = revealEase(t);
    const accent = el.dataset.revealAccent as keyof typeof WORD_REVEAL_ACCENTS | undefined;
    const accentColors = accent ? WORD_REVEAL_ACCENTS[accent] : null;
    const revealPale = accentColors?.pale ?? pale;
    const revealDark = accentColors?.dark ?? dark;
    el.style.color = lerpColor(eased, revealPale, revealDark);
  });
}

export function setWordsFullyRevealed(
  wordEls: NodeListOf<HTMLElement> | HTMLElement[],
  palette: WordRevealPalette
) {
  const { dark } = WORD_REVEAL_PALETTES[palette];
  wordEls.forEach((el) => {
    el.style.color = lerpColor(1, dark, dark);
  });
}

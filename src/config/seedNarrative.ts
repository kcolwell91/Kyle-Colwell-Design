/** Tunable narrative values — adjust these first when tuning the scroll experience. */
export const SEED_NARRATIVE_CONFIG = {
  /** Total scroll height for idle interstitial (Philosophy → Manifesto), desktop (vh). */
  idleInterstitialVh: 240,
  /** Idle interstitial height on mobile (vh). */
  idleInterstitialVhMobile: 190,

  /** Fraction of idle track: white space before seed fades in (0–1). */
  idleBreathePortion: 0.18,
  /** Fraction of idle track: soft fade-in (0–1). */
  idleFadeInPortion: 0.12,
  /** Fraction of idle track: hold frame 0 with idle motion (0–1). */
  idleHoldPortion: 0.42,
  /** Fraction of idle track: fade seed out (0–1). */
  idleFadeOutPortion: 0.14,
  /** Trailing white space after idle fade-out; remainder of track (0–1). */

  /** Total scroll height for blossom scrub interstitial (Manifesto → Worlds), desktop (vh). */
  scrubInterstitialVh: 440,
  /** Scrub interstitial height on mobile (vh). */
  scrubInterstitialVhMobile: 360,

  /** Fraction of scrub track: breathe before seed appears (0–1). */
  scrubBreathePortion: 0.1,
  /** Fraction of scrub track: soft fade-in (0–1). */
  scrubFadeInPortion: 0.06,
  /** Fraction of scrub track: scroll-driven blossom frames 0→last (0–1). */
  scrubAnimationPortion: 0.58,
  /** Fraction of scrub track: hold completed blossom (0–1). */
  scrubHoldPortion: 0.14,
  /** Fraction of scrub track: slow fade-out (0–1). */
  scrubFadeOutPortion: 0.08,
  /** Trailing empty beat before Selected Worlds; remainder of track (0–1). */

  /** Model height as fraction of viewport — idle interstitial. */
  modelViewportHeightIdle: 0.44,
  /** Model height as fraction of viewport — blossom scrub / hold. */
  modelViewportHeightScrub: 0.56,

  /** Max idle Y rotation during idle interstitial (degrees). */
  idleRotationDeg: 14,
  /** Max idle vertical float (px). */
  idleFloatPx: 10,
  /** Idle breathing scale amplitude. */
  idleBreathScale: 0.012,

  /** ScrollTrigger scrub smoothing for blossom frame sequence. */
  scrubSmoothing: 0.45,
} as const;

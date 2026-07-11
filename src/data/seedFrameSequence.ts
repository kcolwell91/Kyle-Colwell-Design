/** Pre-rendered frame numbers from the 600-frame Blender sequence (phase-weighted sampling). */
export const SEED_FRAME_NUMBERS = [
  1, 31, 60, 90, 96, 102, 108, 114, 120, 126, 132, 138, 144, 150, 156, 162, 168, 174, 180,
  188, 195, 203, 211, 219, 226, 234, 242, 250, 257, 265, 273, 281, 288, 296, 304, 312, 319,
  327, 335, 343, 350, 358, 366, 374, 381, 389, 397, 405, 412, 420, 426, 431, 437, 443, 449,
  454, 460, 466, 471, 477, 483, 489, 494, 500, 506, 511, 517, 523, 529, 534, 540, 560, 580,
  600,
] as const;

export const SEED_FRAME_DIR = '/web_export/';

export function seedFrameUrl(frameNumber: number) {
  return `${SEED_FRAME_DIR}frame_${String(frameNumber).padStart(4, '0')}.png`;
}

export const SEED_FRAME_COUNT = SEED_FRAME_NUMBERS.length;

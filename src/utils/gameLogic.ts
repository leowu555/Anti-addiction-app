/**
 * 2-Back Game Logic
 * Core game mechanics separated from UI for testability and clarity.
 */

/** Stimulus types: letters A-Z and simple shape names */
export type StimulusType = string;

/** Pool of letters for stimuli */
const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.split('');

/** Simple shape names (visual representation handled in UI) */
const SHAPES = ['circle', 'square', 'triangle', 'star', 'diamond'];

/** Combined stimulus pool - letters and shapes */
const STIMULUS_POOL = [...LETTERS, ...SHAPES];

/** Probability that a stimulus is a "match" (same as 2 steps back) */
const MATCH_PROBABILITY = 0.3;

/**
 * Generates a random stimulus from the pool.
 */
export function generateStimulus(): StimulusType {
  return STIMULUS_POOL[Math.floor(Math.random() * STIMULUS_POOL.length)];
}

/**
 * Generates a full game sequence with ~30% matches.
 * @param length Number of stimuli in sequence
 * @param back N-back level (2, 3, or 4)
 */
export function generateSequence(length: number, back: number = 2): StimulusType[] {
  const sequence: StimulusType[] = [];

  for (let i = 0; i < length; i++) {
    if (i >= back && Math.random() < MATCH_PROBABILITY) {
      sequence.push(sequence[i - back]);
    } else {
      let stimulus = generateStimulus();
      while (i >= back && stimulus === sequence[i - back]) {
        stimulus = generateStimulus();
      }
      sequence.push(stimulus);
    }
  }

  return sequence;
}

/**
 * Checks if the current stimulus matches the one N steps earlier.
 */
export function checkMatch(currentIndex: number, sequence: StimulusType[], back: number = 2): boolean {
  if (currentIndex < back) return false;
  return sequence[currentIndex] === sequence[currentIndex - back];
}

/**
 * Counts total match opportunities in a sequence (for accuracy calc).
 */
export function countTotalMatches(sequence: StimulusType[], back: number = 2): number {
  let count = 0;
  for (let i = back; i < sequence.length; i++) {
    if (sequence[i] === sequence[i - back]) count++;
  }
  return count;
}

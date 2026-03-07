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
 * @returns Array of stimuli
 */
export function generateSequence(length: number): StimulusType[] {
  const sequence: StimulusType[] = [];

  for (let i = 0; i < length; i++) {
    if (i >= 2 && Math.random() < MATCH_PROBABILITY) {
      // Force a match: use the stimulus from 2 steps back
      sequence.push(sequence[i - 2]);
    } else {
      // Random stimulus, but avoid accidental matches
      let stimulus = generateStimulus();
      while (i >= 2 && stimulus === sequence[i - 2]) {
        stimulus = generateStimulus();
      }
      sequence.push(stimulus);
    }
  }

  return sequence;
}

/**
 * Checks if the current stimulus matches the one 2 steps earlier.
 */
export function checkMatch(currentIndex: number, sequence: StimulusType[]): boolean {
  if (currentIndex < 2) return false;
  return sequence[currentIndex] === sequence[currentIndex - 2];
}

/**
 * Counts total match opportunities in a sequence (for accuracy calc).
 */
export function countTotalMatches(sequence: StimulusType[]): number {
  let count = 0;
  for (let i = 2; i < sequence.length; i++) {
    if (sequence[i] === sequence[i - 2]) count++;
  }
  return count;
}

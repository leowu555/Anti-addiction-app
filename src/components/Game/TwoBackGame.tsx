/**
 * TwoBackGame - Main 2-Back game UI.
 * Large stimulus, MATCH button, progress bar timer.
 */

import { Stimulus } from './Stimulus';
import { GameStats } from './GameStats';
import { Button } from '../UI/Button';
import { ProgressBar } from '../UI/ProgressBar';
import type { GameResult } from '../../hooks/useTwoBackGame';

interface TwoBackGameProps {
  isPlaying: boolean;
  currentStimulus: string | null;
  progress: number;
  elapsed: number;
  correctMatches: number;
  misses: number;
  startGame: () => void;
  handleMatch: () => void;
  onDone: () => void;
  result: GameResult | null;
  back: number;
}

const ENCOURAGING_MESSAGES = [
  "Nice! You reversed a doomscroll into brain training.",
  "Your focus is improving.",
  "Great work. Every session strengthens your attention.",
  "You're building a stronger mind.",
];

function pickMessage(accuracy: number): string {
  if (accuracy >= 0.9) return ENCOURAGING_MESSAGES[1];
  if (accuracy >= 0.7) return ENCOURAGING_MESSAGES[0];
  return ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)];
}

export function TwoBackGame({
  isPlaying,
  currentStimulus,
  progress,
  elapsed,
  correctMatches,
  misses,
  startGame,
  handleMatch,
  onDone,
  result,
  back,
}: TwoBackGameProps) {
  if (result) {
    const accuracy = result.totalMatches > 0 ? result.correctMatches / result.totalMatches : 0;
    const rts = result.reactionTimes;
    const avgRT = rts.length > 0 ? rts.reduce((a, b) => a + b, 0) / rts.length : 0;
    const speedScore = avgRT > 0 ? Math.max(0, 1 - avgRT / 1000) : 0;
    const workingMemoryScore = accuracy * 0.7 + speedScore * 0.3;

    return (
      <div className="mx-auto max-w-md">
        <GameStats
          accuracy={accuracy}
          reactionTime={avgRT}
          workingMemoryScore={workingMemoryScore}
          correctMatches={result.correctMatches}
          falsePositives={result.falsePositives}
          misses={result.misses}
          message={pickMessage(accuracy)}
          onDone={onDone}
        />
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold text-stone-800">{back}-Back Challenge</h2>
        <p className="text-stone-500">
          Press MATCH when the current letter matches the one from {back} steps ago.
        </p>
        <Button variant="primary" size="lg" onClick={startGame}>
          Start Game
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-center text-sm font-medium text-stone-600">{back}-back game</p>
      <ProgressBar progress={progress} label="Time" showValue />
      <p className="text-center text-stone-500">
        {Math.floor(elapsed)}s / 60s
      </p>

      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
        <Stimulus value={currentStimulus} />
      </div>

      <div className="flex flex-col gap-3">
        <Button
          variant="accent"
          size="lg"
          fullWidth
          onClick={handleMatch}
          className="min-h-[64px] text-xl"
        >
          MATCH
        </Button>
      </div>
    </div>
  );
}

/**
 * GameStats - Post-game stats display with encouraging message.
 */

import { Button } from '../UI/Button';

interface GameStatsProps {
  accuracy: number;
  reactionTime: number;
  workingMemoryScore: number;
  correctMatches: number;
  falsePositives: number;
  misses: number;
  message: string;
  onDone: () => void;
}

export function GameStats({
  accuracy,
  reactionTime,
  workingMemoryScore,
  correctMatches,
  falsePositives,
  misses,
  message,
  onDone,
}: GameStatsProps) {
  return (
    <div className="space-y-6">
      <p className="text-center text-lg text-slate-300">{message}</p>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Accuracy" value={`${Math.round(accuracy * 100)}%`} />
        <StatCard label="Reaction Time" value={`${reactionTime.toFixed(0)}ms`} />
        <StatCard label="Focus Score" value={workingMemoryScore.toFixed(1)} />
      </div>

      <div className="rounded-xl bg-slate-800/60 p-4">
        <h4 className="mb-2 text-sm font-medium text-slate-400">Details</h4>
        <ul className="space-y-1 text-sm text-slate-300">
          <li>Correct: {correctMatches}</li>
          <li>False positives: {falsePositives}</li>
          <li>Misses: {misses}</li>
        </ul>
      </div>

      <Button variant="primary" size="lg" fullWidth onClick={onDone}>
        Back to Dashboard
      </Button>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-800/60 p-4 text-center">
      <div className="text-2xl font-bold text-cyan-400">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

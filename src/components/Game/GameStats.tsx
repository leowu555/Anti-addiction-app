/**
 * GameStats - Post-game stats display with encouraging message.
 */

import { Button } from '../UI/Button';

interface GameStatsProps {
  accuracy: number;
  reactionTime: number;
  correctMatches: number;
  misses: number;
  message: string;
  onDone: () => void;
}

export function GameStats({
  accuracy,
  reactionTime,
  correctMatches,
  misses,
  message,
  onDone,
}: GameStatsProps) {
  return (
    <div className="space-y-6">
      <p className="text-center text-lg text-stone-700">{message}</p>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Focus Score" value={`${Math.round(accuracy * 100)}%`} />
        <StatCard label="Reaction Time" value={`${reactionTime.toFixed(0)}ms`} />
      </div>

      <div className="rounded-xl bg-stone-100 p-4 ring-1 ring-stone-200">
        <h4 className="mb-2 text-sm font-medium text-stone-500">Details</h4>
        <ul className="space-y-1 text-sm text-stone-700">
          <li>Correct: {correctMatches}</li>
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
    <div className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-stone-200">
      <div className="text-2xl font-bold text-stone-700">{value}</div>
      <div className="text-sm text-stone-500">{label}</div>
    </div>
  );
}

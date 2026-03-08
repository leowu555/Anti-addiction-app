/**
 * Stats - Full stats and history view.
 */

import { Link } from 'react-router-dom';
import { loadStats } from '../utils/metrics';
import { Button } from '../components/UI/Button';

export function Stats() {
  const stats = loadStats();

  return (
    <div className="mx-auto max-w-lg space-y-8 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Focus Stats</h1>
        <Link to="/">
          <Button variant="ghost" size="sm">
            ← Back
          </Button>
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Games Played" value={stats.gamesPlayed} />
        <StatCard label="Best Accuracy" value={`${Math.round(stats.bestAccuracy * 100)}%`} />
        <StatCard label="Avg Reaction" value={`${Math.round(stats.averageReactionTime)}ms`} />
        <StatCard label="Current Streak" value={`${stats.currentStreak} days`} />
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h2 className="mb-4 text-sm font-medium text-stone-500">Recent Sessions</h2>
        {stats.sessions.length === 0 ? (
          <p className="text-stone-500">No sessions yet. Play a game to see stats.</p>
        ) : (
          <ul className="space-y-3">
            {[...stats.sessions].reverse().slice(0, 10).map((s, i) => (
              <li
                key={i}
                className="flex justify-between rounded-lg bg-stone-100 px-3 py-2 text-sm"
              >
                <span className="text-stone-500">
                  {new Date(s.timestamp).toLocaleDateString()}
                </span>
                <span className="font-medium text-stone-700">{Math.round(s.accuracy * 100)}%</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-stone-200">
      <div className="text-2xl font-bold text-stone-700">{value}</div>
      <div className="text-sm text-stone-500">{label}</div>
    </div>
  );
}

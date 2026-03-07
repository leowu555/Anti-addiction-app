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
        <h1 className="text-2xl font-bold text-slate-100">Focus Stats</h1>
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

      <div className="rounded-2xl bg-slate-800/80 p-6">
        <h2 className="mb-4 text-sm font-medium text-slate-400">Recent Sessions</h2>
        {stats.sessions.length === 0 ? (
          <p className="text-slate-500">No sessions yet. Play a game to see stats.</p>
        ) : (
          <ul className="space-y-3">
            {[...stats.sessions].reverse().slice(0, 10).map((s, i) => (
              <li
                key={i}
                className="flex justify-between rounded-lg bg-slate-800/60 px-3 py-2 text-sm"
              >
                <span className="text-slate-400">
                  {new Date(s.timestamp).toLocaleDateString()}
                </span>
                <span className="text-cyan-400">{Math.round(s.accuracy * 100)}%</span>
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
    <div className="rounded-xl bg-slate-800/80 p-4 text-center">
      <div className="text-2xl font-bold text-cyan-400">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

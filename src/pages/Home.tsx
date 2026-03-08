/**
 * Home - Dashboard with Focus Score, achievements, and demo button.
 */

import { Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { loadStats, loadAchievements } from '../utils/metrics';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

interface HomeProps {
  onSimulateDoomscroll: () => void;
}

export function Home({ onSimulateDoomscroll }: HomeProps) {
  const { canInstall, install } = useInstallPrompt();
  const stats = loadStats();
  const achievements = loadAchievements();

  const accuracyAverage =
    stats.sessions.length > 0
      ? stats.sessions.reduce((s, x) => s + x.accuracy, 0) / stats.sessions.length
      : 0;
  const focusScore = Math.round(stats.gamesPlayed * accuracyAverage * 100);

  return (
    <div className="mx-auto max-w-lg space-y-8 p-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-stone-700">Monk Mode</h1>
        <p className="mt-2 text-stone-500">
          Turn doomscrolling into brain training
        </p>
      </header>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h2 className="text-sm font-medium text-stone-500">Daily Focus Score</h2>
        <p className="mt-1 text-4xl font-bold text-stone-700">{focusScore}</p>
        <p className="mt-1 text-sm text-stone-500">
          {stats.gamesPlayed} games played · Best accuracy {Math.round(stats.bestAccuracy * 100)}%
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h2 className="mb-4 text-sm font-medium text-stone-500">Achievements</h2>
        <ul className="space-y-3">
          <AchievementRow
            title="First Interruption"
            unlocked={achievements.first_interruption}
          />
          <AchievementRow
            title="5 Games Played"
            unlocked={achievements.five_games}
          />
          <AchievementRow
            title="90% Accuracy"
            unlocked={achievements.ninety_accuracy}
          />
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <Link to="/stats">
          <Button variant="secondary" fullWidth>
            View Stats
          </Button>
        </Link>
        {canInstall && (
          <Button variant="primary" fullWidth onClick={install}>
            Install App
          </Button>
        )}
        <Button variant="ghost" fullWidth onClick={onSimulateDoomscroll}>
          Simulate Doomscroll
        </Button>
      </div>
    </div>
  );
}

function AchievementRow({
  title,
  unlocked,
}: {
  title: string;
  unlocked: boolean;
}) {
  return (
    <li
      className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
        unlocked ? 'bg-stone-200/80 text-stone-700' : 'bg-stone-100 text-stone-500'
      }`}
    >
      <span className="text-xl">{unlocked ? '✓' : '○'}</span>
      <span>{title}</span>
    </li>
  );
}

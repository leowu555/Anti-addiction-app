/**
 * Game - 2-Back game page (full screen).
 */

import { useNavigate } from 'react-router-dom';
import { TwoBackGame } from '../components/Game/TwoBackGame';
import { useTwoBackGame } from '../hooks/useTwoBackGame';
import type { GameResult } from '../hooks/useTwoBackGame';
import { useState } from 'react';
import { saveSession } from '../utils/metrics';

export function Game() {
  const navigate = useNavigate();
  const [result, setResult] = useState<GameResult | null>(null);

  const game = useTwoBackGame((r) => {
    setResult(r);
    const accuracy = r.totalMatches > 0 ? r.correctMatches / r.totalMatches : 0;
    const avgRT = r.reactionTimes.length > 0
      ? r.reactionTimes.reduce((a, b) => a + b, 0) / r.reactionTimes.length
      : 0;
    saveSession({
      timestamp: Date.now(),
      accuracy,
      reactionTime: avgRT,
      correctMatches: r.correctMatches,
      falsePositives: r.falsePositives,
      misses: r.misses,
      totalMatches: r.totalMatches,
      gamesPlayed: 1,
    });
  });

  const handleDone = () => {
    setResult(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-md">
        <TwoBackGame
          isPlaying={game.isPlaying}
          currentStimulus={game.currentStimulus}
          progress={game.progress}
          elapsed={game.elapsed}
          correctMatches={game.correctMatches}
          misses={game.misses}
          startGame={game.startGame}
          handleMatch={game.handleMatch}
          onDone={handleDone}
          result={result}
        />
      </div>
    </div>
  );
}

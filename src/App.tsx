/**
 * App - Root component with routing and doomscroll interruption modal.
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Game } from './pages/Game';
import { Stats } from './pages/Stats';
import { Modal } from './components/UI/Modal';
import { Button } from './components/UI/Button';
import { useDoomscrollDetector } from './hooks/useDoomscrollDetector';

const BACK_OPTIONS = [2, 3, 4];

function AppContent() {
  const [showInterruption, setShowInterruption] = useState(false);
  const [challengeBack, setChallengeBack] = useState(2);
  const navigate = useNavigate();
  const { resetTrigger } = useDoomscrollDetector(() => {
    setChallengeBack(BACK_OPTIONS[Math.floor(Math.random() * BACK_OPTIONS.length)]);
    setShowInterruption(true);
  });

  const handleStartChallenge = () => {
    setShowInterruption(false);
    resetTrigger();
    navigate(`/game?back=${challengeBack}`);
  };

  const handleSimulate = () => {
    setChallengeBack(BACK_OPTIONS[Math.floor(Math.random() * BACK_OPTIONS.length)]);
    setShowInterruption(true);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-900">
        <Routes>
          <Route path="/" element={<Home onSimulateDoomscroll={handleSimulate} />} />
          <Route path="/game" element={<Game />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>

      <Modal isOpen={showInterruption}>
        <div className="space-y-6 text-center">
          <h2 className="text-xl font-bold text-slate-100">
            You're doomscrolling. Let's turn this into brain training.
          </h2>
          <p className="text-slate-400">
            Take a quick {challengeBack}-back challenge to sharpen your focus.
          </p>
          <p className="text-sm text-cyan-400/80">This is a {challengeBack}-back game</p>
          <Button variant="primary" size="lg" fullWidth onClick={handleStartChallenge}>
            Start {challengeBack}-Back Challenge
          </Button>
        </div>
      </Modal>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

/**
 * App - Root component with routing and doomscroll interruption modal.
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Game } from './pages/Game';
import { Stats } from './pages/Stats';
import { Modal } from './components/UI/Modal';
import { Button } from './components/UI/Button';
import { useDoomscrollDetector } from './hooks/useDoomscrollDetector';

const BACK_OPTIONS = [2, 3, 4];
const BREATHE_DURATION_MS = 5000;

function AppContent() {
  const [showInterruption, setShowInterruption] = useState(false);
  const [interruptionStep, setInterruptionStep] = useState<'breathe' | 'start'>('breathe');
  const [challengeBack, setChallengeBack] = useState(2);
  const navigate = useNavigate();
  const { resetTrigger } = useDoomscrollDetector(() => {
    setChallengeBack(BACK_OPTIONS[Math.floor(Math.random() * BACK_OPTIONS.length)]);
    setInterruptionStep('breathe');
    setShowInterruption(true);
  });

  useEffect(() => {
    if (!showInterruption || interruptionStep !== 'breathe') return;
    const t = setTimeout(() => setInterruptionStep('start'), BREATHE_DURATION_MS);
    return () => clearTimeout(t);
  }, [showInterruption, interruptionStep]);

  const handleStartChallenge = () => {
    setShowInterruption(false);
    setInterruptionStep('breathe');
    resetTrigger();
    navigate(`/game?back=${challengeBack}`);
  };

  const handleSimulate = () => {
    setChallengeBack(BACK_OPTIONS[Math.floor(Math.random() * BACK_OPTIONS.length)]);
    setInterruptionStep('breathe');
    setShowInterruption(true);
  };

  return (
    <>
      <div className="min-h-screen bg-stone-100">
        <Routes>
          <Route path="/" element={<Home onSimulateDoomscroll={handleSimulate} />} />
          <Route path="/game" element={<Game />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>

      <Modal isOpen={showInterruption}>
        {interruptionStep === 'breathe' ? (
          <p className="min-h-[120px] text-center text-3xl font-light text-stone-600 opacity-0 animate-breathe-in">
            breathe…
          </p>
        ) : (
          <div className="space-y-6 text-center animate-screen-in">
            <h2 className="text-xl font-bold text-stone-800">
              Time for Monk Mode
            </h2>
            <p className="text-stone-500">
              Take a quick {challengeBack}-back challenge to sharpen your focus.
            </p>
            <p className="text-sm text-stone-600">This is a {challengeBack}-back game</p>
            <Button variant="primary" size="lg" fullWidth onClick={handleStartChallenge}>
              Start {challengeBack}-Back Challenge
            </Button>
          </div>
        )}
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

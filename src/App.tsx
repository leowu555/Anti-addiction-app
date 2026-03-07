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

function AppContent() {
  const [showInterruption, setShowInterruption] = useState(false);
  const navigate = useNavigate();
  const { resetTrigger } = useDoomscrollDetector(() => setShowInterruption(true));

  const handleStartChallenge = () => {
    setShowInterruption(false);
    resetTrigger();
    navigate('/game');
  };

  const handleSimulate = () => setShowInterruption(true);

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
            Take a quick 2-Back challenge to sharpen your focus.
          </p>
          <Button variant="primary" size="lg" fullWidth onClick={handleStartChallenge}>
            Start 2-Back Challenge
          </Button>
          <button
            className="block w-full text-sm text-slate-500 hover:text-slate-400"
            onClick={() => setShowInterruption(false)}
          >
            Maybe later
          </button>
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

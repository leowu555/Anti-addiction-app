/**
 * useTwoBackGame
 * Manages N-back game state (2, 3, or 4-back): sequence, timing, scoring.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  generateSequence,
  checkMatch,
  countTotalMatches,
  type StimulusType,
} from '../utils/gameLogic';

export interface GameResult {
  correctMatches: number;
  falsePositives: number;
  misses: number;
  totalMatches: number;
  reactionTimes: number[];
  sequence: StimulusType[];
}

const GAME_DURATION_MS = 60_000;
const STIMULUS_INTERVAL_MS = 2000;

export function useTwoBackGame(onGameEnd: (result: GameResult) => void, back: number = 2) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sequence, setSequence] = useState<StimulusType[]>([]);
  const [correctMatches, setCorrectMatches] = useState(0);
  const [falsePositives, setFalsePositives] = useState(0);
  const [misses, setMisses] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  const startTimeRef = useRef<number>(0);
  const lastStimulusTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameEndRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctMatchesRef = useRef(0);
  const falsePositivesRef = useRef(0);
  const missesRef = useRef(0);
  const reactionTimesRef = useRef<number[]>([]);
  const sequenceRef = useRef<StimulusType[]>([]);
  const matchedIndicesRef = useRef<Set<number>>(new Set());

  correctMatchesRef.current = correctMatches;
  falsePositivesRef.current = falsePositives;
  missesRef.current = misses;
  reactionTimesRef.current = reactionTimes;
  sequenceRef.current = sequence;

  const endGame = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (gameEndRef.current) {
      clearTimeout(gameEndRef.current);
      gameEndRef.current = null;
    }
    setIsPlaying(false);
    const seq = sequenceRef.current;
    const totalMatches = countTotalMatches(seq, back);
    onGameEnd({
      correctMatches: correctMatchesRef.current,
      falsePositives: falsePositivesRef.current,
      misses: missesRef.current,
      totalMatches,
      reactionTimes: [...reactionTimesRef.current],
      sequence: seq,
    });
  }, [onGameEnd]);

  const handleMatch = useCallback(() => {
    if (!isPlaying || sequence.length === 0) return;

    const isMatch = checkMatch(currentIndex, sequence, back);
    const now = Date.now();

    if (isMatch) {
      matchedIndicesRef.current.add(currentIndex);
      correctMatchesRef.current += 1;
      reactionTimesRef.current.push(now - lastStimulusTimeRef.current);
      setCorrectMatches((c) => c + 1);
      setReactionTimes((r) => [...r, now - lastStimulusTimeRef.current]);
    } else {
      missesRef.current += 1;
      setMisses((m) => m + 1);
    }
  }, [isPlaying, sequence, currentIndex, back]);

  const startGame = useCallback(() => {
    const seq = generateSequence(Math.ceil(GAME_DURATION_MS / STIMULUS_INTERVAL_MS) + 5, back);
    correctMatchesRef.current = 0;
    falsePositivesRef.current = 0;
    missesRef.current = 0;
    reactionTimesRef.current = [];
    sequenceRef.current = seq;
    matchedIndicesRef.current = new Set();
    setSequence(seq);
    setCurrentIndex(0);
    setCorrectMatches(0);
    setFalsePositives(0);
    setMisses(0);
    setReactionTimes([]);
    setIsPlaying(true);
    startTimeRef.current = Date.now();
    lastStimulusTimeRef.current = Date.now();

    let idx = 0;

    intervalRef.current = setInterval(() => {
      idx++;
      lastStimulusTimeRef.current = Date.now();

      if (idx >= seq.length) {
        endGame();
        return;
      }

      const prevIdx = idx - 1;
      const wasMatch = checkMatch(prevIdx, seq, back);
      if (wasMatch && !matchedIndicesRef.current.has(prevIdx)) {
        missesRef.current += 1;
        setMisses((m) => m + 1);
      }

      setCurrentIndex(idx);
    }, STIMULUS_INTERVAL_MS);

    gameEndRef.current = setTimeout(() => {
      endGame();
    }, GAME_DURATION_MS);
  }, [endGame, back]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (gameEndRef.current) clearTimeout(gameEndRef.current);
    };
  }, []);

  const currentStimulus = sequence[currentIndex] ?? null;

  return {
    isPlaying,
    currentStimulus,
    currentIndex,
    totalStimuli: sequence.length,
    correctMatches,
    falsePositives,
    misses,
    reactionTimes,
    startGame,
    handleMatch,
    progress: sequence.length > 0 ? (currentIndex / sequence.length) * 100 : 0,
    elapsed: isPlaying ? (Date.now() - startTimeRef.current) / 1000 : 0,
  };
}

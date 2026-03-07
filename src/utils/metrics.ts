/**
 * Focus Progress & Analytics
 * LocalStorage-backed metrics for sessions, streaks, and achievements.
 */

const STORAGE_KEY = 'scrollshield_metrics';
const STREAK_KEY = 'scrollshield_streak';
const ACHIEVEMENTS_KEY = 'scrollshield_achievements';

export interface SessionData {
  timestamp: number;
  accuracy: number;
  reactionTime: number;
  correctMatches: number;
  falsePositives: number;
  misses: number;
  totalMatches: number;
  gamesPlayed: number;
}

export interface FocusStats {
  gamesPlayed: number;
  bestAccuracy: number;
  averageReactionTime: number;
  currentStreak: number;
  longestStreak: number;
  sessions: SessionData[];
  focusScore: number;
}

export type AchievementId = 'first_interruption' | 'five_games' | 'ninety_accuracy';

export interface Achievements {
  first_interruption: boolean;
  five_games: boolean;
  ninety_accuracy: boolean;
}

function getDefaultStats(): FocusStats {
  return {
    gamesPlayed: 0,
    bestAccuracy: 0,
    averageReactionTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    sessions: [],
    focusScore: 0,
  };
}

function getDefaultAchievements(): Achievements {
  return {
    first_interruption: false,
    five_games: false,
    ninety_accuracy: false,
  };
}

/**
 * Saves a game session and updates stats.
 */
export function saveSession(data: SessionData): void {
  const stats = loadStats();

  stats.sessions.push(data);
  stats.gamesPlayed += data.gamesPlayed;

  if (data.accuracy > stats.bestAccuracy) {
    stats.bestAccuracy = data.accuracy;
  }

  const totalRT = stats.sessions.reduce((s, sess) => s + sess.reactionTime, 0);
  stats.averageReactionTime =
    stats.sessions.length > 0 ? totalRT / stats.sessions.length : 0;

  stats.currentStreak = updateStreak(true);
  if (stats.currentStreak > stats.longestStreak) {
    stats.longestStreak = stats.currentStreak;
  }

  const avgAccuracy =
    stats.sessions.reduce((s, sess) => s + sess.accuracy, 0) / stats.sessions.length;
  stats.focusScore = Math.round(
    stats.gamesPlayed * avgAccuracy * 100
  );

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    updateAchievements(stats);
  } catch (e) {
    console.warn('localStorage save failed', e);
  }
}

/**
 * Loads aggregated stats from localStorage.
 */
export function loadStats(): FocusStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStats();
    const parsed = JSON.parse(raw);
    return { ...getDefaultStats(), ...parsed };
  } catch {
    return getDefaultStats();
  }
}

/**
 * Updates streak based on whether user played today.
 * Returns new current streak.
 */
export function updateStreak(playedToday: boolean): number {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    const data = raw ? JSON.parse(raw) : { lastPlayed: null, streak: 0 };

    const now = new Date();
    const today = now.toDateString();

    if (data.lastPlayed === today) {
      return data.streak;
    }

    const lastDate = data.lastPlayed ? new Date(data.lastPlayed) : null;
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = data.streak;

    if (!lastDate) {
      newStreak = playedToday ? 1 : 0;
    } else if (lastDate.toDateString() === yesterday.toDateString()) {
      newStreak = playedToday ? data.streak + 1 : 0;
    } else {
      newStreak = playedToday ? 1 : 0;
    }

    if (playedToday) {
      localStorage.setItem(
        STREAK_KEY,
        JSON.stringify({ lastPlayed: today, streak: newStreak })
      );
    }

    return newStreak;
  } catch {
    return playedToday ? 1 : 0;
  }
}

/**
 * Unlocks achievements based on stats.
 */
function updateAchievements(stats: FocusStats): void {
  const achievements = loadAchievements();

  if (stats.gamesPlayed >= 1 && !achievements.first_interruption) {
    achievements.first_interruption = true;
  }
  if (stats.gamesPlayed >= 5 && !achievements.five_games) {
    achievements.five_games = true;
  }
  if (stats.bestAccuracy >= 0.9 && !achievements.ninety_accuracy) {
    achievements.ninety_accuracy = true;
  }

  try {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  } catch {
    // ignore
  }
}

export function loadAchievements(): Achievements {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (!raw) return getDefaultAchievements();
    return { ...getDefaultAchievements(), ...JSON.parse(raw) };
  } catch {
    return getDefaultAchievements();
  }
}

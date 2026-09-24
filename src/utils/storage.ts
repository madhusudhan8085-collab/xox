import type { SettingsState, ScoreState, Achievement, DailyChallengeState } from '../types';

const STORAGE_PREFIX = 'xox_v1_';

export const DEFAULT_SETTINGS: SettingsState = {
  theme: 'dark',
  soundEnabled: true,
  reducedMotion: false,
  animationsEnabled: true,
  playerXName: 'Player 1',
  playerOName: 'Player 2',
  defaultMode: 'vs-ai',
  defaultDifficulty: 'hard',
  aiPersonality: 'calm',
};

export const DEFAULT_SCORES: ScoreState = {
  xWins: 0,
  oWins: 0,
  draws: 0,
  humanWins: 0,
  aiWins: 0,
  currentStreak: 0,
  longestStreak: 0,
  gamesPlayed: 0,
  byDifficulty: {
    easy: { wins: 0, losses: 0, draws: 0 },
    medium: { wins: 0, losses: 0, draws: 0 },
    hard: { wins: 0, losses: 0, draws: 0 },
    expert: { wins: 0, losses: 0, draws: 0 },
  },
};

export const DEFAULT_DAILY_STATE: DailyChallengeState = {
  lastCompletedDate: null,
  currentStreak: 0,
  longestStreak: 0,
  totalCompleted: 0,
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win', title: 'First Victory', description: 'Win your very first XOX game.', iconName: 'Trophy', unlocked: false },
  { id: 'win_streak_3', title: 'On Fire', description: 'Achieve a 3-game win streak.', iconName: 'Flame', unlocked: false },
  { id: 'win_streak_5', title: 'Dominator', description: 'Achieve a 5-game win streak.', iconName: 'Zap', unlocked: false },
  { id: 'beat_hard_ai', title: 'AI Crusher', description: 'Defeat the Hard AI opponent.', iconName: 'Cpu', unlocked: false },
  { id: 'beat_expert_ai', title: 'Grandmaster', description: 'Defeat or draw against the Expert AI.', iconName: 'Award', unlocked: false },
  { id: 'flawless_victory', title: 'Flawless Victory', description: 'Win a game in 5 moves or fewer.', iconName: 'Target', unlocked: false },
  { id: 'daily_solver', title: 'Tactician', description: 'Complete a Daily Challenge puzzle.', iconName: 'Calendar', unlocked: false },
  { id: 'five_boards', title: 'Master of Dimensions', description: 'Play a game on the 5x5 board.', iconName: 'Grid', unlocked: false },
];

export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading localStorage key ${key}:`, err);
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage key ${key}:`, err);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch (err) {
    console.warn(`Error removing localStorage key ${key}:`, err);
  }
}

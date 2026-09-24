export type PlayerSymbol = 'X' | 'O' | null;
export type ActivePlayer = 'X' | 'O';
export type GameMode = 'vs-ai' | 'vs-human';
export type AIDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type AIPersonality = 'calm' | 'competitive' | 'friendly' | 'silent';
export type BoardSize = 3 | 4 | 5;
export type MatchFormat = 'single' | 'best-of-3' | 'best-of-5';
export type GameStatus = 'setup' | 'playing' | 'won' | 'draw';

export interface WinningLine {
  indices: number[];
  type: 'row' | 'col' | 'diag-main' | 'diag-anti';
  lineIndex: number;
}

export interface MoveRecord {
  index: number;
  symbol: ActivePlayer;
  moveNumber: number;
  timestamp: number;
}

export interface GameAnalysis {
  winner: ActivePlayer | 'draw';
  movesPlayed: number;
  keyMoment: string;
  tacticalNotes: string[];
  winnerHighlights?: number[];
}

export interface GameHistoryItem {
  id: string;
  gameNumber: number;
  mode: GameMode;
  opponent: string;
  winner: ActivePlayer | 'draw';
  movesCount: number;
  durationSeconds: number;
  timestamp: string;
  difficulty?: AIDifficulty;
  boardSize: BoardSize;
  matchFormat: MatchFormat;
  analysis?: GameAnalysis;
}

export interface ScoreState {
  xWins: number;
  oWins: number;
  draws: number;
  humanWins: number;
  aiWins: number;
  currentStreak: number;
  longestStreak: number;
  gamesPlayed: number;
  byDifficulty: Record<AIDifficulty, { wins: number; losses: number; draws: number }>;
}

export interface MatchState {
  format: MatchFormat;
  currentGame: number;
  targetWins: number;
  playerXWins: number;
  playerOWins: number;
  winner: ActivePlayer | 'tied' | null;
  isMatchOver: boolean;
  gameHistoryInMatch: ('X' | 'O' | 'draw')[];
}

export interface SettingsState {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  reducedMotion: boolean;
  animationsEnabled: boolean;
  playerXName: string;
  playerOName: string;
  defaultMode: GameMode;
  defaultDifficulty: AIDifficulty;
  aiPersonality: AIPersonality;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface DailyChallengeState {
  lastCompletedDate: string | null;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
}

export interface DailyPuzzle {
  dateStr: string;
  board: PlayerSymbol[];
  boardSize: BoardSize;
  playerTurn: ActivePlayer;
  winningMoveIndex: number;
  description: string;
  explanation: string;
}

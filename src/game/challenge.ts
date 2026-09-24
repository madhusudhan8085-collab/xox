import type { PlayerSymbol, ActivePlayer, DailyPuzzle } from '../types';
import { findImmediateWin } from './ai/difficulty';

/**
 * Deterministic PRNG seeded by date string
 */
function seededRandom(seedStr: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  }
  return function () {
    h += h << 13;
    h ^= h >>> 7;
    h += h << 3;
    h ^= h >>> 17;
    h = (h + (h << 5)) >>> 0;
    return h / 4294967296;
  };
}

/**
 * Pre-designed puzzle templates for classic 3x3 Daily Challenges
 */
const PUZZLE_TEMPLATES: {
  board: (PlayerSymbol)[];
  turn: ActivePlayer;
  winningMove: number;
  description: string;
  explanation: string;
}[] = [
  {
    board: ['X', 'O', null, 'X', 'O', null, null, null, null],
    turn: 'X',
    winningMove: 6,
    description: 'Complete the vertical line for victory.',
    explanation: 'Placing X at position 6 (bottom-left) completes 3-in-a-row down the left column.',
  },
  {
    board: ['X', 'X', null, 'O', 'O', null, null, null, null],
    turn: 'X',
    winningMove: 2,
    description: 'Seize the top-right corner to strike first.',
    explanation: 'Placing X at position 2 (top-right) completes the top row before O can retaliate.',
  },
  {
    board: ['X', 'O', 'O', null, 'X', null, null, null, null],
    turn: 'X',
    winningMove: 8,
    description: 'Find the diagonal strike.',
    explanation: 'Placing X at position 8 (bottom-right) completes the main diagonal (0-4-8).',
  },
  {
    board: ['O', 'X', 'X', null, 'O', null, 'X', null, null],
    turn: 'X',
    winningMove: 6,
    description: 'Find the anti-diagonal winning move.',
    explanation: 'Placing X at position 6 completes the anti-diagonal.',
  },
  {
    board: ['X', null, 'O', 'O', 'X', null, null, null, null],
    turn: 'X',
    winningMove: 8,
    description: 'Diagonal completion maneuver.',
    explanation: 'Placing X at position 8 completes the diagonal line from top-left to bottom-right.',
  },
  {
    board: ['X', 'O', 'X', 'O', 'X', null, 'O', null, null],
    turn: 'X',
    winningMove: 6,
    description: 'Multiple options, but only one wins immediately.',
    explanation: 'Placing X at position 6 blocks O and completes the anti-diagonal.',
  }
];

export function getDailyPuzzle(dateStr?: string): DailyPuzzle {
  const dateKey = dateStr || new Date().toISOString().split('T')[0];
  const rng = seededRandom(dateKey);

  // Pick puzzle template deterministically
  const rawIdx = Math.floor(rng() * PUZZLE_TEMPLATES.length);
  const idx = Math.abs(rawIdx) % PUZZLE_TEMPLATES.length;
  const template = PUZZLE_TEMPLATES[idx];

  // Validate winning move dynamically
  const boardCopy = [...template.board];
  const winMove = findImmediateWin(boardCopy, 3, template.turn) ?? template.winningMove;

  return {
    dateStr: dateKey,
    board: boardCopy,
    boardSize: 3,
    playerTurn: template.turn,
    winningMoveIndex: winMove,
    description: template.description,
    explanation: template.explanation,
  };
}

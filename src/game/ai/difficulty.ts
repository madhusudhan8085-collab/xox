import type { PlayerSymbol, ActivePlayer, BoardSize, AIDifficulty } from '../../types';
import { checkWinner, getAvailableMoves } from '../winChecker';
import { getBestMove3x3 } from './minimax';
import { heuristicMinimax, detectForks } from './heuristicSolver';

/**
 * Finds an immediate winning move for the given symbol, if any exists.
 */
export function findImmediateWin(board: PlayerSymbol[], size: BoardSize, symbol: ActivePlayer): number | null {
  const moves = getAvailableMoves(board);
  for (const move of moves) {
    board[move] = symbol;
    const winResult = checkWinner(board, size);
    board[move] = null;
    if (winResult && winResult.winner === symbol) {
      return move;
    }
  }
  return null;
}

/**
 * Center and corner preferences for different board sizes
 */
function getPreferredPositions(size: BoardSize): { centers: number[]; corners: number[] } {
  if (size === 3) {
    return {
      centers: [4],
      corners: [0, 2, 6, 8],
    };
  } else if (size === 4) {
    return {
      centers: [5, 6, 9, 10],
      corners: [0, 3, 12, 15],
    };
  } else {
    // 5x5
    return {
      centers: [12, 6, 8, 16, 18],
      corners: [0, 4, 20, 24],
    };
  }
}

/**
 * Easy AI: Mostly random with basic sanity
 */
function getEasyMove(board: PlayerSymbol[], size: BoardSize, aiSymbol: ActivePlayer): number {
  const moves = getAvailableMoves(board);
  if (moves.length === 0) return 0;

  // 20% chance to win if available
  if (Math.random() < 0.2) {
    const winMove = findImmediateWin(board, size, aiSymbol);
    if (winMove !== null) return winMove;
  }

  // Pick random available cell
  return moves[Math.floor(Math.random() * moves.length)];
}

/**
 * Medium AI: Win/Block detection, center preference, corners
 */
function getMediumMove(board: PlayerSymbol[], size: BoardSize, aiSymbol: ActivePlayer): number {
  const humanSymbol: ActivePlayer = aiSymbol === 'X' ? 'O' : 'X';
  const moves = getAvailableMoves(board);
  if (moves.length === 0) return 0;

  // 1. Check immediate win
  const winMove = findImmediateWin(board, size, aiSymbol);
  if (winMove !== null) return winMove;

  // 2. Block immediate human win
  const blockMove = findImmediateWin(board, size, humanSymbol);
  if (blockMove !== null) return blockMove;

  // 3. Prefer center
  const { centers, corners } = getPreferredPositions(size);
  const availCenters = centers.filter((idx) => board[idx] === null);
  if (availCenters.length > 0) {
    return availCenters[Math.floor(Math.random() * availCenters.length)];
  }

  // 4. Prefer corners
  const availCorners = corners.filter((idx) => board[idx] === null);
  if (availCorners.length > 0 && Math.random() < 0.7) {
    return availCorners[Math.floor(Math.random() * availCorners.length)];
  }

  // 5. Fallback random
  return moves[Math.floor(Math.random() * moves.length)];
}

/**
 * Hard AI: Minimax 3x3 (Unbeatable) or Heuristic Minimax (4x4, 5x5)
 */
function getHardMove(board: PlayerSymbol[], size: BoardSize, aiSymbol: ActivePlayer): number {
  const humanSymbol: ActivePlayer = aiSymbol === 'X' ? 'O' : 'X';

  if (size === 3) {
    return getBestMove3x3(board, aiSymbol);
  }

  // 4x4 or 5x5: Depth-limited minimax
  const maxDepth = size === 4 ? 4 : 3;
  const result = heuristicMinimax(board, size, 0, maxDepth, true, aiSymbol, humanSymbol);
  return result.move !== undefined ? result.move : getMediumMove(board, size, aiSymbol);
}

/**
 * Expert AI: Tactical analysis (Forks, threats, positioning, deep search)
 */
function getExpertMove(board: PlayerSymbol[], size: BoardSize, aiSymbol: ActivePlayer): number {
  const humanSymbol: ActivePlayer = aiSymbol === 'X' ? 'O' : 'X';

  // 1. Immediate Win
  const winMove = findImmediateWin(board, size, aiSymbol);
  if (winMove !== null) return winMove;

  // 2. Immediate Block
  const blockMove = findImmediateWin(board, size, humanSymbol);
  if (blockMove !== null) return blockMove;

  // 3. Check for AI Fork creation
  const aiForks = detectForks(board, size, aiSymbol);
  if (aiForks.length > 0) {
    return aiForks[0];
  }

  // 4. Block Human Fork creation
  const humanForks = detectForks(board, size, humanSymbol);
  if (humanForks.length > 0) {
    return humanForks[0];
  }

  // 5. 3x3 Minimax fallback
  if (size === 3) {
    return getBestMove3x3(board, aiSymbol);
  }

  // 6. Extended board deep search
  const result = heuristicMinimax(board, size, 0, 4, true, aiSymbol, humanSymbol);
  return result.move !== undefined ? result.move : getMediumMove(board, size, aiSymbol);
}

/**
 * Main AI Move Dispatcher
 */
export function getAIMove(
  board: PlayerSymbol[],
  size: BoardSize,
  aiSymbol: ActivePlayer,
  difficulty: AIDifficulty
): number {
  switch (difficulty) {
    case 'easy':
      return getEasyMove(board, size, aiSymbol);
    case 'medium':
      return getMediumMove(board, size, aiSymbol);
    case 'hard':
      return getHardMove(board, size, aiSymbol);
    case 'expert':
      return getExpertMove(board, size, aiSymbol);
    default:
      return getHardMove(board, size, aiSymbol);
  }
}

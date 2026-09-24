import type { PlayerSymbol, ActivePlayer } from '../../types';
import { checkWinner, isBoardFull, getAvailableMoves } from '../winChecker';

/**
 * Minimax with Alpha-Beta Pruning for 3x3 Classic Board
 */
export function minimax3x3(
  board: PlayerSymbol[],
  depth: number,
  isMaximizing: boolean,
  aiSymbol: ActivePlayer,
  humanSymbol: ActivePlayer,
  alpha: number = -Infinity,
  beta: number = Infinity
): { score: number; move?: number } {
  const result = checkWinner(board, 3);
  if (result) {
    if (result.winner === aiSymbol) return { score: 10 - depth };
    if (result.winner === humanSymbol) return { score: depth - 10 };
  }
  if (isBoardFull(board)) {
    return { score: 0 };
  }

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = aiSymbol;
      const evalResult = minimax3x3(board, depth + 1, false, aiSymbol, humanSymbol, alpha, beta);
      board[move] = null;

      if (evalResult.score > maxScore) {
        maxScore = evalResult.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break; // Pruning
    }

    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = availableMoves[0];

    for (const move of availableMoves) {
      board[move] = humanSymbol;
      const evalResult = minimax3x3(board, depth + 1, true, aiSymbol, humanSymbol, alpha, beta);
      board[move] = null;

      if (evalResult.score < minScore) {
        minScore = evalResult.score;
        bestMove = move;
      }
      beta = Math.min(beta, minScore);
      if (beta <= alpha) break; // Pruning
    }

    return { score: minScore, move: bestMove };
  }
}

/**
 * Finds the single best move for 3x3 board using Minimax.
 */
export function getBestMove3x3(board: PlayerSymbol[], aiSymbol: ActivePlayer): number {
  const humanSymbol: ActivePlayer = aiSymbol === 'X' ? 'O' : 'X';

  // Optimization: If board is empty, pick center or corner randomly for variety
  const available = getAvailableMoves(board);
  if (available.length === 9) {
    const openingMoves = [4, 0, 2, 6, 8];
    return openingMoves[Math.floor(Math.random() * openingMoves.length)];
  }

  const result = minimax3x3(board, 0, true, aiSymbol, humanSymbol);
  return result.move !== undefined ? result.move : available[0];
}

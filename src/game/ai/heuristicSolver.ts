import type { PlayerSymbol, ActivePlayer, BoardSize } from '../../types';
import { checkWinner, isBoardFull, getAvailableMoves, getRequiredWinLength } from '../winChecker';

/**
 * Heuristic Board Evaluator for arbitrary board sizes (3x3, 4x4, 5x5)
 */
export function evaluateBoard(board: PlayerSymbol[], size: BoardSize, aiSymbol: ActivePlayer): number {
  const humanSymbol: ActivePlayer = aiSymbol === 'X' ? 'O' : 'X';
  const winLen = getRequiredWinLength(size);

  const winnerInfo = checkWinner(board, size);
  if (winnerInfo) {
    return winnerInfo.winner === aiSymbol ? 10000 : -10000;
  }

  let score = 0;
  const toIdx = (r: number, c: number) => r * size + c;

  // Center preference matrix
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = toIdx(r, c);
      const symbol = board[idx];
      if (!symbol) continue;

      // Distance from center
      const centerDist = Math.abs(r - (size - 1) / 2) + Math.abs(c - (size - 1) / 2);
      const centerBonus = Math.max(0, size - centerDist) * 3;

      if (symbol === aiSymbol) {
        score += centerBonus;
      } else {
        score -= centerBonus;
      }
    }
  }

  // Lines evaluation function
  const evalSequence = (seq: PlayerSymbol[]) => {
    let aiCount = 0;
    let humanCount = 0;
    for (const s of seq) {
      if (s === aiSymbol) aiCount++;
      else if (s === humanSymbol) humanCount++;
    }
    if (aiCount > 0 && humanCount > 0) return 0; // Blocked line
    if (aiCount === winLen - 1) return 500;
    if (aiCount === winLen - 2) return 50;
    if (aiCount > 0) return aiCount * 5;

    if (humanCount === winLen - 1) return -600; // Human threat needs blocking!
    if (humanCount === winLen - 2) return -70;
    if (humanCount > 0) return -humanCount * 5;

    return 0;
  };

  // Horizontal lines
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLen; c++) {
      const seq: PlayerSymbol[] = [];
      for (let k = 0; k < winLen; k++) seq.push(board[toIdx(r, c + k)]);
      score += evalSequence(seq);
    }
  }

  // Vertical lines
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLen; r++) {
      const seq: PlayerSymbol[] = [];
      for (let k = 0; k < winLen; k++) seq.push(board[toIdx(r + k, c)]);
      score += evalSequence(seq);
    }
  }

  // Main Diagonals
  for (let r = 0; r <= size - winLen; r++) {
    for (let c = 0; c <= size - winLen; c++) {
      const seq: PlayerSymbol[] = [];
      for (let k = 0; k < winLen; k++) seq.push(board[toIdx(r + k, c + k)]);
      score += evalSequence(seq);
    }
  }

  // Anti Diagonals
  for (let r = 0; r <= size - winLen; r++) {
    for (let c = winLen - 1; c < size; c++) {
      const seq: PlayerSymbol[] = [];
      for (let k = 0; k < winLen; k++) seq.push(board[toIdx(r + k, c - k)]);
      score += evalSequence(seq);
    }
  }

  return score;
}

/**
 * Depth-limited Minimax with Alpha-Beta Pruning for 4x4 and 5x5 boards
 */
export function heuristicMinimax(
  board: PlayerSymbol[],
  size: BoardSize,
  depth: number,
  maxDepth: number,
  isMaximizing: boolean,
  aiSymbol: ActivePlayer,
  humanSymbol: ActivePlayer,
  alpha: number = -Infinity,
  beta: number = Infinity
): { score: number; move?: number } {
  const winnerInfo = checkWinner(board, size);
  if (winnerInfo) {
    if (winnerInfo.winner === aiSymbol) return { score: 10000 - depth };
    if (winnerInfo.winner === humanSymbol) return { score: -10000 + depth };
  }
  if (isBoardFull(board) || depth >= maxDepth) {
    return { score: evaluateBoard(board, size, aiSymbol) };
  }

  const moves = getAvailableMoves(board);
  if (moves.length === 0) return { score: 0 };

  if (isMaximizing) {
    let maxScore = -Infinity;
    let bestMove = moves[0];

    for (const move of moves) {
      board[move] = aiSymbol;
      const res = heuristicMinimax(board, size, depth + 1, maxDepth, false, aiSymbol, humanSymbol, alpha, beta);
      board[move] = null;

      if (res.score > maxScore) {
        maxScore = res.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, maxScore);
      if (beta <= alpha) break;
    }
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    let bestMove = moves[0];

    for (const move of moves) {
      board[move] = humanSymbol;
      const res = heuristicMinimax(board, size, depth + 1, maxDepth, true, aiSymbol, humanSymbol, alpha, beta);
      board[move] = null;

      if (res.score < minScore) {
        minScore = res.score;
        bestMove = move;
      }
      beta = Math.min(beta, minScore);
      if (beta <= alpha) break;
    }
    return { score: minScore, move: bestMove };
  }
}

/**
 * Tactical Fork Detector: Finds if a move creates 2 or more winning threats
 */
export function detectForks(board: PlayerSymbol[], size: BoardSize, player: ActivePlayer): number[] {
  const moves = getAvailableMoves(board);
  const forkMoves: number[] = [];

  for (const move of moves) {
    board[move] = player;
    let winThreats = 0;
    const nextMoves = getAvailableMoves(board);
    for (const nxt of nextMoves) {
      board[nxt] = player;
      if (checkWinner(board, size)?.winner === player) {
        winThreats++;
      }
      board[nxt] = null;
    }
    board[move] = null;

    if (winThreats >= 2) {
      forkMoves.push(move);
    }
  }

  return forkMoves;
}

/**
 * Calculates live engine win probability and board evaluation for X vs O
 */
export function getBoardEvaluation(
  board: PlayerSymbol[],
  size: BoardSize
): { score: number; label: string; xWinChance: number } {
  const winnerInfo = checkWinner(board, size);
  if (winnerInfo) {
    if (winnerInfo.winner === 'X') {
      return { score: 100, label: 'X Victory', xWinChance: 100 };
    }
    return { score: -100, label: 'O Victory', xWinChance: 0 };
  }

  if (isBoardFull(board)) {
    return { score: 0, label: 'Draw Game', xWinChance: 50 };
  }

  const rawScore = evaluateBoard(board, size, 'X');
  // Smooth non-linear mapping
  const normalized = Math.tanh(rawScore / 350);
  const score = Math.round(normalized * 100);
  const xWinChance = Math.min(99, Math.max(1, Math.round(50 + normalized * 48)));

  let label = 'Even (50/50)';
  if (score >= 60) label = 'X Winning';
  else if (score >= 25) label = 'Advantage X';
  else if (score >= 10) label = 'Slight Edge X';
  else if (score <= -60) label = 'O Winning';
  else if (score <= -25) label = 'Advantage O';
  else if (score <= -10) label = 'Slight Edge O';

  return { score, label, xWinChance };
}

import type { PlayerSymbol, ActivePlayer, BoardSize, MoveRecord, GameAnalysis } from '../types';
import { checkWinner } from './winChecker';
import { detectForks } from './ai/heuristicSolver';

/**
 * Analyzes completed game log and board state to produce plain-English tactical insights.
 */
export function analyzeGame(
  board: PlayerSymbol[],
  size: BoardSize,
  moves: MoveRecord[],
  winner: ActivePlayer | 'draw'
): GameAnalysis {
  const movesPlayed = moves.length;
  const tacticalNotes: string[] = [];
  let keyMoment = 'Solid strategic play throughout the match.';

  if (winner === 'draw') {
    tacticalNotes.push('Both players maintained complete defensive coverage.');
    tacticalNotes.push('No unblocked winning lines or tactical forks were conceded.');
    return {
      winner: 'draw',
      movesPlayed,
      keyMoment: 'Tight defense from both sides resulted in a flawless draw.',
      tacticalNotes,
    };
  }

  // Find center moves
  const centerIdx = size === 3 ? 4 : size === 4 ? 5 : 12;
  const firstMove = moves[0];
  if (firstMove && firstMove.index === centerIdx) {
    tacticalNotes.push(`${firstMove.symbol} seized the crucial center square on Move 1.`);
  }

  // Replay moves to identify key tactical events
  const tempBoard: PlayerSymbol[] = Array(size * size).fill(null);
  let forkCreatedMove: number | null = null;

  for (let i = 0; i < moves.length; i++) {
    const m = moves[i];
    tempBoard[m.index] = m.symbol;

    // Check if a fork was created on this move
    if (!forkCreatedMove) {
      const forks = detectForks(tempBoard, size, m.symbol);
      if (forks.length > 0) {
        forkCreatedMove = m.moveNumber;
        if (m.symbol === winner) {
          tacticalNotes.push(`${m.symbol} set up a double-threat fork on Move ${m.moveNumber}.`);
          keyMoment = `${winner} created an unblockable fork on Move ${m.moveNumber}.`;
        }
      }
    }
  }

  // Winning Move
  const lastMove = moves[moves.length - 1];
  if (lastMove && lastMove.symbol === winner) {
    tacticalNotes.push(`${winner} delivered the winning move on Move ${lastMove.moveNumber}.`);
    if (keyMoment === 'Solid strategic play throughout the match.') {
      keyMoment = `${winner} capitalized on line positioning for victory on Move ${lastMove.moveNumber}.`;
    }
  }

  // Highlight winning cells if win
  const winInfo = checkWinner(board, size);

  return {
    winner,
    movesPlayed,
    keyMoment,
    tacticalNotes,
    winnerHighlights: winInfo ? winInfo.winningLine.indices : undefined,
  };
}

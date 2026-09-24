import type { PlayerSymbol, ActivePlayer, BoardSize, WinningLine } from '../types';

export function getRequiredWinLength(size: BoardSize): number {
  switch (size) {
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 4; // 4 in a row for 5x5 provides dynamic tactical depth
    default:
      return 3;
  }
}

/**
 * Returns winning line details if a player has won, otherwise null.
 */
export function checkWinner(board: PlayerSymbol[], size: BoardSize): { winner: ActivePlayer; winningLine: WinningLine } | null {
  const winLen = getRequiredWinLength(size);

  // Helper to convert (row, col) to index
  const toIdx = (r: number, c: number) => r * size + c;

  // Check Horizontal Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - winLen; c++) {
      const first = board[toIdx(r, c)];
      if (!first) continue;
      let isWin = true;
      const indices: number[] = [];
      for (let k = 0; k < winLen; k++) {
        const idx = toIdx(r, c + k);
        indices.push(idx);
        if (board[idx] !== first) {
          isWin = false;
          break;
        }
      }
      if (isWin) {
        return {
          winner: first as ActivePlayer,
          winningLine: { indices, type: 'row', lineIndex: r },
        };
      }
    }
  }

  // Check Vertical Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - winLen; r++) {
      const first = board[toIdx(r, c)];
      if (!first) continue;
      let isWin = true;
      const indices: number[] = [];
      for (let k = 0; k < winLen; k++) {
        const idx = toIdx(r + k, c);
        indices.push(idx);
        if (board[idx] !== first) {
          isWin = false;
          break;
        }
      }
      if (isWin) {
        return {
          winner: first as ActivePlayer,
          winningLine: { indices, type: 'col', lineIndex: c },
        };
      }
    }
  }

  // Check Main Diagonal (\)
  for (let r = 0; r <= size - winLen; r++) {
    for (let c = 0; c <= size - winLen; c++) {
      const first = board[toIdx(r, c)];
      if (!first) continue;
      let isWin = true;
      const indices: number[] = [];
      for (let k = 0; k < winLen; k++) {
        const idx = toIdx(r + k, c + k);
        indices.push(idx);
        if (board[idx] !== first) {
          isWin = false;
          break;
        }
      }
      if (isWin) {
        return {
          winner: first as ActivePlayer,
          winningLine: { indices, type: 'diag-main', lineIndex: 0 },
        };
      }
    }
  }

  // Check Anti Diagonal (/)
  for (let r = 0; r <= size - winLen; r++) {
    for (let c = winLen - 1; c < size; c++) {
      const first = board[toIdx(r, c)];
      if (!first) continue;
      let isWin = true;
      const indices: number[] = [];
      for (let k = 0; k < winLen; k++) {
        const idx = toIdx(r + k, c - k);
        indices.push(idx);
        if (board[idx] !== first) {
          isWin = false;
          break;
        }
      }
      if (isWin) {
        return {
          winner: first as ActivePlayer,
          winningLine: { indices, type: 'diag-anti', lineIndex: 0 },
        };
      }
    }
  }

  return null;
}

/**
 * Checks if board is completely filled (draw condition)
 */
export function isBoardFull(board: PlayerSymbol[]): boolean {
  return board.every((cell) => cell !== null);
}

/**
 * Get all available cell indices
 */
export function getAvailableMoves(board: PlayerSymbol[]): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

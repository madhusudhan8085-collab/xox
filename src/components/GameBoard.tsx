import React from 'react';
import type { PlayerSymbol, BoardSize, WinningLine } from '../types';
import { Cell } from './Cell';

interface GameBoardProps {
  board: PlayerSymbol[];
  boardSize: BoardSize;
  winningLine: WinningLine | null;
  suggestedMove: number | null;
  disabled: boolean;
  onCellClick: (index: number) => void;
  reducedMotion?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  boardSize,
  winningLine,
  suggestedMove,
  disabled,
  onCellClick,
  reducedMotion = false,
}) => {
  const getGridColsClass = (size: BoardSize) => {
    switch (size) {
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-4';
      case 5:
        return 'grid-cols-5';
      default:
        return 'grid-cols-3';
    }
  };

  const isWinningCell = (index: number) => {
    return winningLine ? winningLine.indices.includes(index) : false;
  };

  return (
    <div className="relative w-full max-w-md mx-auto p-4 sm:p-6 rounded-3xl glass-panel shadow-2xl border border-slate-700/40">
      {/* Dynamic Grid Layout */}
      <div className={`grid ${getGridColsClass(boardSize)} gap-2.5 sm:gap-3.5 w-full`}>
        {board.map((cellValue, idx) => (
          <Cell
            key={idx}
            index={idx}
            value={cellValue}
            isWinningCell={isWinningCell(idx)}
            isSuggested={suggestedMove === idx}
            disabled={disabled}
            onClick={onCellClick}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>

      {/* Dynamic SVG Winning Line Overlay */}
      {winningLine && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none p-4 sm:p-6"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {(() => {
            const indices = winningLine.indices;
            if (indices.length < 2) return null;
            const startIdx = indices[0];
            const endIdx = indices[indices.length - 1];

            const startRow = Math.floor(startIdx / boardSize);
            const startCol = startIdx % boardSize;
            const endRow = Math.floor(endIdx / boardSize);
            const endCol = endIdx % boardSize;

            const step = 100 / boardSize;
            const x1 = startCol * step + step / 2;
            const y1 = startRow * step + step / 2;
            const x2 = endCol * step + step / 2;
            const y2 = endRow * step + step / 2;

            return (
              <line
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="#f59e0b"
                strokeWidth="6"
                strokeLinecap="round"
                className={`glow-win ${reducedMotion ? '' : 'winning-line-anim'}`}
              />
            );
          })()}
        </svg>
      )}
    </div>
  );
};

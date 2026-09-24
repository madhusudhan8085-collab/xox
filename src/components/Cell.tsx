import React from 'react';
import type { PlayerSymbol } from '../types';

interface CellProps {
  index: number;
  value: PlayerSymbol;
  isWinningCell: boolean;
  isSuggested: boolean;
  disabled: boolean;
  onClick: (index: number) => void;
  reducedMotion?: boolean;
}

export const Cell: React.FC<CellProps> = ({
  index,
  value,
  isWinningCell,
  isSuggested,
  disabled,
  onClick,
  reducedMotion = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && !value) {
      e.preventDefault();
      onClick(index);
    }
  };

  return (
    <button
      onClick={() => onClick(index)}
      onKeyDown={handleKeyDown}
      disabled={disabled || value !== null}
      tabIndex={disabled ? -1 : 0}
      aria-label={`Cell ${index + 1}, ${value ? `occupied by ${value}` : 'empty'}`}
      className={`
        relative aspect-square w-full rounded-2xl flex items-center justify-center p-3 sm:p-4
        transition-all duration-200 ease-out select-none outline-none
        border focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        ${
          value === null && !disabled
            ? 'glass-panel hover:bg-slate-800/60 hover:scale-[1.02] active:scale-[0.98] border-slate-700/50 cursor-pointer shadow-md'
            : 'glass-card border-slate-800/80 cursor-default'
        }
        ${isWinningCell ? 'ring-2 ring-amber-400 bg-amber-500/10 shadow-xl shadow-amber-500/20 scale-[1.03] z-10' : ''}
        ${isSuggested ? 'ring-2 ring-indigo-400 bg-indigo-500/10 animate-pulse' : ''}
      `}
    >
      {/* Symbol X Rendering */}
      {value === 'X' && (
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full stroke-cyan-400 glow-x ${isWinningCell ? 'stroke-amber-400 glow-win' : ''}`}
          strokeWidth="12"
          strokeLinecap="round"
        >
          <line
            x1="20"
            y1="20"
            x2="80"
            y2="80"
            className={reducedMotion ? '' : 'draw-path'}
          />
          <line
            x1="80"
            y1="20"
            x2="20"
            y2="80"
            className={reducedMotion ? '' : 'draw-path'}
            style={{ animationDelay: '0.15s' }}
          />
        </svg>
      )}

      {/* Symbol O Rendering */}
      {value === 'O' && (
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full stroke-rose-400 glow-o ${isWinningCell ? 'stroke-amber-400 glow-win' : ''}`}
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="32"
            className={reducedMotion ? '' : 'draw-path'}
          />
        </svg>
      )}
    </button>
  );
};

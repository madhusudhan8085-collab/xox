import React, { useState } from 'react';
import type { PlayerSymbol } from '../types';

interface CellProps {
  index: number;
  value: PlayerSymbol;
  isWinningCell: boolean;
  isSuggested: boolean;
  disabled: boolean;
  onClick: (index: number) => void;
  reducedMotion?: boolean;
  hoverPreview?: PlayerSymbol;
  shortcutKey?: string;
}

export const Cell: React.FC<CellProps> = ({
  index,
  value,
  isWinningCell,
  isSuggested,
  disabled,
  onClick,
  reducedMotion = false,
  hoverPreview,
  shortcutKey,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && !value) {
      e.preventDefault();
      onClick(index);
    }
  };

  const showGhostX = isHovered && !disabled && value === null && hoverPreview === 'X';
  const showGhostO = isHovered && !disabled && value === null && hoverPreview === 'O';

  return (
    <button
      onClick={() => onClick(index)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || value !== null}
      tabIndex={disabled ? -1 : 0}
      aria-label={`Cell ${index + 1}, ${value ? `occupied by ${value}` : 'empty'}`}
      className={`
        group relative aspect-square w-full rounded-2xl flex items-center justify-center p-2.5 sm:p-4
        transition-all duration-200 ease-out select-none outline-none
        border focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2
        ${
          value === null && !disabled
            ? 'glass-panel hover:border-indigo-400/50 hover:scale-[1.03] active:scale-[0.97] cursor-pointer shadow-md dark:hover:bg-slate-800/60'
            : 'glass-card cursor-default'
        }
        ${
          isWinningCell
            ? 'ring-2 ring-amber-400 bg-amber-500/15 shadow-xl shadow-amber-500/25 scale-[1.04] z-10 animate-bounce'
            : ''
        }
        ${isSuggested ? 'ring-2 ring-indigo-400 bg-indigo-500/15 animate-pulse' : ''}
      `}
    >
      {/* Keyboard Shortcut Indicator */}
      {shortcutKey && value === null && !disabled && (
        <span className="absolute top-1.5 left-2 text-[9px] font-mono font-bold text-slate-400/60 group-hover:text-indigo-400 transition-colors hidden sm:block">
          {shortcutKey}
        </span>
      )}

      {/* Symbol X Rendering */}
      {value === 'X' && (
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full stroke-cyan-400 glow-x ${
            isWinningCell ? 'stroke-amber-400 glow-win' : ''
          }`}
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
            style={{ animationDelay: '0.12s' }}
          />
        </svg>
      )}

      {/* Symbol O Rendering */}
      {value === 'O' && (
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full stroke-rose-400 glow-o ${
            isWinningCell ? 'stroke-amber-400 glow-win' : ''
          }`}
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

      {/* Ghost Hover Preview for X */}
      {showGhostX && (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full stroke-cyan-400/40 opacity-50 transition-opacity pointer-events-none"
          strokeWidth="10"
          strokeLinecap="round"
        >
          <line x1="20" y1="20" x2="80" y2="80" />
          <line x1="80" y1="20" x2="20" y2="80" />
        </svg>
      )}

      {/* Ghost Hover Preview for O */}
      {showGhostO && (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full stroke-rose-400/40 opacity-50 transition-opacity pointer-events-none"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        >
          <circle cx="50" cy="50" r="32" />
        </svg>
      )}
    </button>
  );
};

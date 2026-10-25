import React from 'react';
import type { BoardEvaluation, GameMode, ActivePlayer } from '../types';
import { Zap } from 'lucide-react';

interface EvaluationBarProps {
  evaluation: BoardEvaluation;
  mode: GameMode;
  humanSymbol: ActivePlayer;
  playerXName: string;
  playerOName: string;
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({
  evaluation,
  mode,
  humanSymbol,
  playerXName,
  playerOName,
}) => {
  const { label, xWinChance } = evaluation;
  const oWinChance = 100 - xWinChance;

  const getLabelX = () => {
    if (mode === 'vs-ai') {
      return humanSymbol === 'X' ? playerXName || 'You (X)' : 'AI (X)';
    }
    return playerXName || 'X';
  };

  const getLabelO = () => {
    if (mode === 'vs-ai') {
      return humanSymbol === 'O' ? playerOName || 'You (O)' : 'AI (O)';
    }
    return playerOName || 'O';
  };

  return (
    <div className="w-full max-w-md mx-auto select-none space-y-1.5">
      {/* Header with tactical engine badge */}
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 px-1">
        <span className="flex items-center gap-1 text-cyan-400 font-bold truncate max-w-[130px]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
          {getLabelX()} ({xWinChance}%)
        </span>

        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-200 text-[10px] font-bold shadow-sm">
          <Zap className="w-3 h-3 text-amber-400" />
          {label}
        </span>

        <span className="flex items-center gap-1 text-rose-400 font-bold truncate max-w-[130px] justify-end">
          {getLabelO()} ({oWinChance}%)
          <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
        </span>
      </div>

      {/* Dynamic Dual-Tone Progress Track */}
      <div className="relative h-2 w-full bg-slate-800/80 rounded-full overflow-hidden flex border border-slate-700/50 p-0.5 shadow-inner">
        {/* X Percentage Bar */}
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-l-full transition-all duration-500 ease-out"
          style={{ width: `${xWinChance}%` }}
        />
        {/* O Percentage Bar */}
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-rose-500 rounded-r-full transition-all duration-500 ease-out"
          style={{ width: `${oWinChance}%` }}
        />
        {/* Center Divider Indicator */}
        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/40 -translate-x-1/2" />
      </div>
    </div>
  );
};

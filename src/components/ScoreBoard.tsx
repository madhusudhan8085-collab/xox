import React from 'react';
import type { ScoreState, MatchState, GameMode, ActivePlayer } from '../types';
import { Flame } from 'lucide-react';

interface ScoreBoardProps {
  scores: ScoreState;
  matchState: MatchState;
  mode: GameMode;
  humanSymbol: ActivePlayer;
  playerXName: string;
  playerOName: string;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores,
  matchState,
  mode,
  humanSymbol,
  playerXName,
  playerOName,
}) => {
  const getXName = () => {
    if (mode === 'vs-ai') {
      return humanSymbol === 'X' ? playerXName || 'You (X)' : 'AI (X)';
    }
    return playerXName || 'Player X';
  };

  const getOName = () => {
    if (mode === 'vs-ai') {
      return humanSymbol === 'O' ? playerOName || 'You (O)' : 'AI (O)';
    }
    return playerOName || 'Player O';
  };

  return (
    <div className="w-full max-w-md mx-auto grid grid-cols-4 gap-2 text-center select-none">
      {/* X Wins Card */}
      <div className="glass-panel p-2.5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 transition-transform hover:scale-[1.02]">
        <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider truncate">
          {getXName()}
        </div>
        <div className="text-xl font-black text-cyan-300 font-mono">
          {matchState.format !== 'single' ? matchState.playerXWins : scores.xWins}
        </div>
      </div>

      {/* Draws Card */}
      <div className="glass-panel p-2.5 rounded-2xl border border-slate-700/40 bg-slate-800/40 transition-transform hover:scale-[1.02]">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">DRAWS</div>
        <div className="text-xl font-black text-slate-300 font-mono">{scores.draws}</div>
      </div>

      {/* O Wins Card */}
      <div className="glass-panel p-2.5 rounded-2xl border border-rose-500/20 bg-rose-500/5 transition-transform hover:scale-[1.02]">
        <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider truncate">
          {getOName()}
        </div>
        <div className="text-xl font-black text-rose-300 font-mono">
          {matchState.format !== 'single' ? matchState.playerOWins : scores.oWins}
        </div>
      </div>

      {/* Win Streak Card */}
      <div className="glass-panel p-2.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-col justify-center items-center transition-transform hover:scale-[1.02]">
        <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
          <Flame className="w-3 h-3 text-amber-400" /> STREAK
        </div>
        <div className="text-xl font-black text-amber-300 font-mono">{scores.currentStreak}</div>
      </div>
    </div>
  );
};

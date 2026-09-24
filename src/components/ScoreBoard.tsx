import React from 'react';
import type { ScoreState, MatchState, GameMode } from '../types';
import { Flame } from 'lucide-react';

interface ScoreBoardProps {
  scores: ScoreState;
  matchState: MatchState;
  mode: GameMode;
  playerXName: string;
  playerOName: string;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores,
  matchState,
  mode,
  playerXName,
  playerOName,
}) => {
  return (
    <div className="w-full max-w-md mx-auto grid grid-cols-4 gap-2 text-center">
      {/* X Wins Card */}
      <div className="glass-panel p-2.5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5">
        <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider truncate">
          {mode === 'vs-human' ? playerXName || 'Player X' : 'Player X'}
        </div>
        <div className="text-xl font-black text-cyan-300">
          {matchState.format !== 'single' ? matchState.playerXWins : scores.xWins}
        </div>
      </div>

      {/* Draws Card */}
      <div className="glass-panel p-2.5 rounded-2xl border border-slate-700/40 bg-slate-800/40">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">DRAWS</div>
        <div className="text-xl font-black text-slate-300">{scores.draws}</div>
      </div>

      {/* O Wins Card */}
      <div className="glass-panel p-2.5 rounded-2xl border border-rose-500/20 bg-rose-500/5">
        <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider truncate">
          {mode === 'vs-human' ? playerOName || 'Player O' : 'XOX AI'}
        </div>
        <div className="text-xl font-black text-rose-300">
          {matchState.format !== 'single' ? matchState.playerOWins : scores.oWins}
        </div>
      </div>

      {/* Win Streak Card */}
      <div className="glass-panel p-2.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-col justify-center items-center">
        <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
          <Flame className="w-3 h-3 text-amber-400" /> STREAK
        </div>
        <div className="text-xl font-black text-amber-300">{scores.currentStreak}</div>
      </div>
    </div>
  );
};

import React from 'react';
import type { ScoreState, AIDifficulty } from '../types';
import { BarChart2, Trophy, Flame, Target, X, Cpu } from 'lucide-react';
import { formatWinRate } from '../utils/formatters';

interface StatisticsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  scores: ScoreState;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ isOpen, onClose, scores }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-lg p-4 overflow-y-auto animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700/60 shadow-2xl space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-100">PLAYER STATISTICS</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-3.5 rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Games Played
            </div>
            <div className="text-2xl font-black text-slate-100 mt-1">{scores.gamesPlayed}</div>
          </div>

          <div className="glass-card p-3.5 rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-cyan-400" /> Overall Win Rate
            </div>
            <div className="text-2xl font-black text-cyan-400 mt-1">
              {formatWinRate(scores.humanWins, scores.gamesPlayed)}
            </div>
          </div>

          <div className="glass-card p-3.5 rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Current Streak
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">{scores.currentStreak}</div>
          </div>

          <div className="glass-card p-3.5 rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" /> Longest Streak
            </div>
            <div className="text-2xl font-black text-rose-400 mt-1">{scores.longestStreak}</div>
          </div>
        </div>

        {/* AI Performance Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-purple-400" /> AI DIFFICULTY BREAKDOWN
          </h3>

          <div className="space-y-2">
            {(['easy', 'medium', 'hard', 'expert'] as AIDifficulty[]).map((d) => {
              const stat = scores.byDifficulty[d];
              const total = stat.wins + stat.losses + stat.draws;
              const rate = formatWinRate(stat.wins, total);

              return (
                <div key={d} className="glass-card p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="font-extrabold capitalize text-slate-200 w-20">{d}</div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <span>W: <strong className="text-cyan-400">{stat.wins}</strong></span>
                    <span>L: <strong className="text-rose-400">{stat.losses}</strong></span>
                    <span>D: <strong className="text-slate-300">{stat.draws}</strong></span>
                    <span className="w-12 text-right font-black text-purple-300">{rate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

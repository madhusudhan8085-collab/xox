import React from 'react';
import type { Achievement } from '../types';
import { Award, X, Trophy, Flame, Zap, Cpu, Target, Calendar, Grid, CheckCircle2, Lock } from 'lucide-react';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Trophy: <Trophy className="w-5 h-5 text-amber-400" />,
  Flame: <Flame className="w-5 h-5 text-amber-500" />,
  Zap: <Zap className="w-5 h-5 text-purple-400" />,
  Cpu: <Cpu className="w-5 h-5 text-indigo-400" />,
  Award: <Award className="w-5 h-5 text-cyan-400" />,
  Target: <Target className="w-5 h-5 text-rose-400" />,
  Calendar: <Calendar className="w-5 h-5 text-emerald-400" />,
  Grid: <Grid className="w-5 h-5 text-blue-400" />,
};

export const AchievementModal: React.FC<AchievementModalProps> = ({ isOpen, onClose, achievements }) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-lg p-4 overflow-y-auto animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700/60 shadow-2xl space-y-6 my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">ACHIEVEMENTS</h2>
              <p className="text-[10px] text-amber-400 font-semibold">
                {unlockedCount} of {achievements.length} Badges Unlocked
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="overflow-y-auto flex-1 space-y-2.5 pr-1">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                item.unlocked
                  ? 'glass-card border-amber-500/30 bg-amber-500/5'
                  : 'glass-card border-slate-800 opacity-50'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                {item.unlocked ? (
                  ICON_MAP[item.iconName] || <Award className="w-5 h-5 text-amber-400" />
                ) : (
                  <Lock className="w-5 h-5 text-slate-600" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100">{item.title}</h4>
                  {item.unlocked && (
                    <span className="text-[9px] text-amber-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Unlocked
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

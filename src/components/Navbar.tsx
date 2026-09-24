import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Settings, BarChart2, History, Award, Calendar } from 'lucide-react';

interface NavbarProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  onOpenSettings: () => void;
  onOpenStats: () => void;
  onOpenHistory: () => void;
  onOpenAchievements: () => void;
  onOpenDaily: () => void;
  onOpenSetup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  toggleTheme,
  soundEnabled,
  toggleSound,
  onOpenSettings,
  onOpenStats,
  onOpenHistory,
  onOpenAchievements,
  onOpenDaily,
  onOpenSetup,
}) => {
  return (
    <header className="w-full glass-panel sticky top-0 z-40 px-4 py-3 border-b transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenSetup}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-rose-400 text-xl tracking-tighter">
              XOX
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider text-slate-100 flex items-center gap-1.5">
              ADVANCED <span className="text-indigo-400 text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">PRO</span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">Think. Predict. Win.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenDaily}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-medium text-xs flex items-center gap-1.5 transition-all"
            title="Daily Challenge"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden md:inline">Daily Puzzle</span>
          </button>

          <button
            onClick={onOpenStats}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors"
            title="Statistics"
            aria-label="Statistics"
          >
            <BarChart2 className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors"
            title="Game History"
            aria-label="Game History"
          >
            <History className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenAchievements}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors"
            title="Achievements"
            aria-label="Achievements"
          >
            <Award className="w-5 h-5" />
          </button>

          <div className="h-5 w-[1px] bg-slate-700/50 mx-1 hidden sm:block" />

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-indigo-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

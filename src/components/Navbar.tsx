import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Settings, BarChart2, History, Award, Calendar, Keyboard } from 'lucide-react';
import { Logo } from './Logo';

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
  onOpenShortcuts?: () => void;
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
  onOpenShortcuts,
}) => {
  return (
    <header className="w-full glass-panel sticky top-0 z-40 px-3 sm:px-4 py-2.5 sm:py-3 border-b select-none transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group" onClick={onOpenSetup}>
          <Logo size="md" />
          <div>
            <h1 className="font-black text-base sm:text-lg tracking-wider text-slate-100 flex items-center gap-1.5">
              XO MIND <span className="text-cyan-400 text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25">AI</span>
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">Strategy meets AI &bull; Brain XO Battle</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <button
            onClick={onOpenDaily}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-medium text-xs flex items-center gap-1.5 transition-all"
            title="Daily Challenge"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden md:inline font-bold">Daily Puzzle</span>
          </button>

          <button
            onClick={onOpenStats}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors"
            title="Statistics"
            aria-label="Statistics"
          >
            <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors"
            title="Game History"
            aria-label="Game History"
          >
            <History className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onOpenAchievements}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors"
            title="Achievements"
            aria-label="Achievements"
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors hidden sm:block"
              title="Keyboard Shortcuts (?)"
              aria-label="Keyboard Shortcuts"
            >
              <Keyboard className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          <div className="h-4 w-[1px] bg-slate-700/50 mx-0.5 sm:mx-1 hidden sm:block" />

          <button
            onClick={toggleSound}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors"
            title={soundEnabled ? 'Mute Sound (M)' : 'Enable Sound (M)'}
            aria-label={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors"
            title="Toggle Theme (T)"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-300 transition-colors"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import type { SettingsState } from '../types';
import { Settings, X, Moon, Sun, Volume2, VolumeX, Eye, User } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
  onUpdateSettings: (updater: (prev: SettingsState) => SettingsState) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  theme,
  toggleTheme,
  soundEnabled,
  toggleSound,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-lg p-4 overflow-y-auto animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700/60 shadow-2xl space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-100">GAME SETTINGS</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Custom Display Names */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" /> Player Display Names
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-cyan-400 font-bold block mb-1">Player X Name</label>
              <input
                type="text"
                value={settings.playerXName}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({ ...prev, playerXName: e.target.value || 'Player 1' }))
                }
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="text-[10px] text-rose-400 font-bold block mb-1">Player O Name</label>
              <input
                type="text"
                value={settings.playerOName}
                onChange={(e) =>
                  onUpdateSettings((prev) => ({ ...prev, playerOName: e.target.value || 'Player 2' }))
                }
                className="w-full px-3 py-2 rounded-xl glass-card border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>
        </div>

        {/* Theme & Sound Toggles */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Preferences</label>

          <div className="flex items-center justify-between p-3 rounded-2xl glass-card border border-slate-800">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              Appearance Mode
            </span>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-200 capitalize hover:bg-slate-700"
            >
              {theme} Mode
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl glass-card border border-slate-800">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              Sound Effects
            </span>
            <button
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                soundEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {soundEnabled ? 'Enabled' : 'Muted'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl glass-card border border-slate-800">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" /> Reduced Motion
            </span>
            <button
              onClick={() =>
                onUpdateSettings((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }))
              }
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                settings.reducedMotion ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

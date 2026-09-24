import React, { useState } from 'react';
import { Lightbulb, Undo2, RotateCcw, Trash2 } from 'lucide-react';

interface GameControlsProps {
  onHint: () => void;
  onUndo: () => void;
  onNewGame: () => void;
  onResetScores: () => void;
  undoDisabled: boolean;
  disabled: boolean;
}

export const GameControls: React.FC<GameControlsProps> = ({
  onHint,
  onUndo,
  onNewGame,
  onResetScores,
  undoDisabled,
  disabled,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetConfirm = () => {
    onResetScores();
    setShowResetConfirm(false);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <div className="flex items-center justify-between gap-2">
        {/* Hint Button */}
        <button
          onClick={onHint}
          disabled={disabled}
          className="flex-1 py-2.5 px-3 rounded-2xl glass-panel hover:bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-sm"
          title="Get move suggestion"
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Hint</span>
        </button>

        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={undoDisabled || disabled}
          className="flex-1 py-2.5 px-3 rounded-2xl glass-panel hover:bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none shadow-sm"
          title="Undo move"
        >
          <Undo2 className="w-4 h-4 text-indigo-400" />
          <span>Undo</span>
        </button>

        {/* New Game / Setup Button */}
        <button
          onClick={onNewGame}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>New Game</span>
        </button>

        {/* Reset Score Button */}
        <button
          onClick={() => setShowResetConfirm(true)}
          className="py-2.5 px-3 rounded-2xl glass-panel hover:bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium text-xs flex items-center justify-center transition-all active:scale-95"
          title="Reset Scores"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Confirmation Modal for Reset Scores */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="glass-panel p-6 rounded-3xl max-w-sm w-full border border-slate-700/60 shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-400" /> Reset Scores?
            </h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to reset all game scores and current win streaks? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl glass-card hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

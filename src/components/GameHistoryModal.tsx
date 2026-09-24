import React from 'react';
import type { GameHistoryItem } from '../types';
import { History, X, Clock } from 'lucide-react';
import { formatDate } from '../utils/formatters';

interface GameHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: GameHistoryItem[];
}

export const GameHistoryModal: React.FC<GameHistoryModalProps> = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-lg p-4 overflow-y-auto animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-700/60 shadow-2xl space-y-6 my-auto max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-100">MATCH HISTORY</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs italic">
              No games played yet. Play a match to build history!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2 hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="font-extrabold text-slate-200 flex items-center gap-1.5">
                    <span className="text-indigo-400">#{item.gameNumber}</span>
                    <span>{item.opponent}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{formatDate(item.timestamp)}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-black px-2 py-0.5 rounded-lg text-[10px] uppercase ${
                        item.winner === 'draw'
                          ? 'bg-slate-700/40 text-slate-300'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {item.winner === 'draw' ? 'Draw' : `Winner: ${item.winner}`}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.boardSize}×{item.boardSize} Board</span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span>{item.movesCount} moves</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.durationSeconds}s</span>
                  </div>
                </div>

                {item.analysis && item.analysis.keyMoment && (
                  <div className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    "{item.analysis.keyMoment}"
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

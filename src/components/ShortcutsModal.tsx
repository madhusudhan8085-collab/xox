import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '1 – 9', desc: 'Place mark on 3×3 grid (1=top-left, 9=bottom-right)' },
    { key: 'U', desc: 'Undo last move' },
    { key: 'H', desc: 'Request strategic AI hint' },
    { key: 'N', desc: 'Open New Game / Match setup' },
    { key: 'M', desc: 'Toggle sound effects on / muted' },
    { key: 'T', desc: 'Toggle dark / light appearance' },
    { key: '?', desc: 'View keyboard shortcuts' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-lg p-4 overflow-y-auto animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-7 rounded-3xl max-w-sm w-full border border-slate-700/60 shadow-2xl space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100">PRO KEYBOARD SHORTCUTS</h3>
              <p className="text-[10px] text-slate-400">Fast tactical controls</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-2">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="glass-card p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
            >
              <span className="text-slate-300 font-medium">{s.desc}</span>
              <kbd className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-indigo-300 font-mono font-black text-[11px] shadow-sm shrink-0 ml-2">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

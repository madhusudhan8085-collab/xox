import React, { useState } from 'react';
import type { GameMode, AIDifficulty, AIPersonality, BoardSize, MatchFormat, ActivePlayer } from '../types';
import { User, Cpu, Play, Sparkles, Grid, Trophy, MessageSquare } from 'lucide-react';
import { Logo } from './Logo';

interface GameSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMatch: (
    mode: GameMode,
    difficulty: AIDifficulty,
    boardSize: BoardSize,
    humanSymbol: ActivePlayer,
    matchFormat: MatchFormat,
    aiPersonality: AIPersonality
  ) => void;
  initialMode: GameMode;
  initialDifficulty: AIDifficulty;
  initialBoardSize: BoardSize;
  initialSymbol: ActivePlayer;
  initialMatchFormat: MatchFormat;
  initialPersonality: AIPersonality;
}

export const GameSetupModal: React.FC<GameSetupModalProps> = ({
  isOpen,
  onClose,
  onStartMatch,
  initialMode,
  initialDifficulty,
  initialBoardSize,
  initialSymbol,
  initialMatchFormat,
  initialPersonality,
}) => {
  const [mode, setMode] = useState<GameMode>(initialMode);
  const [difficulty, setDifficulty] = useState<AIDifficulty>(initialDifficulty);
  const [boardSize, setBoardSize] = useState<BoardSize>(initialBoardSize);
  const [side, setSide] = useState<ActivePlayer>(initialSymbol);
  const [matchFormat, setMatchFormat] = useState<MatchFormat>(initialMatchFormat);
  const [personality, setPersonality] = useState<AIPersonality>(initialPersonality);

  if (!isOpen) return null;

  const handleStart = () => {
    let finalSide = side;
    if (side !== 'X' && side !== 'O') {
      finalSide = Math.random() < 0.5 ? 'X' : 'O';
    }
    onStartMatch(mode, difficulty, boardSize, finalSide, matchFormat, personality);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-lg p-4 overflow-y-auto animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-700/60 shadow-2xl space-y-6 my-auto">
        {/* Header Title */}
        <div className="text-center space-y-1.5 flex flex-col items-center">
          <Logo size="lg" className="mb-1" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> BRAIN XO BATTLE
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-100">XO MIND</h2>
          <p className="text-xs text-slate-400 font-medium">Strategy meets AI</p>
        </div>

        {/* 1. Mode Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">1. Select Game Mode</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('vs-ai')}
              className={`p-3.5 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-xs transition-all border ${
                mode === 'vs-ai'
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 scale-[1.02]'
                  : 'glass-card text-slate-400 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>PLAY VS AI</span>
            </button>

            <button
              onClick={() => setMode('vs-human')}
              className={`p-3.5 rounded-2xl flex items-center justify-center gap-2.5 font-bold text-xs transition-all border ${
                mode === 'vs-human'
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30 scale-[1.02]'
                  : 'glass-card text-slate-400 border-slate-800 hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>PLAY VS HUMAN</span>
            </button>
          </div>
        </div>

        {/* 2. AI Difficulty (If VS AI) */}
        {mode === 'vs-ai' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">2. AI Difficulty Level</label>
            <div className="grid grid-cols-4 gap-2">
              {(['easy', 'medium', 'hard', 'expert'] as AIDifficulty[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold capitalize transition-all border ${
                    difficulty === d
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30 scale-[1.02]'
                      : 'glass-card text-slate-400 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Player Side (If VS AI) */}
        {mode === 'vs-ai' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">3. Play As</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSide('X')}
                className={`py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border transition-all ${
                  side === 'X'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'glass-card text-slate-400 border-slate-800'
                }`}
              >
                <span>X (First Turn)</span>
              </button>
              <button
                onClick={() => setSide('O')}
                className={`py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 border transition-all ${
                  side === 'O'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-md shadow-rose-500/20'
                    : 'glass-card text-slate-400 border-slate-800'
                }`}
              >
                <span>O (Second Turn)</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. Board Size Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Grid className="w-3.5 h-3.5 text-indigo-400" /> Board Size</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { size: 3, label: '3 × 3', rule: '3 in a row' },
              { size: 4, label: '4 × 4', rule: '4 in a row' },
              { size: 5, label: '5 × 5', rule: '4 in a row' },
            ].map((b) => (
              <button
                key={b.size}
                onClick={() => setBoardSize(b.size as BoardSize)}
                className={`p-2.5 rounded-2xl text-center border transition-all ${
                  boardSize === b.size
                    ? 'bg-indigo-600/30 text-indigo-200 border-indigo-400 shadow-md shadow-indigo-500/20'
                    : 'glass-card text-slate-400 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="font-extrabold text-xs">{b.label}</div>
                <div className="text-[10px] text-slate-400">{b.rule}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Match Format Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5 text-amber-400" /> Match Format</span>
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { fmt: 'single', label: 'Single Game' },
              { fmt: 'best-of-3', label: 'Best of 3' },
              { fmt: 'best-of-5', label: 'Best of 5' },
            ].map((f) => (
              <button
                key={f.fmt}
                onClick={() => setMatchFormat(f.fmt as MatchFormat)}
                className={`p-2.5 rounded-2xl text-center border transition-all ${
                  matchFormat === f.fmt
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'glass-card text-slate-400 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="font-extrabold text-xs">{f.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 6. AI Personality Style */}
        {mode === 'vs-ai' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" /> AI Personality Style
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['calm', 'competitive', 'friendly', 'silent'] as AIPersonality[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPersonality(p)}
                  className={`py-2 px-1.5 rounded-xl text-[11px] font-bold capitalize transition-all border ${
                    personality === p
                      ? 'bg-purple-600/30 text-purple-200 border-purple-400 shadow-sm'
                      : 'glass-card text-slate-400 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Start Game Action */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:opacity-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/30 transition-all active:scale-98"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>START MATCH</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import type { ActivePlayer, GameMode, AIDifficulty, AIPersonality, GameStatus, MatchState } from '../types';
import { Cpu, User, Loader2, Sparkles } from 'lucide-react';

interface PlayerIndicatorProps {
  currentPlayer: ActivePlayer;
  humanSymbol: ActivePlayer;
  mode: GameMode;
  difficulty: AIDifficulty;
  aiPersonality: AIPersonality;
  gameStatus: GameStatus;
  isAIThinking: boolean;
  aiComment: string;
  matchState: MatchState;
  playerXName: string;
  playerOName: string;
}

export const PlayerIndicator: React.FC<PlayerIndicatorProps> = ({
  currentPlayer,
  humanSymbol,
  mode,
  difficulty,
  gameStatus,
  isAIThinking,
  aiComment,
  matchState,
  playerXName,
  playerOName,
}) => {
  const isXTurn = currentPlayer === 'X';
  const isOTurn = currentPlayer === 'O';

  const getName = (symbol: ActivePlayer) => {
    if (mode === 'vs-ai') {
      if (symbol === humanSymbol) {
        return (symbol === 'X' ? playerXName : playerOName) || 'You';
      }
      return `AI (${difficulty.toUpperCase()})`;
    }
    return symbol === 'X' ? playerXName || 'Player X' : playerOName || 'Player O';
  };

  const isHuman = (symbol: ActivePlayer) => {
    if (mode === 'vs-human') return true;
    return symbol === humanSymbol;
  };

  const isXThinking = isXTurn && gameStatus === 'playing' && mode === 'vs-ai' && humanSymbol !== 'X' && isAIThinking;
  const isOThinking = isOTurn && gameStatus === 'playing' && mode === 'vs-ai' && humanSymbol !== 'O' && isAIThinking;

  return (
    <div className="w-full max-w-md mx-auto space-y-3 select-none">
      {/* Match Series Progress Header */}
      {matchState.format !== 'single' && (
        <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-slate-400 px-2">
          <span>MATCH SERIES ({matchState.format.toUpperCase()})</span>
          <span>GAME {matchState.currentGame}</span>
        </div>
      )}

      {/* Main Status Bar */}
      <div className="grid grid-cols-2 gap-3 glass-panel p-2.5 rounded-2xl border border-slate-700/40">
        {/* Player X Status Card */}
        <div
          className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
            isXTurn && gameStatus === 'playing'
              ? 'bg-cyan-500/15 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
              : 'opacity-70 border border-transparent'
          }`}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center font-black text-cyan-400 text-lg">
              X
            </div>
            {isXTurn && gameStatus === 'playing' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-xs text-slate-400 font-medium truncate flex items-center gap-1.5">
              {isHuman('X') ? (
                <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              ) : (
                <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              )}
              <span className="truncate">{getName('X')}</span>
            </div>
            <div className="text-xs font-bold text-slate-200">
              {isXTurn && gameStatus === 'playing' ? (
                isXThinking ? (
                  <span className="text-indigo-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> THINKING
                  </span>
                ) : (
                  <span className="text-cyan-400 animate-pulse">YOUR TURN</span>
                )
              ) : (
                <span className="text-slate-500">WAITING</span>
              )}
            </div>
          </div>
        </div>

        {/* Player O Status Card */}
        <div
          className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
            isOTurn && gameStatus === 'playing'
              ? 'bg-rose-500/15 border border-rose-500/30 shadow-lg shadow-rose-500/10'
              : 'opacity-70 border border-transparent'
          }`}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center font-black text-rose-400 text-lg">
              O
            </div>
            {isOTurn && gameStatus === 'playing' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-400 rounded-full animate-ping" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-xs text-slate-400 font-medium truncate flex items-center gap-1.5">
              {isHuman('O') ? (
                <User className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              ) : (
                <Cpu className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              )}
              <span className="truncate">{getName('O')}</span>
            </div>
            <div className="text-xs font-bold text-slate-200">
              {isOTurn && gameStatus === 'playing' ? (
                isOThinking ? (
                  <span className="text-purple-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> THINKING
                  </span>
                ) : (
                  <span className="text-rose-400 animate-pulse">YOUR TURN</span>
                )
              ) : (
                <span className="text-slate-500">WAITING</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Speech & Commentary Bubble */}
      {mode === 'vs-ai' && aiComment && (
        <div className="glass-card px-4 py-2 rounded-xl border border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="italic font-medium">{aiComment}</span>
        </div>
      )}
    </div>
  );
};

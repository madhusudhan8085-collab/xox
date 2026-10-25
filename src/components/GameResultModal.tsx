import React from 'react';
import type { ActivePlayer, GameStatus, GameAnalysis, MatchState, GameMode } from '../types';
import { Trophy, ShieldAlert, Sparkles, ArrowRight, RotateCcw, Film } from 'lucide-react';

interface GameResultModalProps {
  gameStatus: GameStatus;
  winner: ActivePlayer | 'draw' | null;
  analysis: GameAnalysis | null;
  matchState: MatchState;
  mode: GameMode;
  humanSymbol: ActivePlayer;
  playerXName: string;
  playerOName: string;
  onNextGame: () => void;
  onNewSetup: () => void;
  onOpenReplay?: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  gameStatus,
  winner,
  analysis,
  matchState,
  mode,
  humanSymbol,
  playerXName,
  playerOName,
  onNextGame,
  onNewSetup,
  onOpenReplay,
}) => {
  if (gameStatus !== 'won' && gameStatus !== 'draw') return null;

  const isMatchOver = matchState.isMatchOver;
  const matchWinner = matchState.winner;

  const getWinnerText = () => {
    if (isMatchOver) {
      if (matchWinner === 'tied') return 'Match Series Tied!';
      if (mode === 'vs-ai') {
        const isHumanWinner = matchWinner === humanSymbol;
        const humanName = humanSymbol === 'X' ? playerXName || 'You' : playerOName || 'You';
        return isHumanWinner ? `${humanName} Won the Match!` : 'AI Won the Match!';
      }
      return `${matchWinner === 'X' ? playerXName || 'Player X' : playerOName || 'Player O'} Won the Match!`;
    }

    if (winner === 'draw') return 'Draw Game';

    if (mode === 'vs-ai') {
      const isHumanWinner = winner === humanSymbol;
      const humanName = humanSymbol === 'X' ? playerXName || 'You' : playerOName || 'You';
      return isHumanWinner ? `${humanName} Victory!` : 'AI Victory!';
    }

    return `${winner === 'X' ? playerXName || 'Player X' : playerOName || 'Player O'} Victory!`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn select-none">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700/60 shadow-2xl space-y-5 text-center">
        {/* Banner Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-purple-500 to-indigo-500 p-0.5 shadow-xl shadow-amber-500/20">
          <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
            {winner === 'draw' ? (
              <ShieldAlert className="w-8 h-8 text-amber-400" />
            ) : (
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            )}
          </div>
        </div>

        {/* Victory Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-indigo-200 to-cyan-300">
            {getWinnerText()}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {matchState.format !== 'single'
              ? `Game ${matchState.currentGame - 1} of ${matchState.format.toUpperCase()}`
              : 'Match Complete'}
          </p>
        </div>

        {/* Game Analysis Panel */}
        {analysis && (
          <div className="glass-card p-4 rounded-2xl border border-slate-700/50 text-left space-y-2.5 bg-slate-900/40">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-400 tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" /> GAME ANALYSIS
              </span>
              <span className="text-slate-400">{analysis.movesPlayed} moves</span>
            </div>

            <div className="text-xs font-semibold text-slate-200 bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20">
              <span className="text-indigo-400 font-bold">Key Moment: </span>
              {analysis.keyMoment}
            </div>

            <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
              {analysis.tacticalNotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {onOpenReplay && (
            <button
              onClick={onOpenReplay}
              className="w-full py-2.5 px-4 rounded-2xl glass-card hover:bg-slate-800 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 border border-cyan-500/30 transition-all hover:scale-[1.01]"
            >
              <Film className="w-4 h-4 text-cyan-400" />
              <span>Step-by-Step Move Replay</span>
            </button>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={onNewSetup}
              className="flex-1 py-3 px-4 rounded-2xl glass-card hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Setup</span>
            </button>

            <button
              onClick={onNextGame}
              className="flex-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 hover:opacity-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/25 transition-all active:scale-95"
            >
              <span>{isMatchOver ? 'Play Again' : 'Next Game'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import type { PlayerSymbol, DailyPuzzle } from '../types';
import { Calendar, X, CheckCircle2, XCircle, Flame } from 'lucide-react';
import { getDailyPuzzle } from '../game/challenge';
import { getItem, setItem, DEFAULT_DAILY_STATE } from '../utils/storage';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPuzzleSolved: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  onPuzzleSolved,
}) => {
  const puzzle: DailyPuzzle = getDailyPuzzle();
  const [dailyState, setDailyState] = useState(() => getItem('daily_state', DEFAULT_DAILY_STATE));

  const [puzzleBoard, setPuzzleBoard] = useState<PlayerSymbol[]>(puzzle.board);
  const [solvedStatus, setSolvedStatus] = useState<'pending' | 'success' | 'fail'>('pending');
  const [selectedCell, setSelectedCell] = useState<number | null>(null);

  if (!isOpen) return null;

  const isAlreadyCompletedToday = dailyState.lastCompletedDate === puzzle.dateStr;

  const handleCellClick = (idx: number) => {
    if (solvedStatus === 'success' || isAlreadyCompletedToday || puzzleBoard[idx] !== null) return;

    setSelectedCell(idx);
    const nextBoard = [...puzzleBoard];
    nextBoard[idx] = puzzle.playerTurn;
    setPuzzleBoard(nextBoard);

    if (idx === puzzle.winningMoveIndex) {
      setSolvedStatus('success');

      // Update Daily Streak
      const today = puzzle.dateStr;
      const newStreak = isAlreadyCompletedToday ? dailyState.currentStreak : dailyState.currentStreak + 1;
      const newLongest = Math.max(dailyState.longestStreak, newStreak);

      const newState = {
        lastCompletedDate: today,
        currentStreak: newStreak,
        longestStreak: newLongest,
        totalCompleted: dailyState.totalCompleted + (isAlreadyCompletedToday ? 0 : 1),
      };
      setDailyState(newState);
      setItem('daily_state', newState);

      onPuzzleSolved();
    } else {
      setSolvedStatus('fail');
    }
  };

  const handleRetry = () => {
    setPuzzleBoard(puzzle.board);
    setSolvedStatus('pending');
    setSelectedCell(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-lg p-4 overflow-y-auto animate-fadeIn">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-700/60 shadow-2xl space-y-6 my-auto text-center">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-extrabold text-slate-100">DAILY PUZZLE</h2>
              <p className="text-[10px] text-slate-400">{puzzle.dateStr}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streak Counter Banner */}
        <div className="glass-card p-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-between text-xs font-bold text-amber-300">
          <span className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" /> Daily Streak: {dailyState.currentStreak} Days
          </span>
          <span className="text-slate-400">Total Solved: {dailyState.totalCompleted}</span>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-200">Find the Winning Move</h3>
          <p className="text-xs text-slate-400">{puzzle.description}</p>
        </div>

        {/* Interactive 3x3 Puzzle Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto p-4 glass-card rounded-2xl border border-slate-800">
          {puzzleBoard.map((val, idx) => (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              disabled={val !== null && idx !== puzzle.winningMoveIndex}
              className={`aspect-square rounded-xl flex items-center justify-center font-black text-2xl transition-all border ${
                val === 'X'
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : val === 'O'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'glass-panel hover:bg-amber-500/10 border-slate-700/60 cursor-pointer'
              } ${
                selectedCell === idx && solvedStatus === 'success'
                  ? 'ring-2 ring-emerald-400 bg-emerald-500/20'
                  : selectedCell === idx && solvedStatus === 'fail'
                  ? 'ring-2 ring-rose-500 bg-rose-500/20'
                  : ''
              }`}
            >
              {val}
            </button>
          ))}
        </div>

        {/* Status Feedback */}
        {solvedStatus === 'success' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 animate-fadeIn">
            <div className="font-extrabold text-sm flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Challenge Solved!
            </div>
            <p className="text-slate-300">{puzzle.explanation}</p>
          </div>
        )}

        {solvedStatus === 'fail' && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2 animate-fadeIn">
            <div className="font-extrabold text-sm flex items-center justify-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400" /> Incorrect Move!
            </div>
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

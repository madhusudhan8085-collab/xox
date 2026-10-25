import React, { useState, useEffect } from 'react';
import type { PlayerSymbol, BoardSize, MoveRecord, GameAnalysis, ActivePlayer } from '../types';
import { X, Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { Cell } from './Cell';

interface MoveReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardSize: BoardSize;
  moves: MoveRecord[];
  analysis?: GameAnalysis;
  winner: ActivePlayer | 'draw';
  title?: string;
}

const ReplayModalContent: React.FC<Omit<MoveReplayModalProps, 'isOpen'>> = ({
  onClose,
  boardSize,
  moves,
  analysis,
  winner,
  title = 'Interactive Game Replay',
}) => {
  const [currentStep, setCurrentStep] = useState<number>(() => moves.length);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= moves.length) {
          setIsPlaying(false);
          return moves.length;
        }
        return next;
      });
    }, 700);

    return () => clearTimeout(timer);
  }, [isPlaying, moves.length]);

  // Build the board at currentStep
  const replayBoard: PlayerSymbol[] = Array(boardSize * boardSize).fill(null);
  for (let i = 0; i < currentStep; i++) {
    const m = moves[i];
    if (m && m.index >= 0 && m.index < replayBoard.length) {
      replayBoard[m.index] = m.symbol;
    }
  }

  const lastMoveIndex = currentStep > 0 && currentStep <= moves.length ? moves[currentStep - 1].index : null;
  const currentMoveRecord = currentStep > 0 && currentStep <= moves.length ? moves[currentStep - 1] : null;

  const getGridColsClass = (size: BoardSize) => {
    switch (size) {
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-4';
      case 5:
        return 'grid-cols-5';
      default:
        return 'grid-cols-3';
    }
  };

  const getCellPositionLabel = (idx: number, size: BoardSize) => {
    const r = Math.floor(idx / size) + 1;
    const c = (idx % size) + 1;
    return `Row ${r}, Col ${c}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-lg p-4 overflow-y-auto animate-fadeIn">
      <div className="glass-panel p-6 sm:p-7 rounded-3xl max-w-lg w-full border border-slate-700/60 shadow-2xl space-y-5 my-auto max-h-[92vh] flex flex-col select-none">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-100">{title}</h3>
              <p className="text-xs text-slate-400">
                Move {currentStep} of {moves.length}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsPlaying(false);
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Board View */}
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] mx-auto p-3 sm:p-4 rounded-2xl glass-card border border-slate-800">
          <div className={`grid ${getGridColsClass(boardSize)} gap-2 w-full`}>
            {replayBoard.map((val, idx) => (
              <Cell
                key={idx}
                index={idx}
                value={val}
                isWinningCell={false}
                isSuggested={lastMoveIndex === idx}
                disabled={true}
                onClick={() => {}}
                reducedMotion={true}
              />
            ))}
          </div>
        </div>

        {/* Move Info Card */}
        <div className="p-3 rounded-2xl glass-card border border-slate-800 text-xs flex items-center justify-between bg-slate-900/50">
          <div>
            {currentMoveRecord ? (
              <span className="font-semibold text-slate-200">
                Move #{currentMoveRecord.moveNumber}:{' '}
                <strong
                  className={currentMoveRecord.symbol === 'X' ? 'text-cyan-400' : 'text-rose-400'}
                >
                  Player {currentMoveRecord.symbol}
                </strong>{' '}
                at {getCellPositionLabel(currentMoveRecord.index, boardSize)}
              </span>
            ) : (
              <span className="text-slate-400 italic">Game Start (Empty Board)</span>
            )}
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            {winner === 'draw' ? 'Draw' : `Winner: ${winner}`}
          </span>
        </div>

        {/* Tactical Note if at Key Moment */}
        {analysis && analysis.keyMoment && currentStep === moves.length && (
          <div className="text-xs text-slate-300 bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
            <span className="text-indigo-400 font-bold">Tactical Review: </span>
            {analysis.keyMoment}
          </div>
        )}

        {/* Stepper Controls Toolbar */}
        <div className="flex items-center justify-center gap-2 pt-1 shrink-0">
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
            }}
            disabled={currentStep === 0}
            className="p-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Start of Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((p) => Math.max(0, p - 1));
            }}
            disabled={currentStep === 0}
            className="p-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Previous Move"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              if (currentStep >= moves.length) {
                setCurrentStep(0);
              }
              setIsPlaying((p) => !p);
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> {currentStep >= moves.length ? 'Replay' : 'Play'}
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep((p) => Math.min(moves.length, p + 1));
            }}
            disabled={currentStep >= moves.length}
            className="p-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="Next Move"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const MoveReplayModal: React.FC<MoveReplayModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <ReplayModalContent {...props} />;
};

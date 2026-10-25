import { useState, useEffect } from 'react';
import type { MoveRecord, GameAnalysis, ActivePlayer, BoardSize, GameHistoryItem } from './types';
import { useGame } from './hooks/useGame';
import { useTheme } from './hooks/useTheme';
import { useSound } from './hooks/useSound';
import { Navbar } from './components/Navbar';
import { PlayerIndicator } from './components/PlayerIndicator';
import { ScoreBoard } from './components/ScoreBoard';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { GameResultModal } from './components/GameResultModal';
import { GameSetupModal } from './components/GameSetupModal';
import { StatisticsPanel } from './components/StatisticsPanel';
import { GameHistoryModal } from './components/GameHistoryModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { AchievementModal } from './components/AchievementModal';
import { SettingsModal } from './components/SettingsModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { MoveReplayModal } from './components/MoveReplayModal';
import { EvaluationBar } from './components/EvaluationBar';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSound();

  const {
    mode,
    difficulty,
    boardSize,
    humanSymbol,
    matchFormat,
    aiPersonality,
    settings,
    setSettings,
    board,
    currentPlayer,
    gameStatus,
    winningLine,
    isAIThinking,
    aiComment,
    suggestedMove,
    latestAnalysis,
    evaluation,
    moveRecords,
    scores,
    history,
    achievements,
    matchState,
    undoAvailable,
    makeMove,
    undoLastMove,
    requestHint,
    startNewMatch,
    startNextGameInMatch,
    resetScores,
    triggerAchievement,
  } = useGame();

  // Modals visibility state
  const [isSetupOpen, setIsSetupOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isDailyOpen, setIsDailyOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Interactive Match Replay State
  const [replayState, setReplayState] = useState<{
    isOpen: boolean;
    boardSize: BoardSize;
    moves: MoveRecord[];
    analysis?: GameAnalysis;
    winner: ActivePlayer | 'draw';
    title?: string;
  }>({
    isOpen: false,
    boardSize: 3,
    moves: [],
    winner: 'draw',
  });

  // Global Pro Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in text inputs
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Check number keys 1-9 for instant 3x3 play
      if (boardSize === 3 && e.key >= '1' && e.key <= '9') {
        const cellIdx = parseInt(e.key, 10) - 1;
        if (gameStatus === 'playing' && !isAIThinking && board[cellIdx] === null) {
          e.preventDefault();
          makeMove(cellIdx);
        }
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'u' && undoAvailable) {
        e.preventDefault();
        undoLastMove();
      } else if (key === 'h' && gameStatus === 'playing' && !isAIThinking) {
        e.preventDefault();
        requestHint();
      } else if (key === 'n') {
        e.preventDefault();
        setIsSetupOpen(true);
      } else if (key === 'm') {
        e.preventDefault();
        toggleSound();
      } else if (key === 't') {
        e.preventDefault();
        toggleTheme();
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((p) => !p);
      } else if (e.key === 'Escape') {
        setIsSetupOpen(false);
        setIsStatsOpen(false);
        setIsHistoryOpen(false);
        setIsDailyOpen(false);
        setIsAchievementsOpen(false);
        setIsSettingsOpen(false);
        setIsShortcutsOpen(false);
        setReplayState((p) => ({ ...p, isOpen: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    boardSize,
    gameStatus,
    isAIThinking,
    board,
    undoAvailable,
    makeMove,
    undoLastMove,
    requestHint,
    toggleSound,
    toggleTheme,
  ]);

  const handleOpenActiveGameReplay = () => {
    const winSymbol = winningLine
      ? (board[winningLine.indices[0]] as ActivePlayer)
      : gameStatus === 'draw'
      ? 'draw'
      : currentPlayer;

    setReplayState({
      isOpen: true,
      boardSize,
      moves: moveRecords,
      analysis: latestAnalysis || undefined,
      winner: winSymbol,
      title: 'Active Game Replay',
    });
  };

  const handleOpenHistoryItemReplay = (item: GameHistoryItem) => {
    if (!item.moves || item.moves.length === 0) return;
    setIsHistoryOpen(false);
    setReplayState({
      isOpen: true,
      boardSize: item.boardSize,
      moves: item.moves,
      analysis: item.analysis,
      winner: item.winner,
      title: `Match #${item.gameNumber} vs ${item.opponent}`,
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Sleek Top Navigation Header */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenDaily={() => setIsDailyOpen(true)}
        onOpenSetup={() => setIsSetupOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Game Arena Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-3 sm:py-5 flex flex-col items-center justify-start space-y-3 sm:space-y-3.5">
        {/* Scoreboard Series Header */}
        <ScoreBoard
          scores={scores}
          matchState={matchState}
          mode={mode}
          humanSymbol={humanSymbol}
          playerXName={settings.playerXName}
          playerOName={settings.playerOName}
        />

        {/* Live Turn & Player Indicator */}
        <PlayerIndicator
          currentPlayer={currentPlayer}
          humanSymbol={humanSymbol}
          mode={mode}
          difficulty={difficulty}
          aiPersonality={aiPersonality}
          gameStatus={gameStatus}
          isAIThinking={isAIThinking}
          aiComment={aiComment}
          matchState={matchState}
          playerXName={settings.playerXName}
          playerOName={settings.playerOName}
        />

        {/* Live Engine Advantage Bar / Win Probability Meter */}
        <EvaluationBar
          evaluation={evaluation}
          mode={mode}
          humanSymbol={humanSymbol}
          playerXName={settings.playerXName}
          playerOName={settings.playerOName}
        />

        {/* Interactive Responsive Board */}
        <GameBoard
          board={board}
          boardSize={boardSize}
          winningLine={winningLine}
          suggestedMove={suggestedMove}
          disabled={gameStatus !== 'playing' || isAIThinking}
          onCellClick={makeMove}
          reducedMotion={settings.reducedMotion}
          hoverSymbol={gameStatus === 'playing' && !isAIThinking ? currentPlayer : null}
        />

        {/* Action Controls Toolbar */}
        <GameControls
          onHint={requestHint}
          onUndo={undoLastMove}
          onNewGame={() => setIsSetupOpen(true)}
          onResetScores={resetScores}
          undoDisabled={!undoAvailable}
          disabled={gameStatus !== 'playing' || isAIThinking}
        />
      </main>

      {/* Modals & Dialog Overlays */}
      <GameResultModal
        gameStatus={gameStatus}
        winner={winningLine ? (board[winningLine.indices[0]] as ActivePlayer) : gameStatus === 'draw' ? 'draw' : null}
        analysis={latestAnalysis}
        matchState={matchState}
        mode={mode}
        humanSymbol={humanSymbol}
        playerXName={settings.playerXName}
        playerOName={settings.playerOName}
        onNextGame={startNextGameInMatch}
        onNewSetup={() => setIsSetupOpen(true)}
        onOpenReplay={moveRecords.length > 0 ? handleOpenActiveGameReplay : undefined}
      />

      <GameSetupModal
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        onStartMatch={startNewMatch}
        initialMode={mode}
        initialDifficulty={difficulty}
        initialBoardSize={boardSize}
        initialSymbol={humanSymbol}
        initialMatchFormat={matchFormat}
        initialPersonality={aiPersonality}
      />

      <StatisticsPanel
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        scores={scores}
      />

      <GameHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectReplay={handleOpenHistoryItemReplay}
      />

      <DailyChallengeModal
        isOpen={isDailyOpen}
        onClose={() => setIsDailyOpen(false)}
        onPuzzleSolved={() => triggerAchievement('daily_solver')}
      />

      <AchievementModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        achievements={achievements}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        theme={theme}
        toggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <MoveReplayModal
        isOpen={replayState.isOpen}
        onClose={() => setReplayState((p) => ({ ...p, isOpen: false }))}
        boardSize={replayState.boardSize}
        moves={replayState.moves}
        analysis={replayState.analysis}
        winner={replayState.winner}
        title={replayState.title}
      />

      {/* Refined Footer */}
      <footer className="w-full py-3 text-center text-xs text-slate-500 border-t border-slate-800/40 select-none">
        XO MIND &bull; Strategy meets AI &bull; Brain XO Battle &bull; Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 font-mono text-[10px]">?</kbd> for shortcuts
      </footer>
    </div>
  );
}

export default App;


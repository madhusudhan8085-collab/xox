import { useState } from 'react';
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
      />

      {/* Main Game Arena Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-center space-y-6">
        {/* Scoreboard Series Header */}
        <ScoreBoard
          scores={scores}
          matchState={matchState}
          mode={mode}
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

        {/* Interactive Responsive Board */}
        <GameBoard
          board={board}
          boardSize={boardSize}
          winningLine={winningLine}
          suggestedMove={suggestedMove}
          disabled={gameStatus !== 'playing' || isAIThinking}
          onCellClick={makeMove}
          reducedMotion={settings.reducedMotion}
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
        winner={winningLine ? winningLine.type && board[winningLine.indices[0]] : gameStatus === 'draw' ? 'draw' : null}
        analysis={latestAnalysis}
        matchState={matchState}
        mode={mode}
        playerXName={settings.playerXName}
        playerOName={settings.playerOName}
        onNextGame={startNextGameInMatch}
        onNewSetup={() => setIsSetupOpen(true)}
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

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 border-t border-slate-800/40">
        Advanced XOX Pro &bull; Production Gaming Product
      </footer>
    </div>
  );
}

export default App;

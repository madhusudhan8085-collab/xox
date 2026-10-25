import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type {
  PlayerSymbol,
  ActivePlayer,
  GameMode,
  AIDifficulty,
  AIPersonality,
  BoardSize,
  MatchFormat,
  GameStatus,
  WinningLine,
  MoveRecord,
  GameAnalysis,
  GameHistoryItem,
  ScoreState,
  MatchState,
  SettingsState,
  Achievement,
  BoardEvaluation,
} from '../types';
import { checkWinner, isBoardFull } from '../game/winChecker';
import { getAIMove } from '../game/ai/difficulty';
import { getBoardEvaluation } from '../game/ai/heuristicSolver';
import { analyzeGame } from '../game/analyzer';
import { soundManager } from '../utils/sound';
import { fireConfetti } from '../utils/confetti';
import {
  getItem,
  setItem,
  DEFAULT_SETTINGS,
  DEFAULT_SCORES,
  INITIAL_ACHIEVEMENTS,
} from '../utils/storage';
import { getPersonalityCommentary } from '../game/ai/personality';

export function useGame() {
  // Settings & Storage
  const [settings, setSettings] = useState<SettingsState>(() => getItem('settings', DEFAULT_SETTINGS));
  const [scores, setScores] = useState<ScoreState>(() => getItem('scores', DEFAULT_SCORES));
  const [history, setHistory] = useState<GameHistoryItem[]>(() => getItem('history', []));
  const [achievements, setAchievements] = useState<Achievement[]>(() => getItem('achievements', INITIAL_ACHIEVEMENTS));

  // Pre-game / Active Setup
  const [mode, setMode] = useState<GameMode>(settings.defaultMode);
  const [difficulty, setDifficulty] = useState<AIDifficulty>(settings.defaultDifficulty);
  const [boardSize, setBoardSize] = useState<BoardSize>(3);
  const [humanSymbol, setHumanSymbol] = useState<ActivePlayer>('X');
  const [matchFormat, setMatchFormat] = useState<MatchFormat>('single');
  const [aiPersonality, setAiPersonality] = useState<AIPersonality>(settings.aiPersonality);

  // Active Gameplay State
  const [board, setBoard] = useState<PlayerSymbol[]>(() => Array(boardSize * boardSize).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<ActivePlayer>('X');
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winningLine, setWinningLine] = useState<WinningLine | null>(null);
  const [isAIThinking, setIsAIThinking] = useState<boolean>(false);
  const [aiComment, setAiComment] = useState<string>('');
  const [suggestedMove, setSuggestedMove] = useState<number | null>(null);

  // History & Undo Stacks
  const [moveRecords, setMoveRecords] = useState<MoveRecord[]>([]);
  const [undoStack, setUndoStack] = useState<{ board: PlayerSymbol[]; player: ActivePlayer }[]>([]);
  const [gameStartTime, setGameStartTime] = useState<number>(() => Date.now());
  const [latestAnalysis, setLatestAnalysis] = useState<GameAnalysis | null>(null);

  // Match Series State
  const [matchState, setMatchState] = useState<MatchState>({
    format: matchFormat,
    currentGame: 1,
    targetWins: 1,
    playerXWins: 0,
    playerOWins: 0,
    winner: null,
    isMatchOver: false,
    gameHistoryInMatch: [],
  });

  // Keep ref to avoid stale closure during async AI turns
  const boardRef = useRef(board);
  const aiScheduledRef = useRef<boolean>(false);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  // Sync settings with localStorage
  useEffect(() => {
    setItem('settings', settings);
  }, [settings]);

  useEffect(() => {
    setItem('scores', scores);
  }, [scores]);

  useEffect(() => {
    setItem('history', history);
  }, [history]);

  useEffect(() => {
    setItem('achievements', achievements);
  }, [achievements]);

  // Target wins for series
  const getTargetWins = (format: MatchFormat): number => {
    if (format === 'best-of-3') return 2;
    if (format === 'best-of-5') return 3;
    return 1;
  };

  /**
   * Unlock achievement helper
   */
  const triggerAchievement = useCallback((id: string) => {
    setAchievements((prev) =>
      prev.map((a) => {
        if (a.id === id && !a.unlocked) {
          return { ...a, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return a;
      })
    );
  }, []);

  /**
   * Starts a brand new game or match series
   */
  const startNewMatch = useCallback(
    (
      newMode: GameMode = mode,
      newDiff: AIDifficulty = difficulty,
      newSize: BoardSize = boardSize,
      newSide: ActivePlayer = humanSymbol,
      newFormat: MatchFormat = matchFormat,
      newPersonality: AIPersonality = aiPersonality
    ) => {
      const size = newSize;
      const target = getTargetWins(newFormat);

      setMode(newMode);
      setDifficulty(newDiff);
      setBoardSize(size);
      setHumanSymbol(newSide);
      setMatchFormat(newFormat);
      setAiPersonality(newPersonality);

      const emptyBoard = Array(size * size).fill(null);
      setBoard(emptyBoard);
      boardRef.current = emptyBoard;
      aiScheduledRef.current = false;

      setCurrentPlayer('X');
      setGameStatus('playing');
      setWinningLine(null);
      setIsAIThinking(false);
      setSuggestedMove(null);
      setMoveRecords([]);
      setUndoStack([]);
      setLatestAnalysis(null);
      setGameStartTime(Date.now());

      setMatchState({
        format: newFormat,
        currentGame: 1,
        targetWins: target,
        playerXWins: 0,
        playerOWins: 0,
        winner: null,
        isMatchOver: false,
        gameHistoryInMatch: [],
      });

      if (newMode === 'vs-ai' && newSide === 'O') {
        setAiComment(getPersonalityCommentary(newPersonality, 'thinking'));
      } else {
        setAiComment('');
      }

      if (newSize === 5) {
        triggerAchievement('five_boards');
      }
    },
    [mode, difficulty, boardSize, humanSymbol, matchFormat, aiPersonality, triggerAchievement]
  );

  /**
   * Starts next game in current match series
   */
  const startNextGameInMatch = useCallback(() => {
    if (matchState.isMatchOver) {
      startNewMatch();
      return;
    }

    const emptyBoard = Array(boardSize * boardSize).fill(null);
    setBoard(emptyBoard);
    boardRef.current = emptyBoard;
    aiScheduledRef.current = false;

    setCurrentPlayer('X');
    setGameStatus('playing');
    setWinningLine(null);
    setIsAIThinking(false);
    setSuggestedMove(null);
    setMoveRecords([]);
    setUndoStack([]);
    setLatestAnalysis(null);
    setGameStartTime(Date.now());
  }, [boardSize, matchState.isMatchOver, startNewMatch]);

  /**
   * End Game Handler
   */
  const handleGameEnd = useCallback(
    (winnerSymbol: ActivePlayer | 'draw', winLineInfo: WinningLine | null, finalBoard: PlayerSymbol[], moves: MoveRecord[]) => {
      setGameStatus(winnerSymbol === 'draw' ? 'draw' : 'won');
      setWinningLine(winLineInfo);
      setSuggestedMove(null);
      setIsAIThinking(false);
      aiScheduledRef.current = false;

      const durationSeconds = Math.round((Date.now() - gameStartTime) / 1000);
      const analysis = analyzeGame(finalBoard, boardSize, moves, winnerSymbol);
      setLatestAnalysis(analysis);

      // Play Sound FX & Confetti
      if (winnerSymbol === 'draw') {
        soundManager.playDraw();
        if (mode === 'vs-ai') setAiComment(getPersonalityCommentary(aiPersonality, 'draw'));
      } else {
        soundManager.playWin();
        fireConfetti(settings.reducedMotion);
        if (mode === 'vs-ai') {
          const aiSymbol: ActivePlayer = humanSymbol === 'X' ? 'O' : 'X';
          if (winnerSymbol === aiSymbol) {
            setAiComment(getPersonalityCommentary(aiPersonality, 'aiWin'));
          } else {
            setAiComment(getPersonalityCommentary(aiPersonality, 'humanWin'));
          }
        }
      }

      // Update Scores & Statistics
      setScores((prev) => {
        const isXWin = winnerSymbol === 'X';
        const isOWin = winnerSymbol === 'O';
        const isDraw = winnerSymbol === 'draw';

        const aiSymbol: ActivePlayer = humanSymbol === 'X' ? 'O' : 'X';
        const isHumanWin = mode === 'vs-ai' && winnerSymbol === humanSymbol;
        const isAIWin = mode === 'vs-ai' && winnerSymbol === aiSymbol;

        const newCurrentStreak = isHumanWin || (mode === 'vs-human' && !isDraw) ? prev.currentStreak + 1 : 0;
        const newLongestStreak = Math.max(prev.longestStreak, newCurrentStreak);

        const diffStats = { ...prev.byDifficulty };
        if (mode === 'vs-ai') {
          const currentDiff = diffStats[difficulty];
          diffStats[difficulty] = {
            wins: currentDiff.wins + (isHumanWin ? 1 : 0),
            losses: currentDiff.losses + (isAIWin ? 1 : 0),
            draws: currentDiff.draws + (isDraw ? 1 : 0),
          };
        }

        return {
          ...prev,
          xWins: prev.xWins + (isXWin ? 1 : 0),
          oWins: prev.oWins + (isOWin ? 1 : 0),
          draws: prev.draws + (isDraw ? 1 : 0),
          humanWins: prev.humanWins + (isHumanWin ? 1 : 0),
          aiWins: prev.aiWins + (isAIWin ? 1 : 0),
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          gamesPlayed: prev.gamesPlayed + 1,
          byDifficulty: diffStats,
        };
      });

      // Update Session History Log
      const opponentName = mode === 'vs-ai' ? `XO Mind AI (${difficulty.toUpperCase()})` : settings.playerOName || 'Player 2';
      const historyItem: GameHistoryItem = {
        id: 'game_' + Date.now(),
        gameNumber: history.length + 1,
        mode,
        opponent: opponentName,
        winner: winnerSymbol,
        movesCount: moves.length,
        durationSeconds,
        timestamp: new Date().toISOString(),
        difficulty: mode === 'vs-ai' ? difficulty : undefined,
        boardSize,
        matchFormat,
        analysis,
        moves: [...moves],
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 49)]);

      // Update Match Series State
      setMatchState((prev) => {
        const newXWins = prev.playerXWins + (winnerSymbol === 'X' ? 1 : 0);
        const newOWins = prev.playerOWins + (winnerSymbol === 'O' ? 1 : 0);
        const newGameHistory = [...prev.gameHistoryInMatch, winnerSymbol];

        let seriesWinner: ActivePlayer | 'tied' | null = null;
        let isMatchOver = false;

        if (newXWins >= prev.targetWins) {
          seriesWinner = 'X';
          isMatchOver = true;
        } else if (newOWins >= prev.targetWins) {
          seriesWinner = 'O';
          isMatchOver = true;
        } else if (prev.currentGame >= (prev.format === 'best-of-3' ? 3 : prev.format === 'best-of-5' ? 5 : 1)) {
          seriesWinner = newXWins > newOWins ? 'X' : newOWins > newXWins ? 'O' : 'tied';
          isMatchOver = true;
        }

        return {
          ...prev,
          currentGame: prev.currentGame + 1,
          playerXWins: newXWins,
          playerOWins: newOWins,
          winner: seriesWinner,
          isMatchOver,
          gameHistoryInMatch: newGameHistory,
        };
      });

      // Achievements Evaluation
      triggerAchievement('first_win');
      if (moves.length <= 5 && winnerSymbol !== 'draw') {
        triggerAchievement('flawless_victory');
      }
      if (mode === 'vs-ai' && winnerSymbol === humanSymbol) {
        if (difficulty === 'hard') triggerAchievement('beat_hard_ai');
        if (difficulty === 'expert') triggerAchievement('beat_expert_ai');
      }
      if (scores.currentStreak + 1 >= 3) triggerAchievement('win_streak_3');
      if (scores.currentStreak + 1 >= 5) triggerAchievement('win_streak_5');
    },
    [
      gameStartTime,
      boardSize,
      mode,
      humanSymbol,
      aiPersonality,
      settings.reducedMotion,
      settings.playerOName,
      difficulty,
      matchFormat,
      history.length,
      scores.currentStreak,
      triggerAchievement,
    ]
  );

  /**
   * Primary Action: Make a move on cell index
   */
  const makeMove = useCallback(
    (index: number) => {
      if (gameStatus !== 'playing' || isAIThinking || board[index] !== null) {
        soundManager.playInvalid();
        return;
      }

      soundManager.playClick();
      setSuggestedMove(null);

      const nextBoard = [...board];
      nextBoard[index] = currentPlayer;

      const newRecord: MoveRecord = {
        index,
        symbol: currentPlayer,
        moveNumber: moveRecords.length + 1,
        timestamp: Date.now(),
      };
      const nextRecords = [...moveRecords, newRecord];

      setUndoStack((prev) => [...prev, { board: [...board], player: currentPlayer }]);
      setBoard(nextBoard);
      boardRef.current = nextBoard;
      setMoveRecords(nextRecords);

      // Check Win or Draw
      const winResult = checkWinner(nextBoard, boardSize);
      if (winResult) {
        handleGameEnd(winResult.winner, winResult.winningLine, nextBoard, nextRecords);
        return;
      }

      if (isBoardFull(nextBoard)) {
        handleGameEnd('draw', null, nextBoard, nextRecords);
        return;
      }

      // Switch turn
      const nextPlayer: ActivePlayer = currentPlayer === 'X' ? 'O' : 'X';
      setCurrentPlayer(nextPlayer);

      if (mode === 'vs-ai') {
        setAiComment(getPersonalityCommentary(aiPersonality, 'playerMove'));
      }
    },
    [gameStatus, isAIThinking, board, currentPlayer, moveRecords, boardSize, mode, aiPersonality, handleGameEnd]
  );

  /**
   * AI Turn Effect Execution with instant calculation & fast 250ms natural delay
   */
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const aiSymbol: ActivePlayer = humanSymbol === 'X' ? 'O' : 'X';
    if (mode === 'vs-ai' && currentPlayer === aiSymbol && !aiScheduledRef.current) {
      aiScheduledRef.current = true;
      setIsAIThinking(true);
      setAiComment(getPersonalityCommentary(aiPersonality, 'thinking'));

      const timer = setTimeout(() => {
        const currentBoard = boardRef.current;
        const aiMoveIndex = getAIMove(currentBoard, boardSize, aiSymbol, difficulty);

        if (currentBoard[aiMoveIndex] === null) {
          soundManager.playAIMove();

          const nextBoard = [...currentBoard];
          nextBoard[aiMoveIndex] = aiSymbol;

          setUndoStack((prev) => [...prev, { board: [...currentBoard], player: aiSymbol }]);
          setBoard(nextBoard);
          boardRef.current = nextBoard;

          setMoveRecords((prevRecords) => {
            const nextRecords = [
              ...prevRecords,
              {
                index: aiMoveIndex,
                symbol: aiSymbol,
                moveNumber: prevRecords.length + 1,
                timestamp: Date.now(),
              },
            ];

            const winResult = checkWinner(nextBoard, boardSize);
            if (winResult) {
              handleGameEnd(winResult.winner, winResult.winningLine, nextBoard, nextRecords);
            } else if (isBoardFull(nextBoard)) {
              handleGameEnd('draw', null, nextBoard, nextRecords);
            } else {
              setCurrentPlayer(humanSymbol);
              setAiComment(getPersonalityCommentary(aiPersonality, 'aiMove'));
            }

            return nextRecords;
          });
        }
        setIsAIThinking(false);
        aiScheduledRef.current = false;
      }, 250); // Snappy 250ms delay

      return () => {
        clearTimeout(timer);
      };
    }
  }, [gameStatus, currentPlayer, mode, humanSymbol, boardSize, difficulty, aiPersonality, handleGameEnd]);

  /**
   * Action: Undo last move
   */
  const undoLastMove = useCallback(() => {
    if (gameStatus !== 'playing' || isAIThinking || undoStack.length === 0) return;

    soundManager.playButton();

    if (mode === 'vs-human') {
      const lastState = undoStack[undoStack.length - 1];
      setBoard(lastState.board);
      boardRef.current = lastState.board;
      setCurrentPlayer(lastState.player);
      setUndoStack((prev) => prev.slice(0, -1));
      setMoveRecords((prev) => prev.slice(0, -1));
    } else {
      if (undoStack.length < 2) return;
      const targetState = undoStack[undoStack.length - 2];
      setBoard(targetState.board);
      boardRef.current = targetState.board;
      setCurrentPlayer(humanSymbol);
      setUndoStack((prev) => prev.slice(0, -2));
      setMoveRecords((prev) => prev.slice(0, -2));
    }
    setSuggestedMove(null);
  }, [gameStatus, isAIThinking, undoStack, mode, humanSymbol]);

  /**
   * Action: Request Hint
   */
  const requestHint = useCallback(() => {
    if (gameStatus !== 'playing' || isAIThinking) return;

    soundManager.playButton();
    const recommended = getAIMove(board, boardSize, currentPlayer, 'expert');
    setSuggestedMove(recommended);
  }, [gameStatus, isAIThinking, board, boardSize, currentPlayer]);

  const evaluation: BoardEvaluation = useMemo(() => {
    return getBoardEvaluation(board, boardSize);
  }, [board, boardSize]);

  /**
   * Reset Score Action
   */
  const resetScores = useCallback(() => {
    soundManager.playButton();
    setScores(DEFAULT_SCORES);
  }, []);

  return {
    // Configuration State
    mode,
    difficulty,
    boardSize,
    humanSymbol,
    matchFormat,
    aiPersonality,
    settings,
    setSettings,

    // Active Play State
    board,
    currentPlayer,
    gameStatus,
    winningLine,
    isAIThinking,
    aiComment,
    suggestedMove,
    moveRecords,
    latestAnalysis,
    evaluation,

    // Stats & History
    scores,
    history,
    achievements,
    matchState,
    undoAvailable: undoStack.length > 0 && gameStatus === 'playing' && !isAIThinking,

    // Actions
    makeMove,
    undoLastMove,
    requestHint,
    startNewMatch,
    startNextGameInMatch,
    resetScores,
    triggerAchievement,
  };
}

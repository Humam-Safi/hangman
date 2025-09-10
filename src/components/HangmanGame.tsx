import React, { useState, useEffect, useCallback } from "react";
import { Heart, Trophy, RotateCcw, Sparkles } from "lucide-react";
import HangmanDrawing from "./HangmanDrawing";
import Keyboard from "./Keyboard";
import WordDisplay from "./WordDisplay";

// Tech words database with Arabic hints
const TECH_WORDS = [
  {
    word: "React",
    hint1: "JavaScript مكتبة  لبناء واجهات المستخدم",
    hint2: " Facebook تم تطويرها من قبل",
  },
  {
    word: "JavaScript",
    hint1: "لغة برمجة تستخدم في تطوير الويب",
    hint2: "تعمل في المتصفح والخادم",
  },
  {
    word: "Web",
    hint1: "شبكة عالمية من المواقع والصفحات",
    hint2: "World Wide Web اختصار لـ",
  },
  {
    word: "Mobile",
    hint1: "تطبيقات تعمل على الهواتف الذكية",
    hint2: " iOS يمكن أن تكون أندرويد أو",
  },
  {
    word: "Frontend",
    hint1: "الجزء المرئي من الموقع للمستخدم",
    hint2: " HTML و CSS و JavaScript يتضمن",
  },
  {
    word: "Backend",
    hint1: "الجزء الخفي من الموقع الذي يعمل على الخادم",
    hint2: "يتعامل مع قواعد البيانات والمنطق",
  },
  {
    word: "Database",
    hint1: "مخزن منظم للبيانات والمعلومات",
    hint2: " MySQL أو MongoDB مثل",
  },
  {
    word: "AI",
    hint1: "الذكاء الاصطناعي - محاكاة الذكاء البشري",
    hint2: " Artificial Intelligence اختصار لـ",
  },
  {
    word: "UI",
    hint1: "واجهة المستخدم - التصميم المرئي للتطبيق",
    hint2: " User Interface اختصار لـ ",
  },
  {
    word: "JAVA",
    hint1: "لغة برمجة شائعة ومتعددة المنصات",
    hint2: "Android  تستخدم في تطبيقات",
  },
];

interface GameState {
  word: string;
  hint1: string;
  hint2: string;
  guessedLetters: Set<string>;
  wrongGuesses: number;
  gameStatus: "playing" | "won" | "lost" | "allWordsCompleted";
  score: number;
  streak: number;
  hintsUsed: number;
  guessedWords: Set<string>;
  currentWordIndex: number;
}

const HangmanGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    word: "",
    hint1: "",
    hint2: "",
    guessedLetters: new Set(),
    wrongGuesses: 0,
    gameStatus: "playing",
    score: 0,
    streak: 0,
    hintsUsed: 0,
    guessedWords: new Set(),
    currentWordIndex: 0,
  });

  const MAX_WRONG_GUESSES = 6;

  // Select next word in sequence
  const selectNextWord = useCallback(() => {
    if (gameState.currentWordIndex >= TECH_WORDS.length) {
      return null; // All words completed
    }
    return TECH_WORDS[gameState.currentWordIndex];
  }, [gameState.currentWordIndex]);

  // Initialize new game or next word
  const startNewGame = useCallback(() => {
    const newWordData = selectNextWord();
    if (!newWordData) {
      // All words completed
      setGameState((prev) => ({
        ...prev,
        gameStatus: "allWordsCompleted",
      }));
      return;
    }

    setGameState((prev) => ({
      word: newWordData.word,
      hint1: newWordData.hint1,
      hint2: newWordData.hint2,
      guessedLetters: new Set(),
      wrongGuesses: 0,
      gameStatus: "playing",
      score: prev.score,
      streak: prev.streak,
      hintsUsed: 0,
      guessedWords: prev.guessedWords,
      currentWordIndex: prev.currentWordIndex,
    }));
  }, [selectNextWord]);

  // Handle hint usage
  const useHint = useCallback(() => {
    if (gameState.gameStatus !== "playing" || gameState.hintsUsed >= 2) {
      return;
    }

    setGameState((prev) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      // No score deduction for hints
    }));
  }, [gameState.gameStatus, gameState.hintsUsed]);

  // Handle letter guess
  const handleLetterGuess = useCallback(
    (letter: string) => {
      if (
        gameState.gameStatus !== "playing" ||
        gameState.guessedLetters.has(letter)
      ) {
        return;
      }

      const newGuessedLetters = new Set(gameState.guessedLetters);
      newGuessedLetters.add(letter);

      const isWrongGuess = !gameState.word.toUpperCase().includes(letter);
      const newWrongGuesses = isWrongGuess
        ? gameState.wrongGuesses + 1
        : gameState.wrongGuesses;

      // Check win condition
      const hasWon = gameState.word
        .toUpperCase()
        .split("")
        .every((char) => newGuessedLetters.has(char));
      // Check lose condition
      const hasLost = newWrongGuesses >= MAX_WRONG_GUESSES;

      let newScore = gameState.score;
      let newStreak = gameState.streak;

      if (hasWon) {
        newScore += 100 + gameState.word.length * 10;
        newStreak += 1;

        // Add word to guessed words and move to next word
        const newGuessedWords = new Set(gameState.guessedWords);
        newGuessedWords.add(gameState.word);

        setGameState((prev) => ({
          ...prev,
          guessedLetters: newGuessedLetters,
          wrongGuesses: newWrongGuesses,
          gameStatus: "won",
          score: newScore,
          streak: newStreak,
          guessedWords: newGuessedWords,
          currentWordIndex: prev.currentWordIndex + 1,
        }));
      } else if (hasLost) {
        newStreak = 0;
        setGameState((prev) => ({
          ...prev,
          guessedLetters: newGuessedLetters,
          wrongGuesses: newWrongGuesses,
          gameStatus: "lost",
          score: newScore,
          streak: newStreak,
        }));
      } else {
        setGameState((prev) => ({
          ...prev,
          guessedLetters: newGuessedLetters,
          wrongGuesses: newWrongGuesses,
          gameStatus: "playing",
          score: newScore,
          streak: newStreak,
        }));
      }
    },
    [gameState]
  );

  // Initialize game on component mount
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const letter = event.key.toUpperCase();
      if (letter >= "A" && letter <= "Z") {
        handleLetterGuess(letter);
      } else if (event.key === "Enter" && gameState.gameStatus !== "playing") {
        startNewGame();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleLetterGuess, gameState.gameStatus, startNewGame]);

  const getGameMessage = () => {
    switch (gameState.gameStatus) {
      case "won":
        return "🎉 Congratulations! You saved the hangman!";
      case "lost":
        return `💀 Game Over! The word was "${gameState.word}"`;
      case "allWordsCompleted":
        return "🏆 AMAZING! You've completed all 10 words!";
      default:
        return `Guess the tech word! (${gameState.currentWordIndex + 1}/10)`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-white mb-4">TECH HANGMAN</h1>
          <p className="text-xl text-blue-200">{getGameMessage()}</p>
        </div>

        {/* Progress Bar */}
        <div className="text-center mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
            <div className="text-white font-semibold mb-2">
              Progress: {gameState.guessedWords.size}/10 Words Completed
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${(gameState.guessedWords.size / 10) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Game Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">
              Score: {gameState.score}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">
              Streak: {gameState.streak}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-white font-semibold">
              Lives: {MAX_WRONG_GUESSES - gameState.wrongGuesses}
            </span>
          </div>
        </div>

        {/* Hints Section */}
        {gameState.gameStatus === "playing" && (
          <div className="text-center mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-white mb-3">
                💡 تلميحات (Hints)
              </h3>
              <div className="space-y-2">
                {gameState.hintsUsed >= 1 && (
                  <div className="text-blue-200 text-sm">
                    <strong>التلميح الأول:</strong> {gameState.hint1}
                  </div>
                )}
                {gameState.hintsUsed >= 2 && (
                  <div className="text-blue-200 text-sm">
                    <strong>التلميح الثاني:</strong> {gameState.hint2}
                  </div>
                )}
                {gameState.hintsUsed < 2 && (
                  <button
                    onClick={useHint}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                  >
                    استخدم تلميح ({gameState.hintsUsed + 1}/2)
                  </button>
                )}
                {gameState.hintsUsed >= 2 && (
                  <div className="text-gray-400 text-sm">
                    تم استخدام جميع التلميحات المتاحة
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Celebration Section */}
        {gameState.gameStatus === "allWordsCompleted" && (
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">🎉🏆🎊</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Congratulations! You're a Tech Genius!
              </h2>
              <p className="text-xl text-white mb-4">
                You've successfully guessed all 10 tech words!
              </p>
              <div className="text-lg text-white">
                <p>
                  Final Score:{" "}
                  <span className="font-bold text-yellow-200">
                    {gameState.score}
                  </span>
                </p>
                <p>
                  Final Streak:{" "}
                  <span className="font-bold text-yellow-200">
                    {gameState.streak}
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  setGameState({
                    word: "",
                    hint1: "",
                    hint2: "",
                    guessedLetters: new Set(),
                    wrongGuesses: 0,
                    gameStatus: "playing",
                    score: 0,
                    streak: 0,
                    hintsUsed: 0,
                    guessedWords: new Set(),
                    currentWordIndex: 0,
                  });
                }}
                className="mt-6 bg-white text-orange-500 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Main Game Area */}
        {gameState.gameStatus !== "allWordsCompleted" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Hangman Drawing */}
            <div className="flex justify-center">
              <HangmanDrawing wrongGuesses={gameState.wrongGuesses} />
            </div>

            {/* Game Controls */}
            <div className="space-y-6">
              {/* Word Display */}
              <WordDisplay
                word={gameState.word}
                guessedLetters={gameState.guessedLetters}
              />

              {/* Keyboard */}
              <Keyboard
                guessedLetters={gameState.guessedLetters}
                onLetterClick={handleLetterGuess}
                disabled={gameState.gameStatus !== "playing"}
              />

              {/* New Game Button */}
              <button
                onClick={startNewGame}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                New Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HangmanGame;

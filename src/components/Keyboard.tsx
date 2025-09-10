import React from "react";

interface KeyboardProps {
  guessedLetters: Set<string>;
  onLetterClick: (letter: string) => void;
  disabled: boolean;
}

const Keyboard: React.FC<KeyboardProps> = ({
  guessedLetters,
  onLetterClick,
  disabled,
}) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const getLetterStyle = (letter: string) => {
    const isUsed = guessedLetters.has(letter);
    const baseStyle =
      "w-10 h-10 rounded-lg font-bold text-sm transition-all duration-300 flex items-center justify-center cursor-pointer";

    if (isUsed) {
      return `${baseStyle} bg-gray-600 text-gray-400 cursor-not-allowed`;
    }
    return `${baseStyle} bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white text-center mb-4">
        Choose a Letter
      </h3>

      <div className="grid grid-cols-7 gap-2 max-w-md mx-auto">
        {letters.map((letter) => {
          const isUsed = guessedLetters.has(letter);

          return (
            <button
              key={letter}
              onClick={() => !disabled && !isUsed && onLetterClick(letter)}
              disabled={disabled || isUsed}
              className={getLetterStyle(letter)}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Keyboard;

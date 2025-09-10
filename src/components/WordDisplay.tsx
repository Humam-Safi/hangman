import React from "react";

interface WordDisplayProps {
  word: string;
  guessedLetters: Set<string>;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ word, guessedLetters }) => {
  return (
    <div className="space-y-6">
      {/* Word Display */}
      <div className="flex justify-center items-center gap-2 flex-wrap">
        {word.split("").map((letter, index) => {
          const isRevealed = guessedLetters.has(letter.toUpperCase());

          return (
            <div key={index} className="relative">
              <div className="w-12 h-16 flex items-center justify-center text-2xl font-bold text-white relative">
                {isRevealed ? (
                  <span className="text-green-400">{letter}</span>
                ) : (
                  <span className="text-transparent">_</span>
                )}
              </div>

              {/* Underline */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
            </div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center">
        <div className="flex gap-1">
          {word.split("").map((letter, index) => {
            const isRevealed = guessedLetters.has(letter.toUpperCase());
            return (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  isRevealed ? "bg-green-400" : "bg-gray-600"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Word length hint */}
      <div className="text-center text-blue-200 text-sm">
        Word length: {word.length} letters
      </div>
    </div>
  );
};

export default WordDisplay;

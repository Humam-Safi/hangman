import React from "react";

interface HangmanDrawingProps {
  wrongGuesses: number;
}

const HangmanDrawing: React.FC<HangmanDrawingProps> = ({ wrongGuesses }) => {
  return (
    <div className="relative w-80 h-96 flex items-center justify-center">
      {/* Gallows */}
      <svg
        width="300"
        height="400"
        viewBox="0 0 300 400"
        className="absolute inset-0"
      >
        {/* Base */}
        {wrongGuesses >= 1 && (
          <line
            x1="50"
            y1="350"
            x2="200"
            y2="350"
            stroke="#8B5CF6"
            strokeWidth="8"
            strokeLinecap="round"
          />
        )}

        {/* Vertical pole */}
        {wrongGuesses >= 2 && (
          <line
            x1="125"
            y1="350"
            x2="125"
            y2="50"
            stroke="#8B5CF6"
            strokeWidth="8"
            strokeLinecap="round"
          />
        )}

        {/* Top horizontal */}
        {wrongGuesses >= 3 && (
          <line
            x1="125"
            y1="50"
            x2="200"
            y2="50"
            stroke="#8B5CF6"
            strokeWidth="8"
            strokeLinecap="round"
          />
        )}

        {/* Rope */}
        {wrongGuesses >= 4 && (
          <line
            x1="200"
            y1="50"
            x2="200"
            y2="100"
            stroke="#8B5CF6"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}

        {/* Head */}
        {wrongGuesses >= 5 && (
          <circle
            cx="200"
            cy="120"
            r="20"
            stroke="#FF6B6B"
            strokeWidth="4"
            fill="none"
          />
        )}

        {/* Eyes */}
        {wrongGuesses >= 5 && (
          <>
            <circle cx="195" cy="115" r="2" fill="#FF6B6B" />
            <circle cx="205" cy="115" r="2" fill="#FF6B6B" />
          </>
        )}

        {/* Mouth */}
        {wrongGuesses >= 5 && (
          <path
            d="M 190 125 Q 200 135 210 125"
            stroke="#FF6B6B"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Body */}
        {wrongGuesses >= 6 && (
          <line
            x1="200"
            y1="140"
            x2="200"
            y2="250"
            stroke="#FF6B6B"
            strokeWidth="4"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
};

export default HangmanDrawing;

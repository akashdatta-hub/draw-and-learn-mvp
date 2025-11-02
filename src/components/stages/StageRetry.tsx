// Stage 4: Retry - Timed Listening MCQ
import { useState, useEffect, useMemo } from 'react';
import { speakText } from '../../lib/tts';
import type { Word } from '../../types';

interface Props {
  word: Word;
  onComplete: (result: 'pass' | 'fail', hintsUsed: number) => void;
}

export default function StageRetry({ word, onComplete }: Props) {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  // Generate options - memoized to prevent re-shuffling
  const options = useMemo(() => {
    return [word.word, 'example', 'another'].sort(() => Math.random() - 0.5);
  }, [word.word]);

  useEffect(() => {
    // Auto-play audio
    playAudio();
  }, []);

  useEffect(() => {
    if (!hasPlayed) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasPlayed]);

  const playAudio = async () => {
    await speakText(word.word);
    setHasPlayed(true);
  };

  const checkAnswer = () => {
    setShowFeedback(true);
    if (selectedAnswer === word.word) {
      setTimeout(() => onComplete('pass', 0), 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Retry: Listen and Choose</h2>
        <p className="text-lg text-gray-700">
          Listen carefully and select the word you hear
        </p>
      </div>

      <div className="bg-blue-50 p-8 rounded-lg text-center">
        <div className="text-6xl mb-4">=
</div>
        <button onClick={playAudio} className="btn-primary">
          {hasPlayed ? 'Play Again' : 'Play Audio'}
        </button>
        {hasPlayed && (
          <div className="mt-4 text-2xl font-bold text-blue-600">
            Time left: {timeLeft}s
          </div>
        )}
      </div>

      {hasPlayed && (
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => setSelectedAnswer(option)}
              disabled={timeLeft === 0}
              className={`w-full p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300'
              } ${timeLeft === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {hasPlayed && (
        <div className="flex justify-center">
          <button
            onClick={checkAnswer}
            disabled={!selectedAnswer || timeLeft === 0}
            className="btn-primary"
          >
            Submit Answer
          </button>
        </div>
      )}

      {showFeedback && (
        <div
          className={`p-4 rounded-lg text-center ${
            selectedAnswer === word.word
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {selectedAnswer === word.word
            ? 'Excellent! You got it right!'
            : 'Not quite. Keep practicing!'}
        </div>
      )}
    </div>
  );
}

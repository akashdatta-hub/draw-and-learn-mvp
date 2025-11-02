// Stage 2: Try - Fill in the Blank / Telugu Match
import { useState } from 'react';
import TTSButton from '../TTSButton';
import type { Word } from '../../types';

interface Props {
  word: Word;
  onComplete: (result: 'pass' | 'fail', hintsUsed: number) => void;
}

export default function StageTry({ word, onComplete }: Props) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Generate a fill-in-the-blank question
  const sentence = word.examples[0];
  const blankSentence = sentence.replace(word.word, '______');

  // Generate options (correct answer + 2 distractors)
  const options = [
    word.word,
    'happy',
    'running',
  ].sort(() => Math.random() - 0.5);

  const checkAnswer = () => {
    setShowFeedback(true);
    if (selectedAnswer === word.word) {
      setTimeout(() => onComplete('pass', hintsUsed), 1500);
    }
  };

  const useHint = () => {
    setHintsUsed(hintsUsed + 1);
    alert(`Hint: The Telugu word is "${word.telugu_hint}"`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Try: Fill in the Blank</h2>
        <p className="text-lg text-gray-700 mb-4">Choose the correct word:</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-xl mb-4">{blankSentence}</p>
        <TTSButton text={sentence} source="example" wordId={word.id} />
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => setSelectedAnswer(option)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              selectedAnswer === option
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={useHint} className="btn-secondary">
          =¡ Hint
        </button>
        <button
          onClick={checkAnswer}
          disabled={!selectedAnswer}
          className="btn-primary"
        >
          Check Answer
        </button>
      </div>

      {showFeedback && (
        <div
          className={`p-4 rounded-lg text-center ${
            selectedAnswer === word.word
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {selectedAnswer === word.word
            ? 'Correct! Well done!'
            : 'Not quite. Try again!'}
        </div>
      )}
    </div>
  );
}

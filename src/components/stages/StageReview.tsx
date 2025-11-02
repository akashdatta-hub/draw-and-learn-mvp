// Stage 3: Review - Build a Sentence with Draggable Tiles
import { useState } from 'react';
import type { Word } from '../../types';

interface Props {
  word: Word;
  onComplete: (result: 'pass' | 'fail', hintsUsed: number) => void;
}

export default function StageReview({ word, onComplete }: Props) {
  // Simple sentence building: arrange tiles in correct order
  const correctSentence = word.examples[0].split(' ');
  const [tiles, setTiles] = useState(
    [...correctSentence].sort(() => Math.random() - 0.5)
  );
  const [builtSentence, setBuiltSentence] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const addTile = (tile: string, index: number) => {
    setBuiltSentence([...builtSentence, tile]);
    setTiles(tiles.filter((_, i) => i !== index));
  };

  const removeTile = (index: number) => {
    const removed = builtSentence[index];
    setBuiltSentence(builtSentence.filter((_, i) => i !== index));
    setTiles([...tiles, removed]);
  };

  const checkSentence = () => {
    setShowFeedback(true);
    const isCorrect = builtSentence.join(' ') === correctSentence.join(' ');
    if (isCorrect) {
      setTimeout(() => onComplete('pass', 0), 1500);
    }
  };

  const reset = () => {
    setTiles([...correctSentence].sort(() => Math.random() - 0.5));
    setBuiltSentence([]);
    setShowFeedback(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Review: Build a Sentence</h2>
        <p className="text-lg text-gray-700">
          Arrange the words to make a correct sentence using "{word.word}"
        </p>
      </div>

      {/* Built Sentence Area */}
      <div className="min-h-[80px] p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
        <div className="flex flex-wrap gap-2">
          {builtSentence.length === 0 ? (
            <p className="text-gray-400">Tap words below to build your sentence...</p>
          ) : (
            builtSentence.map((tile, idx) => (
              <button
                key={idx}
                onClick={() => removeTile(idx)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {tile}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Available Tiles */}
      <div className="min-h-[80px] p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap gap-2">
          {tiles.map((tile, idx) => (
            <button
              key={idx}
              onClick={() => addTile(tile, idx)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              {tile}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={reset} className="btn-secondary">
          Reset
        </button>
        <button
          onClick={checkSentence}
          disabled={builtSentence.length !== correctSentence.length}
          className="btn-primary"
        >
          Check Sentence
        </button>
      </div>

      {showFeedback && (
        <div
          className={`p-4 rounded-lg text-center ${
            builtSentence.join(' ') === correctSentence.join(' ')
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {builtSentence.join(' ') === correctSentence.join(' ')
            ? 'Perfect! Great sentence!'
            : 'Not quite right. Try again!'}
        </div>
      )}
    </div>
  );
}

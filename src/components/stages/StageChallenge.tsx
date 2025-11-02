// Stage 5: Challenge - Draw + Caption with AI Review
import React, { useState, useRef } from 'react';
// import TTSButton from '../TTSButton';
import type { Word } from '../../types';

interface Props {
  word: Word;
  onComplete: (result: 'pass' | 'fail', hintsUsed: number) => void;
}

export default function StageChallenge({ word, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [caption, setCaption] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const submitChallenge = async () => {
    if (!caption.trim()) {
      setFeedback('Please write a caption!');
      return;
    }

    setIsProcessing(true);
    setFeedback('');

    // Simple check: does caption contain the word?
    const captionLower = caption.toLowerCase();
    const wordLower = word.word.toLowerCase();

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (captionLower.includes(wordLower)) {
      setFeedback(
        `Excellent! You used "${word.word}" correctly! Your creativity is amazing. Keep learning!`
      );
      setTimeout(() => onComplete('pass', 0), 2000);
    } else {
      setFeedback(
        `Good try! Make sure to use the word "${word.word}" in your sentence. Try again!`
      );
    }

    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Challenge: Create!</h2>
        <p className="text-lg text-gray-700 mb-2">
          Draw a picture and write a sentence using "{word.word}"
        </p>
        <p className="text-sm text-gray-600">Show us what you've learned!</p>
      </div>

      {/* Drawing Canvas */}
      <div>
        <h3 className="font-semibold mb-2">Your Drawing:</h3>
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="border-2 border-purple-300 rounded-lg mx-auto cursor-crosshair bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div className="flex justify-center gap-2 mt-2">
          <button onClick={clearCanvas} className="btn-secondary text-sm">
            Clear Drawing
          </button>
        </div>
      </div>

      {/* Caption Input */}
      <div>
        <h3 className="font-semibold mb-2">Your Sentence:</h3>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={`Write a sentence using "${word.word}"...`}
          className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none min-h-[100px] text-lg"
          maxLength={120}
        />
        <div className="text-sm text-gray-500 text-right">
          {caption.length}/120 characters
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={submitChallenge}
          disabled={isProcessing || !caption.trim()}
          className="btn-primary"
        >
          {isProcessing ? 'Checking...' : 'Submit My Challenge'}
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-lg ${
            feedback.includes('Excellent')
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Hint */}
      <div className="text-center text-sm text-gray-600">
        <p>Hint: Use the word in a meaningful way!</p>
        <p>Example: "Our {word.word} was full of fun."</p>
      </div>
    </div>
  );
}

// Stage 1: Understand - Draw and Explain
import React, { useState, useRef } from 'react';
import { classifyDrawing } from '../../lib/aiRecognition';
import TTSButton from '../TTSButton';
import type { Word } from '../../types';

interface Props {
  word: Word;
  onComplete: (result: 'pass' | 'fail', hintsUsed: number) => void;
}

export default function StageUnderstand({ word, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTeluguHint, setShowTeluguHint] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

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
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
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
    setFeedback('');
  };

  const checkDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsProcessing(true);
    setFeedback('');
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const result = await classifyDrawing(imageData, word.id);
      if (result.recognized) {
        setFeedback('Great job! You drew it correctly!');
        setTimeout(() => onComplete('pass', showTeluguHint ? 1 : 0), 1500);
      } else {
        setFeedback('Nice attempt! Try again or skip to continue.');
      }
    } catch (error) {
      console.error('[Drawing Error]', error);
      setFeedback('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{word.word}</h2>
        <p className="text-lg text-gray-700 mb-4">{word.meaning}</p>
        <div className="flex items-center justify-center gap-2">
          <TTSButton text={word.meaning} source="definition" wordId={word.id} />
          <button onClick={() => setShowTeluguHint(!showTeluguHint)} className="btn-secondary">
            {showTeluguHint ? 'Hide' : 'Show'} Telugu
          </button>
        </div>
        {showTeluguHint && <div className="mt-2 text-xl">{word.telugu_hint}</div>}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Examples:</h3>
        {word.examples.map((ex, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <p>{ex}</p>
            <TTSButton text={ex} source="example" wordId={word.id} />
          </div>
        ))}
      </div>

      <div className="text-center">
        <h3 className="font-semibold mb-2">Draw the word:</h3>
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="border-2 rounded-lg mx-auto cursor-crosshair bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <div className="flex justify-center gap-2 mt-4">
          <button onClick={clearCanvas} className="btn-secondary">Clear</button>
          <button onClick={checkDrawing} disabled={isProcessing} className="btn-primary">
            {isProcessing ? 'Checking...' : 'Check Drawing'}
          </button>
          <button onClick={() => onComplete('pass', 1)} className="btn-secondary">Skip</button>
        </div>
        {feedback && <div className="mt-4 p-4 rounded-lg bg-yellow-100">{feedback}</div>}
      </div>
    </div>
  );
}

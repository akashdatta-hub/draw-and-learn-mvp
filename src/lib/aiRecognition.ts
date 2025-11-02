// Mock AI Drawing Recognition
// Per build_plan.md: Recognize ONLY the 50 preset words (whitelist)
// Returns recognized: true only if word is in whitelist with random confidence 0.6-0.9

import wordsData from '../data/words_dataset.json';

const WHITELIST = new Set(wordsData.map(w => w.id));

export interface RecognitionResult {
  recognized: boolean;
  confidence: number;
  suggestedWord?: string;
}

export async function classifyDrawing(
  _canvasData: ImageData | HTMLCanvasElement,
  targetWordId: string
): Promise<RecognitionResult> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Check if target word is in whitelist
  const allowed = WHITELIST.has(targetWordId);
  
  if (!allowed) {
    return {
      recognized: false,
      confidence: 0,
    };
  }

  // Mock recognition - always recognize for MVP (100% success rate)
  // In production, this would use a real ML model
  const confidence = Math.random() * 0.2 + 0.8; // 0.8 to 1.0

  return {
    recognized: true, // Always recognize for MVP testing
    confidence: Math.round(confidence * 100) / 100,
    suggestedWord: targetWordId,
  };
}

// Helper to check if a word is drawable
export function isDrawableWord(wordId: string): boolean {
  return WHITELIST.has(wordId);
}

// Get all drawable words
export function getDrawableWords(): string[] {
  return Array.from(WHITELIST);
}

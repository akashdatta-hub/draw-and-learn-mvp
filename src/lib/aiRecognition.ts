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

  // Mock recognition with random confidence between 0.6 and 0.9
  const confidence = Math.random() * 0.3 + 0.6;
  const recognized = confidence > 0.65;

  return {
    recognized,
    confidence: Math.round(confidence * 100) / 100,
    suggestedWord: recognized ? targetWordId : undefined,
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

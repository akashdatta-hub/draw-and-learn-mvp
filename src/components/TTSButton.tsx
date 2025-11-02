// TTS Button Component
// Per governance: TTS available for every instruction/sentence

import { useState } from 'react';
import { speakText, ttsManager } from '../lib/tts';
import { useAnalytics } from '../contexts/AnalyticsContext';

interface TTSButtonProps {
  text: string;
  source: 'definition' | 'example' | 'instruction';
  wordId?: string;
  className?: string;
}

export default function TTSButton({ text, source, wordId, className = '' }: TTSButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { logEvent } = useAnalytics();

  const handleSpeak = async () => {
    if (isPlaying) {
      ttsManager.cancel();
      setIsPlaying(false);
      return;
    }

    // Log TTS event
    if (wordId) {
      logEvent({
        type: 'tts_play',
        word_id: wordId,
        source,
      });
    }

    setIsPlaying(true);
    try {
      await speakText(text);
    } catch (error) {
      console.error('[TTS Error]', error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      className={`btn-secondary min-w-[44px] min-h-[44px] ${className}`}
      aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
      title={isPlaying ? 'Stop' : 'Listen'}
    >
      {isPlaying ? '⏸️' : '🔊'}
    </button>
  );
}

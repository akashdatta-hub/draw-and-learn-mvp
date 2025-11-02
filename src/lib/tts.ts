// Text-to-Speech helper using browser's speechSynthesis API
// Per governance: TTS available for every instruction/sentence

export interface TTSOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

class TTSManager {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  speak(text: string, options: TTSOptions = {}) {
    // Cancel any ongoing speech
    this.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 0.9; // Slightly slower for clarity
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    this.currentUtterance = utterance;
    this.synthesis.speak(utterance);

    return new Promise<void>((resolve, reject) => {
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };
      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(event);
      };
    });
  }

  cancel() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  pause() {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}

export const ttsManager = new TTSManager();

// Convenience function
export function speakText(text: string, options?: TTSOptions): Promise<void> {
  return ttsManager.speak(text, options);
}

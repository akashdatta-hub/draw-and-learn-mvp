// AI Chat Assistant Component
// Per build_plan.md section 6: Bilingual (Telugu-English), confidence-first

import { useState } from 'react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import TTSButton from './TTSButton';
import type { Word } from '../types';

interface Props {
  word: Word;
  currentStage: number;
}

export default function AIChatAssistant({ word, currentStage }: Props) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Hi! I'm here to help you learn "${word.word}" (${word.telugu_hint}). What would you like help with?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { logEvent } = useAnalytics();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages([...messages, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    // Log hint request
    logEvent({
      type: 'assistant_hint_sent',
      word_id: word.id,
    });

    // Simulate AI response (in real implementation, call Claude API)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = generateHelpfulResponse(userMessage, word, currentStage);
    setMessages((prev) => [...prev, { role: 'assistant', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="card bg-purple-50 border-2 border-purple-300">
      <h3 className="text-xl font-bold mb-4">AI Assistant</h3>

      {/* Messages */}
      <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-blue-100 text-blue-900 ml-8'
                : 'bg-white text-gray-800 mr-8'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="flex-1">{msg.text}</p>
              {msg.role === 'assistant' && (
                <TTSButton text={msg.text} source="instruction" wordId={word.id} />
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="p-3 rounded-lg bg-white text-gray-800 mr-8">
            <p>Thinking...</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything..."
          className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          className="btn-primary"
        >
          Send
        </button>
      </div>

      {/* Quick Help Buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => {
            setInput("What does this word mean?");
            setTimeout(() => sendMessage(), 100);
          }}
          className="btn-secondary text-sm"
        >
          Meaning?
        </button>
        <button
          onClick={() => {
            setInput("Can you give me an example?");
            setTimeout(() => sendMessage(), 100);
          }}
          className="btn-secondary text-sm"
        >
          Example?
        </button>
        <button
          onClick={() => {
            setInput("I'm stuck on this stage");
            setTimeout(() => sendMessage(), 100);
          }}
          className="btn-secondary text-sm"
        >
          Help with stage
        </button>
      </div>
    </div>
  );
}

// Generate helpful response based on question
function generateHelpfulResponse(question: string, word: Word, stage: number): string {
  const q = question.toLowerCase();

  // Meaning queries
  if (q.includes('mean') || q.includes('what') || q.includes('0M%')) {
    return `Great question! "${word.word}" means ${word.meaning}. In Telugu: ${word.telugu_hint}. Try using it in a sentence!`;
  }

  // Example queries
  if (q.includes('example') || q.includes('	&>90#')) {
    const example = word.examples[0];
    return `Sure! Here's an example: "${example}". Want to try making your own sentence?`;
  }

  // Stage-specific help
  if (q.includes('stuck') || q.includes('help') || q.includes('hard')) {
    return getStageHelp(stage, word);
  }

  // Default encouraging response
  return `Good question! Remember, "${word.word}" (${word.telugu_hint}) means ${word.meaning}. Take your time and try your best. You're doing great!`;
}

function getStageHelp(stage: number, word: Word): string {
  switch (stage) {
    case 1:
      return `For drawing, think about what "${word.word}" looks like. Don't worry about being perfect - just try your best! If it's too hard, you can skip to picture select.`;
    case 2:
      return `Look at the sentence carefully. Which word makes the most sense? Hint: ${word.telugu_hint}. Take your time!`;
    case 3:
      return `Try arranging the words to make a sentence that sounds natural. Start with the subject, then action, then rest. You've got this!`;
    case 4:
      return `Listen carefully to how the word sounds. Focus on the pronunciation. You can replay it as many times as you need!`;
    case 5:
      return `Be creative! Draw something related to "${word.word}" and write a sentence using it. Example: "Our ${word.word} was wonderful." Show what you've learned!`;
    default:
      return `Keep trying! You're learning and that's what matters. Every attempt makes you stronger!`;
  }
}

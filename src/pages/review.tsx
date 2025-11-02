// Review Page - Spaced Repetition
// Per build_plan.md section 8

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useAnalytics } from '../contexts/AnalyticsContext';

export default function ReviewPage() {
  const { dueWords, getWordById } = useGame();
  const { logEvent } = useAnalytics();

  useEffect(() => {
    if (dueWords.length > 0) {
      logEvent({
        type: 'sr_due_seen',
        word_id: dueWords[0],
        due_count: dueWords.length,
      });
    }
  }, [dueWords, logEvent]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Review Time 🎯</h1>
          
          {dueWords.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600 mb-4">
                No words due for review right now.
              </p>
              <p className="text-gray-500 mb-6">
                Keep learning new words and they'll appear here when it's time to practice!
              </p>
              <Link to="/" className="btn-primary">
                Explore Words
              </Link>
            </div>
          ) : (
            <>
              <p className="text-lg text-gray-700 mb-6">
                Welcome back! {dueWords.length} word{dueWords.length > 1 ? 's' : ''} ready for review.
              </p>

              <div className="space-y-4">
                {dueWords.map((wordId) => {
                  const word = getWordById(wordId);
                  if (!word) return null;

                  return (
                    <Link
                      key={wordId}
                      to={`/word/${wordId}`}
                      className="card hover:shadow-xl transition-shadow p-4 flex items-center justify-between focus-ring block"
                    >
                      <div>
                        <div className="text-xl font-bold text-gray-800">
                          {word.word}
                        </div>
                        <div className="text-sm text-gray-600">
                          {word.telugu_hint} — {word.meaning}
                        </div>
                      </div>
                      <div className="btn-secondary">Review →</div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 text-center">
                <Link to="/" className="btn-secondary">
                  ← Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

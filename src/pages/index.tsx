// Home Page
// Per build_plan.md section 8

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { useAnalytics } from '../contexts/AnalyticsContext';

export default function Home() {
  const { words, getTotalXP, getTotalStars, getStreak, dueWords } = useGame();
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

  const totalXP = getTotalXP();
  const totalStars = getTotalStars();
  const streak = getStreak();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-2">
            Draw & Learn — English Word Quest
          </h1>
          <p className="text-lg text-gray-600">
            Build confidence with every word you learn!
          </p>
        </header>

        {/* Progress Summary */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-500">{totalStars}</div>
              <div className="text-sm text-gray-600">Stars</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{totalXP}</div>
              <div className="text-sm text-gray-600">XP</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500">{streak}</div>
              <div className="text-sm text-gray-600">Day Streak 🔥</div>
            </div>
          </div>
        </div>

        {/* Due Words Section */}
        {dueWords.length > 0 && (
          <div className="card mb-8 bg-yellow-50 border-2 border-yellow-300">
            <h2 className="text-2xl font-bold mb-4">Review Time! 🎯</h2>
            <p className="mb-4">
              {dueWords.length} word{dueWords.length > 1 ? 's' : ''} ready for review
            </p>
            <Link to="/review" className="btn-primary">
              Start Review
            </Link>
          </div>
        )}

        {/* Explore Words Grid */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Explore Words</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {words.slice(0, 16).map((word) => (
              <Link
                key={word.id}
                to={`/word/${word.id}`}
                className="card hover:shadow-xl transition-shadow p-4 text-center focus-ring"
              >
                <div className="text-3xl mb-2">📝</div>
                <div className="font-semibold text-gray-800">{word.word}</div>
                <div className="text-sm text-gray-500">{word.telugu_hint}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Links */}
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/leaderboard" className="btn-secondary">
            🏆 Leaderboard
          </Link>
          <Link to="/debug" className="btn-secondary text-xs">
            Debug
          </Link>
        </div>
      </div>
    </div>
  );
}

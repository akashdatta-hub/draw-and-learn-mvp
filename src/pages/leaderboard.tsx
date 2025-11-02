// Leaderboard Page
// Per build_plan.md section 8: Anonymous nicknames, XP totals

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useGame } from '../contexts/GameContext';

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  total_xp: number;
  updated_at: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { logEvent, userId } = useAnalytics();
  const { getTotalXP } = useGame();

  useEffect(() => {
    logEvent({ type: 'leaderboard_viewed' });
    loadLeaderboard();
  }, [logEvent]);

  async function loadLeaderboard() {
    setLoading(true);

    if (!isSupabaseConfigured()) {
      // Mock data for local development - show user's actual progress
      const userXP = getTotalXP();
      const mockEntries = [
        {
          user_id: '1',
          display_name: 'StarLearner',
          total_xp: Math.max(userXP + 100, 200),
          updated_at: new Date().toISOString(),
        },
        {
          user_id: userId,
          display_name: 'You',
          total_xp: userXP,
          updated_at: new Date().toISOString(),
        },
        {
          user_id: '2',
          display_name: 'WordMaster',
          total_xp: Math.max(userXP - 50, 50),
          updated_at: new Date().toISOString(),
        },
        {
          user_id: '3',
          display_name: 'QuickLearner',
          total_xp: Math.max(userXP - 80, 20),
          updated_at: new Date().toISOString(),
        },
      ].sort((a, b) => b.total_xp - a.total_xp);

      setEntries(mockEntries);
      setLoading(false);
      return;
    }

    try {
      const result = await supabase
        .from('leaderboard')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(20);

      if (result.error) throw result.error;

      setEntries(result.data || []);
    } catch (err) {
      console.error('[Leaderboard Error]', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">Leaderboard</h1>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-xl text-gray-600">Loading...</div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl text-gray-600 mb-4">
                No entries yet. Be the first!
              </p>
              <Link to="/" className="btn-primary">
                Start Learning
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry, index) => {
                const isCurrentUser = entry.user_id === userId;
                const rankClass = index === 0 ? 'text-yellow-500' : 
                                 index === 1 ? 'text-gray-400' : 
                                 index === 2 ? 'text-orange-600' : 'text-gray-600';
                const rank = index === 0 ? '🥇' : 
                            index === 1 ? '🥈' : 
                            index === 2 ? '🥉' : `#${index + 1}`;
                
                return (
                  <div
                    key={entry.user_id}
                    className={`p-4 rounded-lg flex items-center justify-between ${
                      isCurrentUser
                        ? 'bg-yellow-100 border-2 border-yellow-400'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl font-bold ${rankClass}`}>
                        {rank}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">
                          {entry.display_name}
                          {isCurrentUser && ' (You)'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Last active: {new Date(entry.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {entry.total_xp}
                      </div>
                      <div className="text-sm text-gray-500">XP</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

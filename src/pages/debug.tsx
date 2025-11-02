// Debug Page
// Per build_plan.md section 8

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useGame } from '../contexts/GameContext';

export default function DebugPage() {
  const { userId, sessionId } = useAnalytics();
  const { getTotalXP, getTotalStars, progress } = useGame();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    loadRecentEvents();
  }, [userId]);

  async function loadRecentEvents() {
    if (!isSupabaseConfigured()) {
      setEvents([
        {
          id: 1,
          type: 'word_opened',
          word_id: 'festival',
          ts: new Date().toISOString(),
        },
      ]);
      return;
    }

    try {
      const result = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId)
        .order('ts', { ascending: false })
        .limit(20);

      if (result.error) throw result.error;
      setEvents(result.data || []);
    } catch (err) {
      console.error('[Debug Events Error]', err);
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="card mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Debug Dashboard</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">User ID</div>
              <div className="font-mono text-xs">{userId.slice(0, 8)}...</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Session ID</div>
              <div className="font-mono text-xs">{sessionId.slice(0, 8)}...</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Total XP</div>
              <div className="text-2xl font-bold text-blue-600">{getTotalXP()}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-600">Total Stars</div>
              <div className="text-2xl font-bold text-yellow-500">{getTotalStars()}</div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Progress Snapshot</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Word ID</th>
                    <th className="p-2 text-left">Stage</th>
                    <th className="p-2 text-left">XP</th>
                    <th className="p-2 text-left">Stars</th>
                    <th className="p-2 text-left">Last Result</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(progress.values()).map((p) => (
                    <tr key={p.word_id} className="border-b">
                      <td className="p-2">{p.word_id}</td>
                      <td className="p-2">{p.stage}</td>
                      <td className="p-2">{p.xp}</td>
                      <td className="p-2">{p.stars}</td>
                      <td className="p-2">{p.last_result}</td>
                    </tr>
                  ))}
                  {progress.size === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500">
                        No progress yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Recent Events</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Word ID</th>
                    <th className="p-2 text-left">Stage</th>
                    <th className="p-2 text-left">Result</th>
                    <th className="p-2 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2 font-mono">{event.type}</td>
                      <td className="p-2">{event.word_id || '-'}</td>
                      <td className="p-2">{event.stage || '-'}</td>
                      <td className="p-2">{event.result || '-'}</td>
                      <td className="p-2">
                        {new Date(event.ts).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-500">
                        No events yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

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

// Anonymous User Hook
// Per build_plan.md section 18

import { useState } from 'react';

export function useAnonUser() {
  const [userId] = useState<string>(() => {
    const stored = localStorage.getItem('anon_id');
    if (stored) return stored;

    const newId = crypto.randomUUID();
    localStorage.setItem('anon_id', newId);
    return newId;
  });

  const [sessionId] = useState<string>(() => {
    // Session ID rotates per visit
    return crypto.randomUUID();
  });

  return { userId, sessionId };
}

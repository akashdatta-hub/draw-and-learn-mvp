// Analytics Context Provider
// Provides analytics logging throughout the app

import React, { createContext, useContext, useEffect } from 'react';
import { useAnonUser } from '../hooks/useAnonUser';
import { logEvent } from '../lib/analytics';
import { initWebVitals } from '../lib/webVitals';
import type { AnalyticsEvent } from '../types';

interface AnalyticsContextType {
  logEvent: (event: Partial<AnalyticsEvent> & { type: string }) => void;
  userId: string;
  sessionId: string;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { userId, sessionId } = useAnonUser();

  // Initialize Web Vitals on mount
  useEffect(() => {
    initWebVitals(userId, sessionId);
  }, [userId, sessionId]);

  const logEventWithContext = (
    event: Partial<AnalyticsEvent> & { type: string }
  ) => {
    const fullEvent: AnalyticsEvent = {
      ...event,
      user_id: userId,
      session_id: sessionId,
      ts: new Date().toISOString(),
    } as AnalyticsEvent;

    logEvent(fullEvent);
  };

  return (
    <AnalyticsContext.Provider
      value={{
        logEvent: logEventWithContext,
        userId,
        sessionId,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
}

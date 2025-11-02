// Web Vitals Reporter
// Per analytics_design.md section 6

import { onLCP, onINP, onCLS, onTTFB } from 'web-vitals';
import { logEvent } from './analytics';

export function initWebVitals(user_id: string, session_id: string): void {
  // Only report in production
  if (import.meta.env.DEV) {
    console.log('[Web Vitals] Skipped in development');
    return;
  }

  const ts = new Date().toISOString();

  onLCP((metric) => {
    logEvent({
      type: 'web_vitals',
      user_id,
      session_id,
      ts,
      lcp: metric.value,
    });
  });

  onINP((metric) => {
    logEvent({
      type: 'web_vitals',
      user_id,
      session_id,
      ts,
      inp: metric.value,
    });
  });

  onCLS((metric) => {
    logEvent({
      type: 'web_vitals',
      user_id,
      session_id,
      ts,
      cls: metric.value,
    });
  });

  onTTFB((metric) => {
    logEvent({
      type: 'web_vitals',
      user_id,
      session_id,
      ts,
      ttfb: metric.value,
    });
  });
}

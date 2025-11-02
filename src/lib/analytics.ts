// Analytics Infrastructure
// Per analytics_design.md: Track all events to Supabase + optional Clarity

import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { AnalyticsEvent } from '../types';

const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
const ENABLE_CLARITY = import.meta.env.VITE_ENABLE_CLARITY === 'true';

// Event queue for retry logic
const eventQueue: AnalyticsEvent[] = [];
let isProcessingQueue = false;

export async function logEvent(event: AnalyticsEvent): Promise<void> {
  if (!ENABLE_ANALYTICS) {
    console.log('[Analytics Disabled]', event.type, event);
    return;
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', event.type, event);
  }

  // Send to Clarity (if enabled)
  if (ENABLE_CLARITY && window.clarity) {
    try {
      window.clarity('event', event.type, event);
    } catch (error) {
      console.error('[Clarity Error]', error);
    }
  }

  // Send to Supabase
  if (isSupabaseConfigured()) {
    try {
      await writeEventToSupabase(event);
    } catch (error) {
      console.error('[Supabase Analytics Error]', error);
      // Add to queue for retry
      eventQueue.push(event);
      processQueue();
    }
  }
}

async function writeEventToSupabase(event: AnalyticsEvent): Promise<void> {
  const { type, user_id, session_id, ts } = event;

  const payload: any = {
    user_id,
    session_id,
    ts,
    type,
  };

  // Map event-specific fields
  if ('word_id' in event) payload.word_id = event.word_id;
  if ('stage' in event) payload.stage = event.stage;
  if ('result' in event) payload.result = event.result;
  if ('hints_used' in event) payload.hints_used = event.hints_used;
  if ('time_ms' in event) payload.time_ms = event.time_ms;
  if ('due_count' in event) payload.due_count = event.due_count;
  if ('reviewed' in event) payload.reviewed = event.reviewed;
  if ('passes' in event) payload.passes = event.passes;
  if ('fails' in event) payload.fails = event.fails;
  if ('badge_id' in event) payload.badge_id = event.badge_id;
  if ('lcp' in event) payload.lcp = event.lcp;
  if ('cls' in event) payload.cls = event.cls;
  if ('inp' in event) payload.inp = event.inp;
  if ('ttfb' in event) payload.ttfb = event.ttfb;
  if ('message' in event) payload.message = event.message;

  const { error } = await supabase.from('events').insert(payload);

  if (error) {
    throw error;
  }
}

// Process queued events (retry logic)
async function processQueue(): Promise<void> {
  if (isProcessingQueue || eventQueue.length === 0) return;

  isProcessingQueue = true;

  while (eventQueue.length > 0) {
    const event = eventQueue.shift();
    if (!event) break;

    try {
      await writeEventToSupabase(event);
    } catch (error) {
      console.error('[Queue Processing Error]', error);
      // Put it back if it fails again
      eventQueue.push(event);
      break;
    }
  }

  isProcessingQueue = false;
}

// Declare Clarity type for TypeScript
declare global {
  interface Window {
    clarity?: (command: string, ...args: any[]) => void;
  }
}

// Initialize Clarity (called from index.html or main.tsx)
export function initClarity(projectId: string): void {
  if (!ENABLE_CLARITY || !projectId) return;

  const script = document.createElement('script');
  script.innerHTML = `
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "${projectId}");
  `;
  document.head.appendChild(script);
}

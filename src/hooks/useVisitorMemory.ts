'use client';

import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'visitor_data';
// sessionStorage key: guards against React Strict Mode double-mount in dev.
// sessionStorage persists across HMR reloads but resets on tab close — perfect.
const SESSION_GUARD_KEY = 'visitor_session_active';

interface VisitorData {
  visitCount: number;
  firstVisit: string;
  lastVisit: string;
  rsvpDone: boolean;
  rsvpName: string | null;
}

function loadData(): VisitorData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    visitCount: 0,
    firstVisit: new Date().toISOString(),
    lastVisit: new Date().toISOString(),
    rsvpDone: false,
    rsvpName: null,
  };
}

function saveData(data: VisitorData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function useVisitorMemory() {
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const sessionStartRef = useRef<number>(Date.now());

  useEffect(() => {
    const data = loadData();

    // ── Guard: only count once per real browser session ─────────────────────
    // sessionStorage is cleared on tab close but survives HMR / Strict Mode
    // double-mount, so visitCount won't be inflated in dev.
    const alreadyCounted = sessionStorage.getItem(SESSION_GUARD_KEY) === '1';
    const isReturning = data.visitCount > 0; // computed before any increment

    let updated: VisitorData;

    if (!alreadyCounted) {
      sessionStorage.setItem(SESSION_GUARD_KEY, '1');
      updated = {
        ...data,
        visitCount: data.visitCount + 1,
        lastVisit: new Date().toISOString(),
      };
      saveData(updated);
    } else {
      // Strict Mode second mount — just read current state, don't double-count
      updated = data;
    }

    setVisitorData(updated);
    sessionStartRef.current = Date.now();

    // ── Analytics beacon: fire once per session on tab close ─────────────────
    // sessionStorage also guards the beacon from double-firing.
    const BEACON_GUARD_KEY = 'visitor_beacon_sent';

    const flush = () => {
      if (sessionStorage.getItem(BEACON_GUARD_KEY) === '1') return;
      sessionStorage.setItem(BEACON_GUARD_KEY, '1');

      const timeSpentSeconds = Math.round((Date.now() - sessionStartRef.current) / 1000);
      if (timeSpentSeconds < 2) return; // ignore sub-2s bounces (e.g. HMR)

      const payload = JSON.stringify({ timeSpentSeconds, isReturning });
      try {
        navigator.sendBeacon(
          '/api/analytics',
          new Blob([payload], { type: 'application/json' }),
        );
      } catch {}
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', flush);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', flush);
    };
  }, []);

  // Call this from RSVPForm after successful submit
  const markRsvpDone = (name: string) => {
    const data = loadData();
    const updated = { ...data, rsvpDone: true, rsvpName: name };
    saveData(updated);
    setVisitorData(updated);
  };

  return { visitorData, markRsvpDone };
}

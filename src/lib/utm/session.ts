// ============================================
// SESSION MANAGEMENT
// ============================================

// Session management
let sessionId: string | null = null;
const SESSION_STORAGE_KEY = 'utm_session_id';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
let sessionTimer: NodeJS.Timeout | null = null;

export function getOrCreateSessionId(): string {
  if (sessionId) {
    resetSessionTimeout();
    return sessionId;
  }

  // Try to get from localStorage
  const stored = localStorage.getItem(SESSION_STORAGE_KEY);
  if (stored) {
    sessionId = stored;
    resetSessionTimeout();
    return sessionId;
  }

  // Generate new session ID
  sessionId = generateSessionId();
  localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  resetSessionTimeout();

  console.log('🆕 New session created:', sessionId);
  return sessionId;
}

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function resetSessionTimeout() {
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }

  sessionTimer = setTimeout(() => {
    console.log('⏱️ Session expired');
    sessionId = null;
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }, SESSION_TIMEOUT);
}

export function clearSession() {
  sessionId = null;
  localStorage.removeItem(SESSION_STORAGE_KEY);
  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }
}

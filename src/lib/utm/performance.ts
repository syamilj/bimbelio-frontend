// ============================================
// PERFORMANCE TRACKING
// ============================================

// Page load time measurement
let pageLoadStartTime = performance.now();

// Time on page tracking
let pageStartTime = Date.now();

export function getPageLoadTime(): number {
  return Math.round(performance.now() - pageLoadStartTime);
}

export function getTimeOnPage(): number {
  return Date.now() - pageStartTime;
}

export function getScrollDepth(): number {
  if (typeof window === 'undefined') return 0;

  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  const totalScroll = scrollTop + windowHeight;
  const scrollDepthPercent = Math.round((totalScroll / documentHeight) * 100);

  // Clamp between 0-100
  return Math.min(Math.max(scrollDepthPercent, 0), 100);
}

export function getViewportDimensions(): {
  width: number;
  height: number;
  resolution: string;
} {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0, resolution: 'unknown' };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const resolution = `${width}x${height}`;

  return { width, height, resolution };
}

export function getConnectionInfo(): {
  type: string | null;
  speed: number | null;
} {
  if (typeof navigator === 'undefined') {
    return { type: null, speed: null };
  }

  const nav = navigator as any;
  const connection =
    nav.connection || nav.mozConnection || nav.webkitConnection;

  if (!connection) {
    return { type: null, speed: null };
  }

  return {
    type: connection.effectiveType || null, // 4g, 3g, 2g, slow-2g
    speed: connection.downlink || null, // Mbps
  };
}

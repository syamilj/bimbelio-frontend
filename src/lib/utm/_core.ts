import { env } from '@/env.mjs';
import { LinkConversionType } from '@/types/database';
import { TrackUtmPayload, TrackUtmResponse } from './_type';
import {
  getConnectionInfo,
  getPageLoadTime,
  getScrollDepth,
  getTimeOnPage,
  getViewportDimensions,
} from './performance';
import { clearSession, getOrCreateSessionId } from './session';
import {
  getAbVariant,
  getAdClickIds,
  getReferralCode,
  getUtmParameters,
} from './url';

// ============================================
// CONSTANTS
// ============================================

const API_BASE_URL = env.NEXT_PUBLIC_API_URL;
const TRACK_ENDPOINT = `${API_BASE_URL}/link/track/utmTracker`;

// ============================================
// TRACKING FUNCTIONS
// ============================================

export async function trackPageView(
  slug?: string,
  options?: Partial<TrackUtmPayload>,
): Promise<TrackUtmResponse | null> {
  try {
    const viewport = getViewportDimensions();
    const connection = getConnectionInfo();
    const sessionId = getOrCreateSessionId();

    const payload: TrackUtmPayload = {
      slug,
      eventType: 'PAGE_VIEW',
      pageLoadTime: getPageLoadTime(),
      ...getUtmParameters(),
      ...getAdClickIds(),
      referralCode: getReferralCode(),
      abVariant: getAbVariant(),
      sessionId,
      connectionType: connection.type || undefined,
      connectionSpeed: connection.speed || undefined,
      viewportWidth: viewport.width,
      viewportHeight: viewport.height,
      screenResolution: viewport.resolution,
      scrollDepth: 0,
      ...options,
    };

    return await trackUtm(payload);
  } catch (error) {
    console.error('❌ Error tracking page view:', error);
    return null;
  }
}

export async function trackButtonClick(
  slug: string,
  buttonId: string,
  options?: Partial<TrackUtmPayload>,
): Promise<TrackUtmResponse | null> {
  try {
    const sessionId = getOrCreateSessionId();
    const scrollDepth = getScrollDepth();
    const timeOnPage = getTimeOnPage();

    const payload: TrackUtmPayload = {
      slug,
      buttonId,
      eventType: 'BUTTON_CLICK',
      timeOnPage,
      scrollDepth,
      sessionId,
      ...getUtmParameters(),
      ...getAdClickIds(),
      ...options,
    };

    return await trackUtm(payload);
  } catch (error) {
    console.error('❌ Error tracking button click:', error);
    return null;
  }
}

export async function trackConversion(
  slug: string,
  conversionType: LinkConversionType,
  options?: Partial<TrackUtmPayload>,
): Promise<TrackUtmResponse | null> {
  try {
    const sessionId = getOrCreateSessionId();
    const timeOnPage = getTimeOnPage();
    const scrollDepth = getScrollDepth();

    const payload: TrackUtmPayload = {
      slug,
      eventType: 'CONVERSION',
      conversionType,
      isConversion: true,
      timeOnPage,
      scrollDepth,
      sessionId,
      ...getUtmParameters(),
      ...getAdClickIds(),
      ...options,
    };

    return await trackUtm(payload);
  } catch (error) {
    console.error('❌ Error tracking conversion:', error);
    return null;
  }
}

export async function trackEvent(
  slug: string,
  eventName: string,
  options?: Partial<TrackUtmPayload>,
): Promise<TrackUtmResponse | null> {
  try {
    const sessionId = getOrCreateSessionId();

    const payload: TrackUtmPayload = {
      slug,
      eventType: 'BUTTON_CLICK',
      eventName,
      sessionId,
      ...getUtmParameters(),
      ...options,
    };

    return await trackUtm(payload);
  } catch (error) {
    console.error(`❌ Error tracking event [${eventName}]:`, error);
    return null;
  }
}

// ============================================
// CORE TRACKING FUNCTION
// ============================================

async function trackUtm(
  payload: TrackUtmPayload,
): Promise<TrackUtmResponse | null> {
  try {
    if (!payload.eventType) {
      console.warn('⚠️ eventType is required');
      return null;
    }

    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null),
    );

    console.log(`📤 Tracking [${payload.eventType}]:`, cleanPayload);

    // ============================================
    // STRATEGY 1: sendBeacon PRIMARY ✅
    // ============================================
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      try {
        console.log(
          `✅ Try sendBeacon [${payload.eventType}]:`,
          cleanPayload.id || 'unknown',
        );
        const blob = new Blob([JSON.stringify(cleanPayload)], {
          type: 'application/json',
        });
        const success = navigator.sendBeacon(TRACK_ENDPOINT, blob);

        if (success) {
          console.log(
            `✅ Tracked via sendBeacon [${payload.eventType}]:`,
            cleanPayload.id || 'unknown',
          );

          return {
            success: true,
            statusCode: 200,
            message: 'Event tracked via sendBeacon',
            data: {
              id: cleanPayload.id || ('unknown' as any),
              clickId: cleanPayload.clickId || ('unknown' as any),
              timestamp: new Date().toISOString(),
            },
          };
        }

        console.log('⚠️ sendBeacon returned false, falling back to fetch');
      } catch (error) {
        console.warn('⚠️ sendBeacon failed:', error);
        // Continue to fetch fallback
      }
    }

    // ============================================
    // STRATEGY 2: fetch + keepalive FALLBACK
    // ============================================
    console.log('📡 Using fetch + keepalive as fallback');

    const response = await fetch(TRACK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanPayload),
      keepalive: true, // ← Keep connection alive
      signal: AbortSignal.timeout(5000), // ← 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TrackUtmResponse = await response.json();

    if (data.data?.skipped) {
      console.log('⏭️ Tracking skipped (duplicate)');
    } else {
      console.log(
        `✅ Tracked via fetch [${payload.eventType}]:`,
        data.data?.id,
      );
    }

    return data;
  } catch (error) {
    console.error('❌ Error sending tracking data:', error);

    return null;
  }
}

// ============================================
// REACT HOOK
// ============================================

export const utm = {
  trackPageView: trackPageView,
  trackButtonClick: trackButtonClick,
  trackConversion: trackConversion,
  trackEvent: trackEvent,
  getSessionId: getOrCreateSessionId,
  clearSession,
};

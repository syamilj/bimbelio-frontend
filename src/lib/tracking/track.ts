'use client';

import { trackServerEvent, type TrackingPlatform } from './server-events';
import { createEventId } from './event-id';
import { normalizeTikTokCustomData } from './normalize-tiktok';

export type UnifiedTrackInput = {
  eventName: string;
  eventId?: string;
  eventSourceUrl?: string;
  platforms?: TrackingPlatform[];
  browser?: boolean;
  server?: boolean;
  user?: {
    email?: string;
    phone?: string;
    userId?: string;
    firstName?: string;
    lastName?: string;
  };
  customData?: Record<string, any>;
};

function trackBrowserMeta(eventName: string, customData: Record<string, any>, eventId: string) {
  if (typeof window === 'undefined') return;
  const fbq = (window as any).fbq;
  if (!fbq) return;

  // For standard events, use `track`.
  // De-dup uses `eventID` in the options object.
  fbq('track', eventName, customData || {}, { eventID: eventId });
}

function trackBrowserTikTok(eventName: string, customData: Record<string, any>, eventId: string) {
  if (typeof window === 'undefined') return;
  const ttq = (window as any).ttq;
  if (!ttq) return;

  // TikTok Pixel supports passing `event_id` for de-dup.
  const tiktokCustomData = normalizeTikTokCustomData(customData || {});
  ttq.track(eventName, { ...tiktokCustomData, event_id: eventId });
}

export function trackUnifiedEvent(input: UnifiedTrackInput) {
  const eventId = input.eventId || createEventId(input.eventName);
  const customData = input.customData || {};
  const platforms = input.platforms || ['meta', 'tiktok'];
  const shouldBrowser = input.browser !== false;
  const shouldServer = input.server !== false;

  if (shouldBrowser) {
    if (platforms.includes('meta')) {
      try {
        trackBrowserMeta(input.eventName, customData, eventId);
      } catch (e) {
        console.warn('Meta Pixel browser tracking failed:', e);
      }
    }

    if (platforms.includes('tiktok')) {
      try {
        trackBrowserTikTok(input.eventName, customData, eventId);
      } catch (e) {
        console.warn('TikTok Pixel browser tracking failed:', e);
      }
    }
  }

  if (shouldServer) {
    trackServerEvent({
      eventName: input.eventName,
      eventId,
      eventSourceUrl: input.eventSourceUrl,
      platforms,
      user: input.user,
      customData,
    }).catch((e) => {
      console.warn('Server tracking failed:', e);
    });
  }

  return { eventId };
}

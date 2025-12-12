import axiosInstanceRaw from '@/lib/axios/axiosInstanceRaw';
import { getAdClickIds } from '@/lib/utm/url';
import { getTrackingCookies } from './cookies';

export type TrackingPlatform = 'meta' | 'tiktok';

export async function trackServerEvent(input: {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
  platforms?: TrackingPlatform[];
  user?: {
    email?: string;
    phone?: string;
    userId?: string;
    firstName?: string;
    lastName?: string;
  };
  customData?: Record<string, any>;
}) {
  const cookieData = getTrackingCookies();
  const clickIds = getAdClickIds();

  const eventSourceUrl =
    input.eventSourceUrl ||
    (typeof window !== 'undefined' ? window.location.href : undefined);

  return axiosInstanceRaw.post('/tracking/event', {
    eventName: input.eventName,
    eventId: input.eventId,
    eventSourceUrl,
    platforms: input.platforms,
    user: input.user,
    cookieData: {
      ...cookieData,
      fbclid: clickIds.fbclid,
      ttclid: clickIds.ttclid,
    },
    customData: input.customData,
  });
}

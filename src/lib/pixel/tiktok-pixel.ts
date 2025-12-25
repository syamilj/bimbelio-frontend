'use client';

import { TiktokPixelCustomDataType, TiktokPixelEventType } from './types';
import { createEventId } from '@/lib/tracking/event-id';
import { trackServerEvent } from '@/lib/tracking/server-events';
import { normalizeTikTokCustomData } from '@/lib/tracking/normalize-tiktok';

let isTikTokPixelInitialized = false;

export const initTikTokPixel = () => {
  // ✅ TikTok Pixel sudah di-load via layout.tsx untuk konsistensi
  // Fungsi ini hanya memastikan pixel sudah ready untuk tracking
  if (typeof window === 'undefined') return;

  // Cek apakah TikTok Pixel sudah tersedia (dari layout.tsx script)
  if ((window as any).ttq) {
    isTikTokPixelInitialized = true;
    console.info('✅ TikTok Pixel sudah tersedia dan ready untuk tracking');
    return;
  }

  // Fallback: jika pixel belum dimuat (seharusnya tidak terjadi)
  console.warn(
    '⚠️ TikTok Pixel belum dimuat - pastikan script di layout.tsx berfungsi',
  );
};

// Semua event yang sudah di-track, untuk menghindari duplikasi
const trackedTikTokEvents: Record<string, boolean> = {};

export const trackTikTokEvent = (
  event: TiktokPixelEventType,
  data?: Partial<Record<TiktokPixelCustomDataType, any>>,
) => {
  if (typeof window === 'undefined' || !(window as any).ttq) return;

  // Untuk ViewContent, kita track dengan identifier yang unik
  // untuk mencegah duplikasi
  if (event === 'ViewContent' && data?.content_id) {
    const eventKey = `ViewContent_${data.content_id}`;

    // Periksa apakah event sudah di-track dengan content_id yang sama
    if (trackedTikTokEvents[eventKey]) {
      console.info(
        `TikTok ViewContent untuk ${data.content_id} sudah di-track sebelumnya`,
      );
      return;
    }

    // Tandai bahwa event sudah di-track untuk content_id ini
    trackedTikTokEvents[eventKey] = true;
  }

  const eventId = createEventId(`tt_${event}`);

  const normalizedData = normalizeTikTokCustomData((data || {}) as Record<string, any>);

  // Track event (with event_id for dedup)
  (window as any).ttq.track(event, { ...normalizedData, event_id: eventId });

  // Server Events API (best-effort)
  trackServerEvent({
    eventName: event,
    eventId,
    platforms: ['tiktok'],
    customData: normalizedData,
  }).catch((e) => {
    console.warn('TikTok server tracking failed:', e);
  });
};

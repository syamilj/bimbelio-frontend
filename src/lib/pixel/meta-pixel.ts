'use client';

import { MetaPixelCustomDataType, MetaPixelEventType } from './types';

let isMetaPixelInitialized = false;

export const initMetaPixel = () => {
  // ✅ Meta Pixel sudah di-load via layout.tsx untuk konsistensi dengan TikTok Pixel
  // Fungsi ini hanya memastikan pixel sudah ready untuk tracking
  if (typeof window === 'undefined') return;

  // Cek apakah Meta Pixel sudah tersedia (dari layout.tsx script)
  if ((window as any).fbq) {
    isMetaPixelInitialized = true;
    console.info('✅ Meta Pixel sudah tersedia dan ready untuk tracking');
    return;
  }

  // Fallback: jika pixel belum dimuat (seharusnya tidak terjadi)
  console.warn(
    '⚠️ Meta Pixel belum dimuat - pastikan script di layout.tsx berfungsi',
  );
};

// Semua event yang sudah di-track, untuk menghindari duplikasi
const trackedMetaEvents: Record<string, boolean> = {};

export const trackMetaEvent = (
  event: MetaPixelEventType,
  data?: Partial<Record<MetaPixelCustomDataType, any>>,
  advancedMatching?: Partial<{
    em: string; // hashed email
    ph: string; // hashed phone
    fn: string; // hashed first name
    ln: string; // hashed last name
    ct: string; // hashed city
    st: string; // hashed state
    zp: string; // hashed zip
    country: string; // hashed country
  }>,
) => {
  if (typeof window === 'undefined' || !(window as any).fbq) {
    console.warn('⚠️ Meta Pixel tidak tersedia untuk tracking event:', event);
    return;
  }

  // Debug log untuk verifikasi pixel detection
  console.info('✅ Meta Pixel detected, tracking event:', event, data);

  // Mencegah duplikasi untuk PageView
  if (event === 'PageView') {
    // PageView event hanya boleh sekali per halaman
    // layout.tsx sudah memanggil fbq('track', 'PageView')
    console.info(
      'Meta PageView sudah di-track di layout.tsx, mencegah duplikasi',
    );
    return;
  }

  // Mencegah duplikasi untuk ViewContent pada konten yang sama
  if (event === 'ViewContent' && data?.content_name) {
    const eventKey = `ViewContent_${data.content_name}`;

    // Periksa apakah event ini sudah di-track sebelumnya
    if (trackedMetaEvents[eventKey]) {
      console.info(
        `Meta ViewContent untuk "${data.content_name}" sudah di-track sebelumnya`,
      );
      return;
    }

    // Tandai event sudah di-track
    trackedMetaEvents[eventKey] = true;
  }

  // Track event
  if (advancedMatching && Object.keys(advancedMatching).length > 0) {
    // Track dengan advanced matching data
    (window as any).fbq('track', event, data || {}, advancedMatching);
  } else {
    // Track normal tanpa advanced matching
    (window as any).fbq('track', event, data || {});
  }
}; // ✅ Helper function untuk hash data user (Advanced Matching)
export const hashUserData = async (value: string): Promise<string> => {
  if (!value) return '';

  // Gunakan Web Crypto API untuk hash SHA256
  const encoder = new TextEncoder();
  const data = encoder.encode(value.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
};

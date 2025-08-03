'use client';

import { MetaPixelCustomDataType, MetaPixelEventType } from './types';

let isMetaPixelInitialized = false;

export const initMetaPixel = () => {
  if (typeof window === 'undefined') return;
  if (isMetaPixelInitialized || (window as any).fbq) return;

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId) return;

  // Inject script
  const script = document.createElement('script');
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  script.async = true;
  script.onload = () => {
    if (!(window as any).fbq) {
      const fbq = function (...args: any[]) {
        (fbq as any).callMethod
          ? (fbq as any).callMethod(...args)
          : (fbq as any).queue.push(args);
      };
      (fbq as any).push = fbq;
      (fbq as any).loaded = true;
      (fbq as any).version = '2.0';
      (fbq as any).queue = [];
      (window as any).fbq = fbq;
    }

    (window as any).fbq('init', pixelId);
    (window as any).fbq('track', 'PageView');
    isMetaPixelInitialized = true;
  };

  document.head.appendChild(script);
};

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
  if (typeof window !== 'undefined' && (window as any).fbq) {
    if (advancedMatching && Object.keys(advancedMatching).length > 0) {
      // Track dengan advanced matching data
      (window as any).fbq('track', event, data || {}, advancedMatching);
    } else {
      // Track normal tanpa advanced matching
      (window as any).fbq('track', event, data || {});
    }
  }
};

// ✅ Helper function untuk hash data user (Advanced Matching)
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

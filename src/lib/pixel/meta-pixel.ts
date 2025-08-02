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
) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', event, data || {});
  }
};

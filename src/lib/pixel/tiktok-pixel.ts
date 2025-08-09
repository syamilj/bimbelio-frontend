'use client';

import { TiktokPixelCustomDataType, TiktokPixelEventType } from './types';

let isTikTokPixelInitialized = false;

export const initTikTokPixel = () => {
  if (typeof window === 'undefined') return;
  if (isTikTokPixelInitialized || (window as any).ttq) return;

  const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  if (!pixelId) return;

  const ttq = ((window as any).ttq = (window as any).ttq || []);
  if (!ttq.initialize) {
    if (ttq.invoked) return;
    ttq.invoked = true;
    ttq.methods = [
      'page',
      'track',
      'identify',
      'instances',
      'debug',
      'on',
      'off',
      'once',
      'ready',
      'alias',
      'group',
      'enableCookie',
    ];

    ttq.setAndDefer = function (tt: any, method: string) {
      tt[method] = function (...args: any[]) {
        tt.push([method, ...args]);
      };
    };

    for (const method of ttq.methods) {
      ttq.setAndDefer(ttq, method);
    }

    ttq.instance = function (id: string) {
      const inst = ttq._i?.[id] || [];
      for (const method of ttq.methods) {
        ttq.setAndDefer(inst, method);
      }
      return inst;
    };

    ttq.load = function (id: string) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript?.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }
      ttq._i = ttq._i || {};
      ttq._i[id] = [];
      ttq._i[id]._u = 'https://analytics.tiktok.com/i18n/pixel';
      ttq._t = ttq._t || {};
      ttq._t[id] = +new Date();
      ttq.instance(id);
    };

    ttq.load(pixelId);
    ttq.page();
    isTikTokPixelInitialized = true;
  }
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
      console.info(`TikTok ViewContent untuk ${data.content_id} sudah di-track sebelumnya`);
      return;
    }
    
    // Tandai bahwa event sudah di-track untuk content_id ini
    trackedTikTokEvents[eventKey] = true;
  }
  
  // Track event
  (window as any).ttq.track(event, data || {});
};

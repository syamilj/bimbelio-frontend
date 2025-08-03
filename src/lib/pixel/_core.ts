import { hashUserData, initMetaPixel, trackMetaEvent } from './meta-pixel';
import { initTikTokPixel, trackTikTokEvent } from './tiktok-pixel';

export const pixel = {
  meta: {
    init: initMetaPixel,
    track: trackMetaEvent,
    hashUserData, // ✅ Export helper untuk advanced matching
  },
  tiktok: {
    init: initTikTokPixel,
    track: trackTikTokEvent,
  },
};

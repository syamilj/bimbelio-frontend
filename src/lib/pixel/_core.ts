import { initMetaPixel, trackMetaEvent } from './meta-pixel';
import { initTikTokPixel, trackTikTokEvent } from './tiktok-pixel';

export const pixel = {
  meta: {
    init: initMetaPixel,
    track: trackMetaEvent,
  },
  tiktok: {
    init: initTikTokPixel,
    track: trackTikTokEvent,
  },
};

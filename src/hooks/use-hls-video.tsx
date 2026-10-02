import { getAuthToken } from '@/lib/auth-helper';
import HLS from 'hls.js';
import { useEffect, useRef } from 'react';

export const useVideoHLS = (videoUrl: string) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Bucket video bersifat privat: setiap request playlist/segmen membawa token sesi.
    const token = getAuthToken();

    if (HLS.isSupported()) {
      const hls = new HLS({
        xhrSetup: (xhr) => {
          // Mode httpOnly: cookie sesi; mode lama: header Bearer.
          xhr.withCredentials = true;
          if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        },
      });

      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(HLS.Events.MANIFEST_PARSED, () => {
        console.log('Manifest loaded, starting playback');
        video.play().catch((err) => console.error('Play error:', err));
      });

      hls.on(HLS.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
      });

      hls.on(HLS.Events.FRAG_LOADED, (event, data) => {
        console.log('Fragment loaded:', data.frag);
      });

      return () => {
        hls.destroy();
      };
    }
  }, [videoUrl]);

  return {
    videoRef,
  };
  //   return (
  //     <div className="w-full h-screen bg-black flex items-center justify-center">
  //       <video
  //         ref={videoRef}
  //         controls
  //         controlsList="nodownload"
  //         className="w-full h-full max-w-4xl"
  //         style={{ maxHeight: "80vh" }}
  //         onContextMenu={(e) => e.preventDefault()}
  //       />
  //     </div>
  //   );
};

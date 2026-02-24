/**
 * Notification sound singleton.
 * Pre-loads the sound once and exposes a play() method.
 * Safe to call on the server (no-op when window is undefined).
 */

class NotificationSound {
  private audio: HTMLAudioElement | null = null;
  private loaded = false;

  private init() {
    if (typeof window === 'undefined' || this.loaded) return;
    try {
      this.audio = new Audio('/sounds/notification.mp3');
      this.audio.volume = 0.5;
      this.audio.load();
      this.loaded = true;
    } catch {
      // ignore — audio may not be available in all environments
    }
  }

  play() {
    this.init();
    if (!this.audio) return;
    // Reset to beginning so rapid notifications always play
    this.audio.currentTime = 0;
    this.audio.play().catch(() => {
      // Autoplay policy may block first play — user gesture required
    });
  }

  setVolume(volume: number) {
    this.init();
    if (this.audio) this.audio.volume = Math.min(1, Math.max(0, volume));
  }
}

export const notificationSound = new NotificationSound();

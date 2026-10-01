// Skrip pihak ketiga (fbq, ttq, gtag, snap, google) dipasang di window.
declare global {
  interface Window {
    [key: string]: any;
  }
}

export {};

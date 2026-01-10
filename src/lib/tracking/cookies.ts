export function getCookieValue(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;

  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(rest.join('='));
    }
  }
  return undefined;
}

export function getTrackingCookies() {
  return {
    fbp: getCookieValue('_fbp'),
    fbc: getCookieValue('_fbc'),
    ttp: getCookieValue('_ttp'),
  };
}

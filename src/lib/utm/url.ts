// ============================================
// URL PARAMETER EXTRACTION
// ============================================

export function getUtmParameters(): Partial<{
  utmSource: string | undefined;
  utmMedium: string | undefined;
  utmCampaign: string | undefined;
  utmContent: string | undefined;
  utmTerm: string | undefined;
}> {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);

  const data = {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    utmContent: params.get('utm_content') || undefined,
    utmTerm: params.get('utm_term') || undefined,
  };

  return data;
}

export function getAdClickIds(): Partial<{
  gclid: string | undefined;
  fbclid: string | undefined;
  ttclid: string | undefined;
  msclkid: string | undefined;
}> {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);

  const data = {
    gclid: params.get('gclid') || undefined,
    fbclid: params.get('fbclid') || undefined,
    ttclid: params.get('ttclid') || undefined,
    msclkid: params.get('msclkid') || undefined,
  };
  return data;
}

export function getReferralCode(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  const params = new URLSearchParams(window.location.search);
  return params.get('ref') || params.get('referral') || undefined;
}

export function getAbVariant(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  const params = new URLSearchParams(window.location.search);
  return (
    params.get('ab_variant') || localStorage.getItem('ab_variant') || undefined
  );
}

export function getLinkPageSlug(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const pathSegments = window.location.pathname.split('/').filter(Boolean); // Hapus empty strings

  return pathSegments.length > 0
    ? pathSegments[pathSegments.length - 1]
    : 'homepage';
}

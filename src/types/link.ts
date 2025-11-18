export interface LinkShortUrl {
  id: string;
  code: string;
  clickCount: number;
}

export type LinkBackgroundType = "GRADIENT" | "COLOR" | "IMAGE" | "VIDEO";

export interface LinkButton {
  id: string;
  linkPageId: string;
  title: string;
  subtitle?: string | null;
  sectionLabel?: string | null;
  url: string;
  icon?: string | null;
  iconType?: string | null;
  type: string;
  color?: string | null;
  textColor?: string | null;
  borderRadius?: string | null;
  thumbnail?: string | null;
  price?: string | null;
  isActive: boolean;
  order: number;
  scheduleStart?: string | null;
  scheduleEnd?: string | null;
  allowedCountries?: string[] | null;
  blockedCountries?: string[] | null;
  showOnMobile: boolean;
  showOnDesktop: boolean;
  abVariant?: string | null;
  clickCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LinkPageDetail {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  profileImage?: string | null;
  backgroundType?: LinkBackgroundType;
  backgroundColor?: string | null;
  backgroundImage?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  socialLinks?: Record<string, string> | null;
  isActive: boolean;
  isPublic: boolean;
  password?: string | null;
  expireAt?: string | null;
  scheduleStart?: string | null;
  scheduleEnd?: string | null;
  isABTest?: boolean;
  abTestConfig?: {
    variants: string[];
  } | null;
  enableReferralTracking?: boolean;
  referralCookieDays?: number | null;
  metaPixelId?: string | null;
  tiktokPixelCode?: string | null;
  enableMetaCAPI?: boolean;
  enableTikTokEvents?: boolean;
  totalViews?: number;
  totalClicks?: number;
  totalUniqueIps?: number;
  conversionCount?: number;
  buttonCount?: number;
  shortUrls: LinkShortUrl[];
  buttons: LinkButton[];
  analyticsCount?: number;
  conversionCountReal?: number;
  sharingWebsiteSubCategoryIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LinkAnalyticsOverview {
  totalViews: number;
  totalClicks: number;
  totalUniqueIps: number;
  conversionCount: number;
}

export interface LinkAnalyticsConversion {
  id: string;
  conversionType: string;
  value?: number | null;
  currency?: string | null;
  referralCode?: string | null;
  createdAt: string;
}

export interface LinkAnalyticsRecentActivityItem {
  id: string;
  eventType: string;
  country?: string | null;
  city?: string | null;
  deviceType?: string | null;
  browser?: string | null;
  referrerSource?: string | null;
  referralCode?: string | null;
  createdAt: string;
}

export interface LinkAnalyticsResponse {
  linkPage: {
    id: string;
    slug: string;
    title: string;
  };
  dateRange: {
    startDate: string;
    endDate: string;
  };
  overview: LinkAnalyticsOverview;
  eventBreakdown: Array<{
    eventType: string;
    _count: {
      id: number;
    };
  }>;
  topReferrers: Array<{ domain: string; source: string; count: number }>;
  topCountries: Array<{ country: string; code: string; count: number }>;
  deviceBreakdown: Array<{ device: string; count: number }>;
  browserBreakdown: Array<{ browser: string; count: number }>;
  osBreakdown: Array<{ os: string; count: number }>;
  viewsByDay: Array<{ date: string; count: number }>;
  buttonPerformance: Array<{ id: string; title: string; clicks: number }>;
  conversions: LinkAnalyticsConversion[];
  topReferralCodes: Array<{ code: string | null; count: number }>;
  recentActivity: LinkAnalyticsRecentActivityItem[];
}

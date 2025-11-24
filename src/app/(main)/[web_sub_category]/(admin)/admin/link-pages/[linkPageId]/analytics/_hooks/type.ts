import { LinkConversionType } from '@/types/database';
import { LinkPageDetail } from '@/types/link';

export type OverviewMetricsType = {
  linkPage: LinkPageDetail;
  totalEvents: number;
  pageViews: number;
  buttonClicks: number;
  conversions: number;
  conversionRate: number;
  avgPageLoadTime: number;
  avgTimeOnPage: number;
  avgScrollDepth: number;
  bounceRate: number;
  uniqueVisitors: number;
  uniqueSessions: number;
  uniqueEmails: number;
  totalRevenue: number;
  avgOrderValue: number;
  eventsByUtmSource: {
    name: string;
    value: number;
  }[];
  conversionsByUtmSource: {
    name: string;
    value: number;
  }[];
  revenueByUtmSource: {
    name: string;
    value: number;
  }[];
  eventsByDevice: {
    name: string;
    value: number;
  }[];
  conversionsByDevice: {
    name: string;
    value: number;
  }[];
  eventsByCountry: {
    name: string;
    code: string;
    value: number;
  }[];
  conversionsByCountry: {
    name: string;
    code: string;
    value: number;
  }[];
  eventsByBrowser: {
    name: string;
    value: number;
  }[];
  eventsByOs: {
    name: string;
    value: number;
  }[];
  hourlyHeatmap: {
    hour: number;
    pageViews: number;
    clicks: number;
    conversions: number;
  }[];
  weeklyPattern: {
    day: number;
    dayName: string;
    pageViews: number;
    clicks: number;
    conversions: number;
  }[];
  deviceBreakdown: {
    device: string;
    count: number;
  }[];
  browserBreakdown: {
    browser: string;
    count: number;
  }[];
  osBreakdown: {
    os: string;
    count: number;
  }[];
  viewsByDay: {
    date: string;
    count: number;
  }[];
  buttonPerformance: {
    id: string;
    title: string;
    clicks: number;
  }[];
};

export type EventDataType = {
  id: string;
  linkPageId: string | null;
  buttonId: string | null;
  eventType: string;
  userId: string | null;
  email: string | null;
  phone: string | null;
  ipAddress: string | null;
  ipHash: string | null;
  userAgent: string | null;
  referer: string | null;
  hourOfDay: number | null;
  dayOfWeek: number | null;
  pageLoadTime: number | null;
  timeOnPage: number | null;
  scrollDepth: number | null;
  engagementScore: number | null;
  referrerDomain: string | null;
  referrerSource: string | null;
  gclid: string | null;
  fbclid: string | null;
  ttclid: string | null;
  msclkid: string | null;
  connectionType: string | null;
  connectionSpeed: number;
  eventData: string | null;
  eventName: string | null;
  country: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  device: string | null;
  deviceType: string | null;
  deviceVendor: string | null;
  deviceModel: string | null;
  os: string | null;
  osVersion: string | null;
  browser: string | null;
  browserVersion: string | null;
  screenResolution: string | null;
  viewportWidth: number | null;
  viewportHeight: number | null;
  isConversion: boolean;
  conversionType: LinkConversionType;
  conversionValue: number | null;
  conversionCurrency: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  referralCode: string | null;
  clickId: string | null;
  abVariant: string | null;
  sessionId: string | null;
  createdAt: string;
};

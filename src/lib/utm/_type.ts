// ============================================
// TYPES
// ============================================

import { LinkConversionType } from '@/types/database';

export type TrackUtmPayload = {
  // Source
  slug?: string;
  buttonId?: string;

  // Event
  eventType: 'PAGE_VIEW' | 'BUTTON_CLICK' | 'CONVERSION';
  eventName?: string;

  // UTM Parameters
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  // User Info
  userId?: string;
  email?: string;
  phone?: string;

  // Performance
  pageLoadTime?: number;
  timeOnPage?: number;
  scrollDepth?: number;
  engagementScore?: number;

  // Ad Click IDs
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;

  // Custom Data
  eventData?: Record<string, any>;

  // Conversion (optional)
  isConversion?: boolean;
  conversionType?: LinkConversionType;
  conversionValue?: number;
  conversionCurrency?: string;

  // Connection/Network info
  connectionType?: string;
  connectionSpeed?: number;

  // Device (Enhanced)
  screenResolution?: string; // e.g., "1920x1080"
  viewportWidth?: number;
  viewportHeight?: number;

  // Referral
  referralCode?: string;

  // A/B Testing
  abVariant?: string;

  // Session
  sessionId?: string;
};

export type TrackUtmResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    id: string;
    clickId: string;
    timestamp: string;
    skipped?: boolean;
  };
};

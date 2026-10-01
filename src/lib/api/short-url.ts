import axiosInstanceWithToken from '@/lib/axios/axiosInstanceWithToken';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface ShortUrl {
  id: string;
  code: string;
  destinationType: 'DIRECT' | 'LINK_PAGE' | 'SMART_REDIRECT';
  destinationUrl?: string;
  linkPageId?: string;
  title?: string;
  description?: string;
  isActive: boolean;
  expireAt?: string;
  password?: string;
  maxClicks?: number;
  clickCount: number;
  totalClicks: number;
  totalUniqueIps: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  website_sub_category_id?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  LinkPage?: {
    id: string;
    slug: string;
    title: string;
  };
}

export interface ShortUrlAnalytics {
  summary: {
    totalClicks: number;
    uniqueVisitors: number;
    averageClicksPerDay: string;
  };
  geographic: {
    countries: Array<{
      country: string | null;
      _count: number;
    }>;
  };
  technology: {
    devices: Array<{
      device: string | null;
      _count: number;
    }>;
    browsers: Array<{
      browser: string | null;
      _count: number;
    }>;
    operatingSystems: Array<{
      os: string | null;
      _count: number;
    }>;
  };
  traffic: {
    referrers: Array<{
      referer: string | null;
      _count: number;
    }>;
  };
  recentClicks: Array<{
    createdAt: string;
    device?: string | null;
    country?: string | null;
  }>;
}

// ============================================
// API FUNCTIONS
// ============================================

export interface CreateShortUrlPayload {
  code?: string;
  destinationType: 'DIRECT' | 'LINK_PAGE' | 'SMART_REDIRECT';
  destinationUrl?: string;
  linkPageId?: string;
  title?: string;
  description?: string;
  expireAt?: string;
  maxClicks?: number;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  website_sub_category_id?: string;
}

export interface UpdateShortUrlPayload {
  id: string;
  code?: string;
  destinationType?: 'DIRECT' | 'LINK_PAGE' | 'SMART_REDIRECT';
  // null = kosongkan field.
  title?: string | null;
  description?: string | null;
  destinationUrl?: string | null;
  linkPageId?: string | null;
  isActive?: boolean;
  expireAt?: string | null;
  maxClicks?: number | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
}

export const fetchAllShortUrls = async (params?: {
  website_sub_category_id?: string;
  id?: string;
  page?: number;
  take?: number;
  search?: string;
}) => {
  const response = await axiosInstanceWithToken.get(
    '/l/admin/getAllShortUrls',
    {
      params,
    },
  );
  return response.data;
};

export const createShortUrl = async (payload: CreateShortUrlPayload) => {
  const response = await axiosInstanceWithToken.post(
    '/l/admin/createShortUrl',
    payload,
  );
  return response.data.data as ShortUrl;
};

export const updateShortUrl = async (payload: UpdateShortUrlPayload) => {
  const response = await axiosInstanceWithToken.put(
    '/l/admin/updateShortUrl',
    payload,
  );
  return response.data.data as ShortUrl;
};

export const deleteShortUrl = async (id: string) => {
  const response = await axiosInstanceWithToken.delete(
    '/l/admin/deleteShortUrl',
    {
      params: { id },
    },
  );
  return response.data;
};

export const fetchShortUrlAnalytics = async (
  shortUrlId: string,
  params?: { startDate?: string; endDate?: string },
) => {
  const response = await axiosInstanceWithToken.get('/l/admin/getAnalytics', {
    params: { shortUrlId, ...params },
  });
  return response.data.data as ShortUrlAnalytics;
};

export const generateQrCode = async (shortUrlId: string, size?: number) => {
  const response = await axiosInstanceWithToken.post(
    '/l/admin/generateQrCode',
    {
      shortUrlId,
      size: size || 300,
    },
  );
  return response.data.data as { qrCodeUrl: string; qrCodeDataUrl: string };
};

export const exportShortUrlAnalytics = async (shortUrlId: string) => {
  const response = await axiosInstanceWithToken.get(
    '/l/admin/exportAnalytics',
    {
      params: { shortUrlId },
      responseType: 'blob',
    },
  );
  return response.data;
};

// Public function (no auth) - for tracking
export const trackShortUrlClick = async (code: string) => {
  const response = await axiosInstanceWithToken.post('/l/track/click', {
    code,
  });
  return response.data;
};

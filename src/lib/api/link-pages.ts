import axiosInstanceRaw from '@/lib/axios/axiosInstanceRaw';
import axiosInstanceWithToken from '@/lib/axios/axiosInstanceWithToken';
import { LinkButton, LinkPageDetail } from '@/types/link';

// ============================================
// LINK PAGE CRUD
// ============================================

export interface CreateLinkPagePayload {
  slug?: string;
  title: string;
  description?: string;
  profileImage?: string;
  backgroundType?: 'GRADIENT' | 'COLOR' | 'IMAGE' | 'VIDEO';
  backgroundColor?: string;
  backgroundImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
    whatsapp?: string;
  };
  isActive?: boolean;
  isPublic?: boolean;
  password?: string;
  expireAt?: string;
  scheduleStart?: string;
  scheduleEnd?: string;
  enableReferralTracking?: boolean;
  referralCookieDays?: number;
  metaPixelId?: string;
  tiktokPixelCode?: string;
  enableMetaCAPI?: boolean;
  enableTikTokEvents?: boolean;
  website_sub_category_id?: string;
}

export interface UpdateLinkPagePayload extends Partial<CreateLinkPagePayload> {
  id?: string;
}

export const fetchAllLinkPages = async (params?: {
  website_sub_category_id?: string;
  page?: number;
  take?: number;
  search?: string;
  isActive?: boolean;
}) => {
  const response = await axiosInstanceWithToken.get('/link/admin/pages', {
    params,
  });
  return response.data;
};

export const fetchLinkPage = async (linkPageId: string) => {
  const response = await axiosInstanceWithToken.get(
    `/link/admin/page/${linkPageId}`,
  );
  return response.data.data as LinkPageDetail;
};

export const createLinkPage = async (payload: CreateLinkPagePayload) => {
  const response = await axiosInstanceWithToken.post(
    '/link/admin/createLinkPage',
    payload,
  );
  return response.data.data as LinkPageDetail;
};

export const updateLinkPage = async (
  linkPageId: string,
  payload: UpdateLinkPagePayload,
) => {
  const response = await axiosInstanceWithToken.put(
    `/link/admin/page/${linkPageId}`,
    payload,
  );
  return response.data.data as LinkPageDetail;
};

export const deleteLinkPage = async (linkPageId: string) => {
  return axiosInstanceWithToken.delete(`/link/admin/page/${linkPageId}`);
};

export interface CreateLinkButtonPayload {
  linkPageId: string;
  title: string;
  subtitle?: string;
  sectionLabel?: string;
  url: string;
  icon?: string;
  iconType?: string;
  type?: string;
  color?: string;
  textColor?: string;
  borderRadius?: string;
  order?: number;
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
  allowedCountries?: string[];
  isActive?: boolean;
}

export const createLinkButton = async (payload: CreateLinkButtonPayload) => {
  const response = await axiosInstanceWithToken.post(
    '/link/admin/createButton',
    payload,
  );
  return response.data.data as LinkButton;
};

export type UpdateLinkButtonPayload = Partial<
  Omit<
    LinkButton,
    'id' | 'linkPageId' | 'clickCount' | 'createdAt' | 'updatedAt'
  >
>;

export const updateLinkButton = async (
  buttonId: string,
  payload: UpdateLinkButtonPayload,
) => {
  const response = await axiosInstanceWithToken.put(
    `/link/admin/button/${buttonId}`,
    payload,
  );
  return response.data.data as LinkButton;
};

export const deleteLinkButton = async (buttonId: string) => {
  return axiosInstanceWithToken.delete(`/link/admin/button/${buttonId}`);
};

export const reorderLinkButtons = async (
  linkPageId: string,
  buttonOrders: Array<{ id: string; order: number }>,
) => {
  return axiosInstanceWithToken.post('/link/admin/reorderButtons', {
    linkPageId,
    buttonOrders,
  });
};

export const trackTestConversion = async (linkPageId: string) => {
  return axiosInstanceWithToken.post('/link/track/conversion', {
    linkPageId,
    conversionType: 'CUSTOM',
    value: 0,
    currency: 'IDR',
    metadata: {
      test: true,
    },
  });
};

// ============================================
// PUBLIC FUNCTIONS (No Auth Required)
// ============================================

export const viewLinkPage = async (slug: string, password?: string) => {
  const response = await axiosInstanceRaw.get(`/link/${slug}`, {
    params: password ? { password } : undefined,
  });
  return response.data.data;
};

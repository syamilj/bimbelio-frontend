// === LIVE CLASS UTILITIES ===

import {
  Category,
  Instructor,
  LiveClass,
  LiveClassReference,
} from '@/types/database';

/**
 * Format date and time untuk display
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format duration dalam menit ke string readable
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours} jam ${mins > 0 ? `${mins} menit` : ''}`.trim();
  }
  return `${mins} menit`;
};

/**
 * Get badge color berdasarkan status live class
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Akan Datang':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'Sedang Berlangsung':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'Selesai':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

/**
 * Get badge color berdasarkan participant status
 */
export const getParticipantStatusColor = (
  status: string | undefined,
): string => {
  switch (status) {
    case 'REGISTERED':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    case 'INVITED':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'EXPIRED':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

/**
 * Get text berdasarkan participant status
 */
export const getParticipantStatusText = (
  status: string | undefined,
): string => {
  switch (status) {
    case 'Terdaftar':
      return 'Terdaftar';
    case 'Diundang':
      return 'Diundang';
    case 'EXPIRED':
      return 'Kedaluwarsa';
    case null:
    case undefined:
      return 'Belum Terdaftar';
    default:
      return 'Belum Terdaftar';
  }
};

/**
 * Get description berdasarkan participant status
 */
export const getParticipantStatusDescription = (
  status: string | undefined,
): string => {
  switch (status) {
    case 'REGISTERED':
      return 'Menunggu undangan dari admin';
    case 'INVITED':
      return 'Siap bergabung kelas';
    case 'EXPIRED':
      return 'Undangan sudah kedaluwarsa';
    default:
      return '';
  }
};

/**
 * Get unique subject list dari array live classes
 */
export const getSubjectList = (liveClasses: any[]): string[] => {
  const subjects = liveClasses.map((lc) => lc.Category?.name).filter(Boolean);
  return [...new Set(subjects)];
};

// === RATING UTILITIES ===

/**
 * Get star rating display text
 */
export const getRatingText = (rating: number): string => {
  switch (rating) {
    case 1:
      return 'Sangat Buruk';
    case 2:
      return 'Buruk';
    case 3:
      return 'Cukup';
    case 4:
      return 'Baik';
    case 5:
      return 'Sangat Baik';
    default:
      return '';
  }
};

/**
 * Format average rating untuk display
 */
export const formatAverageRating = (average: number): string => {
  return average.toFixed(1);
};

/**
 * Get rating distribution percentage
 */
export const getRatingPercentage = (count: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
};

/**
 * Validate rating value (1-5)
 */
export const isValidRating = (rating: number): boolean => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

/**
 * Check if user can submit rating (only for finished classes and invited participants)
 */
export const canSubmitRating = (
  liveClassStatus: string,
  participantStatus: string | undefined,
): boolean => {
  return liveClassStatus === 'Selesai' && participantStatus === 'INVITED';
};

/**
 * Get star array for rating display
 */
export const getStarArray = (rating: number): boolean[] => {
  return Array.from({ length: 5 }, (_, index) => index < rating);
};

// === LIVE CLASS SYSTEM ===

export type LiveClassMaterial = {
  id: string;
  liveClassId: string;
  category: string;
  subCategory: string;
  title: string;
  content: string;
  fileUrl?: string;
  order: number;
  website_sub_category_id: string;
};

export type LiveClassAgenda = {
  id: string;
  liveClassId: string;
  title: string;
  description: string;
  duration: number; // in minutes
  order: number;
  website_sub_category_id: string;
};

// export type LiveClassReference = {
//   id: string;
//   liveClassId: string;
//   title: string;
//   type: ReferenceTypeEnum;
//   url?: string;
//   chapterId?: string; // reference to CourseChapter
//   subChapterId?: string; // reference to CourseSubChapter
//   order: number;
//   website_sub_category_id: string;
// };

export type ReferenceTypeEnum = 'URL' | 'CHAPTER' | 'DOCUMENT' | 'VIDEO';

export type LiveClassRecording = {
  id: string;
  liveClassId: string;
  title: string;
  url: string;
  duration: number;
  uploadedAt: Date;
  isPublic: boolean;
  website_sub_category_id: string;
};

export type LiveClassParticipant = {
  id: string;
  liveClassId: string;
  userId: string;
  joinedAt?: Date;
  leftAt?: Date;
  isPresent: boolean;
  programPurchaseId: string; // link to program purchase
  website_sub_category_id: string;
  status?: 'REGISTERED' | 'INVITED' | 'EXPIRED';
  registeredAt?: Date;
  invitedAt?: Date;
};

// === LIVE CLASS RATING SYSTEM ===
export type LiveClassRating = {
  id: string;
  liveClassId: string;
  userId: string;
  rating: number; // 1-5 stars
  review?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Response types untuk rating APIs
export type LiveClassRatingResponse = {
  liveClassId: string;
  totalRatings: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  userRating?: {
    rating: number;
    review?: string;
    createdAt: Date;
    updatedAt: Date;
  };
  ratings: {
    id: string;
    rating: number;
    review?: string;
    createdAt: Date;
    user: {
      name: string;
      image?: string;
    };
  }[];
};

export type SubmitRatingRequest = {
  rating: number;
  review?: string;
};

// === EXTENDED TYPES FOR UI ===

// LiveClass dengan semua relasi untuk UI
export type LiveClassWithDetails = LiveClass & {
  status: string; // computed status
  canJoin: boolean; // computed field
  participantStatus?: 'REGISTERED' | 'INVITED' | 'EXPIRED';
  registeredAt?: Date;
  invitedAt?: Date;
  Category: Category;
  Instructor: Instructor;
  LiveClassAgenda: LiveClassAgenda[];
  LiveClassReference: LiveClassReference[];
  LiveClassParticipant?: LiveClassParticipant[];
  // Rating information - optional for performance
  ratingStats?: {
    averageRating: number;
    totalRatings: number;
    userRating?: LiveClassRating;
  };
};

// User's live class response structure
export type UserLiveClassResponse = {
  all: LiveClassWithDetails[];
  registered: LiveClassWithDetails[];
  invited: LiveClassWithDetails[];
  expired: LiveClassWithDetails[];
};

// LiveClass dengan access control details untuk multi-plan system
export type LiveClassWithAccessDetails = LiveClassWithDetails & {
  userAccess: {
    canView: boolean;
    canRegister: boolean;
    hasAnyRequiredPlan: boolean;
    requiredPlans: string[];
    availableUpgradePlans: string[];
    userPlans: string[];
  };
  needsUpgrade: boolean;
  canRegister: boolean; // for UI consistency dengan existing components
  requiredPlans: string[]; // for easy access in UI
};

// Response type untuk getAllAvailable API (multi-plan support)
export type AllLiveClassResponse = {
  accessible: LiveClassWithAccessDetails[];
  needsUpgrade: LiveClassWithAccessDetails[];
  registered: LiveClassWithAccessDetails[];
  upcoming: LiveClassWithAccessDetails[];
  ongoing: LiveClassWithAccessDetails[];
  available: LiveClassWithAccessDetails[];
  all: LiveClassWithAccessDetails[];
  meta: {
    total: number;
    accessibleCount: number;
    needsUpgradeCount: number;
    registeredCount: number;
    availableForRegistration: number;
    currentUserPlan: {
      planName: string;
      planCategory: string;
    };
  };
};

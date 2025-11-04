export type Pivot_TryoutQuestion_CourseChapter = {
  id: string;
  createAt: Date;
  updateAt: Date;
  tryoutQuestionId: string;
  courseChapterId: string;
};

export type Pivot_Plan_Category = {
  id: string;
  planFeatureId: string;
  categoryId: string;
};

export type PlanBenefit = {
  id: string;
  title: string;
  description: string;
  order: number;
  planId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LiveClassReference = {
  id: string;
  description: string;
  type: LiveClassReferenceTypeEnum;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  subChapterId: string | null;
  url: string | null;
  urlType: LiveClassReferenceUrlTypeEnum;
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

export type LiveClassReferenceUrlTypeEnum =
  | 'VIDEO'
  | 'AUDIO'
  | 'WEBSITE'
  | 'DOCUMENT'
  | 'ARTICLE';
export type LiveClassReferenceTypeEnum = 'URL' | 'COURSE';

export type LiveClass = {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  categoryId: string;
  image: string | null;
  startDate: string;
  endDate: string;
  link: string;
  instructorId: string;
  duration: number;
  maxParticipant: number | null;
  isRecord: boolean;
  type: LiveClassTypeEnum;
  websiteSubCategoryId: string;
};
export type LiveClassTypeEnum = 'LIVECLASS' | 'LIVESTREAM' | 'WEBINAR';

export type LiveClassInvited = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  liveClassId: string;
  userId: string;
};

export type LiveClassRating = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  score: number;
  comment: string | null;
  userId: string | null;
  liveClassId: string;
};

export type Instructor = {
  name: string;
  id: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
  image: string | null;
  email: string;
  phone: string;
  lastEducation: string;
  certificate: string | null;
};

export type InstructorCertificate = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  instructorId: string;
  title: string;
};

export type Pivot_LiveClass_Plan = {
  id: string;
  planId: string;
  liveClassId: string;
};

export type Prediction = {
  id: string;
  userId: string;
  tryoutId: string | null;
  university: string;
  study: string;
  fakultas: string;
  websiteSubCategoryId: string;
};

export type PredictionScore = {
  id: string;
  type: PredictionScoreTypeEnum;
  finalScore: number;
  predictionId: string;
};

export type PredictionScoreDetail = {
  id: string;
  category: string;
  subCategory: string;
  true: number | null;
  false: number | null;
  empty: number | null;
  totalQuestions: number | null;
  score: number;
  predictionScoreId: string;
};

export type PredictionScoreTypeEnum = 'UTBK' | 'SIMAK_UI';

export type CourseChapter = {
  number: number;
  id: string;
  website_sub_category_id: string;
  categoryId: string;
  title: string;
  status: CourseStatusEnum;
};

export type CourseStatusEnum = 'PRIVATE' | 'PUBLIC';

export type CourseSubChapter = {
  number: number;
  id: string;
  website_sub_category_id: string;
  title: string;
  document: string | null;
  description: string;
  premium: boolean;
  video: string | null;
  courseChapterId: string;
  spendTime: number;
  type: TypeCourseEnum;
  tryoutSessionId: string | null;
  materi: string | null;
  status: 'DRAFT' | 'PUBLISH' | 'UPCOMING';
  publishedAt: string | null;
};

export type CourseProgress = {
  userId: string;
  id: string;
  createdAt: Date;
  website_sub_category_id: string;
  courseSubChapterId: string;
  totalScore: number | null;
};

export type TryoutSessionResult = {
  id: string;
  website_sub_category_id: string;
  categoryId: string;
  totalScore: number;
  tryoutResultId: string;
  sessionId: string;
  startSession: Date;
  endSession: Date;
  theta: number | null;
};

export type TypeCourseEnum = 'VIDEO' | 'DOCUMENT' | 'TRYOUT' | 'MATERI';

export type BlogPost = {
  website_sub_category_id: string;
  id: string;
  slug: string;
  title: string;
  description: string;
  value: string;
  thumbnail: string;
  createdAt: Date;
  publishedAt: Date | null;
  status: BlogStatusEnum;
  tags: string[];
  updatedAt: Date;
  views: number;
  isEditorPick: boolean | null;
};

export type BlogStatusEnum = 'DRAFT' | 'SCHEDULED' | 'PUBLISH';

export type BlogTags = {
  website_sub_category_id: string;
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  website_sub_category_id: string;
  id: string;
  name: string;
  nomor: number;
  to: boolean;
  visibleAtWebSubIds: string[];
};

export type Subcategory = {
  website_sub_category_id: string;
  id: string;
  name: string;
  categoryId: string;
  visibleAtWebSubIds: string[];
};

export type Highlight = {
  userId: string;
  id: string;
  createdAt: Date;
  website_sub_category_id: string;
  documentId: string;
  pageNumber: number | null;
  type: HighlightTypeEnum;
  noteId: string | null;
};

export type HighlightTypeEnum = 'TEXT' | 'IMAGE';

export type Cordinate = {
  id: string;
  website_sub_category_id: string;
  pageNumber: number | null;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  markerId: string | null;
  highlightedRectangleId: string | null;
  highlightedBoundingRectangleId: string | null;
};

export type Message = {
  userId: string | null;
  id: string;
  createdAt: Date;
  website_sub_category_id: string;
  documentId: string | null;
  text: string;
  courseCategoryId: string | null;
  isUserMessage: boolean;
  dislike: boolean;
  like: boolean;
};

export type Tryout = {
  // status: TryoutStatusEnum;
  // id: string;
  // title: string;
  // image: string | null;
  // createAt: Date;
  // updateAt: Date;
  // restTime: number;
  // startDate: Date;
  // endDate: Date;
  // resultDate: Date;
  // website_sub_category_id: string;
  website_sub_category_id: string;
  id: string;
  title: string;
  restTime: number;
  status: TryoutStatusEnum;
  startDate: string;
  endDate: string;
  resultDate: string;
  createAt: string;
  updateAt: string;
  image: string | null;
  instagram: string | null;
  tiktok: string | null;
};

export type TryoutRegistration = {
  id: string;
  tryoutId: string;
  userTryOutId: string;
  website_sub_category_id: string;
};
export type TryoutSessionParticipant = {
  id: string;
  userId: string;
  sessionId: string;
  startSession: Date;
  endSession: Date | null;
  isDone: boolean;
  website_sub_category_id: string;
};
export type TryoutStatusEnum = 'PUBLIC' | 'PRIVATE' | 'DRAFT';
export type TryoutCategory = {
  name: string;
  id: string;
  slug: string;
  description: string | null;
  createAt: Date;
  updateAt: Date;
  image: string | null;
  website_sub_category_id: string;
};
export type TryoutSubCategory = {
  id: string;
  name: string;
  categoryId: string;
  website_sub_category_id: string;
};
export type TryoutSession = {
  number: number;
  name: string;
  id: string;
  slug: string;
  description: string | null;
  documentId: string | null;
  subCategoryId: string;
  categoryId: string;
  tryoutId: string;
  duration: number;
  assessmentType: string;
  thresholdValue: number | null;
  createAt: Date;
  updateAt: Date;
  website_sub_category_id: string;
};

export type TryoutAnswer = {
  id: string;
  value: number;
  answer: string;
  questionId: string;
  website_sub_category_id: string;
  image: string | null;
};

export type TryoutQuestion = {
  number: number;
  id: string;
  type: 'OBJECTIVE_5' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  question: string;
  createAt: Date;
  updateAt: Date;
  subCategory: string | null;
  image: string | null;
  sessionId: string;
  explanation: string | null;
  a_discrimination: number | null;
  b_difficulty: number | null;
  c_guessing: number | null;
  subSubCategory: string | null;
  website_sub_category_id: string;
};
export type User = {
  name: string;
  id: string;
  createdAt: Date;
  email: string;
  password: string;
  image: string | null;
  emailVerified: Date | null;
  userTryOutId: string | null;
  Role: UserRoleEnum;
};

export type UserRoleEnum = 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'PREMIUM';

export type UserTryout = {
  id: string;
  gender: GenderEnum;
  age: number;
  phone: string;
  kabupaten: string;
  provinsi: string;
  channel: string;
};

export type UserTryoutData = {
  website_sub_category_id: string;
  id: string;
  userTryOutId: string;
  schoolTipe: string | null;
  schoolOrigin: string | null;
  schoolStudy: string | null;
  schoolGraduated: number | null;
  targetValue: number | null;
  univChoiceOne: string | null;
  univStudyChoiceOne: string | null;
  univChoiceTwo: string | null;
  univStudyChoiceTwo: string | null;
};

export type GenderEnum = 'PRIA' | 'WANITA';

export type Transaction = {
  id: string;
  userId: string;
  token: string;
  settlement_time: Date | null;
  payment_type: string | null;
  transaction_details: Object;
  item_details: Object;
  customer_details: Object;
  transaction_time: Date;
  expired_time: Date;
  order_id: string;
  website_sub_category_id: string | null;
};

export type Pricing = {
  id: string;
  slug: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  price: number;
};

export type QuestionTypeEnum = 'OBJECTIVE_5' | 'TRUE_FALSE' | 'SHORT_ANSWER';

export type Document = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  tags: TagEnum[];
  url: string;
  dateTo: Date | null;
  tokenTo: string | null;
  dateToUnlock: Date | null;
  isUploaded: boolean;
  subCategoryId: string | null;
  categoryId: string;
  img: string | null;
  premium: boolean | null;
  videoId: string | null;
  website_sub_category_id: string;
  visibleAtWebSubIds: string[];
};

export type Video = {
  website_sub_category_id: string;
  id: string;
  url: string;
  title: string;
  createdAt: Date;
};

export type TagEnum = 'Document' | 'Video';

export type ChatHistory = {
  id: string;
  title: string;
  updatedAt: Date;
  userId: string;
  website_sub_category_id: string;
};

export type UserDocument = {
  documentId: string;
  userId: string;
  lastAccessed: Date;
  isVectorised: boolean;
  website_sub_category_id: string;
};

export type WebsiteCategory = {
  id: string;
  name: string;
  main_color: string;
  secondary_color: string;
  createdAt: Date;
  updatedAt: Date;
};

export type WebsiteSubCategory = {
  id: string;
  name: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  main_color: string;
  secondary_color: string;
  website_category_id: string;
  sharing_website_sub_category_ids: string[];
  type: WebsiteSubCategoryTypeEnum;
};

export type WebsiteSubCategoryTypeEnum = 'CORE' | 'GENERAL';

export type FeatureTypeEnum = 'DOCUMENT' | 'COURSE' | 'LIVECLASS';

export type SubscriptionPending = {
  id: string;
  createdAt: string;
  userId: string;
  planId: string | null;
  planSlug: string;
  planName: string;
  planTier: string;
  planDescription: string;
  planPrice: number;
  discord_user_id: string | null;
  discord_username: string | null;
  discord_invite_link: string | null;
  updatedAt: string;
  websiteSubCategoryId: string;
};

export type SubscriptionPendingFeature = {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: FeatureTypeEnum;
  validFrom: string;
  validUntil: string;
  subscriptionPendingId: string | null;
};

export type SubscriptionPendingLimitation = {
  id: string;
  validFrom: string;
  validUntil: string;
  subscriptionPendingId: string;
  chat: number;
  notes: number;
  vision: number;
  quiz: number;
  tryout: number;
};

export type Subscription = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  planId?: string;
  userId: string;
  websiteSubCategoryId: string | null;
  planSlug: string;
  planName: string;
  planTier: string;
  planDescription: string;
  planPrice: number;
  planExpire: Date;

  discord_user_id: string;
  discord_username: string;
  discord_display_name: string;
  discord_invite_link: string;
};

export type SubscriptionFeature = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: FeatureTypeEnum;
  subscriptionId: string;
};

export type Plan = {
  id: string;
  slug: string;
  name: string;
  description: string;
  roleDiscord: string | null;
  image: string | null;
  originalPrice: number | null;
  price: number;
  status: PlanStatusEnum;
  maxUsers: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PlanStatusEnum = 'PUBLIC' | 'DRAFT' | 'COMING_SOON';

export type PlanLimitation = {
  chat: number;
  notes: number;
  vision: number;
  quiz: number;
  tryout: number;
  expireDays?: number;
  validFrom?: string;
  validUntil?: string;
  isTimebound: boolean;
  id: string;
  planId: string;
};

export type PlanSubscription = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  planId: string;
  tier: string;
  expireDays?: number;
  websiteSubCategoryId: string;
};

export type PlanSubscriptionBundle = {
  id: string;
  createdAt: string;
  updatedAt: string;
  websiteSubCategoryId: string;
  planSubscriptionId: string;
};

export type PlanFeature = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: FeatureTypeEnum;
  liveClassesPerWeek?: number;
  planSubscriptionId: string;
  validFrom?: string;
  validUntil?: string;
  isTimebound: boolean;
};

export type TryoutUserAnswer = {
  id: string;
  userId: string;
  website_sub_category_id: string;
  questionId: string;
  answerId: string | null;
  sessionParticipantId: string;
};

export type Voucher = {
  id: string;
  createdAt: string;
  title: string;
  voucherCode: string;
  type: VoucherTypeEnum;
  discount: number;
  startDate: string;
  endDate: string | null;
  usageLimit: number | null;
  voucherPlanType: VoucherPlanTypeEnum;
  updatedAt: string;
};

export type VoucherTypeEnum = 'Percentage' | 'Fixed_Amount';

export type VoucherPlanTypeEnum = 'ALL_PLAN' | 'SELECTED_PLAN';

export type Pivot_Voucher_Plan = {
  id: string;
  planId: string;
  voucherId: string;
};

// // =============================================================================

// // === LIVE CLASS SYSTEM ===
// // export type LiveClass = {
// //   id: string;
// //   title: string;
// //   description: string;
// //   subject: string;
// //   tutorId: string;
// //   scheduleDate: Date;
// //   startTime: string;
// //   endTime: string;
// //   duration: number; // calculated field
// //   meetLink: string;
// //   maxParticipants?: number;
// //   status: LiveClassStatusEnum;
// //   isRecorded: boolean;
// //   createdAt: Date;
// //   updatedAt: Date;
// //   createdBy: string;
// //   updatedBy: string;
// //   website_sub_category_id: string;
// // };

// export type LiveClassStatusEnum =
//   | 'SCHEDULED'
//   | 'ONGOING'
//   | 'COMPLETED'
//   | 'CANCELLED';

// export type LiveClassMaterial = {
//   id: string;
//   liveClassId: string;
//   category: string;
//   subCategory: string;
//   title: string;
//   content: string;
//   fileUrl?: string;
//   order: number;
//   website_sub_category_id: string;
// };

// export type LiveClassAgenda = {
//   id: string;
//   liveClassId: string;
//   title: string;
//   description: string;
//   duration: number; // in minutes
//   order: number;
//   website_sub_category_id: string;
// };

// // export type LiveClassReference = {
// //   id: string;
// //   liveClassId: string;
// //   title: string;
// //   type: ReferenceTypeEnum;
// //   url?: string;
// //   chapterId?: string; // reference to CourseChapter
// //   subChapterId?: string; // reference to CourseSubChapter
// //   order: number;
// //   website_sub_category_id: string;
// // };

// export type ReferenceTypeEnum = 'URL' | 'CHAPTER' | 'DOCUMENT' | 'VIDEO';

// export type LiveClassRecording = {
//   id: string;
//   liveClassId: string;
//   title: string;
//   url: string;
//   duration: number;
//   uploadedAt: Date;
//   isPublic: boolean;
//   website_sub_category_id: string;
// };

// export type LiveClassParticipant = {
//   id: string;
//   liveClassId: string;
//   userId: string;
//   joinedAt?: Date;
//   leftAt?: Date;
//   isPresent: boolean;
//   programPurchaseId: string; // link to program purchase
//   website_sub_category_id: string;
// };

// // === TUTOR SYSTEM ===
// export type Tutor = {
//   id: string;
//   fullName: string;
//   email: string;
//   phone?: string;
//   bio: string;
//   subjects: string[]; // JSON array
//   avatar?: string;
//   socialLinks?: TutorSocialLink[];
//   rating: number;
//   totalClasses: number;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   website_sub_category_id: string;
// };

// export type TutorSocialLink = {
//   platform: string;
//   url: string;
// };

// // === PROGRAM & MARKETPLACE SYSTEM ===
// export type Program = {
//   id: string;
//   name: string;
//   description: string;
//   type: ProgramTypeEnum;
//   price: number;
//   discount: number;
//   finalPrice: number; // calculated field
//   duration?: string;
//   isActive: boolean;
//   status: ProgramStatusEnum;
//   // Type-specific fields
//   maxParticipants?: number; // for REGULAR/BUNDLE
//   quantity?: number; // for SINGLE type (e.g., 10x tryout)
//   sessionCount?: number; // for PRIVATE type
//   specialNotes?: string; // for PRIVATE type
//   createdAt: Date;
//   updatedAt: Date;
//   createdBy: string;
//   updatedBy: string;
//   website_sub_category_id: string;
// };

// export type ProgramTypeEnum = 'REGULAR' | 'BUNDLE' | 'SINGLE' | 'PRIVATE';
// export type ProgramStatusEnum = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

// export type ProgramClass = {
//   id: string;
//   programId: string;
//   liveClassId: string;
//   order: number;
//   website_sub_category_id: string;
// };

// export type ProgramLimitation = {
//   id: string;
//   programId: string;
//   type: LimitationTypeEnum;
//   value: number;
//   website_sub_category_id: string;
// };

// export type LimitationTypeEnum =
//   | 'CHAT'
//   | 'NOTES'
//   | 'VISION'
//   | 'QUIZ'
//   | 'TRYOUT'
//   | 'COURSE_ACCESS';

// export type ProgramVoucher = {
//   id: string;
//   programId: string;
//   voucherId: string;
//   website_sub_category_id: string;
// };

// // === VOUCHER SYSTEM ===
// export type Voucher = {
//   id: string;
//   code: string;
//   type: VoucherTypeEnum;
//   value: number;
//   maxDiscount?: number;
//   totalQuota: number;
//   quotaPerUser: number;
//   usedCount: number;
//   validFrom: Date;
//   validUntil: Date;
//   isActive: boolean;
//   // Marketing & Tracking
//   channel: string; // IG, WA, TikTok, etc
//   campaign: string;
//   utmSource?: string;
//   utmMedium?: string;
//   utmCampaign?: string;
//   // Restrictions
//   allowedUsers?: string[]; // JSON array of user IDs
//   minPurchase?: number;
//   maxUsagePerUser: number;
//   createdAt: Date;
//   updatedAt: Date;
//   createdBy: string;
//   website_sub_category_id: string;
// };

// export type VoucherTypeEnum = 'NOMINAL' | 'PERCENTAGE';

// export type VoucherUsage = {
//   id: string;
//   voucherId: string;
//   userId: string;
//   programPurchaseId: string;
//   discountAmount: number;
//   usedAt: Date;
//   // UTM tracking saat redeem
//   utmSource?: string;
//   utmMedium?: string;
//   utmCampaign?: string;
//   website_sub_category_id: string;
// };

// // === PROGRAM PURCHASE & TRANSACTION ===
// export type ProgramPurchase = {
//   id: string;
//   userId: string;
//   programId: string;
//   voucherId?: string;
//   originalPrice: number;
//   discountAmount: number;
//   finalPrice: number;
//   status: PurchaseStatusEnum;
//   purchasedAt: Date;
//   expiresAt?: Date;
//   // Payment integration
//   transactionId?: string; // link to existing Transaction table
//   paymentMethod?: string;
//   // Metadata
//   metadata?: Record<string, any>; // JSON for flexible data
//   website_sub_category_id: string;
// };

// export type PurchaseStatusEnum =
//   | 'PENDING'
//   | 'PAID'
//   | 'EXPIRED'
//   | 'REFUNDED'
//   | 'CANCELLED';

// export type UserProgramAccess = {
//   id: string;
//   userId: string;
//   programId: string;
//   programPurchaseId: string;
//   accessGrantedAt: Date;
//   expiresAt?: Date;
//   isActive: boolean;
//   website_sub_category_id: string;
// };

// // === WISHLIST SYSTEM ===
// export type UserWishlist = {
//   id: string;
//   userId: string;
//   programId: string;
//   addedAt: Date;
//   website_sub_category_id: string;
// };

// // === AUDIT & TRACKING ===
// export type AuditLog = {
//   id: string;
//   entityType: string; // 'LiveClass', 'Program', 'Voucher', etc
//   entityId: string;
//   action: AuditActionEnum;
//   oldData?: Record<string, any>;
//   newData?: Record<string, any>;
//   performedBy: string; // userId
//   performedAt: Date;
//   ipAddress?: string;
//   userAgent?: string;
//   website_sub_category_id: string;
// };

// export type AuditActionEnum =
//   | 'CREATE'
//   | 'UPDATE'
//   | 'DELETE'
//   | 'PUBLISH'
//   | 'UNPUBLISH';

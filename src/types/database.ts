export type Category = {
  website_sub_category_id: string;
  id: string;
  name: string;
  nomor: number;
  to: boolean;
};

export type Subcategory = {
  website_sub_category_id: string;
  id: string;
  name: string;
  categoryId: string;
};

export type Tryout = {
  status: TryoutStatusEnum;
  id: string;
  title: string;
  image: string | null;
  createAt: Date;
  updateAt: Date;
  restTime: number;
  startDate: Date;
  endDate: Date;
  resultDate: Date;
  website_sub_category_id: string;
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

export type UserRoleEnum = 'ADMIN' | 'USER' | 'PREMIUM';

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
  website_sub_category_id: string;
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
  createdAt: Date;
  updatedAt: Date;
  main_color: string;
  secondary_color: string;
  website_category_id: string;
};

export type FeatureTypeEnum = 'DOCUMENT' | 'COURSE';

export type Subscription = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  planId: string;
  userId: string;
  websiteSubCategoryId: string | null;
  planSlug: string;
  planName: string;
  planTier: string;
  planDescription: string;
  planPrice: number;
  planExpire: Date;
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
  name: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  price: number;
  description: string;
};

export type PlanLimitation = {
  id: string;
  chat: number;
  notes: number;
  vision: number;
  quiz: number;
  tryout: number;
  planId: string;
};

export type PlanSubscription = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  planId: string;
  tier: string;
  expireDays: number;
  websiteSubCategoryId: string;
};

export type PlanFeature = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: FeatureTypeEnum;
  planSubscriptionId: string;
};

export type TryoutUserAnswer = {
  id: string;
  userId: string;
  website_sub_category_id: string;
  questionId: string;
  answerId: string | null;
  sessionParticipantId: string;
};

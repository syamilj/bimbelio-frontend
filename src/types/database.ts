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
};

export type TryoutRegistration = {
  id: string;
  tryoutId: string;
  userTryOutId: string;
};
export type TryoutSessionParticipant = {
  id: string;
  userId: string;
  sessionId: string;
  startSession: Date;
  endSession: Date | null;
  isDone: boolean;
};
export type TryoutStatusEnum = "PUBLIC" | "PRIVATE" | "DRAFT";
export type TryoutCategory = {
  name: string;
  id: string;
  slug: string;
  description: string | null;
  createAt: Date;
  updateAt: Date;
  image: string | null;
};
export type TryoutSubCategory = {
  id: string;
  name: string;
  categoryId: string;
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
};

export type TryoutAnswer = {
  id: string;
  value: number;
  answer: string;
  questionId: string;
};

export type TryoutQuestion = {
  number: number;
  id: string;
  type: "OBJECTIVE_5" | "TRUE_FALSE" | "SHORT_ANSWER";
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

export type UserRoleEnum = "ADMIN" | "USER" | "PREMIUM";

export type UserTryout = {
  id: string;
  gender: GenderEnum;
  age: number;
  phone: string;
  kabupaten: string;
  provinsi: string;
  schoolTipe: string;
  schoolOrigin: string;
  schoolStudy: string;
  schoolGraduated: number;
  targetValue: number;
  univChoiceOne: string;
  univStudyChoiceOne: string;
  univChoiceTwo: string;
  univStudyChoiceTwo: string;
  channel: string;
};

export type GenderEnum = "PRIA" | "WANITA";

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
};

export type Pricing = {
  id: string;
  slug: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  price: number;
};

export type QuestionTypeEnum = "OBJECTIVE_5" | "TRUE_FALSE" | "SHORT_ANSWER";

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
};

export type TagEnum = "Document" | "Video";

export type ChatHistory = {
  id: string;
  title: string;
  updatedAt: Date;
  userId: string;
};

export type UserDocument = {
  documentId: string;
  userId: string;
  lastAccessed: Date;
  isVectorised: boolean;
};

import {
  Category,
  Instructor,
  LiveClass,
  Pivot_LiveClass_Plan,
  Pivot_Plan_Category,
  Plan,
  PlanBenefit,
  PlanFeature,
  PlanLimitation,
  PlanSubscription,
  PlanSubscriptionBundle,
  WebsiteSubCategory,
} from '@/types/database';
import { BookOpen, Brain, Eye, FileText, MessageCircle, Star, Trophy, Video } from 'lucide-react';

export type PlanDataType = Plan & {
  totalUsers: number;
  PlanBenefit: PlanBenefit[];
  discount: number | undefined;
  PlanLimitation: PlanLimitation;
  PlanSubscription: PlanSubscription & {
    PlanSubscriptionBundle: PlanSubscriptionBundle[];
    PlanFeature: (PlanFeature & {
      Pivot_Plan_Category: (Pivot_Plan_Category & {
        Category: Category;
      })[];
    })[];
    WebsiteSubCategory: WebsiteSubCategory;
  };
  Pivot_LiveClass_Plan: (Pivot_LiveClass_Plan & {
    LiveClass: LiveClass & {
      Instructor: Instructor;
    };
  })[];
  timeline: string;
};

export const getFeatureIcon = (type: string) => {
  switch (type) {
    case 'LIVECLASS':
      return <Video className="w-5 h-5 text-white" />;
    case 'DOCUMENT':
      return <FileText className="w-5 h-5 text-white" />;
    case 'COURSE':
      return <BookOpen className="w-5 h-5 text-white" />;
    default:
      return <Star className="w-5 h-5 text-white" />;
  }
};

export const getLimitationIcon = (type: string) => {
  switch (type) {
    case 'chat':
      return <MessageCircle className="w-5 h-5" />;
    case 'notes':
      return <FileText className="w-5 h-5" />;
    case 'vision':
      return <Eye className="w-5 h-5" />;
    case 'quiz':
      return <Brain className="w-5 h-5" />;
    case 'tryout':
      return <Trophy className="w-5 h-5" />;
    default:
      return <Star className="w-5 h-5" />;
  }
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

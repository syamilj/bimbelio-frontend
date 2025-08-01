//src/components/_shared/other/card-plan/_provider/types.ts
'use client';

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
  WebsiteSubCategory,
} from '@/types/database';

export type PlanDataType = Plan & {
  PlanBenefit: PlanBenefit[];
  PlanLimitation: PlanLimitation;
  PlanSubscription: PlanSubscription & {
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

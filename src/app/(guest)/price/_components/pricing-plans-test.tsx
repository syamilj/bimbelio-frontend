'use client';
import { EmptyPlan } from '@/components/_shared/empty/empty-plan';
import { CardPlan } from '@/components/_shared/other/card-plan';
import { CardPlanTopping } from '@/components/_shared/other/card-plan-coin';
import { PlanDataType } from '@/components/_shared/other/card-plan/_provider/types';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { pixel } from '@/lib/pixel/_core';
import { Crown, Sparkles, Star, Target, Trophy, Zap } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type PlanType = PlanDataType;

// Dummy data for different web sub categories
const dummyPricingData = {
  webSubCategory: [
    {
      webSubCategoryId: 'snbt',
      webSubCategoryName: 'SNBT',
      main_color: '#FF6B35',
      secondary_color: '#F7931E',
      bundles: [
        {
          id: 'snbt-bundle-premium',
          slug: 'snbt-premium-bundle',
          name: 'SNBT Premium Bundle',
          description:
            'Paket lengkap persiapan SNBT dengan akses penuh ke semua materi, tryout, dan konsultasi',
          roleDiscord: null,
          image: null,
          originalPrice: 450000,
          price: 299000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'benefit-1',
              title: 'Akses penuh materi SNBT',
              description: 'Materi lengkap untuk semua subtes SNBT',
              order: 1,
              planId: 'snbt-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'benefit-2',
              title: '100+ Tryout SNBT',
              description: 'Koleksi tryout lengkap dengan pembahasan',
              order: 2,
              planId: 'snbt-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'benefit-3',
              title: 'Konsultasi tutor ahli',
              description: 'Konsultasi personal dengan tutor berpengalaman',
              order: 3,
              planId: 'snbt-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 100,
            notes: 500,
            vision: 50,
            quiz: 200,
            tryout: 100,
            expireDays: 365,
            validFrom: '2024-01-01',
            validUntil: '2024-12-31',
            isTimebound: true,
            id: 'limitation-1',
            planId: 'snbt-bundle-premium',
          },
          discount: 33,
          PlanSubscription: {
            id: 'sub-1',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'snbt-bundle-premium',
            tier: 'PREMIUM',
            expireDays: 365,
            websiteSubCategoryId: 'snbt',
            PlanFeature: [
              {
                id: 'feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 2,
                planSubscriptionId: 'sub-1',
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isTimebound: true,
                Pivot_Plan_Category: [
                  {
                    id: 'pivot-1',
                    planFeatureId: 'feature-1',
                    categoryId: 'cat-1',
                    Category: {
                      website_sub_category_id: 'snbt',
                      id: 'cat-1',
                      name: 'Matematika',
                      nomor: 1,
                      to: true,
                    },
                  },
                ],
              },
              {
                id: 'feature-2',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'DOCUMENT' as const,
                planSubscriptionId: 'sub-1',
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'snbt',
              name: 'SNBT',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#FF6B35',
              secondary_color: '#F7931E',
              website_category_id: 'snbt-cat',
            },
          },
          Pivot_LiveClass_Plan: [
            {
              id: 'live-pivot-1',
              planId: 'snbt-bundle-premium',
              liveClassId: 'live-1',
              LiveClass: {
                id: 'live-1',
                description: 'Live class SNBT premium',
                createdAt: '2024-01-01',
                updatedAt: '2024-01-01',
                title: 'Strategi SNBT Premium',
                categoryId: 'cat-1',
                image: null,
                startDate: '2024-02-01',
                endDate: '2024-02-01',
                link: 'https://meet.google.com/abc',
                instructorId: 'inst-1',
                duration: 120,
                maxParticipant: 50,
                isRecord: true,
                websiteSubCategoryId: 'snbt',
                Instructor: {
                  name: 'Dr. Ahmad Santoso',
                  id: 'inst-1',
                  description: 'Ahli SNBT dengan pengalaman 10 tahun',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  status: true,
                  image: null,
                  email: 'ahmad@bimbelio.com',
                  phone: '+628123456789',
                  lastEducation: 'S3 Pendidikan Matematika',
                  certificate: 'Sertifikat Tutor SNBT',
                },
              },
            },
          ],
          timeline: '1 tahun',
        },
        {
          id: 'snbt-bundle-basic',
          slug: 'snbt-basic-bundle',
          name: 'SNBT Basic Bundle',
          description:
            'Paket essential untuk persiapan SNBT dengan materi dasar dan tryout',
          roleDiscord: null,
          image: null,
          originalPrice: 200000,
          price: 149000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'benefit-basic-1',
              title: 'Akses materi SNBT dasar',
              description: 'Materi dasar untuk pemula',
              order: 1,
              planId: 'snbt-bundle-basic',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'benefit-basic-2',
              title: '50+ Tryout SNBT',
              description: 'Tryout dasar dengan pembahasan',
              order: 2,
              planId: 'snbt-bundle-basic',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 50,
            notes: 200,
            vision: 25,
            quiz: 100,
            tryout: 50,
            expireDays: 180,
            validFrom: '2024-01-01',
            validUntil: '2024-06-30',
            isTimebound: true,
            id: 'limitation-basic',
            planId: 'snbt-bundle-basic',
          },
          discount: 25,
          PlanSubscription: {
            id: 'sub-basic',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'snbt-bundle-basic',
            tier: 'BASIC',
            expireDays: 180,
            websiteSubCategoryId: 'snbt',
            PlanFeature: [
              {
                id: 'feature-basic-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'DOCUMENT' as const,
                planSubscriptionId: 'sub-basic',
                validFrom: '2024-01-01',
                validUntil: '2024-06-30',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'snbt',
              name: 'SNBT',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#FF6B35',
              secondary_color: '#F7931E',
              website_category_id: 'snbt-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '6 bulan',
        },
      ],
      subscriptions: [
        {
          id: 'snbt-subscription-3month',
          slug: 'snbt-subscription-3month',
          name: 'SNBT Subscription 3 Bulan',
          description: 'Langganan 3 bulan akses penuh platform SNBT',
          roleDiscord: null,
          image: null,
          originalPrice: 120000,
          price: 99000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'benefit-sub-1',
              title: 'Akses platform 3 bulan',
              description: 'Akses lengkap selama 3 bulan',
              order: 1,
              planId: 'snbt-subscription-3month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 30,
            notes: 150,
            vision: 15,
            quiz: 60,
            tryout: 30,
            expireDays: 90,
            validFrom: '2024-01-01',
            validUntil: '2024-04-01',
            isTimebound: true,
            id: 'limitation-sub-3m',
            planId: 'snbt-subscription-3month',
          },
          discount: 17,
          PlanSubscription: {
            id: 'sub-3m',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'snbt-subscription-3month',
            tier: 'STANDARD',
            expireDays: 90,
            websiteSubCategoryId: 'snbt',
            PlanFeature: [
              {
                id: 'feature-sub-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 1,
                planSubscriptionId: 'sub-3m',
                validFrom: '2024-01-01',
                validUntil: '2024-04-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'snbt',
              name: 'SNBT',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#FF6B35',
              secondary_color: '#F7931E',
              website_category_id: 'snbt-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '3 bulan',
        },
        {
          id: 'snbt-subscription-6month',
          slug: 'snbt-subscription-6month',
          name: 'SNBT Subscription 6 Bulan',
          description: 'Langganan 6 bulan dengan harga lebih hemat',
          roleDiscord: null,
          image: null,
          originalPrice: 240000,
          price: 179000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'benefit-sub-6m-1',
              title: 'Akses platform 6 bulan',
              description: 'Akses lengkap selama 6 bulan',
              order: 1,
              planId: 'snbt-subscription-6month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'benefit-sub-6m-2',
              title: 'Konsultasi prioritas',
              description: 'Konsultasi dengan prioritas tinggi',
              order: 2,
              planId: 'snbt-subscription-6month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 60,
            notes: 300,
            vision: 30,
            quiz: 120,
            tryout: 60,
            expireDays: 180,
            validFrom: '2024-01-01',
            validUntil: '2024-07-01',
            isTimebound: true,
            id: 'limitation-sub-6m',
            planId: 'snbt-subscription-6month',
          },
          discount: 25,
          PlanSubscription: {
            id: 'sub-6m',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'snbt-subscription-6month',
            tier: 'PREMIUM',
            expireDays: 180,
            websiteSubCategoryId: 'snbt',
            PlanFeature: [
              {
                id: 'feature-sub-6m-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 2,
                planSubscriptionId: 'sub-6m',
                validFrom: '2024-01-01',
                validUntil: '2024-07-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
              {
                id: 'feature-sub-6m-2',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'LIVECLASS' as const,
                liveClassesPerWeek: 1,
                planSubscriptionId: 'sub-6m',
                validFrom: '2024-01-01',
                validUntil: '2024-07-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'snbt',
              name: 'SNBT',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#FF6B35',
              secondary_color: '#F7931E',
              website_category_id: 'snbt-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '6 bulan',
        },
      ],
    },
    {
      webSubCategoryId: 'simak-ui',
      webSubCategoryName: 'SIMAK UI',
      main_color: '#4A90E2',
      secondary_color: '#7B68EE',
      bundles: [
        {
          id: 'simak-bundle-premium',
          slug: 'simak-premium-bundle',
          name: 'SIMAK UI Premium Bundle',
          description:
            'Paket komprehensif persiapan SIMAK UI dengan semua fitur premium',
          roleDiscord: null,
          image: null,
          originalPrice: 350000,
          price: 249000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'simak-benefit-1',
              title: 'Materi SIMAK UI lengkap',
              description: 'Materi komprehensif untuk semua mata kuliah',
              order: 1,
              planId: 'simak-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'simak-benefit-2',
              title: '80+ Tryout SIMAK UI',
              description: 'Koleksi tryout dengan tingkat kesulitan bervariasi',
              order: 2,
              planId: 'simak-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 80,
            notes: 400,
            vision: 40,
            quiz: 160,
            tryout: 80,
            expireDays: 365,
            validFrom: '2024-01-01',
            validUntil: '2024-12-31',
            isTimebound: true,
            id: 'simak-limitation',
            planId: 'simak-bundle-premium',
          },
          discount: 29,
          PlanSubscription: {
            id: 'simak-sub',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'simak-bundle-premium',
            tier: 'PREMIUM',
            expireDays: 365,
            websiteSubCategoryId: 'simak-ui',
            PlanFeature: [
              {
                id: 'simak-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 3,
                planSubscriptionId: 'simak-sub',
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'simak-ui',
              name: 'SIMAK UI',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#4A90E2',
              secondary_color: '#7B68EE',
              website_category_id: 'simak-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '1 tahun',
        },
        {
          id: 'simak-bundle-intensif',
          slug: 'simak-intensif-bundle',
          name: 'SIMAK UI Intensif Bundle',
          description:
            'Paket intensif untuk persiapan SIMAK UI dalam waktu singkat',
          roleDiscord: null,
          image: null,
          originalPrice: 280000,
          price: 199000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'simak-intensif-1',
              title: 'Materi SIMAK UI intensif',
              description: 'Fokus pada materi prioritas dalam waktu singkat',
              order: 1,
              planId: 'simak-bundle-intensif',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 60,
            notes: 300,
            vision: 30,
            quiz: 120,
            tryout: 60,
            expireDays: 180,
            validFrom: '2024-01-01',
            validUntil: '2024-07-01',
            isTimebound: true,
            id: 'simak-intensif-limitation',
            planId: 'simak-bundle-intensif',
          },
          discount: 29,
          PlanSubscription: {
            id: 'simak-intensif-sub',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'simak-bundle-intensif',
            tier: 'INTENSIF',
            expireDays: 180,
            websiteSubCategoryId: 'simak-ui',
            PlanFeature: [
              {
                id: 'simak-intensif-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'DOCUMENT' as const,
                planSubscriptionId: 'simak-intensif-sub',
                validFrom: '2024-01-01',
                validUntil: '2024-07-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'simak-ui',
              name: 'SIMAK UI',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#4A90E2',
              secondary_color: '#7B68EE',
              website_category_id: 'simak-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '6 bulan',
        },
      ],
      subscriptions: [
        {
          id: 'simak-subscription-3month',
          slug: 'simak-subscription-3month',
          name: 'SIMAK UI Subscription 3 Bulan',
          description: 'Langganan 3 bulan akses lengkap SIMAK UI',
          roleDiscord: null,
          image: null,
          originalPrice: 110000,
          price: 89000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'simak-sub-3m-1',
              title: 'Akses platform 3 bulan',
              description: 'Akses lengkap selama 3 bulan',
              order: 1,
              planId: 'simak-subscription-3month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 25,
            notes: 125,
            vision: 12,
            quiz: 50,
            tryout: 25,
            expireDays: 90,
            validFrom: '2024-01-01',
            validUntil: '2024-04-01',
            isTimebound: true,
            id: 'simak-sub-3m-limitation',
            planId: 'simak-subscription-3month',
          },
          discount: 19,
          PlanSubscription: {
            id: 'simak-sub-3m',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'simak-subscription-3month',
            tier: 'STANDARD',
            expireDays: 90,
            websiteSubCategoryId: 'simak-ui',
            PlanFeature: [
              {
                id: 'simak-sub-3m-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 1,
                planSubscriptionId: 'simak-sub-3m',
                validFrom: '2024-01-01',
                validUntil: '2024-04-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'simak-ui',
              name: 'SIMAK UI',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#4A90E2',
              secondary_color: '#7B68EE',
              website_category_id: 'simak-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '3 bulan',
        },
        {
          id: 'simak-subscription-6month',
          slug: 'simak-subscription-6month',
          name: 'SIMAK UI Subscription 6 Bulan',
          description: 'Langganan 6 bulan dengan diskon besar',
          roleDiscord: null,
          image: null,
          originalPrice: 220000,
          price: 159000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'simak-sub-6m-1',
              title: 'Akses platform 6 bulan',
              description: 'Akses lengkap selama 6 bulan',
              order: 1,
              planId: 'simak-subscription-6month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 50,
            notes: 250,
            vision: 25,
            quiz: 100,
            tryout: 50,
            expireDays: 180,
            validFrom: '2024-01-01',
            validUntil: '2024-07-01',
            isTimebound: true,
            id: 'simak-sub-6m-limitation',
            planId: 'simak-subscription-6month',
          },
          discount: 28,
          PlanSubscription: {
            id: 'simak-sub-6m',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'simak-subscription-6month',
            tier: 'PREMIUM',
            expireDays: 180,
            websiteSubCategoryId: 'simak-ui',
            PlanFeature: [
              {
                id: 'simak-sub-6m-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 2,
                planSubscriptionId: 'simak-sub-6m',
                validFrom: '2024-01-01',
                validUntil: '2024-07-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'simak-ui',
              name: 'SIMAK UI',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#4A90E2',
              secondary_color: '#7B68EE',
              website_category_id: 'simak-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '6 bulan',
        },
      ],
    },
    {
      webSubCategoryId: 'um-ugm',
      webSubCategoryName: 'UM UGM',
      main_color: '#2E8B57',
      secondary_color: '#32CD32',
      bundles: [
        {
          id: 'umugm-bundle-premium',
          slug: 'umugm-premium-bundle',
          name: 'UM UGM Premium Bundle',
          description:
            'Paket lengkap persiapan UM UGM dengan akses penuh semua materi',
          roleDiscord: null,
          image: null,
          originalPrice: 400000,
          price: 279000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'umugm-benefit-1',
              title: 'Materi UM UGM komprehensif',
              description: 'Materi lengkap sesuai standar UGM',
              order: 1,
              planId: 'umugm-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'umugm-benefit-2',
              title: '90+ Tryout UM UGM',
              description: 'Tryout dengan format asli UGM',
              order: 2,
              planId: 'umugm-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 90,
            notes: 450,
            vision: 45,
            quiz: 180,
            tryout: 90,
            expireDays: 365,
            validFrom: '2024-01-01',
            validUntil: '2024-12-31',
            isTimebound: true,
            id: 'umugm-limitation',
            planId: 'umugm-bundle-premium',
          },
          discount: 30,
          PlanSubscription: {
            id: 'umugm-sub',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'umugm-bundle-premium',
            tier: 'PREMIUM',
            expireDays: 365,
            websiteSubCategoryId: 'um-ugm',
            PlanFeature: [
              {
                id: 'umugm-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 2,
                planSubscriptionId: 'umugm-sub',
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'um-ugm',
              name: 'UM UGM',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#2E8B57',
              secondary_color: '#32CD32',
              website_category_id: 'umugm-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '1 tahun',
        },
        {
          id: 'umugm-bundle-target',
          slug: 'umugm-target-bundle',
          name: 'UM UGM Target Bundle',
          description: 'Paket fokus untuk target skor tertentu UM UGM',
          roleDiscord: null,
          image: null,
          originalPrice: 250000,
          price: 179000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'umugm-target-1',
              title: 'Materi UM UGM terfokus',
              description: 'Materi spesifik untuk target skor',
              order: 1,
              planId: 'umugm-bundle-target',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 70,
            notes: 350,
            vision: 35,
            quiz: 140,
            tryout: 70,
            expireDays: 180,
            validFrom: '2024-01-01',
            validUntil: '2024-07-01',
            isTimebound: true,
            id: 'umugm-target-limitation',
            planId: 'umugm-bundle-target',
          },
          discount: 28,
          PlanSubscription: {
            id: 'umugm-target-sub',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'umugm-bundle-target',
            tier: 'TARGET',
            expireDays: 180,
            websiteSubCategoryId: 'um-ugm',
            PlanFeature: [
              {
                id: 'umugm-target-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'DOCUMENT' as const,
                planSubscriptionId: 'umugm-target-sub',
                validFrom: '2024-01-01',
                validUntil: '2024-07-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'um-ugm',
              name: 'UM UGM',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#2E8B57',
              secondary_color: '#32CD32',
              website_category_id: 'umugm-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '6 bulan',
        },
      ],
      subscriptions: [
        {
          id: 'umugm-subscription-3month',
          slug: 'umugm-subscription-3month',
          name: 'UM UGM Subscription 3 Bulan',
          description: 'Langganan 3 bulan akses platform UM UGM',
          roleDiscord: null,
          image: null,
          originalPrice: 120000,
          price: 95000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'umugm-sub-3m-1',
              title: 'Akses platform 3 bulan',
              description: 'Akses lengkap selama 3 bulan',
              order: 1,
              planId: 'umugm-subscription-3month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 30,
            notes: 150,
            vision: 15,
            quiz: 60,
            tryout: 30,
            expireDays: 90,
            validFrom: '2024-01-01',
            validUntil: '2024-04-01',
            isTimebound: true,
            id: 'umugm-sub-3m-limitation',
            planId: 'umugm-subscription-3month',
          },
          discount: 21,
          PlanSubscription: {
            id: 'umugm-sub-3m',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'umugm-subscription-3month',
            tier: 'STANDARD',
            expireDays: 90,
            websiteSubCategoryId: 'um-ugm',
            PlanFeature: [
              {
                id: 'umugm-sub-3m-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 1,
                planSubscriptionId: 'umugm-sub-3m',
                validFrom: '2024-01-01',
                validUntil: '2024-04-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'um-ugm',
              name: 'UM UGM',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#2E8B57',
              secondary_color: '#32CD32',
              website_category_id: 'umugm-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '3 bulan',
        },
        {
          id: 'umugm-subscription-6month',
          slug: 'umugm-subscription-6month',
          name: 'UM UGM Subscription 6 Bulan',
          description: 'Langganan 6 bulan dengan harga spesial',
          roleDiscord: null,
          image: null,
          originalPrice: 240000,
          price: 169000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'umugm-sub-6m-1',
              title: 'Akses platform 6 bulan',
              description: 'Akses lengkap selama 6 bulan',
              order: 1,
              planId: 'umugm-subscription-6month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 60,
            notes: 300,
            vision: 30,
            quiz: 120,
            tryout: 60,
            expireDays: 180,
            validFrom: '2024-01-01',
            validUntil: '2024-07-01',
            isTimebound: true,
            id: 'umugm-sub-6m-limitation',
            planId: 'umugm-subscription-6month',
          },
          discount: 30,
          PlanSubscription: {
            id: 'umugm-sub-6m',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'umugm-subscription-6month',
            tier: 'PREMIUM',
            expireDays: 180,
            websiteSubCategoryId: 'um-ugm',
            PlanFeature: [
              {
                id: 'umugm-sub-6m-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 2,
                planSubscriptionId: 'umugm-sub-6m',
                validFrom: '2024-01-01',
                validUntil: '2024-07-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'um-ugm',
              name: 'UM UGM',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#2E8B57',
              secondary_color: '#32CD32',
              website_category_id: 'umugm-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '6 bulan',
        },
      ],
    },
    {
      webSubCategoryId: 'stan',
      webSubCategoryName: 'STAN',
      main_color: '#DC143C',
      secondary_color: '#FF6347',
      bundles: [
        {
          id: 'stan-bundle-premium',
          slug: 'stan-premium-bundle',
          name: 'STAN Premium Bundle',
          description:
            'Paket lengkap persiapan STAN dengan semua materi dan tryout',
          roleDiscord: null,
          image: null,
          originalPrice: 380000,
          price: 259000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'stan-benefit-1',
              title: 'Materi STAN lengkap',
              description: 'Materi komprehensif sesuai kurikulum STAN',
              order: 1,
              planId: 'stan-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'stan-benefit-2',
              title: '85+ Tryout STAN',
              description: 'Tryout dengan format asli STAN',
              order: 2,
              planId: 'stan-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 85,
            notes: 425,
            vision: 42,
            quiz: 170,
            tryout: 85,
            expireDays: 365,
            validFrom: '2024-01-01',
            validUntil: '2024-12-31',
            isTimebound: true,
            id: 'stan-limitation',
            planId: 'stan-bundle-premium',
          },
          discount: 32,
          PlanSubscription: {
            id: 'stan-sub',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'stan-bundle-premium',
            tier: 'PREMIUM',
            expireDays: 365,
            websiteSubCategoryId: 'stan',
            PlanFeature: [
              {
                id: 'stan-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 2,
                planSubscriptionId: 'stan-sub',
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'stan',
              name: 'STAN',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#DC143C',
              secondary_color: '#FF6347',
              website_category_id: 'stan-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '1 tahun',
        },
        {
          id: 'stan-bundle-accelerator',
          slug: 'stan-accelerator-bundle',
          name: 'STAN Accelerator Bundle',
          description: 'Paket percepatan persiapan STAN untuk hasil maksimal',
          roleDiscord: null,
          image: null,
          originalPrice: 270000,
          price: 189000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'stan-accelerator-1',
              title: 'Materi STAN akselerasi',
              description: 'Program percepatan khusus STAN',
              order: 1,
              planId: 'stan-bundle-accelerator',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 65,
            notes: 325,
            vision: 32,
            quiz: 130,
            tryout: 65,
            expireDays: 180,
            validFrom: '2024-01-01',
            validUntil: '2024-07-01',
            isTimebound: true,
            id: 'stan-accelerator-limitation',
            planId: 'stan-bundle-accelerator',
          },
          discount: 30,
          PlanSubscription: {
            id: 'stan-accelerator-sub',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'stan-bundle-accelerator',
            tier: 'ACCELERATOR',
            expireDays: 180,
            websiteSubCategoryId: 'stan',
            PlanFeature: [
              {
                id: 'stan-accelerator-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'DOCUMENT' as const,
                planSubscriptionId: 'stan-accelerator-sub',
                validFrom: '2024-01-01',
                validUntil: '2024-07-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'stan',
              name: 'STAN',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#DC143C',
              secondary_color: '#FF6347',
              website_category_id: 'stan-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '6 bulan',
        },
      ],
      subscriptions: [
        {
          id: 'stan-subscription-3month',
          slug: 'stan-subscription-3month',
          name: 'STAN Subscription 3 Bulan',
          description: 'Langganan 3 bulan akses platform STAN',
          roleDiscord: null,
          image: null,
          originalPrice: 115000,
          price: 92000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'stan-sub-3m-1',
              title: 'Akses platform 3 bulan',
              description: 'Akses lengkap selama 3 bulan',
              order: 1,
              planId: 'stan-subscription-3month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 28,
            notes: 140,
            vision: 14,
            quiz: 56,
            tryout: 28,
            expireDays: 90,
            validFrom: '2024-01-01',
            validUntil: '2024-04-01',
            isTimebound: true,
            id: 'stan-sub-3m-limitation',
            planId: 'stan-subscription-3month',
          },
          discount: 20,
          PlanSubscription: {
            id: 'stan-sub-3m',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'stan-subscription-3month',
            tier: 'STANDARD',
            expireDays: 90,
            websiteSubCategoryId: 'stan',
            PlanFeature: [
              {
                id: 'stan-sub-3m-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 1,
                planSubscriptionId: 'stan-sub-3m',
                validFrom: '2024-01-01',
                validUntil: '2024-04-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'stan',
              name: 'STAN',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#DC143C',
              secondary_color: '#FF6347',
              website_category_id: 'stan-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '3 bulan',
        },
        {
          id: 'stan-subscription-6month',
          slug: 'stan-subscription-6month',
          name: 'STAN Subscription 6 Bulan',
          description: 'Langganan 6 bulan dengan diskon maksimal',
          roleDiscord: null,
          image: null,
          originalPrice: 230000,
          price: 164000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'stan-sub-6m-1',
              title: 'Akses platform 6 bulan',
              description: 'Akses lengkap selama 6 bulan',
              order: 1,
              planId: 'stan-subscription-6month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 55,
            notes: 275,
            vision: 27,
            quiz: 110,
            tryout: 55,
            expireDays: 180,
            validFrom: '2024-01-01',
            validUntil: '2024-07-01',
            isTimebound: true,
            id: 'stan-sub-6m-limitation',
            planId: 'stan-subscription-6month',
          },
          discount: 29,
          PlanSubscription: {
            id: 'stan-sub-6m',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'stan-subscription-6month',
            tier: 'PREMIUM',
            expireDays: 180,
            websiteSubCategoryId: 'stan',
            PlanFeature: [
              {
                id: 'stan-sub-6m-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 2,
                planSubscriptionId: 'stan-sub-6m',
                validFrom: '2024-01-01',
                validUntil: '2024-07-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'stan',
              name: 'STAN',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#DC143C',
              secondary_color: '#FF6347',
              website_category_id: 'stan-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '6 bulan',
        },
      ],
    },
    // Cross-websubcategory plans (2 websubcategories combined)
    {
      webSubCategoryId: 'snbt-simak-ui',
      webSubCategoryName: 'SNBT + SIMAK UI',
      main_color: '#FF6B35',
      secondary_color: '#4A90E2',
      bundles: [
        {
          id: 'cross-snbt-simak-bundle-premium',
          slug: 'snbt-simak-premium-bundle',
          name: 'SNBT + SIMAK UI Premium Bundle',
          description:
            'Paket lengkap untuk persiapan SNBT dan SIMAK UI dengan akses penuh semua materi',
          roleDiscord: null,
          image: null,
          originalPrice: 650000,
          price: 449000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'cross-benefit-1',
              title: 'Akses penuh SNBT & SIMAK UI',
              description: 'Materi lengkap untuk kedua program',
              order: 1,
              planId: 'cross-snbt-simak-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'cross-benefit-2',
              title: '180+ Tryout gabungan',
              description: 'Koleksi tryout lengkap SNBT dan SIMAK UI',
              order: 2,
              planId: 'cross-snbt-simak-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'cross-benefit-3',
              title: 'Konsultasi dual expertise',
              description: 'Konsultasi dengan tutor ahli SNBT dan SIMAK UI',
              order: 3,
              planId: 'cross-snbt-simak-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 180,
            notes: 900,
            vision: 90,
            quiz: 360,
            tryout: 180,
            expireDays: 365,
            validFrom: '2024-01-01',
            validUntil: '2024-12-31',
            isTimebound: true,
            id: 'cross-limitation-snbt-simak',
            planId: 'cross-snbt-simak-bundle-premium',
          },
          discount: 31,
          PlanSubscription: {
            id: 'cross-sub-snbt-simak',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'cross-snbt-simak-bundle-premium',
            tier: 'CROSS_PREMIUM',
            expireDays: 365,
            websiteSubCategoryId: 'snbt-simak-ui',
            PlanFeature: [
              {
                id: 'cross-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 4,
                planSubscriptionId: 'cross-sub-snbt-simak',
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
              {
                id: 'cross-feature-2',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'DOCUMENT' as const,
                planSubscriptionId: 'cross-sub-snbt-simak',
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'snbt-simak-ui',
              name: 'SNBT + SIMAK UI',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#FF6B35',
              secondary_color: '#4A90E2',
              website_category_id: 'cross-snbt-simak-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '1 tahun',
        },
      ],
      subscriptions: [
        {
          id: 'cross-snbt-simak-subscription-6month',
          slug: 'snbt-simak-subscription-6month',
          name: 'SNBT + SIMAK UI Subscription 6 Bulan',
          description: 'Langganan 6 bulan akses lengkap SNBT dan SIMAK UI',
          roleDiscord: null,
          image: null,
          originalPrice: 400000,
          price: 299000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'cross-sub-benefit-1',
              title: 'Akses dual platform 6 bulan',
              description: 'Akses lengkap SNBT dan SIMAK UI selama 6 bulan',
              order: 1,
              planId: 'cross-snbt-simak-subscription-6month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'cross-sub-benefit-2',
              title: 'Update materi terbaru',
              description: 'Update materi SNBT dan SIMAK UI secara berkala',
              order: 2,
              planId: 'cross-snbt-simak-subscription-6month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 120,
            notes: 600,
            vision: 60,
            quiz: 240,
            tryout: 120,
            expireDays: 180,
            validFrom: '2024-01-01',
            validUntil: '2024-07-01',
            isTimebound: true,
            id: 'cross-sub-limitation-snbt-simak',
            planId: 'cross-snbt-simak-subscription-6month',
          },
          discount: 25,
          PlanSubscription: {
            id: 'cross-sub-snbt-simak-6m',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'cross-snbt-simak-subscription-6month',
            tier: 'CROSS_PREMIUM',
            expireDays: 180,
            websiteSubCategoryId: 'snbt-simak-ui',
            PlanFeature: [
              {
                id: 'cross-sub-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 3,
                planSubscriptionId: 'cross-sub-snbt-simak-6m',
                validFrom: '2024-01-01',
                validUntil: '2024-07-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'snbt-simak-ui',
              name: 'SNBT + SIMAK UI',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#FF6B35',
              secondary_color: '#4A90E2',
              website_category_id: 'cross-snbt-simak-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '6 bulan',
        },
      ],
    },
    {
      webSubCategoryId: 'um-ugm-stan',
      webSubCategoryName: 'UM UGM + STAN',
      main_color: '#2E8B57',
      secondary_color: '#DC143C',
      bundles: [
        {
          id: 'cross-umugm-stan-bundle-premium',
          slug: 'umugm-stan-premium-bundle',
          name: 'UM UGM + STAN Premium Bundle',
          description:
            'Paket lengkap untuk persiapan UM UGM dan STAN dengan semua materi premium',
          roleDiscord: null,
          image: null,
          originalPrice: 580000,
          price: 399000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'cross-umugm-stan-benefit-1',
              title: 'Materi UM UGM & STAN lengkap',
              description: 'Materi komprehensif sesuai standar UGM dan STAN',
              order: 1,
              planId: 'cross-umugm-stan-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'cross-umugm-stan-benefit-2',
              title: '175+ Tryout spesialis',
              description: 'Tryout khusus UM UGM dan STAN',
              order: 2,
              planId: 'cross-umugm-stan-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'cross-umugm-stan-benefit-3',
              title: 'Konsultasi spesialis',
              description: 'Konsultasi dengan ahli UGM dan STAN',
              order: 3,
              planId: 'cross-umugm-stan-bundle-premium',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 170,
            notes: 850,
            vision: 85,
            quiz: 340,
            tryout: 170,
            expireDays: 365,
            validFrom: '2024-01-01',
            validUntil: '2024-12-31',
            isTimebound: true,
            id: 'cross-limitation-umugm-stan',
            planId: 'cross-umugm-stan-bundle-premium',
          },
          discount: 31,
          PlanSubscription: {
            id: 'cross-sub-umugm-stan',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'cross-umugm-stan-bundle-premium',
            tier: 'CROSS_PREMIUM',
            expireDays: 365,
            websiteSubCategoryId: 'um-ugm-stan',
            PlanFeature: [
              {
                id: 'cross-umugm-stan-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 4,
                planSubscriptionId: 'cross-sub-umugm-stan',
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'um-ugm-stan',
              name: 'UM UGM + STAN',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#2E8B57',
              secondary_color: '#DC143C',
              website_category_id: 'cross-umugm-stan-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '1 tahun',
        },
      ],
      subscriptions: [
        {
          id: 'cross-umugm-stan-subscription-6month',
          slug: 'umugm-stan-subscription-6month',
          name: 'UM UGM + STAN Subscription 6 Bulan',
          description: 'Langganan 6 bulan akses lengkap UM UGM dan STAN',
          roleDiscord: null,
          image: null,
          originalPrice: 360000,
          price: 269000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'cross-umugm-stan-sub-benefit-1',
              title: 'Akses dual platform 6 bulan',
              description: 'Akses lengkap UM UGM dan STAN selama 6 bulan',
              order: 1,
              planId: 'cross-umugm-stan-subscription-6month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'cross-umugm-stan-sub-benefit-2',
              title: 'Forum eksklusif',
              description: 'Forum alumni UGM dan komunitas STAN',
              order: 2,
              planId: 'cross-umugm-stan-subscription-6month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 110,
            notes: 550,
            vision: 55,
            quiz: 220,
            tryout: 110,
            expireDays: 180,
            validFrom: '2024-01-01',
            validUntil: '2024-07-01',
            isTimebound: true,
            id: 'cross-sub-limitation-umugm-stan',
            planId: 'cross-umugm-stan-subscription-6month',
          },
          discount: 25,
          PlanSubscription: {
            id: 'cross-sub-umugm-stan-6m',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'cross-umugm-stan-subscription-6month',
            tier: 'CROSS_PREMIUM',
            expireDays: 180,
            websiteSubCategoryId: 'um-ugm-stan',
            PlanFeature: [
              {
                id: 'cross-umugm-stan-sub-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 3,
                planSubscriptionId: 'cross-sub-umugm-stan-6m',
                validFrom: '2024-01-01',
                validUntil: '2024-07-01',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'um-ugm-stan',
              name: 'UM UGM + STAN',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#2E8B57',
              secondary_color: '#DC143C',
              website_category_id: 'cross-umugm-stan-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '6 bulan',
        },
      ],
    },
    {
      webSubCategoryId: 'all-access',
      webSubCategoryName: 'All Access',
      main_color: '#8B5CF6',
      secondary_color: '#06B6D4',
      bundles: [
        {
          id: 'all-access-bundle-ultimate',
          slug: 'all-access-ultimate-bundle',
          name: 'All Access Ultimate Bundle',
          description:
            'Paket lengkap akses semua program: SNBT, SIMAK UI, UM UGM, dan STAN',
          roleDiscord: null,
          image: null,
          originalPrice: 950000,
          price: 699000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'all-access-benefit-1',
              title: 'Akses semua program',
              description: 'SNBT, SIMAK UI, UM UGM, dan STAN lengkap',
              order: 1,
              planId: 'all-access-bundle-ultimate',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'all-access-benefit-2',
              title: '400+ Tryout lengkap',
              description: 'Koleksi tryout semua program dengan pembahasan',
              order: 2,
              planId: 'all-access-bundle-ultimate',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'all-access-benefit-3',
              title: 'Konsultasi all-in-one',
              description: 'Konsultasi dengan semua spesialis program',
              order: 3,
              planId: 'all-access-bundle-ultimate',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'all-access-benefit-4',
              title: 'Live class unlimited',
              description: 'Akses semua live class dan webinar',
              order: 4,
              planId: 'all-access-bundle-ultimate',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 400,
            notes: 2000,
            vision: 200,
            quiz: 800,
            tryout: 400,
            expireDays: 365,
            validFrom: '2024-01-01',
            validUntil: '2024-12-31',
            isTimebound: true,
            id: 'all-access-limitation',
            planId: 'all-access-bundle-ultimate',
          },
          discount: 26,
          PlanSubscription: {
            id: 'all-access-sub',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'all-access-bundle-ultimate',
            tier: 'ALL_ACCESS_ULTIMATE',
            expireDays: 365,
            websiteSubCategoryId: 'all-access',
            PlanFeature: [
              {
                id: 'all-access-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 8,
                planSubscriptionId: 'all-access-sub',
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
              {
                id: 'all-access-feature-2',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'DOCUMENT' as const,
                planSubscriptionId: 'all-access-sub',
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
              {
                id: 'all-access-feature-3',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'LIVECLASS' as const,
                liveClassesPerWeek: 4,
                planSubscriptionId: 'all-access-sub',
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'all-access',
              name: 'All Access',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#8B5CF6',
              secondary_color: '#06B6D4',
              website_category_id: 'all-access-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '1 tahun',
        },
      ],
      subscriptions: [
        {
          id: 'all-access-subscription-12month',
          slug: 'all-access-subscription-12month',
          name: 'All Access Subscription 12 Bulan',
          description:
            'Langganan 12 bulan akses semua program dengan harga spesial',
          roleDiscord: null,
          image: null,
          originalPrice: 750000,
          price: 549000,
          status: 'PUBLIC' as const,
          maxUsers: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          totalUsers: 0,
          PlanBenefit: [
            {
              id: 'all-access-sub-benefit-1',
              title: 'Akses semua platform 12 bulan',
              description: 'Akses lengkap semua program selama 1 tahun',
              order: 1,
              planId: 'all-access-subscription-12month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'all-access-sub-benefit-2',
              title: 'Update materi berkala',
              description: 'Update materi terbaru semua program',
              order: 2,
              planId: 'all-access-subscription-12month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'all-access-sub-benefit-3',
              title: 'Komunitas eksklusif',
              description: 'Akses forum dan komunitas semua program',
              order: 3,
              planId: 'all-access-subscription-12month',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          PlanLimitation: {
            chat: 300,
            notes: 1500,
            vision: 150,
            quiz: 600,
            tryout: 300,
            expireDays: 365,
            validFrom: '2024-01-01',
            validUntil: '2024-12-31',
            isTimebound: true,
            id: 'all-access-sub-limitation',
            planId: 'all-access-subscription-12month',
          },
          discount: 27,
          PlanSubscription: {
            id: 'all-access-sub-12m',
            createdAt: new Date(),
            updatedAt: new Date(),
            planId: 'all-access-subscription-12month',
            tier: 'ALL_ACCESS_PREMIUM',
            expireDays: 365,
            websiteSubCategoryId: 'all-access',
            PlanFeature: [
              {
                id: 'all-access-sub-feature-1',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'COURSE' as const,
                liveClassesPerWeek: 6,
                planSubscriptionId: 'all-access-sub-12m',
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
              {
                id: 'all-access-sub-feature-2',
                createdAt: new Date(),
                updatedAt: new Date(),
                type: 'LIVECLASS' as const,
                liveClassesPerWeek: 2,
                planSubscriptionId: 'all-access-sub-12m',
                validFrom: '2024-01-01',
                validUntil: '2024-12-31',
                isTimebound: true,
                Pivot_Plan_Category: [],
              },
            ],
            WebsiteSubCategory: {
              id: 'all-access',
              name: 'All Access',
              createdAt: new Date(),
              updatedAt: new Date(),
              main_color: '#8B5CF6',
              secondary_color: '#06B6D4',
              website_category_id: 'all-access-cat',
            },
          },
          Pivot_LiveClass_Plan: [],
          timeline: '12 bulan',
        },
      ],
    },
  ],
  topping: [
    {
      id: 'coin-100',
      slug: 'coin-100',
      name: '100 Coin',
      description: 'Coin untuk akses fitur premium',
      roleDiscord: null,
      image: null,
      originalPrice: 25000,
      price: 25000,
      status: 'PUBLIC' as const,
      maxUsers: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalUsers: 0,
      PlanBenefit: [],
      PlanLimitation: {
        chat: 10,
        notes: 50,
        vision: 5,
        quiz: 20,
        tryout: 10,
        expireDays: 180,
        validFrom: '2024-01-01',
        validUntil: '2024-07-01',
        isTimebound: true,
        id: 'coin-100-limitation',
        planId: 'coin-100',
      },
      discount: 0,
      PlanSubscription: {
        id: 'coin-100-sub',
        createdAt: new Date(),
        updatedAt: new Date(),
        planId: 'coin-100',
        tier: 'COIN',
        expireDays: 180,
        websiteSubCategoryId: 'snbt', // Default to SNBT
        PlanFeature: [],
        WebsiteSubCategory: {
          id: 'snbt',
          name: 'SNBT',
          createdAt: new Date(),
          updatedAt: new Date(),
          main_color: '#FF6B35',
          secondary_color: '#F7931E',
          website_category_id: 'snbt-cat',
        },
      },
      Pivot_LiveClass_Plan: [],
      timeline: '6 bulan',
    },
    {
      id: 'coin-250',
      slug: 'coin-250',
      name: '250 Coin',
      description: 'Coin lebih hemat untuk pengguna aktif',
      roleDiscord: null,
      image: null,
      originalPrice: 62500,
      price: 55000,
      status: 'PUBLIC' as const,
      maxUsers: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalUsers: 0,
      PlanBenefit: [
        {
          id: 'coin-250-benefit-1',
          title: 'Bonus 25 coin',
          description: 'Bonus coin untuk pengguna aktif',
          order: 1,
          planId: 'coin-250',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      PlanLimitation: {
        chat: 25,
        notes: 125,
        vision: 12,
        quiz: 50,
        tryout: 25,
        expireDays: 180,
        validFrom: '2024-01-01',
        validUntil: '2024-07-01',
        isTimebound: true,
        id: 'coin-250-limitation',
        planId: 'coin-250',
      },
      discount: 12,
      PlanSubscription: {
        id: 'coin-250-sub',
        createdAt: new Date(),
        updatedAt: new Date(),
        planId: 'coin-250',
        tier: 'COIN',
        expireDays: 180,
        websiteSubCategoryId: 'snbt',
        PlanFeature: [],
        WebsiteSubCategory: {
          id: 'snbt',
          name: 'SNBT',
          createdAt: new Date(),
          updatedAt: new Date(),
          main_color: '#FF6B35',
          secondary_color: '#F7931E',
          website_category_id: 'snbt-cat',
        },
      },
      Pivot_LiveClass_Plan: [],
      timeline: '6 bulan',
    },
    {
      id: 'coin-500',
      slug: 'coin-500',
      name: '500 Coin',
      description: 'Coin terbesar dengan diskon maksimal',
      roleDiscord: null,
      image: null,
      originalPrice: 125000,
      price: 100000,
      status: 'PUBLIC' as const,
      maxUsers: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalUsers: 0,
      PlanBenefit: [
        {
          id: 'coin-500-benefit-1',
          title: 'Bonus 100 coin',
          description: 'Bonus coin terbesar',
          order: 1,
          planId: 'coin-500',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'coin-500-benefit-2',
          title: 'Valid 12 bulan',
          description: 'Masa berlaku lebih lama',
          order: 2,
          planId: 'coin-500',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      PlanLimitation: {
        chat: 50,
        notes: 250,
        vision: 25,
        quiz: 100,
        tryout: 50,
        expireDays: 365,
        validFrom: '2024-01-01',
        validUntil: '2024-12-31',
        isTimebound: true,
        id: 'coin-500-limitation',
        planId: 'coin-500',
      },
      discount: 20,
      PlanSubscription: {
        id: 'coin-500-sub',
        createdAt: new Date(),
        updatedAt: new Date(),
        planId: 'coin-500',
        tier: 'COIN',
        expireDays: 365,
        websiteSubCategoryId: 'snbt',
        PlanFeature: [],
        WebsiteSubCategory: {
          id: 'snbt',
          name: 'SNBT',
          createdAt: new Date(),
          updatedAt: new Date(),
          main_color: '#FF6B35',
          secondary_color: '#F7931E',
          website_category_id: 'snbt-cat',
        },
      },
      Pivot_LiveClass_Plan: [],
      timeline: '12 bulan',
    },
  ],
  productCompare: {
    subscription: [],
    bundles: [],
    listCompare: [],
  },
};

type PricingDataType = typeof dummyPricingData;

export default function PricingPlans() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category or use default
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const searchParams = useSearchParams();
  const voucherCodeQuery = searchParams.get('voucherCode');

  // Use dummy data instead of API call
  const PricingData: PricingDataType = dummyPricingData;
  const topping = PricingData?.topping || [];

  useEffect(() => {
    // ✅ ENRICHED VIEWCONTENT EVENT DATA
    pixel.meta.track(
      'ViewContent',
      {
        content_name: 'Pricing Page',
        content_type: 'page',
      },
      // ✅ Advanced Matching untuk Meta Pixel
      session?.user
        ? {
            em: session.user.email,
            ph: session.user.phone || undefined,
            fn: session.user.name?.split(' ')[0],
            ln: session.user.name?.split(' ').slice(1).join(' '),
          }
        : undefined,
    );
    pixel.tiktok.track('ViewContent', {
      content_name: 'Pricing Page',
      page_path: '/price',
      content_id: 'pricing_page_main', // ✅ Required untuk TikTok VSA
    });
  }, [session]);

  return (
    <div className="space-y-20">
      {/* Enhanced Header Section */}
      <div className="text-center mb-16">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-6"
          style={{
            backgroundColor: `${mainColor}10`,
            color: mainColor,
          }}
        >
          <Crown size={16} />
          Pilih Paket Terbaik
        </div>

        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
          style={{ color: mainColor }}
        >
          Sudah Siap Mulai Belajar?
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Pilih paket yang sesuai dengan kebutuhanmu dan mulai perjalanan
          belajar bersama{' '}
          <span
            style={{ color: mainColor }}
            className="font-semibold"
          >
            Bimbelio
          </span>
        </p>
      </div>

      {/* Enhanced Category Tabs */}
      <div className="max-w-7xl mx-auto">
        <Tabs
          defaultValue="individual"
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="flex overflow-x-auto h-12 p-2 rounded-xl bg-gray-50">
              <TabsTrigger
                value="individual"
                className="rounded-lg font-medium data-[state=active]:shadow-sm transition-all px-6"
                style={
                  {
                    '--tw-data-state-active-bg': mainColor,
                    '--tw-data-state-active-color': 'white',
                  } as React.CSSProperties
                }
              >
                <div className="flex items-center gap-2">
                  <Target size={16} />
                  Program Individual
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="combo"
                className="rounded-lg font-medium data-[state=active]:shadow-sm transition-all px-6"
                style={
                  {
                    '--tw-data-state-active-bg': mainColor,
                    '--tw-data-state-active-color': 'white',
                  } as React.CSSProperties
                }
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} />
                  Paket Combo Hemat
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="all-access"
                className="rounded-lg font-medium data-[state=active]:shadow-sm transition-all px-6"
                style={
                  {
                    '--tw-data-state-active-bg': mainColor,
                    '--tw-data-state-active-color': 'white',
                  } as React.CSSProperties
                }
              >
                <div className="flex items-center gap-2">
                  <Crown size={16} />
                  All Access Premium
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Individual Programs Tab */}
          <TabsContent
            value="individual"
            className="w-full"
          >
            <Tabs
              defaultValue="snbt"
              className="w-full"
            >
              <div className="flex justify-center mb-8">
                <TabsList className="flex overflow-x-auto h-10 p-1 rounded-lg bg-gray-50">
                  {PricingData?.webSubCategory
                    .filter((ws) =>
                      ['snbt', 'simak-ui', 'um-ugm', 'stan'].includes(
                        ws.webSubCategoryId,
                      ),
                    )
                    .map((ws) => (
                      <TabsTrigger
                        key={ws.webSubCategoryId}
                        value={ws.webSubCategoryId}
                        className="rounded-md font-medium data-[state=active]:shadow-sm transition-all px-4"
                        style={
                          {
                            '--tw-data-state-active-bg': ws.main_color,
                            '--tw-data-state-active-color': 'white',
                          } as React.CSSProperties
                        }
                      >
                        <div className="flex items-center gap-2">
                          {ws.webSubCategoryId === 'snbt' && (
                            <Trophy size={14} />
                          )}
                          {ws.webSubCategoryId === 'simak-ui' && (
                            <Target size={14} />
                          )}
                          {ws.webSubCategoryId === 'um-ugm' && (
                            <Star size={14} />
                          )}
                          {ws.webSubCategoryId === 'stan' && (
                            <Crown size={14} />
                          )}
                          {ws.webSubCategoryName}
                        </div>
                      </TabsTrigger>
                    ))}
                </TabsList>
              </div>

              {PricingData?.webSubCategory
                .filter((ws) =>
                  ['snbt', 'simak-ui', 'um-ugm', 'stan'].includes(
                    ws.webSubCategoryId,
                  ),
                )
                .map((ws) => (
                  <TabsContent
                    key={ws.webSubCategoryId}
                    value={ws.webSubCategoryId}
                    className="w-full"
                  >
                    {/* Enhanced Sub-category tabs for Bundle/Subscription */}
                    <Tabs
                      defaultValue="bundle"
                      className="w-full"
                    >
                      <TabsList
                        className="grid w-fit max-w-md mx-auto grid-cols-2 mb-8 h-10 p-1 rounded-lg"
                        style={{
                          backgroundColor: `${ws.main_color}08`,
                        }}
                      >
                        <TabsTrigger
                          value="bundle"
                          className="rounded-md font-medium data-[state=active]:shadow-sm transition-all"
                          style={
                            {
                              '--tw-data-state-active-bg': ws.main_color,
                              '--tw-data-state-active-color': 'white',
                            } as React.CSSProperties
                          }
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles size={14} />
                            Paket Lengkap
                          </div>
                        </TabsTrigger>
                        <TabsTrigger
                          value="subscription"
                          className="rounded-md font-medium data-[state=active]:shadow-sm transition-all"
                          style={
                            {
                              '--tw-data-state-active-bg': ws.main_color,
                              '--tw-data-state-active-color': 'white',
                            } as React.CSSProperties
                          }
                        >
                          <div className="flex items-center gap-2">
                            <Zap size={14} />
                            Berlangganan
                          </div>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="subscription">
                        {ws.subscriptions.length === 0 ? (
                          <EmptyPlan
                            type="subscription"
                            categoryName={ws.webSubCategoryName}
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {ws.subscriptions.map((plan, i) => {
                              return (
                                <CardPlan
                                  key={i}
                                  plan={plan}
                                  discount={plan.discount}
                                />
                              );
                            })}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="bundle">
                        {ws.bundles.length === 0 ? (
                          <EmptyPlan
                            type="bundle"
                            categoryName={ws.webSubCategoryName}
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {ws.bundles.map((bundle, i) => (
                              <CardPlan
                                key={i}
                                plan={bundle}
                                discount={bundle.discount}
                              />
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                ))}
            </Tabs>
          </TabsContent>

          {/* Combo Deals Tab */}
          <TabsContent
            value="combo"
            className="w-full"
          >
            <div className="text-center mb-8">
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: mainColor }}
              >
                Hemat hingga 31% dengan Paket Combo!
              </h3>
              <p className="text-gray-600">
                Siapkan 2 program sekaligus dengan harga lebih terjangkau
              </p>
            </div>

            <Tabs
              defaultValue="snbt-simak-ui"
              className="w-full"
            >
              <div className="flex justify-center mb-8">
                <TabsList className="flex overflow-x-auto h-10 p-1 rounded-lg bg-gray-50">
                  {PricingData?.webSubCategory
                    .filter((ws) =>
                      ['snbt-simak-ui', 'um-ugm-stan'].includes(
                        ws.webSubCategoryId,
                      ),
                    )
                    .map((ws) => (
                      <TabsTrigger
                        key={ws.webSubCategoryId}
                        value={ws.webSubCategoryId}
                        className="rounded-md font-medium data-[state=active]:shadow-sm transition-all px-4"
                        style={
                          {
                            '--tw-data-state-active-bg': ws.main_color,
                            '--tw-data-state-active-color': 'white',
                          } as React.CSSProperties
                        }
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles size={14} />
                          {ws.webSubCategoryName}
                        </div>
                      </TabsTrigger>
                    ))}
                </TabsList>
              </div>

              {PricingData?.webSubCategory
                .filter((ws) =>
                  ['snbt-simak-ui', 'um-ugm-stan'].includes(
                    ws.webSubCategoryId,
                  ),
                )
                .map((ws) => (
                  <TabsContent
                    key={ws.webSubCategoryId}
                    value={ws.webSubCategoryId}
                    className="w-full"
                  >
                    <Tabs
                      defaultValue="bundle"
                      className="w-full"
                    >
                      <TabsList
                        className="grid w-fit max-w-md mx-auto grid-cols-2 mb-8 h-10 p-1 rounded-lg"
                        style={{
                          backgroundColor: `${ws.main_color}08`,
                        }}
                      >
                        <TabsTrigger
                          value="bundle"
                          className="rounded-md font-medium data-[state=active]:shadow-sm transition-all"
                          style={
                            {
                              '--tw-data-state-active-bg': ws.main_color,
                              '--tw-data-state-active-color': 'white',
                            } as React.CSSProperties
                          }
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles size={14} />
                            Paket Lengkap
                          </div>
                        </TabsTrigger>
                        <TabsTrigger
                          value="subscription"
                          className="rounded-md font-medium data-[state=active]:shadow-sm transition-all"
                          style={
                            {
                              '--tw-data-state-active-bg': ws.main_color,
                              '--tw-data-state-active-color': 'white',
                            } as React.CSSProperties
                          }
                        >
                          <div className="flex items-center gap-2">
                            <Zap size={14} />
                            Berlangganan
                          </div>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="subscription">
                        {ws.subscriptions.length === 0 ? (
                          <EmptyPlan
                            type="subscription"
                            categoryName={ws.webSubCategoryName}
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {ws.subscriptions.map((plan, i) => {
                              return (
                                <CardPlan
                                  key={i}
                                  plan={plan}
                                  discount={plan.discount}
                                />
                              );
                            })}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="bundle">
                        {ws.bundles.length === 0 ? (
                          <EmptyPlan
                            type="bundle"
                            categoryName={ws.webSubCategoryName}
                          />
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {ws.bundles.map((bundle, i) => (
                              <CardPlan
                                key={i}
                                plan={bundle}
                                discount={bundle.discount}
                              />
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                ))}
            </Tabs>
          </TabsContent>

          {/* All Access Tab */}
          <TabsContent
            value="all-access"
            className="w-full"
          >
            <div className="text-center mb-8">
              <h3
                className="text-2xl font-bold mb-2"
                style={{ color: mainColor }}
              >
                Akses Semua Program dengan Harga Terbaik!
              </h3>
              <p className="text-gray-600">
                Satu paket untuk semua kebutuhan persiapan tes masuk perguruan
                tinggi
              </p>
            </div>

            {PricingData?.webSubCategory
              .filter((ws) => ws.webSubCategoryId === 'all-access')
              .map((ws) => (
                <div
                  key={ws.webSubCategoryId}
                  className="w-full"
                >
                  <Tabs
                    defaultValue="bundle"
                    className="w-full"
                  >
                    <TabsList
                      className="grid w-fit max-w-md mx-auto grid-cols-2 mb-8 h-10 p-1 rounded-lg"
                      style={{
                        backgroundColor: `${ws.main_color}08`,
                      }}
                    >
                      <TabsTrigger
                        value="bundle"
                        className="rounded-md font-medium data-[state=active]:shadow-sm transition-all"
                        style={
                          {
                            '--tw-data-state-active-bg': ws.main_color,
                            '--tw-data-state-active-color': 'white',
                          } as React.CSSProperties
                        }
                      >
                        <div className="flex items-center gap-2">
                          <Crown size={14} />
                          Paket Ultimate
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="subscription"
                        className="rounded-md font-medium data-[state=active]:shadow-sm transition-all"
                        style={
                          {
                            '--tw-data-state-active-bg': ws.main_color,
                            '--tw-data-state-active-color': 'white',
                          } as React.CSSProperties
                        }
                      >
                        <div className="flex items-center gap-2">
                          <Zap size={14} />
                          Berlangganan Premium
                        </div>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="subscription">
                      {ws.subscriptions.length === 0 ? (
                        <EmptyPlan
                          type="subscription"
                          categoryName={ws.webSubCategoryName}
                        />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                          {ws.subscriptions.map((plan, i) => {
                            return (
                              <CardPlan
                                key={i}
                                plan={plan}
                                discount={plan.discount}
                              />
                            );
                          })}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="bundle">
                      {ws.bundles.length === 0 ? (
                        <EmptyPlan
                          type="bundle"
                          categoryName={ws.webSubCategoryName}
                        />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                          {ws.bundles.map((bundle, i) => (
                            <CardPlan
                              key={i}
                              plan={bundle}
                              discount={bundle.discount}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Enhanced Coin Topping Section */}
      <div className="relative">
        <div className="relative z-10 text-center mb-12">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-6"
            style={{
              backgroundColor: `${secondaryColor}15`,
              color: secondaryColor,
            }}
          >
            <Zap size={16} />
            Tambah Coin
          </div>

          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: mainColor }}
          >
            Paket Coin Tambahan
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tambah coin untuk mengakses lebih banyak fitur seperti notes, chat,
            tryout, quiz, dan vision dengan mudah dan fleksibel
          </p>
        </div>

        {topping.length === 0 ? (
          <EmptyPlan type="coin" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {topping.map((pack) => (
              <CardPlanTopping
                plan={pack}
                key={pack.name}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

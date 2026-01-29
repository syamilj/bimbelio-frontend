import {
  QuizVolume,
  Tryout,
  TryoutCategory,
  TryoutResult,
  TryoutSession,
  TryoutSubCategory,
} from '@/types/database';
import { Dispatch, SetStateAction, useState } from 'react';

type useVolumeType = {
  selectedVolumeId: string | null;
  setSelectedVolumeId: Dispatch<SetStateAction<string | null>>;
  QuizVolumeList: QuizVolume[] | null;
  SingleQuizVolume:
    | (QuizVolume & {
        Tryout: (Tryout & {
          TryoutCategory: TryoutCategory;
          TryoutSubCategory: TryoutSubCategory;
          TryoutSession: TryoutSession & {
            CorrectAnswersCount: number;
            WrongAnswersCount: number;
            NotAnswersCount: number;
          };
          TryoutQuestionCount: number;
          TryoutResult: TryoutResult | null;
          isDone: boolean;
          totalParticipant: number;
        })[];
        totalUserSubscribed: number;
      })
    | null;
  isVolumeStarted: boolean;
  isVolumeEnded: boolean;
};

export const useVolume = (): useVolumeType => {
  const [selectedVolumeId, setSelectedVolumeId] = useState<string | null>(
    'vol-001',
  );
  return {
    selectedVolumeId,
    setSelectedVolumeId,
    QuizVolumeList: [
      {
        number: 1,
        website_sub_category_id: 'sub-cat-001',
        id: 'vol-001',
        title: 'Volume 1 - Dasar Matematika',
        startDate: '2026-01-15',
        endDate: '2026-02-15',
        status: 'PUBLIC',
        createdAt: '2026-01-01',
        updatedAt: '2026-01-10',
      },
      {
        number: 2,
        website_sub_category_id: 'sub-cat-001',
        id: 'vol-002',
        title: 'Volume 2 - Aljabar',
        startDate: '2026-02-16',
        endDate: '2026-03-16',
        status: 'PUBLIC',
        createdAt: '2026-01-05',
        updatedAt: '2026-01-12',
      },
      {
        number: 3,
        website_sub_category_id: 'sub-cat-001',
        id: 'vol-003',
        title: 'Volume 3 - Geometri',
        startDate: '2026-03-17',
        endDate: '2026-04-17',
        status: 'PRIVATE',
        createdAt: '2026-01-08',
        updatedAt: '2026-01-14',
      },
    ],

    SingleQuizVolume: {
      number: 1,
      website_sub_category_id: 'sub-cat-001',
      id: 'vol-001',
      title: 'Volume 1 - Dasar Matematika',
      startDate: '2026-01-15',
      endDate: '2026-02-15',
      status: 'PUBLIC',
      createdAt: '2026-01-01',
      updatedAt: '2026-01-10',
      totalUserSubscribed: 1250,
      Tryout: [
        {
          website_sub_category_id: 'sub-cat-001',
          id: 'tryout-001',
          title: 'Tryout 1 - Operasi Dasar',
          restTime: 15,
          status: 'PUBLIC',
          startDate: '2026-01-15',
          endDate: '2026-02-15',
          resultDate: '2026-02-16',
          createAt: '2026-01-01',
          updateAt: '2026-01-10',
          image: 'https://example.com/tryout1.jpg',
          instagram: '@bimbelio',
          tiktok: '@bimbelio',
          quizOrder: 1,
          TryoutCategory: {
            name: 'Matematika',
            id: 'cat-001',
            slug: 'matematika',
            description: 'Kategori untuk soal-soal matematika dasar',
            createAt: new Date('2026-01-01'),
            updateAt: new Date('2026-01-10'),
            image: 'https://example.com/math-cat.jpg',
            website_sub_category_id: 'sub-cat-001',
          },
          TryoutSubCategory: {
            id: 'subcat_001',
            name: 'Aritmetika',
            categoryId: 'cat-001',
            website_sub_category_id: 'sub-cat-001',
          },
          TryoutSession: {
            number: 1,
            name: 'Sesi 1 - Penjumlahan dan Pengurangan',
            id: 'session-001',
            slug: 'sesi-1-penjumlahan',
            description:
              'Sesi pertama tentang operasi penjumlahan dan pengurangan',
            documentId: 'doc-001',
            subCategoryId: 'subcat_001',
            categoryId: 'cat-001',
            tryoutId: 'tryout-001',
            duration: 60,
            assessmentType: 'OBJECTIVE_5',
            thresholdValue: 70,
            createAt: new Date('2026-01-01'),
            updateAt: new Date('2026-01-10'),
            website_sub_category_id: 'sub-cat-001',
            CorrectAnswersCount: 8,
            WrongAnswersCount: 2,
            NotAnswersCount: 0,
          },
          TryoutQuestionCount: 10,
          TryoutResult: {
            id: 'result-001',
            website_sub_category_id: 'sub-cat-001',
            userId: 'user-001',
            tryoutId: 'tryout-001',
            totalScore: 800,
            startTryout: new Date('2026-01-15'),
            endTryout: new Date('2026-01-15'),
          },
          isDone: true,
          totalParticipant: 450,
        },
        {
          website_sub_category_id: 'sub-cat-001',
          id: 'tryout-002',
          title: 'Tryout 2 - Perkalian dan Pembagian',
          restTime: 15,
          status: 'PUBLIC',
          startDate: '2026-01-20',
          endDate: '2026-02-10',
          resultDate: '2026-02-11',
          createAt: '2026-01-05',
          updateAt: '2026-01-12',
          image: 'https://example.com/tryout2.jpg',
          instagram: '@bimbelio',
          tiktok: '@bimbelio',
          quizOrder: 2,
          TryoutCategory: {
            name: 'Matematika',
            id: 'cat-001',
            slug: 'matematika',
            description: 'Kategori untuk soal-soal matematika dasar',
            createAt: new Date('2026-01-01'),
            updateAt: new Date('2026-01-10'),
            image: 'https://example.com/math-cat.jpg',
            website_sub_category_id: 'sub-cat-001',
          },
          TryoutSubCategory: {
            id: 'subcat_002',
            name: 'Operasi Lanjut',
            categoryId: 'cat-001',
            website_sub_category_id: 'sub-cat-001',
          },
          TryoutSession: {
            number: 2,
            name: 'Sesi 2 - Perkalian dan Pembagian',
            id: 'session-002',
            slug: 'sesi-2-perkalian',
            description: 'Sesi kedua tentang operasi perkalian dan pembagian',
            documentId: 'doc-002',
            subCategoryId: 'subcat_002',
            categoryId: 'cat-001',
            tryoutId: 'tryout-002',
            duration: 60,
            assessmentType: 'OBJECTIVE_5',
            thresholdValue: 70,
            createAt: new Date('2026-01-05'),
            updateAt: new Date('2026-01-12'),
            website_sub_category_id: 'sub-cat-001',
            CorrectAnswersCount: 7,
            WrongAnswersCount: 2,
            NotAnswersCount: 1,
          },
          TryoutQuestionCount: 10,
          TryoutResult: null,
          isDone: false,
          totalParticipant: 420,
        },
        {
          website_sub_category_id: 'sub-cat-001',
          id: 'tryout-003',
          title: 'Tryout 3 - Pecahan dan Desimal',
          restTime: 15,
          status: 'PUBLIC',
          startDate: '2026-02-01',
          endDate: '2026-03-01',
          resultDate: '2026-03-02',
          createAt: '2026-01-08',
          updateAt: '2026-01-15',
          image: 'https://example.com/tryout3.jpg',
          instagram: '@bimbelio',
          tiktok: '@bimbelio',
          quizOrder: 3,
          TryoutCategory: {
            name: 'Matematika',
            id: 'cat-001',
            slug: 'matematika',
            description: 'Kategori untuk soal-soal matematika dasar',
            createAt: new Date('2026-01-01'),
            updateAt: new Date('2026-01-10'),
            image: 'https://example.com/math-cat.jpg',
            website_sub_category_id: 'sub-cat-001',
          },
          TryoutSubCategory: {
            id: 'subcat_003',
            name: 'Pecahan',
            categoryId: 'cat-001',
            website_sub_category_id: 'sub-cat-001',
          },
          TryoutSession: {
            number: 3,
            name: 'Sesi 3 - Pecahan dan Desimal',
            id: 'session-003',
            slug: 'sesi-3-pecahan',
            description: 'Sesi ketiga tentang pecahan dan desimal',
            documentId: 'doc-003',
            subCategoryId: 'subcat_003',
            categoryId: 'cat-001',
            tryoutId: 'tryout-003',
            duration: 75,
            assessmentType: 'OBJECTIVE_5',
            thresholdValue: 70,
            createAt: new Date('2026-01-08'),
            updateAt: new Date('2026-01-15'),
            website_sub_category_id: 'sub-cat-001',
            CorrectAnswersCount: 0,
            WrongAnswersCount: 0,
            NotAnswersCount: 0,
          },
          TryoutQuestionCount: 12,
          TryoutResult: null,
          isDone: false,
          totalParticipant: 380,
        },
      ],
    },

    isVolumeStarted: true,
    isVolumeEnded: false,
  };
};

import { TypeCourseEnum } from '@/types/database';

export type { TypeCourseEnum };

export type SubChapterSearchResult = {
  id: string;
  title: string;
  description: string;
  type: TypeCourseEnum;
  spendTime: number;
  number: number;
  categoryName: string;
  categoryId: string;
  chapterTitle: string;
  isCompleted: boolean;
  video: string | null;
  document: string | null;
  materi: string | null;
};

export type TypeData = {
  id: string;
  name: string;
  CourseChapter: {
    isDone: boolean;
    title: string;
    CourseSubChapter: ({
      CourseProgress: {
        website_sub_category_id: string;
        id: string;
        createdAt: Date;
        userId: string;
        courseSubChapterId: string;
        totalScore: number | null;
      }[];
    } & {
      number: number;
      website_sub_category_id: string;
      id: string;
      title: string;
      description: string;
      courseChapterId: string;
      spendTime: number;
      type: TypeCourseEnum;
      premium: boolean;
      tryoutSessionId: string | null;
      video: string | null;
      document: string | null;
      materi: string | null;
    })[];
  }[];
  totalChapters: number;
  completedChapters: number;
  percentageProgress: number;
  totalSpendTime: number;
  totalTryout: number;
}[];

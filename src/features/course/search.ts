// Pencarian materi di semua course pada track aktif (data dari /course/getCategoryForCard).

export type CourseLessonType = 'VIDEO' | 'DOCUMENT' | 'MATERI' | 'TRYOUT';

export type CourseCardCategory = {
  id: string;
  name: string;
  CourseChapter: {
    title: string;
    CourseSubChapter: {
      id: string;
      title: string;
      description: string;
      type: CourseLessonType;
      CourseProgress: unknown[];
    }[];
  }[];
};

export type LessonSearchItem = {
  id: string;
  title: string;
  description: string;
  type: CourseLessonType;
  categoryId: string;
  categoryName: string;
  chapterTitle: string;
  isCompleted: boolean;
};

export function flattenLessons(
  categories: CourseCardCategory[],
): LessonSearchItem[] {
  return categories.flatMap((category) =>
    category.CourseChapter.flatMap((chapter) =>
      chapter.CourseSubChapter.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description ?? '',
        type: lesson.type,
        categoryId: category.id,
        categoryName: category.name,
        chapterTitle: chapter.title,
        isCompleted: lesson.CourseProgress.length > 0,
      })),
    ),
  );
}

export const MIN_QUERY_LENGTH = 2;

/** Cocokkan judul, deskripsi, mata pelajaran, dan bab (tanpa peduli huruf besar). */
export function searchLessons(
  items: LessonSearchItem[],
  query: string,
  limit = 50,
) {
  const q = query.trim().toLowerCase();
  if (q.length < MIN_QUERY_LENGTH) return [];
  return items
    .filter((item) =>
      [item.title, item.description, item.categoryName, item.chapterTitle].some(
        (field) => field.toLowerCase().includes(q),
      ),
    )
    .slice(0, limit);
}

export const LESSON_TYPE_LABEL: Record<CourseLessonType, string> = {
  VIDEO: 'Video',
  DOCUMENT: 'Dokumen',
  MATERI: 'Materi',
  TRYOUT: 'Try out',
};

/** URL membuka satu materi di ruang belajar course. */
export const lessonHref = (
  trackId: string | null,
  item: Pick<LessonSearchItem, 'id' | 'categoryId'>,
) =>
  `/${trackId ?? 'choice'}/user/bimcourse/${item.categoryId}/study?sub=${item.id}&tab=chat`;

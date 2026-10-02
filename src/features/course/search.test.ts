import { describe, expect, it } from 'vitest';
import {
  flattenLessons,
  lessonHref,
  searchLessons,
  type CourseCardCategory,
} from './search';

const data: CourseCardCategory[] = [
  {
    id: 'mat',
    name: 'Penalaran Matematika',
    CourseChapter: [
      {
        title: 'Aljabar',
        CourseSubChapter: [
          {
            id: 'l1',
            title: 'Persamaan kuadrat',
            description: 'Akar-akar',
            type: 'VIDEO',
            CourseProgress: [{}],
          },
          {
            id: 'l2',
            title: 'Fungsi',
            description: '',
            type: 'MATERI',
            CourseProgress: [],
          },
        ],
      },
    ],
  },
  {
    id: 'ind',
    name: 'Literasi Bahasa Indonesia',
    CourseChapter: [
      {
        title: 'Teks argumentasi',
        CourseSubChapter: [
          {
            id: 'l3',
            title: 'Ide pokok',
            description: 'Menentukan gagasan',
            type: 'DOCUMENT',
            CourseProgress: [],
          },
        ],
      },
    ],
  },
];

describe('pencarian materi', () => {
  const items = flattenLessons(data);

  it('meratakan semua sub-bab dengan konteksnya', () => {
    expect(items).toHaveLength(3);
    expect(items[0]).toMatchObject({
      categoryName: 'Penalaran Matematika',
      chapterTitle: 'Aljabar',
      isCompleted: true,
    });
  });

  it('mencocokkan judul, bab, dan mata pelajaran tanpa peduli huruf besar', () => {
    expect(searchLessons(items, 'KUADRAT').map((i) => i.id)).toEqual(['l1']);
    expect(searchLessons(items, 'aljabar').map((i) => i.id)).toEqual([
      'l1',
      'l2',
    ]);
    expect(searchLessons(items, 'literasi').map((i) => i.id)).toEqual(['l3']);
  });

  it('butuh minimal dua huruf', () => {
    expect(searchLessons(items, 'a')).toEqual([]);
  });

  it('membangun URL ruang belajar', () => {
    expect(lessonHref('utbk', items[2])).toBe(
      '/utbk/user/bimcourse/ind/study?sub=l3&tab=chat',
    );
  });
});

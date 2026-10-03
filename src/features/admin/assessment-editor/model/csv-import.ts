// Impor soal dari CSV. Dua format (sama dengan versi lama):
// - Tipe 1–5: Number | Question | Subcategory | Answer_A | Value_A | … | Answer_E | Value_E
// - Tipe lain: Number | Question | SubCategory | SubSubCategory | A | B | C | D | E |
//   Correct | Explanation [| Category | Chapter]  (Chapter dipisah "|")

import { binaryValues } from './scoring';
import type { AssessmentType, EditorQuestion } from './types';

export class CsvImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CsvImportError';
  }
}

export type ChapterOption = {
  id: string;
  title: string;
  Category: { id: string; name: string };
};

type Row = Record<string, string | undefined>;

export const CSV_FORMAT: Record<'weighted' | 'keyed', string[]> = {
  weighted: [
    'Number',
    'Question',
    'Subcategory',
    'Answer_A',
    'Value_A',
    'Answer_B',
    'Value_B',
    'Answer_C',
    'Value_C',
    'Answer_D',
    'Value_D',
    'Answer_E',
    'Value_E',
  ],
  keyed: [
    'Number',
    'Question',
    'SubCategory',
    'SubSubCategory',
    'A',
    'B',
    'C',
    'D',
    'E',
    'Correct',
    'Explanation',
    'Category',
    'Chapter',
  ],
};

export const csvFormatFor = (type: AssessmentType) =>
  type === '1-5' ? CSV_FORMAT.weighted : CSV_FORMAT.keyed;

/** Cocokkan nama kategori & bab (dari CSV) ke id bab course. */
export function resolveChapters(
  categoryName: string | undefined,
  chapterNames: string[],
  options: ChapterOption[],
  questionNumber: number,
) {
  const cat = (categoryName ?? '').trim().toLowerCase();
  const category = options.find(
    (o) => o.Category.name.toLowerCase() === cat,
  )?.Category;
  if (!category)
    throw new CsvImportError(
      `Kategori "${categoryName ?? ''}" tidak ditemukan pada soal nomor ${questionNumber}.`,
    );
  const matched = options.filter(
    (o) =>
      o.Category.id === category.id &&
      chapterNames.includes(o.title.toLowerCase()),
  );
  for (const name of chapterNames) {
    if (!matched.some((o) => o.title.toLowerCase() === name))
      throw new CsvImportError(
        `Bab "${name}" tidak ditemukan pada soal nomor ${questionNumber}.`,
      );
  }
  return {
    categoryId: category.id,
    courseChapterIds: matched.map((o) => o.id),
  };
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;

function keyedRow(
  row: Row,
  type: AssessmentType,
  chapters: ChapterOption[],
): EditorQuestion {
  const number = parseInt(row.Number ?? '', 10);
  const correct = (row.Correct ?? '').trim().toLowerCase();
  const { correct: right, wrong } = binaryValues(type);
  const course = row.Chapter
    ? resolveChapters(
        row.Category,
        row.Chapter.split('|').map((n) => n.trim().toLowerCase()),
        chapters,
        number,
      )
    : null;
  return {
    number,
    question: row.Question ?? '',
    subCategory: row.SubCategory || undefined,
    subSubCategory: row.SubSubCategory || undefined,
    explanation: row.Explanation || undefined,
    categoryId: course?.categoryId,
    courseChapterIds: course?.courseChapterIds ?? [],
    Answers: LETTERS.map((l) => ({
      answer: row[l] ?? '',
      value: l.toLowerCase() === correct ? right : wrong,
    })),
  };
}

function weightedRow(row: Row): EditorQuestion | 'invalid' {
  const answers = LETTERS.map((l) => {
    const text = row[`Answer_${l}`];
    const value = parseInt(row[`Value_${l}`] ?? '', 10);
    return text && !Number.isNaN(value) ? { answer: text, value } : null;
  }).filter((a) => a !== null);
  if (answers.length !== 5) return 'invalid';
  return {
    number: parseInt(row.Number ?? '', 10),
    question: row.Question ?? '',
    subCategory: row.Subcategory || undefined,
    subSubCategory: row.SubSubCategory || undefined,
    categoryId: row.categoryId || undefined,
    explanation: row.explanation || undefined,
    courseChapterIds: [],
    Answers: answers,
  };
}

/**
 * Ubah baris CSV menjadi soal. Melempar CsvImportError dengan pesan yang
 * menyebut nomor soal bila ada baris yang tidak valid.
 */
export function rowsToQuestions(
  rows: Row[],
  type: AssessmentType,
  chapters: ChapterOption[] = [],
): EditorQuestion[] {
  if (rows.length === 0)
    throw new CsvImportError('File CSV tidak berisi soal.');
  if (type === '1-5') {
    return rows.map((row) => {
      const q = weightedRow(row);
      if (q === 'invalid')
        throw new CsvImportError(
          `Soal nomor ${row.Number ?? '?'}: butuh 5 opsi lengkap dengan nilainya.`,
        );
      return q;
    });
  }
  const { correct } = binaryValues(type);
  return rows.map((row) => {
    const q = keyedRow(row, type, chapters);
    if (!q.Answers.some((a) => a.value === correct))
      throw new CsvImportError(
        `Soal nomor ${q.number}: jawaban benar tidak ditemukan (kolom Correct berisi A–E).`,
      );
    return q;
  });
}

const BASE64_IMAGE = /!\[[^\]]*\]\((data:image\/[^;]+;base64,[^)]+)\)/g;

/**
 * Gambar base64 di soal (format markdown) diunggah ke bucket `dump-images`
 * dan diganti URL publiknya.
 */
export async function replaceBase64Images(
  markdown: string,
  upload: (file: Blob, ext: string) => Promise<string>,
) {
  let result = markdown;
  for (const match of [...markdown.matchAll(BASE64_IMAGE)]) {
    const parsed = match[1].match(/^data:(image\/(\w+));base64,(.+)$/);
    if (!parsed) continue;
    const [, mime, ext, base64] = parsed;
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const url = await upload(new Blob([bytes], { type: mime }), ext);
    result = result.replace(match[0], `![Gambar](${url})`);
  }
  return result;
}

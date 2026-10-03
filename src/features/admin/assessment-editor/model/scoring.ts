// Aturan nilai jawaban per tipe penilaian. Satu tempat untuk logika yang
// dulu tersebar (dan sedikit berbeda) di empat salinan editor.

import type { AssessmentType, EditorAnswer } from './types';

export const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;

export const ASSESSMENT_LABELS: Record<AssessmentType, string> = {
  '1-5': '1–5 (bobot per opsi)',
  '+5/0': '+5 / 0',
  IRT: 'IRT',
  '+4/-1/0': '+4 / −1 / 0',
  '+1/0': '+1 / 0',
  '0-100': '0–100',
};

export const isAssessmentType = (v: unknown): v is AssessmentType =>
  typeof v === 'string' && v in ASSESSMENT_LABELS;

/** Nilai jawaban benar & salah untuk tipe biner. */
export function binaryValues(type: AssessmentType) {
  switch (type) {
    case '+5/0':
    case 'IRT':
      return { correct: 5, wrong: 0 };
    case '+4/-1/0':
      return { correct: 4, wrong: -1 };
    case '+1/0':
    case '0-100':
      return { correct: 1, wrong: 0 };
    case '1-5':
      return { correct: 5, wrong: 1 };
  }
}

export const isBinary = (type: AssessmentType) => type !== '1-5';

/** Lima opsi kosong dengan nilai awal sesuai tipe (opsi E benar). */
export function defaultAnswers(type: AssessmentType): EditorAnswer[] {
  if (type === '1-5') {
    return [1, 2, 3, 4, 5].map((value) => ({ answer: '', value }));
  }
  const { correct, wrong } = binaryValues(type);
  return [wrong, wrong, wrong, wrong, correct].map((value) => ({
    answer: '',
    value,
  }));
}

export type ValueOption = {
  value: number;
  label: string;
  kind?: 'correct' | 'wrong';
};

/** Tombol nilai yang ditampilkan di samping setiap opsi. */
export function valueOptions(type: AssessmentType): ValueOption[] {
  if (type === '1-5')
    return [1, 2, 3, 4, 5].map((v) => ({ value: v, label: `${v}` }));
  const { correct, wrong } = binaryValues(type);
  return [
    { value: wrong, label: 'Salah', kind: 'wrong' },
    { value: correct, label: 'Benar', kind: 'correct' },
  ];
}

export function isCorrectValue(
  value: number,
  type: AssessmentType | string | undefined,
  answers?: EditorAnswer[],
) {
  if (type === '1-5') {
    const max = Math.max(...(answers ?? []).map((a) => a.value), 5);
    return value === max;
  }
  if (!isAssessmentType(type)) return value > 0;
  return value === binaryValues(type).correct;
}

/** Huruf kunci jawaban ("A"–"E") atau "–" bila belum ada. */
export function answerKey(
  answers: EditorAnswer[],
  type: AssessmentType | string | undefined,
) {
  let index = -1;
  answers.forEach((a, i) => {
    if (isCorrectValue(a.value, type, answers)) index = i;
  });
  return index >= 0 ? (OPTION_LETTERS[index] ?? `${index + 1}`) : '–';
}

/**
 * Ubah nilai satu opsi.
 * - Tipe 1–5: nilai bertukar dengan opsi yang sebelumnya memakai nilai itu
 *   (bobot tetap permutasi 1..5).
 * - Tipe biner: menandai benar membuat opsi lain salah; menandai salah hanya
 *   mengubah opsi itu. (Versi lama menukar nilai juga di tipe biner sehingga
 *   menandai satu opsi "salah" membuat empat opsi lain menjadi "benar".)
 */
export function setAnswerValue(
  answers: EditorAnswer[],
  index: number,
  value: number,
  type: AssessmentType,
): EditorAnswer[] {
  if (type === '1-5') {
    const prev = answers[index]?.value;
    return answers.map((a, i) => {
      if (i === index) return { ...a, value };
      if (a.value === value) return { ...a, value: prev };
      return a;
    });
  }
  const { correct, wrong } = binaryValues(type);
  if (value === correct) {
    return answers.map((a, i) => ({
      ...a,
      value: i === index ? correct : wrong,
    }));
  }
  return answers.map((a, i) => (i === index ? { ...a, value: wrong } : a));
}

/**
 * Konversi nilai opsi saat tipe penilaian sesi diganti: opsi yang benar
 * menurut tipe lama tetap benar di tipe baru. Ke 1–5: opsi benar bernilai 5,
 * sisanya 1, 2, 3, 4 berurutan.
 */
export function convertAnswers(
  answers: EditorAnswer[],
  from: AssessmentType | string | undefined,
  to: AssessmentType,
): EditorAnswer[] {
  if (answers.length < 5) return answers;
  const correctIndex = answers.findIndex((a) =>
    isCorrectValue(a.value, from, answers),
  );
  if (to === '1-5') {
    let next = 0;
    return answers.map((a, i) =>
      i === correctIndex ? { ...a, value: 5 } : { ...a, value: ++next },
    );
  }
  const { correct, wrong } = binaryValues(to);
  return answers.map((a, i) => ({
    ...a,
    value: i === correctIndex ? correct : wrong,
  }));
}

/**
 * Nilai dari soal hasil AI/impor yang memakai skala 1–5 (5 = benar)
 * ke tipe sesi.
 */
export function fromFivePointValue(value: number, type: AssessmentType) {
  if (type === '1-5') return value;
  const { correct, wrong } = binaryValues(type);
  return value === 5 ? correct : wrong;
}

export const hasCorrectAnswer = (
  answers: EditorAnswer[],
  type: AssessmentType,
) => answers.some((a) => isCorrectValue(a.value, type, answers));

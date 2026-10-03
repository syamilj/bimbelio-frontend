import LZString from 'lz-string';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  CsvImportError,
  replaceBase64Images,
  resolveChapters,
  rowsToQuestions,
} from './csv-import';
import {
  clearDraft,
  draftKey,
  draftMatchesServer,
  readDraft,
  writeDraft,
} from './draft';
import {
  addQuestion,
  appendGenerated,
  changeSessionType,
  emptySession,
  emptyState,
  moveQuestion,
  moveSession,
  removeQuestion,
  setSessionCategory,
} from './editor';
import { fromServer, toPayload, validateEditor } from './payload';
import {
  answerKey,
  convertAnswers,
  defaultAnswers,
  setAnswerValue,
  valueOptions,
} from './scoring';
import type { EditorState, TryoutForUpdate } from './types';

const values = (answers: { value: number }[]) => answers.map((a) => a.value);
const opts = (vs: number[]) => vs.map((value) => ({ answer: 'x', value }));

describe('scoring', () => {
  it('opsi awal per tipe (E benar)', () => {
    expect(values(defaultAnswers('1-5'))).toEqual([1, 2, 3, 4, 5]);
    expect(values(defaultAnswers('+5/0'))).toEqual([0, 0, 0, 0, 5]);
    expect(values(defaultAnswers('IRT'))).toEqual([0, 0, 0, 0, 5]);
    expect(values(defaultAnswers('+4/-1/0'))).toEqual([-1, -1, -1, -1, 4]);
    expect(values(defaultAnswers('+1/0'))).toEqual([0, 0, 0, 0, 1]);
    expect(values(defaultAnswers('0-100'))).toEqual([0, 0, 0, 0, 1]);
  });

  it('tombol nilai: 1–5 berupa angka, tipe lain benar/salah', () => {
    expect(valueOptions('1-5').map((o) => o.value)).toEqual([1, 2, 3, 4, 5]);
    expect(valueOptions('+4/-1/0')).toEqual([
      { value: -1, label: 'Salah', kind: 'wrong' },
      { value: 4, label: 'Benar', kind: 'correct' },
    ]);
  });

  it('1–5: nilai bertukar agar tetap permutasi', () => {
    expect(values(setAnswerValue(opts([1, 2, 3, 4, 5]), 0, 5, '1-5'))).toEqual([
      5, 2, 3, 4, 1,
    ]);
  });

  it('biner: tandai benar membuat yang lain salah; tandai salah tidak menular', () => {
    expect(values(setAnswerValue(opts([0, 0, 0, 0, 5]), 1, 5, '+5/0'))).toEqual(
      [0, 5, 0, 0, 0],
    );
    // Bug versi lama: menandai E "salah" membuat A–D menjadi benar.
    expect(values(setAnswerValue(opts([0, 0, 0, 0, 5]), 4, 0, '+5/0'))).toEqual(
      [0, 0, 0, 0, 0],
    );
  });

  it('konversi tipe mempertahankan jawaban benar', () => {
    expect(
      values(convertAnswers(opts([0, 5, 0, 0, 0]), '+5/0', '+4/-1/0')),
    ).toEqual([-1, 4, -1, -1, -1]);
    expect(
      values(convertAnswers(opts([0, 0, 1, 0, 0]), '0-100', '1-5')),
    ).toEqual([1, 2, 5, 3, 4]);
    expect(values(convertAnswers(opts([3, 5, 1, 2, 4]), '1-5', 'IRT'))).toEqual(
      [0, 5, 0, 0, 0],
    );
  });

  it('kunci jawaban', () => {
    expect(answerKey(opts([0, 0, 4, -1, -1]), '+4/-1/0')).toBe('C');
    expect(answerKey(opts([0, 0, 0, 0, 0]), '+5/0')).toBe('–');
    expect(answerKey(opts([2, 5, 1, 3, 4]), '1-5')).toBe('B');
  });
});

describe('operasi editor', () => {
  it('tambah, pindah, hapus soal dengan penomoran ulang', () => {
    let s = emptySession();
    s = addQuestion(addQuestion(addQuestion(s)));
    s = {
      ...s,
      Questions: s.Questions.map((q, i) => ({ ...q, question: `Q${i}` })),
    };
    s = moveQuestion(s, 0, 2);
    expect(s.Questions.map((q) => [q.number, q.question])).toEqual([
      [1, 'Q1'],
      [2, 'Q2'],
      [3, 'Q0'],
    ]);
    s = removeQuestion(s, 0);
    expect(s.Questions.map((q) => [q.number, q.question])).toEqual([
      [1, 'Q2'],
      [2, 'Q0'],
    ]);
    expect(new Set(s.Questions.map((q) => q.uid)).size).toBe(2);
  });

  it('ganti tipe sesi mengonversi semua soal', () => {
    const s = changeSessionType(addQuestion(emptySession()), '+4/-1/0');
    expect(s.assessmentType).toBe('+4/-1/0');
    expect(values(s.Questions[0].Answers)).toEqual([-1, -1, -1, -1, 4]);
  });

  it('soal AI ditambahkan ke sesi itu saja dengan nilai sesuai tipe', () => {
    const s = appendGenerated(
      addQuestion({ ...emptySession(), assessmentType: '+1/0' }),
      [
        {
          number: 1,
          question: 'Baru',
          Answers: opts([1, 2, 3, 4, 5]).map((a, i) => ({
            ...a,
            answer: `${i}`,
          })),
        },
      ],
    );
    expect(s.Questions).toHaveLength(2);
    expect(s.Questions[1].number).toBe(2);
    expect(values(s.Questions[1].Answers)).toEqual([0, 0, 0, 0, 1]);
  });

  it('ganti tes mengosongkan subtes; urutan sesi bisa dipindah', () => {
    const s = setSessionCategory(
      { ...emptySession(), subCategoryId: 'x', subCategory: 'PU' },
      { id: 'c1', name: 'TPS' },
    );
    expect(s).toMatchObject({
      categoryId: 'c1',
      category: 'TPS',
      subCategoryId: '',
    });
    expect(moveSession(['a', 'b', 'c'] as never[], 2, 0)).toEqual([
      'c',
      'a',
      'b',
    ]);
  });
});

const server: TryoutForUpdate = {
  id: 't1',
  title: 'TO #1',
  restTime: 5,
  status: 'DRAFT',
  startDate: '2026-10-10T01:00:00.000Z',
  endDate: '2026-10-11T01:00:00.000Z',
  resultDate: '2026-10-12T01:00:00.000Z',
  image: 'tryout-a',
  instagram: null,
  tiktok: null,
  updateAt: '2026-10-01T00:00:00.000Z',
  QuizVolume: null,
  TryoutSession: [
    {
      id: 's1',
      tryoutId: 't1',
      categoryId: 'c1',
      subCategoryId: 'sc1',
      documentId: null,
      name: 'Penalaran Umum',
      slug: 'pu',
      description: null,
      duration: 30,
      thresholdValue: null,
      assessmentType: '+5/0',
      TryoutQuestion: [
        {
          id: 'q1',
          number: 1,
          question: '<p>Soal</p>',
          image: null,
          explanation: null,
          subCategory: 'Silogisme',
          subSubCategory: null,
          Pivot_TryoutQuestion_CourseChapter: [
            { courseChapterId: 'ch1', CourseChapter: { categoryId: 'cc1' } },
          ],
          TryoutAnswers: ['a', 'b', 'c', 'd', 'e'].map((x, i) => ({
            id: `a${i}`,
            answer: x,
            value: i === 2 ? 5 : 0,
            image: i === 0 ? 'img-a' : null,
          })),
        },
      ],
    },
  ],
};
const categories = [
  {
    id: 'c1',
    name: 'TPS',
    TryoutSubCategory: [{ id: 'sc1', name: 'Penalaran Umum' }],
  },
];

describe('data server ↔ editor', () => {
  it('memetakan respons getTryoutForUpdate', () => {
    const state = fromServer(server, categories, 'tryout');
    expect(state.meta.title).toBe('TO #1');
    expect(state.meta.startDate).toMatch(/^2026-10-10T\d\d:00$/);
    expect(state.sessions[0]).toMatchObject({
      category: 'TPS',
      subCategory: 'Penalaran Umum',
      duration: 30,
    });
    expect(state.sessions[0].Questions[0]).toMatchObject({
      categoryId: 'cc1',
      courseChapterIds: ['ch1'],
    });
  });

  it('payload ubah membawa id dan gambar opsi', () => {
    const state = fromServer(server, categories, 'tryout');
    const body = toPayload(state, 'tryout', 'update') as {
      Tryout: Record<string, unknown>;
      TryoutSession: {
        id: string;
        description: string;
        TryoutQuestion: {
          id: string;
          TryoutAnswers: Record<string, unknown>[];
        }[];
      }[];
    };
    expect(body.Tryout).toMatchObject({
      id: 't1',
      restTime: 5,
      image: 'tryout-a',
    });
    expect(body.TryoutSession[0].id).toBe('s1');
    expect(body.TryoutSession[0].description).toBe('');
    expect(body.TryoutSession[0].TryoutQuestion[0].TryoutAnswers[0]).toEqual({
      id: 'a0',
      answer: 'a',
      value: 0,
      image: 'img-a',
    });
  });

  it('payload buat: tanpa id; quiz memakai satu sesi + QuizVolumeId', () => {
    const state = fromServer(server, categories, 'quiz');
    state.meta.id = undefined;
    state.quizVolume = { id: 'v1', name: 'Vol 1' };
    const body = toPayload(state, 'quiz', 'create') as {
      QuizVolumeId: string;
      Tryout: Record<string, unknown>;
      TryoutSession: Record<string, unknown>;
    };
    expect(body.QuizVolumeId).toBe('v1');
    expect(body.Tryout).not.toHaveProperty('id');
    expect(body.Tryout).not.toHaveProperty('restTime');
    expect(Array.isArray(body.TryoutSession)).toBe(false);
    expect(body.TryoutSession).not.toHaveProperty('id');
  });

  it('validasi berurutan dengan lokasi soal', () => {
    const state = fromServer(server, categories, 'tryout');
    expect(validateEditor(state, 'tryout')).toBeNull();
    expect(validateEditor({ ...state, sessions: [] }, 'tryout')?.message).toBe(
      'Buat minimal 1 sesi.',
    );
    const broken: EditorState = structuredClone(state);
    broken.sessions[0].Questions[0].Answers[3].answer = '';
    expect(validateEditor(broken, 'tryout')).toEqual({
      message: 'Sesi 1, soal 1: masih ada opsi jawaban kosong.',
      sessionIndex: 0,
      questionIndex: 0,
    });
    const noSub: EditorState = structuredClone(state);
    noSub.sessions[0].subCategoryId = '';
    expect(validateEditor(noSub, 'tryout')?.message).toBe(
      'Sesi 1: pilih subtes.',
    );
    const mixed: EditorState = structuredClone(state);
    mixed.sessions.push({
      ...structuredClone(state.sessions[0]),
      assessmentType: 'IRT',
    });
    expect(validateEditor(mixed, 'tryout')?.message).toMatch(/IRT/);
  });
});

describe('draf localStorage', () => {
  beforeEach(() => localStorage.clear());

  it('kunci sama dengan versi lama', () => {
    expect(draftKey('tryout')).toBe('temporary-add-tryout');
    expect(draftKey('tryout', 'x')).toBe('temporary-edit-tryout-x');
    expect(draftKey('quiz', 'x')).toBe('temporary-edit-quiz-x');
  });

  it('menulis terkompresi lalu membaca kembali', () => {
    const state = fromServer(server, categories, 'quiz');
    state.quizVolume = { id: 'v1', name: 'Vol 1' };
    writeDraft('quiz', 't1', state);
    expect(
      LZString.decompress(localStorage.getItem('temporary-edit-quiz-t1')!),
    ).toContain('"sessions":{');
    const back = readDraft('quiz', 't1')!;
    expect(back.sessions).toHaveLength(1);
    expect(back.quizVolume).toEqual({ id: 'v1', name: 'Vol 1' });
    clearDraft('quiz', 't1');
    expect(readDraft('quiz', 't1')).toBeNull();
  });

  it('membaca draf "buat try out" lama (JSON tanpa kompresi, tanggal kosong "T")', () => {
    localStorage.setItem(
      'temporary-add-tryout',
      JSON.stringify({
        tryout: {
          title: 'Lama',
          startDate: 'T',
          endDate: '2026-01-01T07:00',
          resultDate: 'T',
        },
        sessions: [
          {
            name: 'S1',
            Questions: [{ number: 1, question: 'q', Answers: [] }],
          },
        ],
      }),
    );
    const draft = readDraft('tryout')!;
    expect(draft.meta).toMatchObject({
      title: 'Lama',
      startDate: '',
      endDate: '2026-01-01T07:00',
    });
    expect(draft.sessions[0].Questions[0].courseChapterIds).toEqual([]);
  });

  it('draf dipakai langsung bila dibuat dari versi server yang sama', () => {
    expect(
      draftMatchesServer('2026-10-01T00:00:00Z', '2026-10-01T00:00:30Z'),
    ).toBe(true);
    expect(
      draftMatchesServer('2026-10-01T00:00:00Z', '2026-10-01T00:05:00Z'),
    ).toBe(false);
    expect(draftMatchesServer(undefined, '2026-10-01T00:00:00Z')).toBe(false);
  });

  it('state kosong quiz selalu punya satu sesi', () => {
    expect(emptyState('quiz').sessions).toHaveLength(1);
    expect(emptyState('tryout').sessions).toHaveLength(0);
  });
});

describe('impor CSV', () => {
  it('format berkunci (A–E + Correct) dengan bab materi', () => {
    const qs = rowsToQuestions(
      [
        {
          Number: '1',
          Question: 'Apa?',
          SubCategory: 'PU',
          A: 'a',
          B: 'b',
          C: 'c',
          D: 'd',
          E: 'e',
          Correct: 'b',
          Category: 'Matematika',
          Chapter: 'Aljabar | Peluang',
        },
      ],
      '+4/-1/0',
      [
        {
          id: 'ch1',
          title: 'Aljabar',
          Category: { id: 'm', name: 'Matematika' },
        },
        {
          id: 'ch2',
          title: 'Peluang',
          Category: { id: 'm', name: 'Matematika' },
        },
      ],
    );
    expect(values(qs[0].Answers)).toEqual([-1, 4, -1, -1, -1]);
    expect(qs[0]).toMatchObject({
      categoryId: 'm',
      courseChapterIds: ['ch1', 'ch2'],
    });
  });

  it('error menyebut nomor soal', () => {
    expect(() =>
      rowsToQuestions(
        [{ Number: '7', A: 'a', B: 'b', C: 'c', D: 'd', E: 'e', Correct: 'z' }],
        'IRT',
      ),
    ).toThrow('Soal nomor 7: jawaban benar tidak ditemukan');
    expect(() =>
      rowsToQuestions([{ Number: '2', Answer_A: 'a', Value_A: '1' }], '1-5'),
    ).toThrow(CsvImportError);
    expect(() => resolveChapters('Fisika', ['x'], [], 3)).toThrow(
      'Kategori "Fisika" tidak ditemukan pada soal nomor 3.',
    );
  });

  it('format berbobot 1–5', () => {
    const row: Record<string, string> = {
      Number: '1',
      Question: 'Q',
      Subcategory: 'S',
    };
    'ABCDE'.split('').forEach((l, i) => {
      row[`Answer_${l}`] = l;
      row[`Value_${l}`] = `${5 - i}`;
    });
    expect(values(rowsToQuestions([row], '1-5')[0].Answers)).toEqual([
      5, 4, 3, 2, 1,
    ]);
  });

  it('gambar base64 diunggah dan diganti URL', async () => {
    const md = 'Lihat ![x](data:image/png;base64,aGVsbG8=) ya';
    const out = await replaceBase64Images(
      md,
      async (_blob, ext) => `https://cdn/img.${ext}`,
    );
    expect(out).toBe('Lihat ![Gambar](https://cdn/img.png) ya');
  });
});

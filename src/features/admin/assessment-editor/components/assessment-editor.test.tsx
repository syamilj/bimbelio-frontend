import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API, server } from '../../../../../test/msw/server';
import { navigation } from '../../../../../test/utils/next-navigation';
import { renderWithProviders } from '../../../../../test/utils/render';
import { writeDraft } from '../model/draft';
import { fromServer } from '../model/payload';
import type { TryoutForUpdate } from '../model/types';
import { AssessmentEditor } from './assessment-editor';

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn(), warning: vi.fn() },
}));

vi.mock(
  'next/navigation',
  () => import('../../../../../test/utils/next-navigation'),
);
// BlockNote berat & butuh DOM penuh; di tes cukup textarea.
vi.mock('@/components/ui/blocknote-editor', () => ({
  default: ({
    value,
    onValueChange,
  }: {
    value?: string;
    onValueChange?: (v: string) => void;
  }) => (
    <textarea
      aria-label="editor"
      value={value ?? ''}
      onChange={(e) => onValueChange?.(e.target.value)}
    />
  ),
}));

const CATEGORIES = [
  {
    id: 'c1',
    name: 'TPS',
    TryoutSubCategory: [{ id: 'sc1', name: 'Penalaran Umum' }],
  },
];

const ok = (data: unknown) =>
  HttpResponse.json({ status: 200, message: 'OK', data });

const DETAIL: TryoutForUpdate = {
  id: 't1',
  title: 'Try Out Server',
  restTime: 0,
  status: 'DRAFT',
  startDate: '2026-10-10T01:00:00.000Z',
  endDate: '2026-10-11T01:00:00.000Z',
  resultDate: '2026-10-12T01:00:00.000Z',
  image: null,
  instagram: null,
  tiktok: null,
  updateAt: '2026-10-02T00:00:00.000Z',
  TryoutSession: [
    {
      id: 's1',
      tryoutId: 't1',
      categoryId: 'c1',
      subCategoryId: 'sc1',
      documentId: null,
      name: 'PU',
      slug: 'pu',
      description: '',
      duration: 30,
      thresholdValue: null,
      assessmentType: '+5/0',
      TryoutQuestion: [
        {
          id: 'q1',
          number: 1,
          question: 'Soal server',
          image: null,
          explanation: null,
          subCategory: null,
          subSubCategory: null,
          Pivot_TryoutQuestion_CourseChapter: [],
          TryoutAnswers: [0, 1, 2, 3, 4].map((i) => ({
            id: `a${i}`,
            answer: `opsi ${i}`,
            value: i === 4 ? 5 : 0,
            image: null,
          })),
        },
      ],
    },
  ],
};

beforeEach(() => {
  server.use(
    http.get(`${API}/tryoutCategory/getCategory`, () => ok(CATEGORIES)),
    http.get(`${API}/category/getAllCategories`, () => ok([])),
  );
});

describe('AssessmentEditor — buat try out', () => {
  beforeEach(() => navigation.set('/utbk/admin/tryout/new'));

  it('menolak simpan yang belum lengkap dengan pesan jelas', async () => {
    const { user } = renderWithProviders(<AssessmentEditor kind="tryout" />);
    await user.click(
      await screen.findByRole('button', { name: /Simpan try out/ }),
    );
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Isi judul try out dulu.'),
    );
  });

  it('menyusun sesi & soal lalu mengirim payload createTryout', async () => {
    let body: Record<string, any> | null = null;
    server.use(
      http.post(`${API}/tryout/createTryout`, async ({ request }) => {
        body = (await request.json()) as Record<string, any>;
        return ok({});
      }),
    );
    const { user } = renderWithProviders(<AssessmentEditor kind="tryout" />);

    await user.type(await screen.findByLabelText('Judul try out'), 'TO Uji');
    await user.click(screen.getByRole('combobox', { name: 'Status' }));
    await user.click(await screen.findByRole('option', { name: 'Draf' }));
    await user.type(screen.getByLabelText('Mulai'), '2026-10-10T08:00');
    await user.type(screen.getByLabelText('Berakhir'), '2026-10-11T08:00');
    await user.type(
      screen.getByLabelText('Pembagian hasil'),
      '2026-10-12T08:00',
    );

    await user.click(screen.getByRole('button', { name: 'Tambah sesi' }));
    await user.click(screen.getByRole('button', { name: /Sunting sesi/ }));

    const session = screen.getByRole('region', { name: /Pengaturan sesi|PU/ });
    await user.click(
      within(session).getByRole('combobox', { name: 'Kategori tes' }),
    );
    await user.click(await screen.findByRole('option', { name: 'TPS' }));
    await user.click(within(session).getByRole('combobox', { name: 'Subtes' }));
    await user.click(
      await screen.findByRole('option', { name: 'Penalaran Umum' }),
    );
    await user.type(within(session).getByLabelText('Judul sesi'), 'PU');
    await user.type(within(session).getByLabelText('Durasi (menit)'), '30');

    await user.click(
      screen.getByRole('button', { name: 'Tambah soal pertama' }),
    );
    const editors = await screen.findAllByLabelText('editor');
    await user.type(editors[0], 'Berapa 1+1?');
    for (const [i, el] of editors.slice(1, 6).entries())
      await user.type(el, `${i + 1}`);
    const valueGroup = screen.getByRole('radiogroup', { name: 'Nilai opsi B' });
    await user.click(within(valueGroup).getByRole('radio', { name: '5' }));

    await user.click(screen.getByRole('button', { name: /Simpan try out/ }));
    await waitFor(() => expect(body).not.toBeNull());
    expect(body!.Tryout).toMatchObject({
      title: 'TO Uji',
      status: 'DRAFT',
      startDate: '2026-10-10T08:00',
      restTime: 0,
    });
    const s = body!.TryoutSession[0];
    expect(s).toMatchObject({
      name: 'PU',
      categoryId: 'c1',
      subCategoryId: 'sc1',
      duration: 30,
      assessmentType: '1-5',
    });
    expect(s).not.toHaveProperty('id');
    expect(s.TryoutQuestion[0].question).toBe('Berapa 1+1?');
    expect(
      s.TryoutQuestion[0].TryoutAnswers.map((a: { value: number }) => a.value),
    ).toEqual([1, 5, 3, 4, 2]);
    await waitFor(() =>
      expect(navigation.url.pathname).toBe('/utbk/admin/tryout'),
    );
    expect(localStorage.getItem('temporary-add-tryout')).toBeNull();
  });
});

describe('AssessmentEditor — ubah', () => {
  beforeEach(() => {
    navigation.set('/utbk/admin/tryout/edit/t1');
    server.use(http.get(`${API}/tryout/getTryoutForUpdate`, () => ok(DETAIL)));
  });

  it('memuat data server dan mengirim updateTryout', async () => {
    let body: Record<string, any> | null = null;
    server.use(
      http.put(`${API}/tryout/updateTryout`, async ({ request }) => {
        body = (await request.json()) as Record<string, any>;
        return ok({});
      }),
    );
    const { user } = renderWithProviders(
      <AssessmentEditor
        kind="tryout"
        id="t1"
      />,
    );
    const title = await screen.findByLabelText('Judul try out');
    expect(title).toHaveValue('Try Out Server');
    await user.clear(title);
    await user.type(title, 'Try Out Baru');
    await user.click(screen.getByRole('button', { name: /Simpan try out/ }));
    await waitFor(() => expect(body).not.toBeNull());
    expect(body!.Tryout).toMatchObject({ id: 't1', title: 'Try Out Baru' });
    expect(body!.TryoutSession[0].id).toBe('s1');
    expect(body!.TryoutSession[0].TryoutQuestion[0].id).toBe('q1');
  });

  it('draf lama vs server baru: admin memilih', async () => {
    const draft = fromServer(DETAIL, CATEGORIES, 'tryout');
    draft.meta.title = 'Judul dari draf';
    draft.meta.updateAt = '2026-09-01T00:00:00.000Z';
    writeDraft('tryout', 't1', draft);
    const { user } = renderWithProviders(
      <AssessmentEditor
        kind="tryout"
        id="t1"
      />,
    );
    expect(
      await screen.findByRole('heading', {
        name: 'Ada versi lebih baru di server',
      }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Lanjutkan draf lokal' }),
    );
    expect(await screen.findByLabelText('Judul try out')).toHaveValue(
      'Judul dari draf',
    );
  });

  it('kunci jawaban & sesi dari server', async () => {
    const { user } = renderWithProviders(
      <AssessmentEditor
        kind="tryout"
        id="t1"
      />,
    );
    await user.click(
      await screen.findByRole('button', { name: 'Lihat kunci jawaban' }),
    );
    const dialog = await screen.findByRole('dialog', { name: 'Kunci jawaban' });
    expect(within(dialog).getByText('E')).toBeInTheDocument();
  });
});

describe('AssessmentEditor — quiz', () => {
  beforeEach(() => {
    navigation.set('/utbk/admin/quiz/new');
    server.use(http.get(`${API}/quizTryout/getQuizVolumeList`, () => ok([])));
  });

  it('sesi tunggal langsung terbuka dan tipe penilaian dibatasi', async () => {
    const { user } = renderWithProviders(<AssessmentEditor kind="quiz" />);
    expect(await screen.findByLabelText('Judul quiz')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Tambah sesi' }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole('combobox', { name: 'Penilaian' }));
    const options = (await screen.findAllByRole('option')).map(
      (o) => o.textContent,
    );
    expect(options).not.toContain('IRT');
    expect(options).toContain('0–100');
  });
});

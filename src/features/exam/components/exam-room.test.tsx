import { API, server } from '@/../test/msw/server';
import { renderWithProviders } from '@/../test/utils/render';
import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { participant, question, session, tryout } from '../fixtures.test-utils';
import { readLocal } from '../model/storage';
import type { ExamOption } from '../types';
import { ExamRoom } from './exam-room';
import { OptionGroup } from './option-group';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/utbk/user/bimarena/try-out/to1',
}));

const options: ExamOption[] = ['A', 'B', 'C'].map((l) => ({
  id: l.toLowerCase(),
  questionId: 'q',
  answer: `<p>Pilihan ${l}</p>`,
}));

function Harness() {
  const [value, setValue] = useState('');
  return (
    <>
      <h2 id="judul">Soal 1</h2>
      <OptionGroup
        name="soal-q"
        options={options}
        value={value}
        labelledBy="judul"
        onSelect={(id) => setValue((v) => (v === id ? '' : id))}
      />
    </>
  );
}

describe('OptionGroup', () => {
  it('radiogroup berlabel; klik memilih, klik ulang membatalkan', async () => {
    const { user } = renderWithProviders(<Harness />);
    const group = screen.getByRole('radiogroup', { name: 'Soal 1' });
    const b = within(group).getByRole('radio', { name: /Opsi B: Pilihan B/ });
    await user.click(b);
    expect(b).toBeChecked();
    await user.click(b);
    expect(b).not.toBeChecked();
  });

  it('panah memindah pilihan (radio asli)', async () => {
    const { user } = renderWithProviders(<Harness />);
    await user.click(screen.getByRole('radio', { name: /Opsi A/ }));
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: /Opsi B/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /Opsi B/ })).toHaveFocus();
  });
});

describe('ExamRoom', () => {
  const saved: unknown[] = [];
  beforeEach(() => {
    saved.length = 0;
    server.use(
      http.get(`${API}/tryoutSession/getDraft`, () =>
        HttpResponse.json({ status: 200, message: 'OK', data: null }),
      ),
      http.put(`${API}/tryoutSession/saveDraft`, async ({ request }) => {
        saved.push(await request.json());
        return HttpResponse.json({ status: 200, message: 'OK', data: {} });
      }),
    );
  });

  const start = new Date(Date.now() - 60_000).toISOString();
  const data = tryout({
    TryoutSession: [
      session('s1', 1, {
        TryoutQuestion: [question('q1', 1), question('q2', 2), question('q3', 3)],
        TryoutSessionParticipant: participant('s1', { start }),
      }),
      session('s2', 2),
    ],
  });

  const renderRoom = () =>
    renderWithProviders(
      <ExamRoom
        tryout={data}
        index={0}
        userId="u1"
        mode="try-out"
        offsetMs={0}
        exitHref="/utbk/user/bimarena/try-out"
        onStale={vi.fn()}
      />,
    );

  it('pintasan A–E, N/P, R dan navigator bubble', async () => {
    const { user } = renderRoom();
    expect(screen.getByRole('heading', { name: /Soal 1/ })).toBeInTheDocument();

    await user.keyboard('c');
    expect(screen.getByRole('radio', { name: /Opsi C/ })).toBeChecked();

    await user.keyboard('r');
    expect(screen.getByRole('button', { name: 'Ditandai ragu' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.keyboard('n');
    expect(screen.getByRole('heading', { name: /Soal 2/ })).toBeInTheDocument();
    await user.keyboard('p');
    expect(screen.getByRole('heading', { name: /Soal 1/ })).toBeInTheDocument();

    const nav = screen.getAllByRole('navigation', { name: 'Navigasi soal' })[0];
    expect(
      within(nav).getByRole('button', { name: /Soal 1, ragu-ragu, sedang dibuka/ }),
    ).toHaveAttribute('aria-current', 'step');
    await user.click(within(nav).getByRole('button', { name: /Soal 3, belum dijawab/ }));
    expect(screen.getByRole('heading', { name: /Soal 3/ })).toBeInTheDocument();
  });

  it('jawaban tersimpan lokal seketika dan ke server setelah jeda', async () => {
    const { user } = renderRoom();
    await user.keyboard('b');
    expect(readLocal('s1')?.answers[0]).toMatchObject({
      questionId: 'q1',
      answerId: 'q1-b',
    });
    // (Simpanan tes sebelumnya yang di-flush saat unmount bisa ikut masuk.)
    const mine = () =>
      saved.find(
        (b) =>
          (b as { answers: { answerId: string }[] }).answers[0]?.answerId ===
          'q1-b',
      );
    await waitFor(() => expect(mine()).toBeDefined(), { timeout: 4000 });
    expect(mine()).toMatchObject({
      sessionId: 's1',
      answers: [{ questionId: 'q1', answerId: 'q1-b', notSure: false }, {}, {}],
    });
    expect(await screen.findByText('Tersimpan')).toBeInTheDocument();
  });

  it('endpoint draft 404 → tetap jalan, status "tersimpan di perangkat"', async () => {
    server.use(
      http.put(`${API}/tryoutSession/saveDraft`, () =>
        HttpResponse.json({ status: 404, message: 'Not found', data: null }, { status: 404 }),
      ),
      http.get(`${API}/tryoutSession/getDraft`, () =>
        HttpResponse.json({ status: 404, message: 'Not found', data: null }, { status: 404 }),
      ),
    );
    const { user } = renderRoom();
    await user.keyboard('a');
    expect(await screen.findByText('Tersimpan di perangkat', {}, { timeout: 4000 })).toBeInTheDocument();
    expect(readLocal('s1')?.answers[0].answerId).toBe('q1-a');
  });

  it('memulihkan draft server yang lebih baru', async () => {
    server.use(
      http.get(`${API}/tryoutSession/getDraft`, () =>
        HttpResponse.json({
          status: 200,
          message: 'OK',
          data: {
            updatedAt: new Date().toISOString(),
            answers: [{ questionId: 'q1', answerId: 'q1-d', notSure: true }],
          },
        }),
      ),
    );
    renderRoom();
    await waitFor(() =>
      expect(screen.getByRole('radio', { name: /Opsi D/ })).toBeChecked(),
    );
  });

  it('kumpulkan: dialog ringkasan lalu finishSession dengan semua jawaban', async () => {
    let body: unknown;
    server.use(
      http.post(`${API}/tryoutSession/finishSession`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ status: 200, message: 'OK', data: null });
      }),
    );
    const { user } = renderRoom();
    await user.keyboard('a');
    await user.click(screen.getAllByRole('button', { name: /Kumpulkan jawaban/ })[0]);
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('2 soal belum dijawab')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(within(dialog).getByRole('button', { name: 'Kumpulkan jawaban' }));
    });
    await waitFor(() => expect(body).toBeDefined());
    expect(body).toMatchObject({
      sessionId: 's1',
      userId: 'u1',
      answer: [
        { number: 1, questionId: 'q1', answerId: 'q1-a', answer: '', type: 'OBJECTIVE_5', notSure: false },
        { questionId: 'q2', answerId: '' },
        { questionId: 'q3', answerId: '' },
      ],
    });
  });
});

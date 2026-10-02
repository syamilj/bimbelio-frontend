import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import { act, screen, waitFor } from '@testing-library/react';
import { HttpResponse, http as mswHttp } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { API, server } from '../../../test/msw/server';
import { renderWithProviders } from '../../../test/utils/render';
import { AnswerBubble, optionLetter } from './answer-bubble';
import { useConfirm } from './confirm-dialog';
import { Countdown, formatDuration } from './countdown';
import { EmptyState } from './empty-state';
import { QueryState } from './query-state';

describe('AnswerBubble', () => {
  it('menampilkan huruf dan status', () => {
    renderWithProviders(
      <AnswerBubble
        label="B"
        state="filled"
      />,
    );
    const bubble = screen.getByText('B');
    expect(bubble).toHaveAttribute('data-state', 'filled');
  });

  it('optionLetter 0..4 → A..E', () => {
    expect([0, 1, 2, 3, 4].map(optionLetter).join('')).toBe('ABCDE');
  });
});

describe('formatDuration', () => {
  it.each([
    [0, '00:00'],
    [65_000, '01:05'],
    [3_725_000, '01:02:05'],
  ])('%i ms → %s', (ms, text) => {
    expect(formatDuration(ms)).toBe(text);
  });
});

describe('Countdown', () => {
  it('menghitung mundur dan memerah di bawah ambang', () => {
    vi.useFakeTimers();
    const now = new Date('2026-10-01T10:00:00Z');
    vi.setSystemTime(now);
    renderWithProviders(
      <Countdown
        target={new Date(now.getTime() + 62_000)}
        warnBelowMs={60_000}
      />,
    );
    const time = screen.getByText('01:02');
    expect(time).not.toHaveClass('text-danger');

    act(() => {
      vi.advanceTimersByTime(3_000);
    });
    expect(screen.getByText('00:59')).toHaveClass('text-danger');
    vi.useRealTimers();
  });
});

describe('QueryState', () => {
  function Plans() {
    const query = useQuery({
      queryKey: ['plans'],
      queryFn: () => api.get<{ id: string; name: string }[]>('/plans'),
    });
    return (
      <QueryState
        query={query}
        errorTitle="Paket tidak dapat dimuat"
        empty={<EmptyState title="Belum ada paket" />}
      >
        {(plans) => (
          <ul>
            {plans.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        )}
      </QueryState>
    );
  }

  it('memuat lalu menampilkan data', async () => {
    server.use(
      mswHttp.get(`${API}/plans`, () =>
        HttpResponse.json({
          status: 200,
          message: 'OK',
          data: [{ id: '1', name: 'Premium' }],
        }),
      ),
    );
    renderWithProviders(<Plans />);
    expect(screen.getByRole('status')).toHaveTextContent('Memuat');
    expect(await screen.findByText('Premium')).toBeInTheDocument();
  });

  it('menampilkan keadaan kosong', async () => {
    server.use(
      mswHttp.get(`${API}/plans`, () =>
        HttpResponse.json({ status: 200, message: 'OK', data: [] }),
      ),
    );
    renderWithProviders(<Plans />);
    expect(await screen.findByText('Belum ada paket')).toBeInTheDocument();
  });

  it('menampilkan error dan bisa mencoba lagi', async () => {
    let calls = 0;
    server.use(
      mswHttp.get(`${API}/plans`, () => {
        calls += 1;
        return calls === 1
          ? HttpResponse.json(
              { status: 500, message: 'Server sibuk' },
              { status: 500 },
            )
          : HttpResponse.json({
              status: 200,
              message: 'OK',
              data: [{ id: '1', name: 'Premium' }],
            });
      }),
    );
    const { user } = renderWithProviders(<Plans />);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Paket tidak dapat dimuat',
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Server sibuk');

    await user.click(screen.getByRole('button', { name: /coba lagi/i }));
    expect(await screen.findByText('Premium')).toBeInTheDocument();
  });
});

describe('useConfirm', () => {
  function DeleteButton({ onDone }: { onDone: (ok: boolean) => void }) {
    const confirm = useConfirm();
    return (
      <button
        onClick={async () =>
          onDone(
            await confirm({
              title: 'Hapus voucher?',
              description: 'Voucher yang dihapus tidak bisa dipakai lagi.',
              confirmLabel: 'Hapus voucher',
              destructive: true,
            }),
          )
        }
      >
        Hapus
      </button>
    );
  }

  it('mengembalikan true saat dikonfirmasi', async () => {
    const onDone = vi.fn();
    const { user } = renderWithProviders(<DeleteButton onDone={onDone} />);
    await user.click(screen.getByRole('button', { name: 'Hapus' }));
    expect(screen.getByRole('alertdialog')).toHaveTextContent('Hapus voucher?');
    await user.click(screen.getByRole('button', { name: 'Hapus voucher' }));
    await waitFor(() => expect(onDone).toHaveBeenCalledWith(true));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('mengembalikan false saat dibatalkan (termasuk tombol Escape)', async () => {
    const onDone = vi.fn();
    const { user } = renderWithProviders(<DeleteButton onDone={onDone} />);
    await user.click(screen.getByRole('button', { name: 'Hapus' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(onDone).toHaveBeenCalledWith(false));
  });
});

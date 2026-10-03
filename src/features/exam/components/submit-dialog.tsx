'use client';

import { AnswerBubble } from '@/components/patterns/answer-bubble';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CircleCheck, Send } from 'lucide-react';
import type { SheetStats } from '../model/answers';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: SheetStats;
  pending: boolean;
  /** Label sesi, mis. "Penalaran Umum". */
  sessionName: string;
  isLastSession: boolean;
  onConfirm: () => void;
  onJump: (index: number) => void;
};

function NumberList({
  numbers,
  state,
  onJump,
  label,
}: {
  numbers: number[];
  state: 'empty' | 'flagged';
  onJump: (index: number) => void;
  label: string;
}) {
  const shown = numbers.slice(0, 20);
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold text-ink">{label}</p>
      <ul className="flex flex-wrap gap-1.5">
        {shown.map((n) => (
          <li key={n}>
            <button
              type="button"
              onClick={() => onJump(n - 1)}
              aria-label={`Buka soal ${n}`}
              className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <AnswerBubble
                label={n}
                state={state}
                size="sm"
              />
            </button>
          </li>
        ))}
        {numbers.length > shown.length && (
          <li className="self-center text-xs text-ink-muted">
            +{numbers.length - shown.length} lainnya
          </li>
        )}
      </ul>
    </div>
  );
}

/** Konfirmasi kumpulkan: ringkasan isian, soal kosong & ragu bisa dibuka langsung. */
export function SubmitDialog({
  open,
  onOpenChange,
  stats,
  pending,
  sessionName,
  isLastSession,
  onConfirm,
  onJump,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !pending && onOpenChange(next)}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Kumpulkan jawaban {sessionName}?</DialogTitle>
          <DialogDescription>
            Setelah dikumpulkan, jawaban subtes ini tidak bisa diubah lagi.
            {isLastSession
              ? ' Ini subtes terakhir.'
              : ' Setelah ini ada waktu istirahat sebelum subtes berikutnya.'}
          </DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-3 gap-2 rounded-md bg-paper p-4 text-center">
          <div>
            <dt className="font-mono text-xs text-ink-muted">terjawab</dt>
            <dd className="font-display text-2xl font-bold tabular-nums">
              {stats.answered}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-ink-muted">ragu</dt>
            <dd className="font-display text-2xl font-bold tabular-nums">
              {stats.flagged}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-ink-muted">kosong</dt>
            <dd className="font-display text-2xl font-bold tabular-nums">
              {stats.empty}
            </dd>
          </div>
        </dl>

        {stats.empty > 0 && (
          <NumberList
            numbers={stats.emptyNumbers}
            state="empty"
            onJump={onJump}
            label={`${stats.empty} soal belum dijawab`}
          />
        )}
        {stats.flagged > 0 && (
          <NumberList
            numbers={stats.flaggedNumbers}
            state="flagged"
            onJump={onJump}
            label={`${stats.flagged} soal masih ragu`}
          />
        )}
        {stats.empty === 0 && stats.flagged === 0 && (
          <p className="flex items-center gap-2 text-sm text-ink">
            <CircleCheck
              className="size-4 text-success"
              aria-hidden
            />
            Semua soal sudah terjawab.
          </p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Periksa lagi
          </Button>
          <Button
            onClick={onConfirm}
            loading={pending}
          >
            {!pending && <Send aria-hidden />}
            Kumpulkan jawaban
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

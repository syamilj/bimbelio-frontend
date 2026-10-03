'use client';

import { useConfirm } from '@/components/patterns/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { getSubtestLabel } from '@/lib/utils/subtest';
import {
  KeyRound,
  ListRestart,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useId, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useStorageUpload } from '../../hooks/use-storage-upload';
import { toLocalInput } from '../../lib/format';
import { Combobox, ImageUpload } from '../../resource-form/fields';
import { useQuizVolumeOptions } from '../api';
import type { AssessmentEditorController } from '../hooks/use-assessment-editor';
import { durationNumber, emptySession, moveSession } from '../model/editor';
import { AiMatchDialog, applyMatches } from './ai-match-dialog';
import { AnswerKeyDialog } from './answer-key-dialog';

const STATUS_OPTIONS = [
  { value: 'PUBLIC', label: 'Publik' },
  { value: 'PRIVATE', label: 'Privat' },
  { value: 'DRAFT', label: 'Draf' },
] as const;

function DateTimeInput({
  id,
  label,
  value,
  onChange,
  disabled,
  hint,
}: {
  id: string;
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="datetime-local"
        className="font-mono"
        value={value ?? ''}
        disabled={disabled}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && (
        <p
          id={`${id}-hint`}
          className="text-xs text-ink-subtle"
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export function MetaPanel({
  editor,
  trackId,
  onDelete,
}: {
  editor: AssessmentEditorController;
  trackId: string;
  onDelete?: () => void;
}) {
  const id = useId();
  const confirm = useConfirm();
  const {
    kind,
    state,
    updateMeta,
    change,
    activeSession,
    openSession,
    isEdit,
  } = editor;
  const { meta, sessions, quizVolume } = state;
  const noun = kind === 'quiz' ? 'quiz' : 'try out';
  const [volumeSearch, setVolumeSearch] = useState('');
  const [debouncedSearch] = useDebounce(volumeSearch, 400);
  const volumes = useQuizVolumeOptions(debouncedSearch, kind === 'quiz');
  const thumb = useStorageUpload({
    bucket: 'img',
    folder: 'tryout',
    toastError: false,
  });

  const hasQuestions = sessions.some((s) => s.Questions.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby={`${id}-detail`}
        className="flex flex-col gap-4"
      >
        <h2
          id={`${id}-detail`}
          className="font-display text-lg font-bold tracking-display text-ink"
        >
          Detail {noun}
        </h2>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-title`}>Judul {noun}</Label>
          <Input
            id={`${id}-title`}
            value={meta.title ?? ''}
            onChange={(e) => updateMeta({ title: e.target.value })}
            placeholder={
              kind === 'quiz' ? 'mis. Quiz PU #3' : 'mis. Try Out UTBK #12'
            }
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-status`}>Status</Label>
            <Select
              value={meta.status}
              onValueChange={(v) =>
                updateMeta({
                  status: v as (typeof STATUS_OPTIONS)[number]['value'],
                })
              }
            >
              <SelectTrigger
                id={`${id}-status`}
                className="h-11"
              >
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem
                    key={s.value}
                    value={s.value}
                  >
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {kind === 'tryout' && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${id}-ig`}>
                Instagram{' '}
                <span className="font-normal text-ink-subtle">(opsional)</span>
              </Label>
              <Input
                id={`${id}-ig`}
                type="url"
                value={meta.instagram ?? ''}
                onChange={(e) => updateMeta({ instagram: e.target.value })}
                placeholder="Tautan postingan"
              />
            </div>
          )}
        </div>

        {kind === 'quiz' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-volume`}>
              Volume quiz{' '}
              <span className="font-normal text-ink-subtle">(opsional)</span>
            </Label>
            <Combobox
              id={`${id}-volume`}
              value={quizVolume?.id ?? null}
              selectedLabel={quizVolume?.name}
              options={(volumes.data ?? []).map((v) => ({
                value: v.id,
                label: v.title ?? `Volume ${v.number ?? ''}`,
              }))}
              loading={volumes.isFetching}
              onSearchChange={setVolumeSearch}
              placeholder="Pilih volume quiz"
              searchPlaceholder="Cari volume (min. 3 huruf)…"
              emptyText="Tidak ada volume quiz."
              onChange={(value, option) => {
                const volume = volumes.data?.find((v) => v.id === value);
                change((s) => ({
                  ...s,
                  quizVolume: value
                    ? { id: value, name: option?.label ?? '' }
                    : null,
                  // Jadwal quiz mengikuti volume (hasil = waktu mulai).
                  meta: volume
                    ? {
                        ...s.meta,
                        startDate: toLocalInput(volume.startDate),
                        endDate: toLocalInput(volume.endDate),
                        resultDate: toLocalInput(volume.startDate),
                      }
                    : s.meta,
                }));
              }}
            />
          </div>
        )}

        {kind === 'tryout' && (
          <div className="flex flex-col gap-1.5">
            <span
              id={`${id}-thumb`}
              className="text-sm font-semibold text-ink"
            >
              Thumbnail
            </span>
            <ImageUpload
              describedBy={`${id}-thumb`}
              label="thumbnail"
              bucket="img"
              folder="tryout"
              prefix="tryout"
              value={meta.image}
              onChange={(image) => updateMeta({ image })}
            />
          </div>
        )}
      </section>

      <section
        aria-labelledby={`${id}-time`}
        className="flex flex-col gap-3 border-t border-line pt-5"
      >
        <h2
          id={`${id}-time`}
          className="font-display text-lg font-bold tracking-display text-ink"
        >
          Jadwal
        </h2>
        {(['startDate', 'endDate', 'resultDate'] as const).map((key) => (
          <DateTimeInput
            key={key}
            id={`${id}-${key}`}
            label={
              key === 'startDate'
                ? 'Mulai'
                : key === 'endDate'
                  ? 'Berakhir'
                  : 'Pembagian hasil'
            }
            value={meta[key]}
            onChange={(v) => updateMeta({ [key]: v })}
            disabled={kind === 'quiz' && !!quizVolume}
            hint={
              kind === 'quiz' && quizVolume
                ? 'Mengikuti volume quiz.'
                : undefined
            }
          />
        ))}
        {kind === 'tryout' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`${id}-rest`}>
              Waktu istirahat antarsesi (menit)
            </Label>
            <Input
              id={`${id}-rest`}
              type="number"
              inputMode="numeric"
              min={0}
              className="font-mono"
              value={meta.restTime || ''}
              placeholder="0"
              onChange={(e) =>
                updateMeta({
                  restTime:
                    e.target.value === '' ? 0 : parseInt(e.target.value, 10),
                })
              }
            />
          </div>
        )}
      </section>

      <section
        aria-labelledby={`${id}-sessions`}
        className="flex flex-col gap-3 border-t border-line pt-5"
      >
        <div className="flex flex-wrap items-center gap-2">
          <h2
            id={`${id}-sessions`}
            className="mr-auto font-display text-lg font-bold tracking-display text-ink"
          >
            {kind === 'quiz' ? 'Sesi quiz' : 'Sesi & subtes'}
          </h2>
          <AiMatchDialog
            sessions={sessions}
            trackId={trackId}
            onApply={(si, matches) =>
              editor.updateSession(si, (s) => applyMatches(s, matches))
            }
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasQuestions}
            >
              <Sparkles />
              AI Match
            </Button>
          </AiMatchDialog>
          {kind === 'tryout' && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                change((s) => ({
                  ...s,
                  sessions: [...s.sessions, emptySession()],
                }))
              }
            >
              <Plus />
              Tambah sesi
            </Button>
          )}
        </div>

        {sessions.length === 0 ? (
          <p className="rounded-md border border-dashed border-line-strong px-4 py-6 text-center text-sm text-ink-muted">
            Belum ada sesi. Tambahkan sesi pertama untuk mulai menyusun soal.
          </p>
        ) : (
          <ol className="flex flex-col gap-2">
            {sessions.map((session, si) => {
              const active = activeSession === si;
              return (
                <li
                  key={session.id ?? `new-${si}`}
                  className={cn(
                    'flex items-center gap-2 rounded-md border border-line bg-surface p-2.5',
                    active && 'border-brand-muted bg-brand-soft',
                  )}
                >
                  {kind === 'tryout' && sessions.length > 1 ? (
                    <Select
                      value={`${si + 1}`}
                      onValueChange={(v) =>
                        change((s) => ({
                          ...s,
                          sessions: moveSession(s.sessions, si, Number(v) - 1),
                        }))
                      }
                    >
                      <SelectTrigger
                        size="sm"
                        className="w-14 shrink-0 font-mono"
                        aria-label={`Urutan sesi ${session.name || si + 1}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sessions.map((_, i) => (
                          <SelectItem
                            key={i}
                            value={`${i + 1}`}
                          >
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-xs">
                      {si + 1}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">
                      {session.name || 'Sesi tanpa judul'}
                    </p>
                    <p className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
                      {session.subCategory ? (
                        <Badge variant="mono">
                          {getSubtestLabel(session.subCategory, trackId)}
                        </Badge>
                      ) : (
                        <span>belum diatur</span>
                      )}
                      <span className="font-mono">
                        {session.Questions.length} soal ·{' '}
                        {durationNumber(session.duration)} mnt
                      </span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={active ? 'default' : 'outline'}
                    onClick={() =>
                      openSession(active && kind === 'tryout' ? null : si)
                    }
                    aria-label={`${active ? 'Tutup' : 'Sunting'} sesi ${session.name || si + 1}`}
                  >
                    <Pencil />
                    {active ? 'Disunting' : 'Sunting'}
                  </Button>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section
        aria-label="Aksi lain"
        className="flex flex-col gap-2 border-t border-line pt-5"
      >
        <AnswerKeyDialog sessions={sessions}>
          <Button
            type="button"
            variant="outline"
            disabled={!hasQuestions}
          >
            <KeyRound />
            Lihat kunci jawaban
          </Button>
        </AnswerKeyDialog>
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            void confirm({
              title: isEdit ? 'Buang draf lokal?' : 'Reset formulir?',
              description: isEdit
                ? `Perubahan yang belum disimpan di perangkat ini dibuang, lalu ${noun} dimuat ulang dari server.`
                : 'Semua isian dan draf di perangkat ini dihapus, termasuk thumbnail yang sudah diunggah.',
              confirmLabel: isEdit ? 'Buang draf' : 'Reset',
              destructive: true,
              onConfirm: async () => {
                if (!isEdit && meta.image) {
                  await thumb.remove([meta.image]).catch(() => undefined);
                }
                await editor.discardDraft();
              },
            })
          }
        >
          <ListRestart />
          {isEdit ? 'Buang draf lokal' : 'Reset & hapus draf'}
        </Button>
        {onDelete && (
          <Button
            type="button"
            variant="ghost"
            className="text-danger hover:bg-danger-soft"
            onClick={onDelete}
          >
            <Trash2 />
            Hapus {noun}
          </Button>
        )}
      </section>
    </div>
  );
}

'use client';

import { useConfirm } from '@/components/patterns/confirm-dialog';
import { ErrorState } from '@/components/patterns/error-state';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { adminPath, useTrackId } from '@/lib/track';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import {
  CircleAlert,
  Cloud,
  CloudOff,
  FileQuestion,
  LoaderCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Save,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { AdminPageHeader } from '../../components/admin-page-header';
import { formatDateTime, shortId } from '../../lib/format';
import { useDeleteAssessment, useSaveAssessment } from '../api';
import {
  useAssessmentEditor,
  type AssessmentEditorController,
  type DraftStatus,
} from '../hooks/use-assessment-editor';
import {
  addQuestion,
  moveQuestion,
  normalizeSession,
  removeQuestion,
  sessionType,
} from '../model/editor';
import { toPayload, validateEditor } from '../model/payload';
import type { AssessmentKind } from '../model/types';
import { ImportCsvDialog } from './import-csv-dialog';
import { MetaPanel } from './meta-panel';
import { QuestionEditor } from './question-editor';
import { SessionSettings } from './session-settings';

const NOUN: Record<AssessmentKind, string> = {
  tryout: 'try out',
  quiz: 'quiz',
};
const LIST_PATH: Record<AssessmentKind, string> = {
  tryout: 'tryout',
  quiz: 'quiz',
};

function DraftIndicator({ status }: { status: DraftStatus }) {
  if (status === 'idle') return null;
  const map = {
    saving: { icon: LoaderCircle, text: 'Menyimpan draf…', spin: true },
    saved: {
      icon: Cloud,
      text: 'Draf tersimpan di perangkat ini',
      spin: false,
    },
    failed: {
      icon: CloudOff,
      text: 'Draf gagal disimpan di perangkat',
      spin: false,
    },
  } as const;
  const { icon: Icon, text, spin } = map[status];
  return (
    <p
      className="flex items-center gap-1.5 text-xs text-ink-muted"
      aria-live="polite"
    >
      <Icon
        className={cn('size-3.5', spin && 'animate-spin')}
        aria-hidden
      />
      {text}
    </p>
  );
}

/**
 * Editor asesmen tunggal untuk try out dan quiz (menggantikan 4 salinan
 * `question-session-tryout.tsx`). `id` kosong = buat baru.
 */
export function AssessmentEditor({
  kind,
  id,
}: {
  kind: AssessmentKind;
  id?: string;
}) {
  const editor = useAssessmentEditor(kind, id);
  const trackId = useTrackId() ?? '';
  const router = useRouter();
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const save = useSaveAssessment(kind);
  const remove = useDeleteAssessment(kind);
  const [detailOpen, setDetailOpen] = useState(true);
  const noun = NOUN[kind];
  const listHref = adminPath(trackId, LIST_PATH[kind]);

  const handleSave = async () => {
    const issue = validateEditor(editor.state, kind);
    if (issue) {
      toast.error(issue.message);
      if (issue.sessionIndex !== undefined) {
        editor.openSession(issue.sessionIndex);
        if (issue.questionIndex !== undefined)
          editor.setQuestionIndex(issue.questionIndex);
      }
      return;
    }
    const mode = editor.isEdit ? 'update' : 'create';
    try {
      await save.mutateAsync({
        mode,
        body: toPayload(editor.state, kind, mode),
      });
    } catch {
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ['admin', 'assessments'] });
    await editor.afterSave();
    if (mode === 'create') router.push(listHref);
  };

  const handleDelete = editor.isEdit
    ? () =>
        void confirm({
          title: `Hapus ${noun} "${editor.state.meta.title ?? ''}"?`,
          description:
            'Semua sesi, soal, dan hasil peserta ikut terhapus. Tindakan ini tidak bisa dibatalkan.',
          confirmLabel: `Hapus ${noun}`,
          destructive: true,
          onConfirm: async () => {
            await remove.mutateAsync(id!);
            await queryClient.invalidateQueries({
              queryKey: ['admin', 'assessments'],
            });
            router.push(listHref);
          },
        })
    : undefined;

  const title = editor.isEdit
    ? `Ubah ${noun}`
    : kind === 'quiz'
      ? 'Tambah quiz'
      : 'Tambah try out';

  const header = (
    <AdminPageHeader
      back={{ href: listHref, label: `Daftar ${noun}` }}
      title={editor.state.meta.title?.trim() || title}
      meta={
        editor.isEdit ? (
          <>
            {title.toLowerCase()} · id {shortId(id!, 12)}
            {editor.state.meta.updateAt &&
              ` · diperbarui ${formatDateTime(editor.state.meta.updateAt)}`}
          </>
        ) : (
          title.toLowerCase()
        )
      }
      actions={
        <div className="flex flex-col items-end gap-1.5">
          <Button
            type="button"
            onClick={handleSave}
            loading={save.isPending}
            disabled={!editor.ready}
          >
            {!save.isPending && <Save />}
            Simpan {noun}
          </Button>
          <DraftIndicator status={editor.draftStatus} />
        </div>
      }
    />
  );

  if (editor.error) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <ErrorState
          error={editor.error}
          title={`Data ${noun} tidak dapat dimuat`}
          onRetry={editor.retry}
        />
      </div>
    );
  }

  if (editor.conflict) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <section
          aria-labelledby="conflict-title"
          className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-md border border-line bg-surface p-6 text-center"
        >
          <CircleAlert
            className="size-6 text-ink-muted"
            aria-hidden
          />
          <h2
            id="conflict-title"
            className="font-display text-lg font-bold tracking-display text-ink"
          >
            Ada versi lebih baru di server
          </h2>
          <p className="text-sm text-ink-muted">
            {noun.charAt(0).toUpperCase() + noun.slice(1)} ini diperbarui
            setelah draf di perangkatmu dibuat. Pilih versi yang mau dipakai.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => editor.resolveConflict('server')}>
              Pakai data server
            </Button>
            <Button
              variant="outline"
              onClick={() => editor.resolveConflict('draft')}
            >
              Lanjutkan draf lokal
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (editor.loading) {
    return (
      <div
        className="flex flex-col gap-6"
        aria-busy
      >
        {header}
        <div className="grid gap-4 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <Skeleton className="h-96 w-full rounded-md" />
          <Skeleton className="h-96 w-full rounded-md" />
        </div>
      </div>
    );
  }

  const sessionOpen = editor.activeSession !== null;

  return (
    <div className="flex flex-col gap-6">
      {header}
      <div
        className={cn(
          'grid items-start gap-4',
          sessionOpen && detailOpen && 'lg:grid-cols-[22rem_minmax(0,1fr)]',
        )}
      >
        {(!sessionOpen || detailOpen) && (
          <aside
            aria-label={`Detail ${noun}`}
            className={cn(
              'rounded-md border border-line bg-surface p-4 sm:p-5',
              !sessionOpen && 'mx-auto w-full max-w-2xl',
            )}
          >
            <MetaPanel
              editor={editor}
              trackId={trackId}
              onDelete={handleDelete}
            />
          </aside>
        )}
        {sessionOpen && (
          <SessionWorkspace
            editor={editor}
            detailOpen={detailOpen}
            onToggleDetail={() => setDetailOpen((v) => !v)}
          />
        )}
      </div>
    </div>
  );
}

function SessionWorkspace({
  editor,
  detailOpen,
  onToggleDetail,
}: {
  editor: AssessmentEditorController;
  detailOpen: boolean;
  onToggleDetail: () => void;
}) {
  const {
    kind,
    state,
    activeSession,
    questionIndex,
    setQuestionIndex,
    updateSession,
    updateQuestion,
    categories,
    change,
    openSession,
  } = editor;
  const si = activeSession!;
  const session = state.sessions[si];
  if (!session) return null;
  const type = sessionType(session, kind);
  const qi = Math.min(questionIndex, Math.max(0, session.Questions.length - 1));
  const question = session.Questions[qi];
  const DetailIcon = detailOpen ? PanelLeftClose : PanelLeftOpen;

  const add = () => {
    updateSession(si, (s) => addQuestion(s, kind));
    setQuestionIndex(session.Questions.length);
  };

  return (
    <section
      aria-labelledby="session-title"
      className="grid items-start gap-4 xl:grid-cols-[20rem_minmax(0,1fr)]"
    >
      <div className="flex flex-col gap-4 rounded-md border border-line bg-surface p-4 xl:sticky xl:top-20">
        <div className="flex items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs text-white">
            {si + 1}
          </span>
          <h2
            id="session-title"
            className="min-w-0 flex-1 truncate font-display text-lg font-bold tracking-display text-ink"
          >
            {session.name || 'Pengaturan sesi'}
          </h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="hidden lg:inline-flex"
            onClick={onToggleDetail}
            aria-label={
              detailOpen ? 'Sembunyikan panel detail' : 'Tampilkan panel detail'
            }
            aria-pressed={!detailOpen}
          >
            <DetailIcon />
          </Button>
        </div>
        <SessionSettings
          kind={kind}
          session={session}
          categories={categories}
          onChange={(fn) => updateSession(si, fn)}
          onDelete={
            kind === 'tryout'
              ? () => {
                  change((s) => ({
                    ...s,
                    sessions: s.sessions.filter((_, i) => i !== si),
                  }));
                  openSession(null);
                }
              : undefined
          }
        />
        <div className="flex flex-col gap-2 border-t border-line pt-4">
          <div className="flex items-center gap-2">
            <h3 className="mr-auto text-sm font-semibold text-ink">
              Daftar soal{' '}
              <span className="font-mono text-ink-muted">
                {session.Questions.length}
              </span>
            </h3>
            <ImportCsvDialog
              kind={kind}
              type={type}
              questionCount={session.Questions.length}
              onImported={(questions) => {
                updateSession(si, (s) =>
                  normalizeSession({ ...s, Questions: questions }, kind),
                );
                setQuestionIndex(0);
              }}
            />
          </div>
          <nav aria-label="Navigasi soal">
            <ol className="flex flex-wrap gap-1.5">
              {session.Questions.map((q, i) => (
                <li key={q.uid ?? i}>
                  <button
                    type="button"
                    onClick={() => setQuestionIndex(i)}
                    aria-current={i === qi ? 'step' : undefined}
                    aria-label={`Soal ${q.number}${q.question.trim() ? '' : ', belum diisi'}`}
                    className={cn(
                      'flex size-9 items-center justify-center rounded-full border font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none',
                      i === qi
                        ? 'border-brand bg-brand text-brand-ink'
                        : q.question.trim()
                          ? 'border-ink/70 bg-surface text-ink hover:bg-ink/5'
                          : 'border-dashed border-line-strong bg-surface text-ink-muted hover:border-ink',
                    )}
                  >
                    {q.number}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={add}
                  aria-label="Tambah soal"
                  className="flex size-9 items-center justify-center rounded-full border border-brand-muted bg-brand-soft text-brand-strong hover:bg-brand-muted/60 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Plus className="size-4" />
                </button>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="min-w-0 rounded-md border border-line bg-paper p-4 sm:p-5">
        {question ? (
          <QuestionEditor
            key={question.uid ?? `${si}-${qi}`}
            question={question}
            index={qi}
            total={session.Questions.length}
            type={type}
            onChange={(fn) => updateQuestion(si, qi, fn)}
            onMove={(to) => {
              updateSession(si, (s) => moveQuestion(s, qi, to));
              setQuestionIndex(to);
            }}
            onDelete={() => {
              updateSession(si, (s) => removeQuestion(s, qi));
              if (qi > 0 && qi === session.Questions.length - 1)
                setQuestionIndex(qi - 1);
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <FileQuestion
              className="size-6 text-ink-muted"
              aria-hidden
            />
            <p className="font-display text-lg font-bold tracking-display text-ink">
              Belum ada soal di sesi ini
            </p>
            <p className="max-w-sm text-sm text-ink-muted">
              Tambah soal satu per satu, impor dari CSV, atau buat dengan AI
              dari materi.
            </p>
            <Button
              type="button"
              onClick={add}
            >
              <Plus />
              Tambah soal pertama
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

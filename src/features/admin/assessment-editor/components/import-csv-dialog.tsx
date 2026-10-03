'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FileUp, LoaderCircle } from 'lucide-react';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import { useStorageUpload } from '../../hooks/use-storage-upload';
import { useAllChapters } from '../api';
import {
  CsvImportError,
  csvFormatFor,
  replaceBase64Images,
  rowsToQuestions,
} from '../model/csv-import';
import type {
  AssessmentKind,
  AssessmentType,
  EditorQuestion,
} from '../model/types';

async function parseCsv(file: File) {
  const { default: Papa } = await import('papaparse');
  return new Promise<Record<string, string>[]>((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => resolve(res.data),
      error: () => reject(new CsvImportError('File CSV tidak bisa dibaca.')),
    });
  });
}

/** Markdown → HTML BlockNote (editor headless, dimuat hanya saat impor). */
async function markdownConverter() {
  const { BlockNoteEditor } = await import('@blocknote/core');
  const editor = BlockNoteEditor.create();
  return async (markdown: string) => {
    if (!markdown) return '';
    const blocks = await editor.tryParseMarkdownToBlocks(markdown);
    return editor.blocksToFullHTML(blocks);
  };
}

/**
 * Impor soal dari CSV ke sesi aktif (menggantikan soal yang ada). Gambar
 * base64 di teks diunggah ke bucket `dump-images`; markdown dikonversi ke
 * HTML BlockNote.
 */
export function ImportCsvDialog({
  kind,
  type,
  questionCount,
  onImported,
}: {
  kind: AssessmentKind;
  type: AssessmentType;
  questionCount: number;
  onImported: (questions: EditorQuestion[]) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const chapters = useAllChapters(open);
  const { upload } = useStorageUpload({
    bucket: 'dump-images',
    toastError: false,
  });
  const disabledForQuiz = kind === 'quiz' && type === 'IRT';
  const format = csvFormatFor(type);

  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const rows = await parseCsv(file);
      const questions = rowsToQuestions(rows, type, chapters.data ?? []);
      const toHtml = await markdownConverter();
      const uploadImage = async (blob: Blob, ext: string) =>
        (await upload(blob, { name: `${crypto.randomUUID()}.${ext}` })).url;
      const converted: EditorQuestion[] = [];
      for (const q of questions) {
        converted.push({
          ...q,
          question: await toHtml(
            await replaceBase64Images(q.question, uploadImage),
          ),
          explanation: await toHtml(
            await replaceBase64Images(q.explanation ?? '', uploadImage),
          ),
          Answers: await Promise.all(
            q.Answers.map(async (a) => ({
              ...a,
              answer: await toHtml(
                await replaceBase64Images(a.answer, uploadImage),
              ),
            })),
          ),
        });
      }
      onImported(converted);
      toast.success(`${converted.length} soal diimpor.`);
      setFile(null);
      setOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Impor gagal. Periksa format CSV.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (busy) return;
        setOpen(v);
        if (!v) setFile(null);
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
        >
          <FileUp />
          Impor CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Impor soal dari CSV</DialogTitle>
          <DialogDescription>
            {questionCount > 0
              ? `${questionCount} soal di sesi ini akan diganti hasil impor.`
              : 'Soal hasil impor mengisi sesi ini.'}
          </DialogDescription>
        </DialogHeader>
        {disabledForQuiz ? (
          <p className="text-sm text-ink-muted">
            Impor untuk penilaian IRT belum tersedia di quiz.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">Kolom CSV</p>
              <p className="mt-1 font-mono text-xs leading-relaxed break-words text-ink-muted">
                {format.join(' | ')}
              </p>
              {type !== '1-5' && (
                <p className="mt-1 text-xs text-ink-subtle">
                  Correct berisi huruf A–E. Category & Chapter opsional;
                  beberapa bab dipisah tanda |.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`${id}-file`}>File CSV</Label>
              <input
                id={`${id}-file`}
                type="file"
                accept=".csv,text/csv"
                disabled={busy}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="text-sm text-ink file:mr-3 file:rounded-full file:border-0 file:bg-brand-soft file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-strong"
              />
            </div>
            {chapters.isFetching && (
              <p className="flex items-center gap-2 text-xs text-ink-muted">
                <LoaderCircle
                  className="size-3.5 animate-spin"
                  aria-hidden
                />
                Memuat daftar bab materi…
              </p>
            )}
          </div>
        )}
        <DialogFooter>
          <Button
            type="button"
            onClick={run}
            loading={busy}
            disabled={!file || disabledForQuiz || chapters.isFetching}
          >
            Impor soal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

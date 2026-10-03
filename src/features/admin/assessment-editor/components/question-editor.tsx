'use client';

import { useConfirm } from '@/components/patterns/confirm-dialog';
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
import { CircleCheck, CircleX, Sigma, Trash2 } from 'lucide-react';
import { useId } from 'react';
import { useStorageUpload } from '../../hooks/use-storage-upload';
import { RichTextEditor } from '../../resource-form/fields';
import { moveAnswer } from '../model/editor';
import { OPTION_LETTERS, setAnswerValue, valueOptions } from '../model/scoring';
import type { AssessmentType, EditorQuestion } from '../model/types';
import { ChapterPicker } from './chapter-picker';
import { QuestionImageControls } from './question-images';

function EditorBox({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string | undefined;
  onChange: (v: string) => void;
}) {
  return (
    <div
      role="group"
      aria-labelledby={id}
      className="rounded-sm border border-line-strong bg-surface px-1 py-2 focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/25"
    >
      <RichTextEditor
        value={value ?? ''}
        onValueChange={onChange}
      />
    </div>
  );
}

type Props = {
  question: EditorQuestion;
  index: number;
  total: number;
  type: AssessmentType;
  onChange: (fn: (q: EditorQuestion) => EditorQuestion) => void;
  onMove: (to: number) => void;
  onDelete: () => void;
};

/** Satu soal: isi, gambar, opsi A–E + nilai, pembahasan, dan bab materi. */
export function QuestionEditor({
  question,
  index,
  total,
  type,
  onChange,
  onMove,
  onDelete,
}: Props) {
  const id = useId();
  const confirm = useConfirm();
  const { remove } = useStorageUpload({
    bucket: 'to-question',
    toastError: false,
  });
  const patch = (p: Partial<EditorQuestion>) =>
    onChange((q) => ({ ...q, ...p }));
  const options = valueOptions(type);
  const imageName = () => `${crypto.randomUUID()}-${question.number}`;

  const handleDelete = () =>
    void confirm({
      title: `Hapus soal ${question.number}?`,
      description: question.image
        ? 'Gambar soal ikut dihapus dari storage. Nomor soal lain akan diurutkan ulang.'
        : 'Nomor soal lain akan diurutkan ulang.',
      confirmLabel: 'Hapus soal',
      destructive: true,
      onConfirm: async () => {
        // Versi lama: bila gambar gagal dihapus, soal tidak ikut dihapus.
        if (question.image) await remove([question.image]);
        onDelete();
      },
    });

  return (
    <article
      aria-labelledby={`${id}-title`}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-order`}>Nomor</Label>
          <Select
            value={`${index + 1}`}
            onValueChange={(v) => onMove(Number(v) - 1)}
          >
            <SelectTrigger
              id={`${id}-order`}
              className="h-11 w-20 font-mono"
              aria-label="Pindahkan ke nomor"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: total }, (_, i) => (
                <SelectItem
                  key={i}
                  value={`${i + 1}`}
                >
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-1.5">
          <Label htmlFor={`${id}-sub`}>Subkategori soal</Label>
          <Input
            id={`${id}-sub`}
            value={question.subCategory ?? ''}
            onChange={(e) => patch({ subCategory: e.target.value })}
            placeholder="mis. Silogisme"
          />
        </div>
        <div className="flex min-w-40 flex-1 flex-col gap-1.5">
          <Label htmlFor={`${id}-subsub`}>Sub-subkategori</Label>
          <Input
            id={`${id}-subsub`}
            value={question.subSubCategory ?? ''}
            onChange={(e) => patch({ subSubCategory: e.target.value })}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleDelete}
          className="text-danger hover:bg-danger-soft"
        >
          <Trash2 />
          Hapus soal
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h3
            id={`${id}-title`}
            className="font-display text-lg font-bold tracking-display text-ink"
          >
            Soal <span className="font-mono">{question.number}</span>
          </h3>
          <p className="flex items-center gap-1 text-xs text-ink-subtle">
            <Sigma
              className="size-3.5"
              aria-hidden
            />
            Rumus: <span className="font-mono">$x^2$</span> atau{' '}
            <span className="font-mono">$$…$$</span>
          </p>
        </div>
        <span
          id={`${id}-q`}
          className="sr-only"
        >
          Isi soal {question.number}
        </span>
        <EditorBox
          id={`${id}-q`}
          value={question.question}
          onChange={(v) => patch({ question: v })}
        />
        <QuestionImageControls
          label={`soal ${question.number}`}
          image={question.image}
          fileName={imageName}
          onUploaded={(name) => patch({ image: name })}
          onInsert={(html) =>
            onChange((q) => ({ ...q, question: `${q.question}\n\n${html}` }))
          }
          onRemoved={() => patch({ image: null })}
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 text-sm font-semibold text-ink">
          Opsi jawaban & nilai
        </legend>
        {question.Answers.map((answer, ai) => {
          const letter = OPTION_LETTERS[ai] ?? `${ai + 1}`;
          return (
            <div
              key={ai}
              className="flex flex-col gap-2 rounded-md border border-line bg-surface p-3 sm:flex-row sm:items-start"
            >
              <div className="flex items-center gap-2 sm:flex-col sm:items-start">
                <span
                  className="flex size-9 items-center justify-center rounded-full border border-line-strong font-mono text-sm font-medium text-ink"
                  aria-hidden
                >
                  {letter}
                </span>
                <Select
                  value={`${ai + 1}`}
                  onValueChange={(v) =>
                    onChange((q) => moveAnswer(q, ai, Number(v) - 1))
                  }
                >
                  <SelectTrigger
                    size="sm"
                    className="w-16 font-mono"
                    aria-label={`Urutan opsi ${letter}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {question.Answers.map((_, i) => (
                      <SelectItem
                        key={i}
                        value={`${i + 1}`}
                      >
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <span
                  id={`${id}-a${ai}`}
                  className="sr-only"
                >
                  Teks opsi {letter}
                </span>
                <EditorBox
                  id={`${id}-a${ai}`}
                  value={answer.answer}
                  onChange={(v) =>
                    onChange((q) => ({
                      ...q,
                      Answers: q.Answers.map((a, i) =>
                        i === ai ? { ...a, answer: v } : a,
                      ),
                    }))
                  }
                />
                <QuestionImageControls
                  label={`opsi ${letter}`}
                  image={answer.image}
                  fileName={imageName}
                  onUploaded={(name) =>
                    onChange((q) => ({
                      ...q,
                      Answers: q.Answers.map((a, i) =>
                        i === ai ? { ...a, image: name } : a,
                      ),
                    }))
                  }
                  onInsert={(html) =>
                    onChange((q) => ({
                      ...q,
                      Answers: q.Answers.map((a, i) =>
                        i === ai
                          ? { ...a, answer: `${a.answer}\n\n${html}` }
                          : a,
                      ),
                    }))
                  }
                  onRemoved={() =>
                    onChange((q) => ({
                      ...q,
                      Answers: q.Answers.map((a, i) =>
                        i === ai ? { ...a, image: null } : a,
                      ),
                    }))
                  }
                />
              </div>
              <div
                role="radiogroup"
                aria-label={`Nilai opsi ${letter}`}
                className="flex flex-wrap gap-1.5"
              >
                {options.map((opt) => {
                  const active = answer.value === opt.value;
                  const Icon =
                    opt.kind === 'correct'
                      ? CircleCheck
                      : opt.kind === 'wrong'
                        ? CircleX
                        : null;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() =>
                        onChange((q) => ({
                          ...q,
                          Answers: setAnswerValue(
                            q.Answers,
                            ai,
                            opt.value,
                            type,
                          ),
                        }))
                      }
                      className={cn(
                        'inline-flex h-9 min-w-9 items-center justify-center gap-1 rounded-full border px-2.5 font-mono text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none',
                        active
                          ? opt.kind === 'wrong'
                            ? 'border-ink bg-ink text-white'
                            : 'border-brand bg-brand text-brand-ink'
                          : 'border-line-strong bg-surface text-ink-muted hover:border-ink hover:text-ink',
                      )}
                    >
                      {Icon && (
                        <Icon
                          className="size-4"
                          aria-hidden
                        />
                      )}
                      {opt.kind ? (
                        <span className="font-sans text-xs font-semibold">
                          {opt.label}
                        </span>
                      ) : (
                        opt.label
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </fieldset>

      <div className="flex flex-col gap-2">
        <h4
          id={`${id}-exp`}
          className="text-sm font-semibold text-ink"
        >
          Pembahasan
        </h4>
        <EditorBox
          id={`${id}-exp`}
          value={question.explanation}
          onChange={(v) => patch({ explanation: v })}
        />
      </div>

      <ChapterPicker
        question={question}
        onChange={patch}
      />
    </article>
  );
}

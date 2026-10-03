'use client';

import { useConfirm } from '@/components/patterns/confirm-dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Trash2 } from 'lucide-react';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import { useGenerateQuestions } from '../api';
import {
  appendGenerated,
  changeSessionType,
  sessionType,
  setSessionCategory,
} from '../model/editor';
import { ASSESSMENT_LABELS } from '../model/scoring';
import {
  ASSESSMENT_TYPES,
  QUIZ_ASSESSMENT_TYPES,
  type AssessmentKind,
  type AssessmentType,
  type EditorSession,
  type TryoutCategoryOption,
} from '../model/types';

type Props = {
  kind: AssessmentKind;
  session: EditorSession;
  categories: TryoutCategoryOption[];
  onChange: (fn: (s: EditorSession) => EditorSession) => void;
  onDelete?: () => void;
};

/** Pengaturan satu sesi/subtes: tes, subtes, durasi, penilaian, dll. */
export function SessionSettings({
  kind,
  session,
  categories,
  onChange,
  onDelete,
}: Props) {
  const id = useId();
  const confirm = useConfirm();
  const type = sessionType(session, kind);
  const types = kind === 'quiz' ? QUIZ_ASSESSMENT_TYPES : [...ASSESSMENT_TYPES];
  const category = categories.find((c) => c.id === session.categoryId);
  const patch = (p: Partial<EditorSession>) =>
    onChange((s) => ({ ...s, ...p }));

  const changeType = (next: AssessmentType) => {
    if (next === type) return;
    const apply = () => onChange((s) => changeSessionType(s, next));
    if (session.Questions.length === 0) return apply();
    void confirm({
      title: `Ganti penilaian ke ${ASSESSMENT_LABELS[next]}?`,
      description:
        'Nilai opsi di semua soal sesi ini dikonversi: jawaban yang benar tetap benar.',
      confirmLabel: 'Ganti penilaian',
      onConfirm: apply,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-cat`}>Kategori tes</Label>
          <Select
            value={session.categoryId || undefined}
            onValueChange={(v) => {
              const c = categories.find((x) => x.id === v);
              onChange((s) => setSessionCategory(s, c ?? null));
            }}
          >
            <SelectTrigger
              id={`${id}-cat`}
              className="h-11"
            >
              <SelectValue placeholder="Pilih tes" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem
                  key={c.id}
                  value={c.id}
                >
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-sub`}>Subtes</Label>
          <Select
            value={session.subCategoryId || undefined}
            disabled={!category}
            onValueChange={(v) => {
              const sub = category?.TryoutSubCategory.find((x) => x.id === v);
              patch({ subCategoryId: v, subCategory: sub?.name ?? '' });
            }}
          >
            <SelectTrigger
              id={`${id}-sub`}
              className="h-11"
            >
              <SelectValue
                placeholder={category ? 'Pilih subtes' : 'Pilih tes dulu'}
              />
            </SelectTrigger>
            <SelectContent>
              {category?.TryoutSubCategory.map((s) => (
                <SelectItem
                  key={s.id}
                  value={s.id}
                >
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-name`}>Judul sesi</Label>
        <Input
          id={`${id}-name`}
          value={session.name ?? ''}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="mis. Penalaran Umum"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-dur`}>Durasi (menit)</Label>
          <Input
            id={`${id}-dur`}
            type="number"
            inputMode="numeric"
            min={0}
            className="font-mono"
            value={session.duration === 0 ? '' : (session.duration ?? '')}
            placeholder="60"
            onChange={(e) =>
              patch({
                duration:
                  e.target.value === '' ? '' : parseInt(e.target.value, 10),
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-type`}>Penilaian</Label>
          <Select
            value={type}
            onValueChange={(v) => changeType(v as AssessmentType)}
          >
            <SelectTrigger
              id={`${id}-type`}
              className="h-11 font-mono"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {types.map((t) => (
                <SelectItem
                  key={t}
                  value={t}
                >
                  {ASSESSMENT_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
          <Label htmlFor={`${id}-th`}>
            Ambang batas{' '}
            <span className="font-normal text-ink-subtle">(opsional)</span>
          </Label>
          <Input
            id={`${id}-th`}
            type="number"
            inputMode="numeric"
            className="font-mono"
            value={session.thresholdValue ? session.thresholdValue : ''}
            onChange={(e) =>
              patch({
                thresholdValue:
                  e.target.value === ''
                    ? undefined
                    : parseInt(e.target.value, 10),
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-doc`}>
          ID dokumen pembahasan{' '}
          <span className="font-normal text-ink-subtle">(opsional)</span>
        </Label>
        <Input
          id={`${id}-doc`}
          className="font-mono"
          value={session.documentId ?? ''}
          onChange={(e) => patch({ documentId: e.target.value })}
          placeholder="id dokumen"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <GenerateQuestionsDialog
          onGenerated={(questions) =>
            onChange((s) => appendGenerated(s, questions, kind))
          }
        />
        {onDelete && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-danger hover:bg-danger-soft"
            onClick={() =>
              void confirm({
                title: `Hapus sesi "${session.name || 'tanpa judul'}"?`,
                description: `${session.Questions.length} soal di sesi ini ikut terhapus dari draf.`,
                confirmLabel: 'Hapus sesi',
                destructive: true,
                onConfirm: onDelete,
              })
            }
          >
            <Trash2 />
            Hapus sesi
          </Button>
        )}
      </div>
    </div>
  );
}

function GenerateQuestionsDialog({
  onGenerated,
}: {
  onGenerated: (questions: Parameters<typeof appendGenerated>[1]) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState('');
  const generate = useGenerateQuestions();

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !generate.isPending && setOpen(v)}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
        >
          <Sparkles />
          Buat soal dengan AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat soal dengan AI</DialogTitle>
          <DialogDescription>
            Tempel materi sebagai konteks. Soal hasil AI ditambahkan di akhir
            sesi ini — periksa lagi sebelum disimpan.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${id}-ctx`}>Konteks materi</Label>
          <Textarea
            id={`${id}-ctx`}
            rows={6}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Minimal 10 karakter"
            disabled={generate.isPending}
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            loading={generate.isPending}
            onClick={async () => {
              if (context.trim().length < 10) {
                toast.warning('Isi konteks minimal 10 karakter.');
                return;
              }
              const result = await generate
                .mutateAsync(context)
                .catch(() => null);
              if (!result) return;
              onGenerated(result);
              toast.success(`${result.length} soal ditambahkan.`);
              setContext('');
              setOpen(false);
            }}
          >
            {generate.isPending ? 'Sedang membuat soal…' : 'Buat soal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Check, Plus } from 'lucide-react';
import { useId } from 'react';
import { Combobox } from '../../resource-form/fields';
import { useCourseCategories, useCourseChapters } from '../api';
import type { EditorQuestion } from '../model/types';

/** Bab materi (course) yang terkait dengan soal — dipakai rekomendasi belajar. */
export function ChapterPicker({
  question,
  onChange,
}: {
  question: EditorQuestion;
  onChange: (patch: Partial<EditorQuestion>) => void;
}) {
  const id = useId();
  const categories = useCourseCategories();
  const chapters = useCourseChapters(question.categoryId);
  const selected = question.courseChapterIds;

  const toggle = (chapterId: string) =>
    onChange({
      courseChapterIds: selected.includes(chapterId)
        ? selected.filter((c) => c !== chapterId)
        : [...selected, chapterId],
    });

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4"
    >
      <div className="flex items-center gap-2">
        <BookOpen
          className="size-4 text-ink-muted"
          aria-hidden
        />
        <h3
          id={`${id}-title`}
          className="text-sm font-semibold text-ink"
        >
          Bab materi terkait
        </h3>
        <span className="ml-auto font-mono text-xs text-ink-subtle">
          {selected.length} dipilih
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-category`}>Kategori course</Label>
        <Combobox
          id={`${id}-category`}
          value={question.categoryId ?? null}
          onChange={(value) => onChange({ categoryId: value ?? undefined })}
          options={(categories.data ?? []).map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          loading={categories.isPending}
          placeholder="Pilih kategori course"
          searchPlaceholder="Cari kategori…"
        />
      </div>
      {!question.categoryId ? (
        <p className="text-sm text-ink-muted">
          Pilih kategori untuk melihat bab yang tersedia.
        </p>
      ) : chapters.isPending ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      ) : (chapters.data ?? []).length === 0 ? (
        <p className="text-sm text-ink-muted">Belum ada bab di kategori ini.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {chapters.data!.map((chapter) => {
            const isSelected = selected.includes(chapter.id);
            return (
              <li
                key={chapter.id}
                className="flex items-center justify-between gap-3 rounded-sm border border-line px-3 py-2 data-[selected=true]:border-brand-muted data-[selected=true]:bg-brand-soft"
                data-selected={isSelected}
              >
                <span className="text-sm text-ink">{chapter.title}</span>
                <Button
                  type="button"
                  size="xs"
                  variant={isSelected ? 'secondary' : 'outline'}
                  aria-pressed={isSelected}
                  aria-label={`${isSelected ? 'Lepas' : 'Tautkan'} bab ${chapter.title}`}
                  onClick={() => toggle(chapter.id)}
                >
                  {isSelected ? <Check /> : <Plus />}
                  {isSelected ? 'Tertaut' : 'Tautkan'}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

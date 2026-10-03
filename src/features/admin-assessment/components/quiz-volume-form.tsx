'use client';

import { ErrorState } from '@/components/patterns/error-state';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminPageHeader } from '@/features/admin/components/admin-page-header';
import { toLocalInput } from '@/features/admin/lib/format';
import {
  Combobox,
  DateField,
  NumberField,
  SelectField,
  TextField,
  UploadField,
} from '@/features/admin/resource-form/fields';
import {
  FormSection,
  isNewId,
  ResourceForm,
} from '@/features/admin/resource-form/resource-form';
import { adminPath, useTrackId } from '@/lib/track';
import { ArrowDown, ArrowUp, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { z } from 'zod';
import {
  useQuizOptions,
  useQuizVolume,
  useSaveQuizVolume,
  useTryoutSubCategories,
} from '../api';
import type { QuizVolumeDetail, VolumeQuiz } from '../model/types';
import {
  normalizeOrders,
  reorderWithinSubCategory,
  toggleQuiz,
} from '../model/volume';

const schema = z
  .object({
    title: z.string().trim().min(1, 'Nama volume wajib diisi'),
    number: z.number({ error: 'Nomor volume harus berupa angka' }).int(),
    status: z.enum(['DRAFT', 'PUBLIC']),
    startDate: z.string().min(1, 'Waktu mulai wajib diisi'),
    endDate: z.string().min(1, 'Waktu berakhir wajib diisi'),
    resultDate: z.string().min(1, 'Waktu pembahasan wajib diisi'),
    image: z.string().nullable(),
    quizzes: z.array(z.custom<VolumeQuiz>()),
  })
  .refine((v) => v.endDate >= v.startDate, {
    path: ['endDate'],
    message: 'Waktu berakhir harus setelah waktu mulai',
  });
type Values = z.input<typeof schema>;

const EMPTY: Values = {
  title: '',
  number: undefined as unknown as number,
  status: 'DRAFT',
  startDate: '',
  endDate: '',
  resultDate: '',
  image: null,
  quizzes: [],
};

const toValues = (d: QuizVolumeDetail, subIds: string[]): Values => ({
  title: d.title ?? '',
  number: d.number,
  status: d.status === 'PUBLIC' ? 'PUBLIC' : 'DRAFT',
  startDate: toLocalInput(d.startDate),
  endDate: toLocalInput(d.endDate),
  // Versi lama: bila volume belum punya tanggal pembahasan, pakai milik quiz
  // pertama, lalu tanggal mulai.
  resultDate: toLocalInput(
    d.resultDate ?? d.Tryout?.[0]?.resultDate ?? d.startDate,
  ),
  image: d.image,
  quizzes: normalizeOrders(d.Tryout ?? [], subIds),
});

function QuizPicker({
  subCategories,
}: {
  subCategories: { id: string; name: string }[];
}) {
  const { control } = useFormContext<Values>();
  const [search, setSearch] = useState('');
  const [debounced] = useDebounce(search, 400);
  const options = useQuizOptions(debounced);
  const subIds = subCategories.map((s) => s.id);

  return (
    <Controller
      control={control}
      name="quizzes"
      render={({ field }) => {
        const selected = field.value as VolumeQuiz[];
        const groups = [
          ...subCategories,
          ...selected
            .map((q) => q.TryoutSubCategory)
            .filter(
              (s, i, arr) =>
                !subIds.includes(s.id) &&
                arr.findIndex((x) => x.id === s.id) === i,
            ),
        ];
        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="volume-quiz-picker"
                className="text-sm font-semibold text-ink"
              >
                Tambah quiz
              </label>
              <Combobox
                id="volume-quiz-picker"
                value={null}
                clearable={false}
                options={(options.data ?? [])
                  .filter((q) => !selected.some((s) => s.id === q.id))
                  .map((q) => ({
                    value: q.id,
                    label: q.title,
                    description: `${q.TryoutCategory?.name ?? ''} · ${q.TryoutSubCategory?.name ?? ''}`,
                  }))}
                loading={options.isFetching}
                onSearchChange={setSearch}
                placeholder="Cari & pilih quiz"
                searchPlaceholder="Cari quiz (min. 3 huruf)…"
                emptyText="Tidak ada quiz."
                onChange={(id) => {
                  const quiz = options.data?.find((q) => q.id === id);
                  if (quiz) field.onChange(toggleQuiz(selected, quiz, subIds));
                }}
              />
            </div>
            {selected.length === 0 ? (
              <p className="rounded-md border border-dashed border-line-strong px-4 py-6 text-center text-sm text-ink-muted">
                Belum ada quiz di volume ini.
              </p>
            ) : (
              groups.map((sub) => {
                const items = selected
                  .filter((q) => q.TryoutSubCategory.id === sub.id)
                  .sort((a, b) => (a.quizOrder ?? 0) - (b.quizOrder ?? 0));
                if (items.length === 0) return null;
                return (
                  <section
                    key={sub.id}
                    aria-label={sub.name}
                    className="flex flex-col gap-2"
                  >
                    <h3 className="font-mono text-xs text-ink-muted">
                      {sub.name} · {items.length} quiz
                    </h3>
                    <ol className="flex flex-col gap-1.5">
                      {items.map((quiz, i) => (
                        <li
                          key={quiz.id}
                          className="flex flex-wrap items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2"
                        >
                          <Select
                            value={`${quiz.quizOrder ?? i + 1}`}
                            onValueChange={(v) =>
                              field.onChange(
                                reorderWithinSubCategory(
                                  selected,
                                  quiz.id,
                                  Number(v),
                                ),
                              )
                            }
                          >
                            <SelectTrigger
                              size="sm"
                              className="w-16 font-mono"
                              aria-label={`Urutan ${quiz.title}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {items.map((_, idx) => (
                                <SelectItem
                                  key={idx}
                                  value={`${idx + 1}`}
                                >
                                  {idx + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-ink">
                              {quiz.title}
                            </p>
                            <p className="text-xs text-ink-muted">
                              {quiz.TryoutCategory.name} ·{' '}
                              {quiz.TryoutSubCategory.name} ·{' '}
                              <span className="font-mono">
                                {quiz.TryoutSession?.duration ?? 0} mnt
                              </span>
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            disabled={i === 0}
                            aria-label={`Naikkan ${quiz.title}`}
                            onClick={() =>
                              field.onChange(
                                reorderWithinSubCategory(
                                  selected,
                                  quiz.id,
                                  (quiz.quizOrder ?? i + 1) - 1,
                                ),
                              )
                            }
                          >
                            <ArrowUp />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            disabled={i === items.length - 1}
                            aria-label={`Turunkan ${quiz.title}`}
                            onClick={() =>
                              field.onChange(
                                reorderWithinSubCategory(
                                  selected,
                                  quiz.id,
                                  (quiz.quizOrder ?? i + 1) + 1,
                                ),
                              )
                            }
                          >
                            <ArrowDown />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Keluarkan ${quiz.title}`}
                            onClick={() =>
                              field.onChange(toggleQuiz(selected, quiz, subIds))
                            }
                          >
                            <X />
                          </Button>
                        </li>
                      ))}
                    </ol>
                  </section>
                );
              })
            )}
          </div>
        );
      }}
    />
  );
}

/** Buat (`id = new`) dan ubah volume quiz dalam satu route. */
export function QuizVolumeFormPage({ id }: { id: string }) {
  const trackId = useTrackId();
  const router = useRouter();
  const isNew = isNewId(id);
  const subCategories = useTryoutSubCategories();
  const detail = useQuizVolume(isNew ? undefined : id);
  const save = useSaveQuizVolume();
  const listHref = adminPath(trackId, 'quiz-volume');
  const subIds = useMemo(
    () => (subCategories.data ?? []).map((s) => s.id),
    [subCategories.data],
  );
  const values = useMemo(
    () =>
      detail.data && subCategories.data
        ? toValues(detail.data, subIds)
        : undefined,
    [detail.data, subCategories.data, subIds],
  );

  const title = isNew ? 'Tambah volume quiz' : 'Ubah volume quiz';
  const header = (
    <AdminPageHeader
      back={{ href: listHref, label: 'Daftar volume quiz' }}
      title={title}
      description={
        isNew
          ? 'Buat volume baru lalu pilih quiz di dalamnya.'
          : 'Perbarui detail volume dan urutan quiz di dalamnya.'
      }
    />
  );

  if (!isNew && (detail.isPending || subCategories.isPending)) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <Skeleton className="h-80 w-full rounded-md" />
      </div>
    );
  }
  if (detail.error) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        <ErrorState
          error={detail.error}
          title="Volume quiz tidak dapat dimuat"
          onRetry={() => detail.refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {header}
      <ResourceForm
        schema={schema}
        defaultValues={values ?? EMPTY}
        values={values}
        cancelHref={listHref}
        submitLabel={isNew ? 'Buat volume' : 'Simpan perubahan'}
        className="max-w-3xl"
        onSubmit={async (v, form) => {
          const ordered = normalizeOrders(v.quizzes, subIds);
          await save.mutateAsync({
            ...(isNew ? {} : { id }),
            title: v.title,
            number: v.number,
            status: v.status,
            startDate: v.startDate,
            endDate: v.endDate,
            resultDate: v.resultDate,
            image: v.image || null,
            TryoutIds: ordered.map((q) => ({
              id: q.id,
              quizOrder: q.quizOrder ?? 1,
            })),
          });
          if (isNew) router.push(listHref);
          else form.reset({ ...v, quizzes: ordered });
        }}
      >
        <FormSection title="Detail volume">
          <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
            <TextField
              name="title"
              label="Nama volume"
              placeholder="mis. Persiapan awal UTBK"
            />
            <NumberField
              name="number"
              label="Nomor volume"
              placeholder="1"
              min={1}
            />
          </div>
          <SelectField
            name="status"
            label="Status"
            options={[
              { value: 'DRAFT', label: 'Draf' },
              { value: 'PUBLIC', label: 'Publik' },
            ]}
          />
          <UploadField
            name="image"
            label="Gambar volume"
            bucket="img"
            folder="quiz-volume"
            prefix="quiz-volume"
            optional
          />
        </FormSection>
        <FormSection
          title="Jadwal"
          description="Jadwal quiz di volume ini mengikuti waktu di sini."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <DateField
              name="startDate"
              label="Mulai"
            />
            <DateField
              name="endDate"
              label="Berakhir"
            />
            <DateField
              name="resultDate"
              label="Pembahasan"
            />
          </div>
        </FormSection>
        <FormSection
          title="Quiz di volume ini"
          description="Urutan dihitung per subtes."
        >
          <QuizPicker subCategories={subCategories.data ?? []} />
        </FormSection>
      </ResourceForm>
    </div>
  );
}

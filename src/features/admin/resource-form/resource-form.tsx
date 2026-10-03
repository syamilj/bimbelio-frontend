'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useId } from 'react';
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type UseFormReturn,
} from 'react-hook-form';
import type { z } from 'zod';
import { idErrorMap } from './error-map';

/** `id` di URL `.../[id]` bernilai `new` untuk halaman buat. */
export const NEW_ID = 'new';
export const isNewId = (id: string | undefined | null) => !id || id === NEW_ID;

type AnySchema = z.ZodType<FieldValues, FieldValues>;

export type ResourceFormProps<S extends AnySchema> = {
  schema: S;
  defaultValues: DefaultValues<z.input<S>>;
  /**
   * Mode ubah: nilai dari server. Form di-reset setiap kali objek ini
   * berganti (mis. setelah data selesai dimuat).
   */
  values?: z.input<S>;
  onSubmit: (
    values: z.output<S>,
    form: UseFormReturn<z.input<S>, unknown, z.output<S>>,
  ) => Promise<unknown> | unknown;
  children:
    | React.ReactNode
    | ((
        form: UseFormReturn<z.input<S>, unknown, z.output<S>>,
      ) => React.ReactNode);
  submitLabel?: string;
  /** Tombol batal berupa tautan (halaman) atau aksi (dialog). */
  cancelHref?: string;
  onCancel?: () => void;
  /** `page`: tombol di bilah bawah yang menempel; `dialog`: tombol rata kanan. */
  layout?: 'page' | 'dialog';
  /** Tombol simpan nonaktif sampai ada perubahan (mode ubah). */
  requireDirty?: boolean;
  /** Peringatkan sebelum menutup tab bila ada perubahan yang belum disimpan. */
  warnUnsaved?: boolean;
  /** Konten tambahan di bilah aksi, rata kiri (mis. tombol hapus). */
  footerStart?: React.ReactNode;
  id?: string;
  className?: string;
};

/**
 * Form admin standar: react-hook-form + zod 4 dengan pesan error bahasa
 * Indonesia, satu komponen untuk mode buat dan ubah. Isi form disusun dari
 * field di `./fields` yang membaca `useFormContext()`.
 */
export function ResourceForm<S extends AnySchema>({
  schema,
  defaultValues,
  values,
  onSubmit,
  children,
  submitLabel = 'Simpan',
  cancelHref,
  onCancel,
  layout = 'page',
  requireDirty = false,
  warnUnsaved = layout === 'page',
  footerStart,
  id,
  className,
}: ResourceFormProps<S>) {
  const autoId = useId();
  const formId = id ?? `resource-form-${autoId}`;
  const form = useForm<z.input<S>, unknown, z.output<S>>({
    resolver: zodResolver(schema as never, {
      error: idErrorMap,
    }) as unknown as Resolver<z.input<S>, unknown, z.output<S>>,
    defaultValues,
    mode: 'onTouched',
  });

  useEffect(() => {
    if (values) form.reset(values);
  }, [values]);

  const { isDirty, isSubmitting } = form.formState;

  useEffect(() => {
    if (!warnUnsaved || !isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [warnUnsaved, isDirty]);

  const submit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data, form);
    } catch {
      // Error API sudah ditampilkan sebagai toast oleh MutationCache.
    }
  });

  const actions = (
    <>
      {footerStart && <div className="mr-auto flex gap-2">{footerStart}</div>}
      {cancelHref ? (
        <Button
          variant="ghost"
          asChild
        >
          <Link href={cancelHref}>Batal</Link>
        </Button>
      ) : onCancel ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          Batal
        </Button>
      ) : null}
      <Button
        type="submit"
        form={formId}
        loading={isSubmitting}
        disabled={requireDirty && !isDirty}
      >
        {submitLabel}
      </Button>
    </>
  );

  return (
    <Form {...form}>
      <form
        id={formId}
        noValidate
        onSubmit={submit}
        className={cn('flex flex-col gap-5', className)}
      >
        {typeof children === 'function' ? children(form) : children}
        {layout === 'dialog' ? (
          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            {actions}
          </div>
        ) : (
          <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-end gap-2 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-md sm:border">
            {actions}
          </div>
        )}
      </form>
    </Form>
  );
}

/** Kelompok field berjudul di dalam ResourceForm. */
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        'flex flex-col gap-4 rounded-md border border-line bg-surface p-4 sm:p-5',
        className,
      )}
    >
      <div className="flex flex-col gap-0.5">
        <h2 className="font-display text-lg font-bold tracking-display text-ink">
          {title}
        </h2>
        {description && <p className="text-sm text-ink-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

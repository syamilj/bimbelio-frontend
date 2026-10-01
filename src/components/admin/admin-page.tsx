'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowLeft, Loader2, Save, SearchX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

// Komponen dasar halaman admin. Dipakai semua halaman form admin supaya
// header, bagian form, dan tombol aksi tampil seragam.

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  /** Tampilkan tombol "Kembali" (router.back). */
  showBack?: boolean;
  actions?: ReactNode;
};

export const AdminPageHeader = ({
  title,
  description,
  showBack = true,
  actions,
}: AdminPageHeaderProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

type AdminFormSectionProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export const AdminFormSection = ({
  title,
  description,
  icon,
  className,
  contentClassName,
  children,
}: AdminFormSectionProps) => (
  <Card className={className}>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon}
        {title}
      </CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent className={cn('space-y-4', contentClassName)}>
      {children}
    </CardContent>
  </Card>
);

type AdminFormActionsProps = {
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
};

/** Baris tombol Batal / Simpan di akhir form (tombol submit = type="submit"). */
export const AdminFormActions = ({
  isSubmitting = false,
  submitLabel = 'Simpan',
  cancelLabel = 'Batal',
  onCancel,
  className,
}: AdminFormActionsProps) => {
  const router = useRouter();
  return (
    <div className={cn('flex justify-end gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel ?? (() => router.back())}
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Save className="mr-2 h-4 w-4" />
        )}
        {submitLabel}
      </Button>
    </div>
  );
};

/** Tampilan saat data yang akan diedit tidak ditemukan (dulu halaman kosong / "Loading..." terus). */
export const AdminNotFound = ({
  title = 'Data tidak ditemukan',
  description = 'Data mungkin sudah dihapus atau tautannya salah.',
}: {
  title?: string;
  description?: string;
}) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <SearchX className="h-10 w-10 text-gray-400" />
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="max-w-sm text-sm text-gray-600">{description}</p>
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Button>
    </div>
  );
};

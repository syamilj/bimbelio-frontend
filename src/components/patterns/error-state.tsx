'use client';

import { Button } from '@/components/ui/button';
import { toApiError } from '@/lib/api/client';
import { cn } from '@/lib/utils';
import { CircleAlert, RotateCw, WifiOff } from 'lucide-react';

type ErrorStateProps = {
  error: unknown;
  /** Judul yang menjelaskan apa yang gagal dimuat, mis. "Daftar try out tidak dapat dimuat". */
  title?: string;
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
};

export function ErrorState({
  error,
  title = 'Data tidak dapat dimuat',
  onRetry,
  retrying,
  className,
}: ErrorStateProps) {
  const apiError = toApiError(error);
  const Icon = apiError.isNetwork ? WifiOff : CircleAlert;

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-3 rounded-md border border-danger/25 bg-danger-soft px-6 py-10 text-center',
        className,
      )}
    >
      <Icon
        className="size-6 text-danger"
        aria-hidden
      />
      <div className="flex max-w-sm flex-col gap-1">
        <p className="text-base font-bold text-ink">{title}</p>
        <p className="text-sm text-ink-muted">{apiError.message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          loading={retrying}
        >
          {!retrying && <RotateCw />}
          Coba lagi
        </Button>
      )}
    </div>
  );
}

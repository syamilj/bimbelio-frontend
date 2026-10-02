'use client';

// Pemuat versi lama. Semua varian kini memakai BubbleLoader agar seragam;
// kode baru langsung memakai @/components/patterns/page-loader.
import { BubbleLoader } from '@/components/patterns/bubble-loader';
import { cn } from '@/lib/utils';
import { useStorageSocket } from '@/supabaseClient';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from './dialog';
import { Progress } from './progress';

/** Spinner kecil untuk di dalam tombol/baris. */
export function Spinner({ className }: { width?: string; className?: string }) {
  return (
    <LoaderCircle
      className={cn('size-5 animate-spin text-ink-muted', className)}
    />
  );
}

export function SpinnerPage() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <BubbleLoader />
    </div>
  );
}

export function SpinnerPageCentered({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-paper',
        className,
      )}
    >
      <BubbleLoader />
    </div>
  );
}

export function SpinnerCentered() {
  return (
    <div className="flex h-full min-h-32 items-center justify-center">
      <BubbleLoader />
    </div>
  );
}

function OverlayMessage({
  heading,
  children,
}: {
  heading?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <BubbleLoader label={heading ?? 'Memuat…'} />
      {heading && <p className="text-base font-semibold text-ink">{heading}</p>}
      {children}
    </div>
  );
}

export function LoadingPopUp({ title }: { title?: string }) {
  return (
    <Dialog open>
      <DialogContent
        hideClose
        className="max-w-xs justify-items-center py-8"
      >
        <DialogTitle className="sr-only">{title ?? 'Memuat'}</DialogTitle>
        <OverlayMessage heading={title ?? 'Memuat…'} />
      </DialogContent>
    </Dialog>
  );
}

export default function LoadingPageWithText({
  heading,
  loading,
}: {
  heading?: string;
  loading: boolean;
}) {
  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm select-none">
      <OverlayMessage heading={heading} />
    </div>
  );
}

export function LoadingComponentWithText({ heading }: { heading?: string }) {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <OverlayMessage heading={heading ?? 'Memuat…'} />
    </div>
  );
}

/** Overlay unggahan dengan persentase dari socket storage. */
export function LoadingPageStorage({
  heading,
  loading,
}: {
  heading?: string;
  loading: boolean;
}) {
  const [percentage, setPercentage] = useState<number>();
  const { on, off } = useStorageSocket();

  useEffect(() => {
    on('loading', (data: { percentage: number }) => {
      setPercentage(data.percentage === 100 ? undefined : data.percentage);
    });
    return () => {
      off('loading');
      setPercentage(undefined);
    };
  }, []);

  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm select-none">
      <OverlayMessage heading={heading}>
        {percentage !== undefined && (
          <div className="flex w-64 flex-col gap-2">
            <Progress value={percentage} />
            <p className="text-sm text-ink-muted tabular-nums">
              {percentage.toFixed(1)}%
            </p>
          </div>
        )}
      </OverlayMessage>
    </div>
  );
}

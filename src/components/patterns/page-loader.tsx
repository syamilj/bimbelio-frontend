import { cn } from '@/lib/utils';
import { BubbleLoader } from './bubble-loader';

/** Pemuat satu layar penuh (mis. menunggu sesi di rute terproteksi). */
export function PageLoader({ className }: { className?: string }) {
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

/** Pemuat di dalam area konten. */
export function SectionLoader({ className }: { className?: string }) {
  return (
    <div className={cn('flex min-h-48 items-center justify-center', className)}>
      <BubbleLoader />
    </div>
  );
}

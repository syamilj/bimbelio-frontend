import { BackgroundRetro } from '@/components/ui/background-retro';
import { cn } from '@/lib/utils';
import { SpinnerCentered } from './spinner';

export function LoadingRetro({
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative flex h-full max-h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent',
        className,
      )}
    >
      {/* <span className="pointer-events-none z-10 whitespace-pre-wrap bg-linear-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
        Loading
      </span> */}
      <span className="text-xl">
        <SpinnerCentered />
      </span>

      <BackgroundRetro />
    </div>
  );
}

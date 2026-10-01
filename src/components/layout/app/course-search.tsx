'use client';

import { BubbleLoader } from '@/components/patterns/bubble-loader';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  flattenLessons,
  LESSON_TYPE_LABEL,
  lessonHref,
  MIN_QUERY_LENGTH,
  searchLessons,
  type CourseCardCategory,
  type CourseLessonType,
} from '@/features/course/search';
import { api } from '@/lib/api/client';
import { useTrackId } from '@/lib/track';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
  BookText,
  CircleCheck,
  FileText,
  ListChecks,
  PlayCircle,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const TYPE_ICON: Record<CourseLessonType, LucideIcon> = {
  VIDEO: PlayCircle,
  DOCUMENT: FileText,
  MATERI: BookText,
  TRYOUT: ListChecks,
};

/** Tombol pencarian di topbar + dialog pencarian materi (Ctrl/⌘+K). */
export function CourseSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'flex h-10 items-center gap-2 rounded-md border border-line bg-paper px-3 text-sm text-ink-muted transition-colors hover:border-line-strong focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none',
          className,
        )}
      >
        <Search
          className="size-4 shrink-0"
          aria-hidden
        />
        <span className="flex-1 truncate text-left">Cari materi</span>
        <kbd className="hidden rounded-xs border border-line bg-surface px-1.5 text-xs font-medium sm:inline">
          Ctrl K
        </kbd>
      </button>
      <CourseSearchDialog
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

export function CourseSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const trackId = useTrackId();
  const [query, setQuery] = useState('');

  const lessonsQuery = useQuery({
    queryKey: ['course', 'search-index', trackId],
    queryFn: () => api.get<CourseCardCategory[]>('/course/getCategoryForCard'),
    enabled: open && !!trackId,
    staleTime: 5 * 60_000,
    select: flattenLessons,
  });

  const results = useMemo(
    () => searchLessons(lessonsQuery.data ?? [], query),
    [lessonsQuery.data, query],
  );

  const close = () => {
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
    >
      <DialogContent
        hideClose
        className="top-[15%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogTitle className="sr-only">Cari materi</DialogTitle>
        <DialogDescription className="sr-only">
          Ketik minimal dua huruf untuk mencari materi di semua course.
        </DialogDescription>
        <Command
          shouldFilter={false}
          className="rounded-none"
        >
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Cari judul materi, bab, atau mata pelajaran…"
          />
          <CommandList className="max-h-[min(26rem,60dvh)]">
            {lessonsQuery.isPending &&
            query.trim().length >= MIN_QUERY_LENGTH ? (
              <div className="flex justify-center py-8">
                <BubbleLoader label="Memuat materi…" />
              </div>
            ) : query.trim().length < MIN_QUERY_LENGTH ? (
              <p className="px-4 py-8 text-center text-sm text-ink-muted">
                Ketik minimal dua huruf untuk mulai mencari.
              </p>
            ) : (
              <>
                <CommandEmpty>
                  Tidak ada materi yang cocok dengan “{query.trim()}”.
                </CommandEmpty>
                {results.length > 0 && (
                  <CommandGroup heading={`${results.length} materi`}>
                    {results.map((item) => {
                      const Icon = TYPE_ICON[item.type] ?? FileText;
                      return (
                        <CommandItem
                          key={item.id}
                          value={item.id}
                          onSelect={() => {
                            close();
                            router.push(lessonHref(trackId, item));
                          }}
                          className="flex items-start gap-3"
                        >
                          <Icon
                            className="mt-0.5 size-4 shrink-0 text-ink-muted"
                            aria-hidden
                          />
                          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="truncate text-sm font-semibold text-ink">
                              {item.title}
                            </span>
                            <span className="truncate text-xs text-ink-muted">
                              {item.categoryName}, {item.chapterTitle}
                            </span>
                          </span>
                          <span className="flex shrink-0 items-center gap-1.5 text-xs text-ink-muted">
                            {item.isCompleted && (
                              <CircleCheck
                                className="size-3.5 text-success"
                                aria-label="Selesai"
                              />
                            )}
                            {LESSON_TYPE_LABEL[item.type]}
                          </span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { BubbleLoader } from '@/components/patterns/bubble-loader';
import { useNotification } from '@/components/provider/privoder-notification';
import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/database';
import { formatDistanceToNowStrict } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Bell, BellOff, Check, MoreHorizontal, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const PAGE_SIZE = 10;

export const relativeTime = (iso: string) => {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 60_000) return 'Baru saja';
  return `${formatDistanceToNowStrict(new Date(iso), { locale: localeId })} lalu`;
};

/** Lonceng notifikasi di topbar siswa. */
export function NotificationMenu() {
  const [open, setOpen] = useState(false);
  const {
    useData: { notifications },
    useAction: { handleDelete, handleMarkAllAsRead, handleMarkAsRead },
    useFetchRead: { isReadingAll },
    useFetchData: {
      filter,
      setFilter,
      page,
      setPage,
      totalPages,
      totalData,
      currentPage,
    },
    useState: {
      isLoading,
      setIsLoading,
      isFirstFetching,
      setIsFirstFetching,
      isViewMore,
      setIsViewMore,
      unreadCount,
    },
  } = useNotification();
  const { data: session } = useSession();
  const canDeleteBroadcast = ['ADMIN', 'SUPER_ADMIN'].includes(
    session?.user.role ?? '',
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = page < totalPages && totalData > PAGE_SIZE;

  // Setelah "Lihat lainnya", halaman berikutnya dimuat saat ujung daftar terlihat.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!open || !isViewMore || !node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (
        entry.isIntersecting &&
        !isLoading &&
        currentPage === page &&
        hasMore
      ) {
        setIsLoading(true);
        setPage((p) => p + 1);
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [
    open,
    isViewMore,
    isLoading,
    currentPage,
    page,
    hasMore,
    setIsLoading,
    setPage,
  ]);

  const changeFilter = (next: 'ALL' | 'UNREAD') => {
    if (next === filter) return;
    setIsFirstFetching(true);
    setIsViewMore(false);
    setPage(1);
    setFilter(next);
  };

  const badge = unreadCount > 9 ? '9+' : String(unreadCount);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            unreadCount > 0
              ? `Notifikasi, ${unreadCount} belum dibaca`
              : 'Notifikasi'
          }
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-brand px-1 font-mono text-xs leading-none font-medium text-brand-ink tabular-nums ring-2 ring-surface">
              {badge}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex w-[min(24rem,calc(100vw-2rem))] flex-col p-0"
      >
        <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
          <h2 className="font-display text-base font-bold tracking-display text-ink">
            Notifikasi
          </h2>
          {unreadCount > 0 && (
            <Button
              variant="link"
              size="xs"
              onClick={handleMarkAllAsRead}
              disabled={isReadingAll}
            >
              Tandai semua dibaca
            </Button>
          )}
        </div>
        <Tabs
          value={filter}
          onValueChange={(v) => changeFilter(v as 'ALL' | 'UNREAD')}
          className="px-4 pt-3"
        >
          <TabsList className="w-full">
            <TabsTrigger
              value="ALL"
              className="flex-1"
            >
              Semua
            </TabsTrigger>
            <TabsTrigger
              value="UNREAD"
              className="flex-1"
            >
              Belum dibaca
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="max-h-[60dvh] overflow-y-auto py-2">
          {isFirstFetching && notifications.length === 0 ? (
            <div className="flex justify-center py-10">
              <BubbleLoader />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
              <BellOff
                className="size-6 text-ink-subtle"
                aria-hidden
              />
              <p className="text-sm text-ink-muted">
                {filter === 'UNREAD'
                  ? 'Semua notifikasi sudah dibaca.'
                  : 'Belum ada notifikasi.'}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {notifications.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  canDelete={!item.isBroadcast || canDeleteBroadcast}
                  onRead={() => handleMarkAsRead(item.id)}
                  onDelete={() => handleDelete(item.id)}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </ul>
          )}
          {isViewMore && hasMore && (
            <div
              ref={sentinelRef}
              className="flex justify-center py-3"
            >
              {isLoading && <BubbleLoader />}
            </div>
          )}
        </div>

        {!isViewMore && hasMore && notifications.length >= PAGE_SIZE && (
          <div className="border-t border-line p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setIsViewMore(true)}
            >
              Lihat lainnya
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function NotificationItem({
  item,
  canDelete,
  onRead,
  onDelete,
  onNavigate,
}: {
  item: Notification;
  canDelete: boolean;
  onRead: () => void;
  onDelete: () => void;
  onNavigate: () => void;
}) {
  const showMenu = !item.isRead || canDelete;
  const action = item.actionUrl;

  return (
    <li
      className={cn(
        'group relative flex gap-3 px-4 py-3 transition-colors',
        item.isRead ? 'hover:bg-paper' : 'bg-brand-soft/60 hover:bg-brand-soft',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'mt-1 size-3 shrink-0 rounded-full border-[1.5px]',
          item.isRead ? 'border-line-strong' : 'border-brand bg-brand',
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <button
          type="button"
          onClick={() => !item.isRead && onRead()}
          className="flex flex-col gap-1 text-left focus-visible:outline-none"
        >
          <span
            className={cn(
              'text-sm text-ink',
              item.isRead ? 'font-medium' : 'font-semibold',
            )}
          >
            {!item.isRead && <span className="sr-only">Belum dibaca: </span>}
            {item.title}
          </span>
          <span className="line-clamp-3 text-sm text-ink-muted">
            {item.content}
          </span>
        </button>
        <div className="flex items-center gap-3">
          <time
            dateTime={item.createdAt}
            className="text-xs text-ink-subtle"
          >
            {relativeTime(item.createdAt)}
          </time>
          {action && action.startsWith('/') && (
            <Link
              href={action}
              onClick={() => {
                if (!item.isRead) onRead();
                onNavigate();
              }}
              className="text-xs font-semibold text-brand-strong hover:underline"
            >
              Lihat detail
            </Link>
          )}
          {action && action.startsWith('http') && (
            <a
              href={action}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => !item.isRead && onRead()}
              className="text-xs font-semibold text-brand-strong hover:underline"
            >
              Buka tautan
            </a>
          )}
        </div>
      </div>
      {showMenu && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Opsi notifikasi"
              className="shrink-0"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!item.isRead && (
              <DropdownMenuItem onSelect={onRead}>
                <Check />
                Tandai sudah dibaca
              </DropdownMenuItem>
            )}
            {canDelete && (
              <DropdownMenuItem
                variant="destructive"
                onSelect={onDelete}
              >
                <Trash2 />
                Hapus
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </li>
  );
}

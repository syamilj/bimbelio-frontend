'use client';

import {
  AlertCircle,
  Archive,
  ArchiveX,
  Bell,
  Check,
  ChevronRight,
  Loader2,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useNotification } from '@/components/provider/privoder-notification';
import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import {
  formatTimeAgo,
  getPriorityIcon,
  getTypeIcon,
  getTypeIconBg,
  getTypeLabel,
} from './_utils/notification-helpers';

export const Notification = () => {
  const { data: session } = useSession();
  const role = session?.user.role;
  const params = useParams<{ web_sub_category: string }>();
  const webSubCategory = params?.web_sub_category || '';

  const {
    useData: { notifications },
    useAction: { handleDelete, handleMarkAllAsRead, handleMarkAsRead, handleArchive },
    useFetchRead: { isReadingAll },
    useFetchData: {
      filter,
      setFilter,
      view,
      setView,
      isAllLoaded,
      page,
      setPage,
      totalData,
      currentPage,
      totalPages,
    },
    useState: {
      isFirstFetching,
      isLoading,
      isViewMore,
      setIsFirstFetching,
      setIsLoading,
      setIsViewMore,
      unreadCount,
    },
  } = useNotification();

  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleChangePage = useDebouncedCallback((scrollPercentage: number) => {
    if (
      scrollPercentage >= 95 &&
      !isLoading &&
      currentPage === page &&
      page < totalPages &&
      totalData > 10 &&
      notifications.length >= 10 &&
      isViewMore
    ) {
      console.log({ currentPage, page });
      setIsLoading(true);
      setPage((prev) => prev + 1);
    }
  }, 1000);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleScroll = () => {
        const { scrollHeight, scrollTop, clientHeight } = container;
        const scrollPercentage =
          ((scrollTop + clientHeight) / scrollHeight) * 100;

        // console.log({ scrollPercentage });

        handleChangePage(scrollPercentage);
      };

      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }, 100);

    return () => clearTimeout(timer);
  }, [
    isOpen,
    isLoading,
    isViewMore,
    notifications,
    totalData,
    page,
    totalPages,
  ]);

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-9 h-9 rounded-3xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 shrink-0"
        >
          <Bell className="w-5 h-5 text-gray-600" />

          {/* Unread Badge */}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[100vw] max-w-[450px] max-h-[90vh] p-0 rounded-3xl shadow-2xl border-2 border-slate-100 flex flex-col"
      >
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 rounded-t-3xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-bold text-gray-900">Notifikasi</h3>
              {unreadCount > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3 py-1.5 h-auto rounded-full"
                  onClick={handleMarkAllAsRead}
                  disabled={isReadingAll}
                >
                  {isReadingAll ? (
                    <Loader2 className="animate-spin w-3.5 h-3.5" />
                  ) : (
                    'Tandai semua dibaca'
                  )}
                </Button>
              )}
              {webSubCategory && (
                <Link href={`/${webSubCategory}/user/notifications`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-3 py-1.5 h-auto rounded-full gap-1"
                    onClick={() => setIsOpen(false)}
                  >
                    Lihat semua
                    <ChevronRight className="w-3 h-3" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List - Scrollable */}
        <div
          ref={containerRef}
          className="overflow-y-auto flex-1 scrollbar-hide"
        >
          <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-2.5 z-[5]">
            <div className="flex gap-1.5 bg-slate-100/80 p-1 rounded-full w-fit">
              {/* View tabs: Inbox / Archive */}
              <button
                className={cn(
                  'text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap',
                  view === 'inbox' && filter === 'ALL'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700',
                )}
                onClick={() => {
                  setView('inbox');
                  setFilter('ALL');
                  setIsLoading(true);
                  setPage(1);
                  setIsViewMore(false);
                  setIsFirstFetching(true);
                  containerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
                }}
              >
                Semua
              </button>
              <button
                className={cn(
                  'text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap',
                  filter === 'UNREAD'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700',
                )}
                onClick={() => {
                  setView('inbox');
                  setFilter('UNREAD');
                  setIsLoading(true);
                  setPage(1);
                  setIsViewMore(false);
                  setIsFirstFetching(true);
                  containerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
                }}
              >
                Belum Dibaca
              </button>
              <button
                className={cn(
                  'text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1',
                  view === 'archive'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700',
                )}
                onClick={() => {
                  setView('archive');
                  setFilter('ALL');
                  setIsLoading(true);
                  setPage(1);
                  setIsViewMore(false);
                  setIsFirstFetching(true);
                  containerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
                }}
              >
                <Archive className="w-3 h-3" />
                Arsip
              </button>
            </div>
          </div>

          {notifications.length === 0 && !isFirstFetching ? (
            <div className="flex flex-col items-center justify-center py-14 px-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <Bell className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Tidak ada notifikasi</p>
              <p className="text-xs text-slate-400 mt-0.5">Semua notifikasi akan tampil di sini</p>
            </div>
          ) : isFirstFetching ? (
            <div className="px-4 py-[5rem] flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-slate-500 hover:bg-transparent rounded-full gap-2 cursor-default border-slate-200"
              >
                <Loader2 className="animate-spin w-4 h-4" /> Memuat...
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notif, index) => (
                <div
                  key={notif.id}
                  className={cn(
                    'px-4 py-3.5 transition-colors duration-150 cursor-default relative',
                    notif.isRead ? 'hover:bg-slate-50/60' : 'bg-blue-50/25 hover:bg-blue-50/40',
                  )}
                  onClick={() => {
                    if (!notif.isRead) {
                      handleMarkAsRead(notif.id);
                    }
                  }}
                >
                  {/* Unread dot indicator */}
                  {!notif.isRead && (
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  )}
                  {/* <div className="absolute top-0 left-0">{index + 1}</div> */}
                  {/* Notification Content */}
                  <div className="flex gap-3 pl-2">
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center',
                        getTypeIconBg(notif.type, notif.priority),
                      )}
                    >
                      {getTypeIcon(notif.type)}
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p
                            className={cn(
                              'text-sm font-semibold truncate',
                              notif.isRead ? 'text-gray-600' : 'text-gray-900',
                            )}
                          >
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {notif.content}
                          </p>
                          {notif.actionUrl &&
                            notif.actionUrl?.length > 0 &&
                            notif.actionUrl.startsWith('/') && (
                              <div className="w-full flex justify-start">
                                <Link href={notif.actionUrl}>
                                  <button className="mt-2 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors">
                                    Lihat Detail
                                  </button>
                                </Link>
                              </div>
                            )}
                          {notif.actionUrl &&
                            notif.actionUrl?.length > 0 &&
                            notif.actionUrl.startsWith('http') && (
                              <div className="w-full flex justify-start">
                                <a
                                  href={notif.actionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <button className="mt-2 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors">
                                    Lihat Detail
                                  </button>
                                </a>
                              </div>
                            )}
                        </div>

                        {/* Priority Badge */}
                        {notif.priority !== 'NORMAL' && (
                          <div className="flex-shrink-0">
                            {getPriorityIcon(notif.priority)}
                          </div>
                        )}
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {formatTimeAgo(notif.createdAt)}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold border border-slate-200">
                          {getTypeLabel(notif.type)}
                        </span>
                      </div>
                    </div>

                    {/* Actions - Menu 3 Titik */}
                    <div className="flex-shrink-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            hidden={notif.isRead && notif.isBroadcast}
                            variant="ghost"
                            size="icon"
                            className="w-6 h-6 rounded hover:bg-gray-200 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48"
                        >
                          {!notif.isRead && (
                            <>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notif.id);
                                }}
                                className="cursor-pointer"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Tandai sudah dibaca
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {/* Archive / Unarchive */}
                          {!notif.isBroadcast && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchive(notif.id, view !== 'archive');
                              }}
                              className="cursor-pointer"
                            >
                              {view === 'archive' ? (
                                <>
                                  <ArchiveX className="w-4 h-4 mr-2" />
                                  Pulihkan dari arsip
                                </>
                              ) : (
                                <>
                                  <Archive className="w-4 h-4 mr-2" />
                                  Arsipkan
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                          {(!notif.isBroadcast ||
                            role === 'ADMIN' ||
                            role === 'SUPER_ADMIN') && (
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notif.id);
                              }}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
              {!isViewMore && totalData > 10 && (
                <div className="px-4 py-3.5 flex justify-center border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-slate-600 hover:bg-slate-50 rounded-full border-slate-200 px-5 font-semibold"
                    onClick={() => {
                      setIsViewMore(true);
                    }}
                  >
                    Lihat Lainnya
                  </Button>
                </div>
              )}
              {!isAllLoaded && isViewMore && (
                <div className="px-4 py-3.5 flex justify-center border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-slate-500 hover:bg-transparent rounded-full gap-2 cursor-default border-slate-200"
                    onClick={() => setIsViewMore(true)}
                  >
                    <Loader2 className="animate-spin w-4 h-4" /> Memuat...
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - hidden (Lihat semua now in header) */}
        {notifications.length > 0 && false && (
          <>
            <DropdownMenuSeparator className="my-0" />
            <div className="sticky bottom-0 px-4 py-3 bg-gray-50 rounded-b-xl z-10 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full text-sm text-blue-600 hover:bg-blue-50 rounded-3xl font-medium"
              >
                Lihat semua notifikasi
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

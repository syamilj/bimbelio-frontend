'use client';

import { useNotification } from '@/components/provider/privoder-notification';
import { useSession } from '@/components/provider/provider-session-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  Archive,
  ArchiveX,
  Bell,
  Check,
  ChevronLeft,
  Loader2,
  MoreVertical,
  Settings2,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  formatTimeAgo,
  getCategoryLabel,
  getPriorityIcon,
  getTypeIcon,
  getTypeIconBg,
} from '@/components/_shared/notification/_utils/notification-helpers';

export default function NotificationsPage() {
  const params = useParams<{ web_sub_category: string }>();
  const webSubCategory = params?.web_sub_category || '';
  const router = useRouter();

  const { data: session } = useSession();
  const role = session?.user.role;

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
    },
    useState: {
      isFirstFetching,
      isLoading,
      setIsLoading,
      setIsFirstFetching,
      setIsViewMore,
      unreadCount,
    },
  } = useNotification();

  useEffect(() => {
    setPage(1);
    setIsViewMore(true);
    setIsFirstFetching(true);
    setIsLoading(true);
  }, []);

  const switchTab = (newView: 'inbox' | 'archive', newFilter: 'ALL' | 'UNREAD') => {
    setView(newView);
    setFilter(newFilter);
    setIsLoading(true);
    setPage(1);
    setIsViewMore(true);
    setIsFirstFetching(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">

      {/* ── Sticky Header ─────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-black/[0.06]">
        <div className="max-w-2xl mx-auto">

          {/* Top row */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
                onClick={() => router.back()}
              >
                <ChevronLeft className="w-5 h-5 text-gray-900" />
              </button>
              <div>
                <h1 className="text-[17px] font-bold text-gray-900 leading-tight tracking-tight">
                  Notifikasi
                </h1>
                {unreadCount > 0 && (
                  <p className="text-[12px] text-gray-400 leading-tight">
                    {unreadCount} belum dibaca
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  className="text-[12px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
                  onClick={handleMarkAllAsRead}
                  disabled={isReadingAll}
                >
                  {isReadingAll ? (
                    <Loader2 className="animate-spin w-3.5 h-3.5" />
                  ) : (
                    'Baca semua'
                  )}
                </button>
              )}
              <Link href={`/${webSubCategory}/user/settings/notifications`}>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors ml-1"
                  title="Pengaturan notifikasi"
                >
                  <Settings2 className="w-4 h-4 text-gray-500" />
                </button>
              </Link>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-0 px-4 pb-0">
            {(
              [
                { label: 'Semua', v: 'inbox' as const, f: 'ALL' as const, badge: undefined as number | undefined },
                { label: 'Belum Dibaca', v: 'inbox' as const, f: 'UNREAD' as const, badge: unreadCount as number | undefined },
                { label: 'Arsip', v: 'archive' as const, f: 'ALL' as const, badge: undefined as number | undefined },
              ]
            ).map(({ label, v, f, badge }) => {
              const active = view === v && filter === f;
              return (
                <button
                  key={label}
                  onClick={() => switchTab(v, f)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-semibold transition-colors mr-1',
                    active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600',
                  )}
                >
                  {label}
                  {badge && badge > 0 ? (
                    <span className="bg-red-500 text-white text-[9px] font-black rounded-full px-1.5 py-px leading-none min-w-[16px] text-center">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  ) : null}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-0 md:px-4 py-3">

        {/* Loading skeleton */}
        {isFirstFetching ? (
          <div className="bg-white md:rounded-2xl overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 px-4 py-4 border-b border-gray-50 last:border-0 animate-pulse">
                <div className="w-11 h-11 rounded-2xl bg-gray-100 flex-shrink-0" />
                <div className="flex-1 space-y-2 py-0.5">
                  <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-full" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (

          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-5 shadow-sm border border-gray-100">
              <Bell className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-[16px] font-bold text-gray-700 mb-1.5">Tidak ada notifikasi</p>
            <p className="text-[13px] text-gray-400 max-w-[220px] leading-relaxed">
              {view === 'archive'
                ? 'Notifikasi yang diarsipkan akan muncul di sini'
                : 'Semua notifikasi sudah terbaca'}
            </p>
          </div>

        ) : (
          <>
            {/* Notification list */}
            <div className="bg-white md:rounded-2xl overflow-hidden divide-y divide-gray-50/80 shadow-sm shadow-black/[0.04] md:border md:border-black/[0.04]">
              {notifications.map((notif) => {
                const iconBg = getTypeIconBg(notif.type, notif.priority);
                const isUnread = !notif.isRead;

                return (
                  <div
                    key={notif.id}
                    className={cn(
                      'group relative flex gap-3 px-4 py-4 cursor-pointer select-none transition-colors duration-100',
                      isUnread
                        ? 'bg-blue-500/[0.03] hover:bg-blue-500/[0.06] active:bg-blue-500/[0.08]'
                        : 'bg-white hover:bg-gray-50/70 active:bg-gray-100/70',
                    )}
                    onClick={() => {
                      if (isUnread) handleMarkAsRead(notif.id);
                    }}
                  >
                    {/* Icon with unread dot badge */}
                    <div className="relative flex-shrink-0 self-start mt-0.5">
                      <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center', iconBg)}>
                        {getTypeIcon(notif.type, 'md')}
                      </div>
                      {isUnread && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">

                      {/* Row 1: title + time + menu */}
                      <div className="flex items-start gap-1.5">
                        <p
                          className={cn(
                            'flex-1 min-w-0 text-[13.5px] leading-[1.35] pr-1',
                            isUnread
                              ? 'font-semibold text-gray-900'
                              : 'font-normal text-gray-700',
                          )}
                        >
                          {notif.title}
                        </p>

                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">
                            {formatTimeAgo(notif.createdAt)}
                          </span>
                          {notif.priority !== 'NORMAL' && (
                            <span className="ml-0.5">
                              {getPriorityIcon(notif.priority, 'sm')}
                            </span>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all ml-0.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
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
                              {(!notif.isBroadcast || role === 'ADMIN' || role === 'SUPER_ADMIN') && (
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

                      {/* Row 2: subtitle/description */}
                      {notif.description && (
                        <p className="text-[11.5px] text-blue-500 font-medium mt-0.5">
                          {notif.description}
                        </p>
                      )}

                      {/* Row 3: body */}
                      <p className={cn(
                        'text-[12.5px] leading-relaxed mt-0.5 line-clamp-2',
                        isUnread ? 'text-gray-600' : 'text-gray-400',
                      )}>
                        {notif.content}
                      </p>

                      {/* Row 4: category chip + action link */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10.5px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-medium leading-none">
                          {getCategoryLabel(notif.category ?? notif.type.split('_')[0])}
                        </span>
                        {notif.actionUrl && notif.actionUrl.length > 0 && (
                          <>
                            {notif.actionUrl.startsWith('/') ? (
                              <Link
                                href={notif.actionUrl}
                                onClick={(e) => e.stopPropagation()}
                                className="text-[11.5px] font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                              >
                                Lihat →
                              </Link>
                            ) : notif.actionUrl.startsWith('http') ? (
                              <a
                                href={notif.actionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[11.5px] font-semibold text-blue-500 hover:text-blue-700 transition-colors"
                              >
                                Lihat →
                              </a>
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load more */}
            {!isAllLoaded && (
              <div className="flex justify-center pt-4 pb-8">
                {isLoading && page > 1 ? (
                  <div className="flex items-center gap-2 text-[13px] text-gray-400 py-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Memuat...</span>
                  </div>
                ) : (
                  <button
                    className="text-[13px] font-semibold text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 border border-blue-200 px-5 py-2 rounded-full transition-colors shadow-sm"
                    onClick={() => {
                      setIsViewMore(true);
                      setIsLoading(true);
                      setPage((prev) => prev + 1);
                    }}
                  >
                    Muat lebih banyak
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

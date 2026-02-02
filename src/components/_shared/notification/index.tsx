'use client';

import {
  AlertCircle,
  Bell,
  Check,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  Eye,
  FileText,
  Gift,
  Loader2,
  MessageSquare,
  MoreVertical,
  Trash2,
  Trophy,
  Zap,
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
import { useDebouncedCallback } from 'use-debounce';

export const Notification = () => {
  const { data: session } = useSession();
  const role = session?.user.role;

  const {
    useData: { notifications },
    useAction: { handleDelete, handleMarkAllAsRead, handleMarkAsRead },
    useFetchRead: { isReadingAll },
    useFetchData: {
      filter,
      setFilter,
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-50 border-red-200';
      case 'HIGH':
        return 'bg-orange-50 border-orange-200';
      case 'NORMAL':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'HIGH':
        return <Zap className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    const iconProps = { className: 'w-5 h-5' };

    switch (type) {
      // Payment
      case 'PAYMENT_SUCCESSFUL':
      case 'PAYMENT_FAILED':
      case 'PAYMENT_REMINDER':
        return (
          <CreditCard
            {...iconProps}
            className="text-green-600"
          />
        );

      // Order
      case 'ORDER_CONFIRMATION':
      case 'ORDER_SHIPPED':
      case 'ORDER_DELIVERED':
      case 'REFUND_PROCESSED':
        return (
          <CheckCircle
            {...iconProps}
            className="text-emerald-600"
          />
        );

      // Subscription
      case 'SUBSCRIPTION_ACTIVATED':
      case 'SUBSCRIPTION_RENEWED':
      case 'SUBSCRIPTION_EXPIRING':
      case 'SUBSCRIPTION_EXPIRED':
      case 'INSTALLMENT_REMINDER':
      case 'INSTALLMENT_DUE':
        return (
          <Clock
            {...iconProps}
            className="text-purple-600"
          />
        );

      // Course
      case 'COURSE_ENROLLED':
      case 'COURSE_PROGRESS':
      case 'COURSE_COMPLETED':
      case 'NEW_COURSE_AVAILABLE':
        return (
          <FileText
            {...iconProps}
            className="text-blue-600"
          />
        );

      // Tryout
      case 'TRYOUT_STARTED':
      case 'TRYOUT_COMPLETED':
      case 'TRYOUT_RESULTS':
        return (
          <Trophy
            {...iconProps}
            className="text-yellow-600"
          />
        );

      // Message
      case 'NEW_MESSAGE':
      case 'MESSAGE_REPLY':
        return (
          <MessageSquare
            {...iconProps}
            className="text-cyan-600"
          />
        );

      // Promo
      case 'PROMOTION':
      case 'SPECIAL_OFFER':
        return (
          <Gift
            {...iconProps}
            className="text-pink-600"
          />
        );

      // Vision
      case 'VISION_USAGE':
        return (
          <Eye
            {...iconProps}
            className="text-indigo-600"
          />
        );

      default:
        return (
          <Bell
            {...iconProps}
            className="text-gray-600"
          />
        );
    }
  };

  const getTypeLabel = (type: string) => {
    return type
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins}m lalu`;
    if (diffHours < 24) return `${diffHours}h lalu`;
    if (diffDays < 7) return `${diffDays}d lalu`;
    return notifDate.toLocaleDateString('id-ID');
  };

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
        className="w-[100vw] max-w-[450px] max-h-[90vh] p-0 rounded-3xl shadow-xl border border-gray-200 flex flex-col"
      >
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 rounded-t-xl z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Notifikasi</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 h-auto"
                onClick={handleMarkAllAsRead}
                disabled={isReadingAll}
              >
                {isReadingAll ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  'Tandai semua dibaca'
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List - Scrollable */}
        <div
          ref={containerRef}
          className="overflow-y-auto flex-1 scrollbar-hide"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2 flex gap-2 z-5">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'text-xs rounded-full px-3 py-1 h-auto text-gray-600 hover:bg-gray-100',
                filter === 'ALL' && 'border-main/50 text-main hover:bg-main/10',
              )}
              onClick={() => {
                setFilter('ALL');
                setIsLoading(true);
                setPage(1);
                setIsViewMore(false);
                setIsFirstFetching(true);
                containerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
              }}
            >
              Semua
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'text-xs rounded-full px-3 py-1 h-auto text-gray-600 hover:bg-gray-100',
                filter === 'UNREAD' &&
                  'border-main/50 text-main hover:bg-main/10',
              )}
              onClick={() => {
                setFilter('UNREAD');
                setIsLoading(true);
                setPage(1);
                setIsViewMore(false);
                setIsFirstFetching(true);
                containerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
              }}
            >
              Belum Dibaca
            </Button>
          </div>

          {notifications.length === 0 && !isFirstFetching ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Bell className="w-12 h-12 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">Tidak ada notifikasi</p>
            </div>
          ) : isFirstFetching ? (
            <div className="px-4 py-[5rem] flex justify-center border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-main hover:bg-transparent rounded-lg gap-2 cursor-default"
              >
                <Loader2 className="animate-spin w-4 h-4" /> Memuat...
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notif, index) => (
                <div
                  key={notif.id}
                  className={cn(
                    'px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-default border-l-4 relative',
                    notif.isRead ? 'border-gray-200' : 'border-blue-500',
                  )}
                  onClick={() => {
                    if (!notif.isRead) {
                      handleMarkAsRead(notif.id);
                    }
                    // if (notif.actionUrl) {
                    //   window.location.href = notif.actionUrl;
                    // }
                  }}
                >
                  {/* <div className="absolute top-0 left-0">{index + 1}</div> */}
                  {/* Notification Content */}
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                        getPriorityColor(notif.priority),
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
                                  <Button
                                    className="py-1 px-3 h-[unset] text-xs mt-2 rounded-3xl"
                                    variant={'outline'}
                                  >
                                    Lihat Detail
                                  </Button>
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
                                  <Button
                                    className="py-1 px-3 h-[unset] text-xs mt-2 rounded-3xl"
                                    variant={'outline'}
                                  >
                                    Lihat Detail
                                  </Button>
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
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(notif.createdAt)}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
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
                <div className="px-4 py-3 flex justify-center border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-blue-600 hover:bg-blue-50 rounded-lg"
                    onClick={() => {
                      setIsViewMore(true);
                    }}
                  >
                    Lihat Lainnya
                  </Button>
                </div>
              )}
              {!isAllLoaded && isViewMore && (
                <div className="px-4 py-3 flex justify-center border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-main hover:bg-transparent rounded-lg gap-2 cursor-default"
                    onClick={() => setIsViewMore(true)}
                  >
                    <Loader2 className="animate-spin w-4 h-4" /> Memuat...
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        {notifications.length > 0 && false && (
          <>
            <DropdownMenuSeparator className="my-0" />
            <div className="sticky bottom-0 px-4 py-3 bg-gray-50 rounded-b-xl z-10 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full text-sm text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
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

'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  Brain,
  ChevronDown,
  Coins,
  Crown,
  Eye,
  FileText,
  MessageSquare,
  Trophy,
} from 'lucide-react';
import type { LimitationItemData } from './layout-user-types';

// ─── LimitationItem (inline chip) ───────────────────────────────

export function LimitationItem({
  icon: Icon,
  label,
  remaining = 0,
  total = 0,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  remaining?: number;
  total?: number;
  color?: string;
}) {
  const { data: userSession } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const userTier = userSession?.user.tier;

  const isAdmin = userTier === 'ADMIN';
  const percentage = isAdmin
    ? 100
    : total > 0
      ? ((total - remaining) / total) * 100
      : 0;
  const isWarning = percentage > 80 && !isAdmin;

  return (
    <div className="flex items-center gap-2 px-2 lg:px-3 py-1.5 rounded-3xl bg-gray-50 hover:bg-gray-100 transition-colors group min-w-0">
      <div className="flex items-center justify-center shrink-0">
        <Icon
          className="w-3 h-3 lg:w-4 lg:h-4"
          style={{ color: color || mainColor }}
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium text-gray-700 truncate">
          {label}
        </span>
        <div className="flex items-center gap-1">
          {isAdmin ? (
            <span className="text-xs text-green-600 font-bold">∞</span>
          ) : (
            <span
              className={cn(
                'text-xs font-bold',
                isWarning ? 'text-orange-600' : 'text-gray-600',
              )}
            >
              {remaining} tersisa
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Build limitations helper ───────────────────────────────────

export function useLimitations(): LimitationItemData[] {
  const { userLimitation } = useUserLimitation();
  return [
    {
      icon: MessageSquare,
      label: 'Chat',
      remaining: Math.max(
        0,
        (userLimitation?.chatLimit || 0) - (userLimitation?.chat || 0),
      ),
      total: userLimitation?.chatLimit || 0,
      color: '#10b981',
    },
    {
      icon: Eye,
      label: 'Vision',
      remaining: Math.max(
        0,
        (userLimitation?.visionLimit || 0) - (userLimitation?.vision || 0),
      ),
      total: userLimitation?.visionLimit || 0,
      color: '#06b6d4',
    },
    {
      icon: FileText,
      label: 'Notes',
      remaining: Math.max(
        0,
        (userLimitation?.notesLimit || 0) - (userLimitation?.notes || 0),
      ),
      total: userLimitation?.notesLimit || 0,
      color: '#f59e0b',
    },
    {
      icon: Brain,
      label: 'Quiz',
      remaining: Math.max(
        0,
        (userLimitation?.quizLimit || 0) - (userLimitation?.quiz || 0),
      ),
      total: userLimitation?.quizLimit || 0,
      color: '#8b5cf6',
    },
    {
      icon: Trophy,
      label: 'Tryout',
      remaining: Math.max(
        0,
        (userLimitation?.tryoutLimit || 0) - (userLimitation?.tryout || 0),
      ),
      total: userLimitation?.tryoutLimit || 0,
      color: '#ef4444',
    },
  ];
}

// ─── MobileLimitationsDropdown ──────────────────────────────────

export function MobileLimitationsDropdown() {
  const { data: userSession } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { setTransactionPopUp } = useAppContext();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const userTier = userSession?.user.tier;
  const limitations = useLimitations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-1.5 h-9 px-2 rounded-3xl hover:bg-gray-100 border border-gray-200"
        >
          <Coins className="w-4 h-4" style={{ color: mainColor }} />
          <span className="text-xs font-bold text-gray-700">
            {userTier === 'ADMIN' ? '∞' : limitations[0]?.remaining || 0}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 mt-2">
        <div className="px-3 py-2.5 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <p className="text-sm font-bold text-center text-gray-900">
            💎 Sisa Penggunaan
          </p>
          {!userTier && (
            <p className="text-xs text-center text-gray-500 mt-0.5">
              Upgrade untuk unlimited akses
            </p>
          )}
        </div>
        <div className="px-3 py-3 space-y-2 max-h-[60vh] overflow-y-auto">
          {limitations.map((limitation, index) => {
            const Icon = limitation.icon;
            const isLow =
              limitation.remaining <= 3 && limitation.remaining > 0;
            const isEmpty = limitation.remaining === 0;
            const percentage =
              userTier === 'ADMIN'
                ? 100
                : limitation.total > 0
                  ? ((limitation.total - limitation.remaining) /
                      limitation.total) *
                    100
                  : 0;

            return (
              <div
                key={index}
                className="p-3 rounded-3xl border bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-3xl flex items-center justify-center"
                      style={{ backgroundColor: `${limitation.color}15` }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: limitation.color }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {limitation.label}
                    </span>
                  </div>
                  {userTier === 'ADMIN' ? (
                    <span className="text-lg font-bold text-green-600">∞</span>
                  ) : (
                    <span
                      className={cn(
                        'text-base font-bold',
                        isEmpty
                          ? 'text-red-600'
                          : isLow
                            ? 'text-orange-600'
                            : 'text-gray-900',
                      )}
                    >
                      {limitation.remaining}
                    </span>
                  )}
                </div>
                {userTier !== 'ADMIN' && (
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-300',
                          isEmpty
                            ? 'bg-red-500'
                            : isLow
                              ? 'bg-orange-500'
                              : 'bg-green-500',
                        )}
                        style={{ width: `${100 - percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>0</span>
                      <span>{limitation.total}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!userTier && (
          <div className="p-3 pt-2 border-t">
            <Button
              className="w-full text-white h-9 text-sm font-medium"
              style={{ backgroundColor: mainColor }}
              onClick={() => setTransactionPopUp(true)}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade ke Premium
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── DesktopLimitationsDropdown ─────────────────────────────────

export function DesktopLimitationsDropdown() {
  const { data: userSession } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { setTransactionPopUp } = useAppContext();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const userTier = userSession?.user.tier;
  const limitations = useLimitations();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hidden md:flex items-center gap-2 h-10 px-3 rounded-3xl hover:bg-gray-50 border border-gray-200 transition-all"
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Coins className="w-4 h-4" style={{ color: mainColor }} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-medium text-gray-500 leading-none">
                Sisa Coin
              </span>
              <span className="text-sm font-bold text-gray-900 leading-tight">
                {userTier === 'ADMIN'
                  ? '∞'
                  : `${limitations[0]?.remaining || 0}`}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 mt-2">
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">
              Sisa Penggunaan
            </p>
            {userTier && (
              <Badge
                className="text-white text-xs font-medium"
                style={{ backgroundColor: mainColor }}
              >
                {userTier}
              </Badge>
            )}
          </div>
        </div>
        <div className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
          {limitations.map((limitation, index) => {
            const Icon = limitation.icon;
            const isLow =
              limitation.remaining <= 3 && limitation.remaining > 0;
            const isEmpty = limitation.remaining === 0;
            const percentage =
              userTier === 'ADMIN'
                ? 100
                : limitation.total > 0
                  ? ((limitation.total - limitation.remaining) /
                      limitation.total) *
                    100
                  : 0;

            return (
              <div
                key={index}
                className="p-3 rounded-3xl border bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-3xl flex items-center justify-center"
                      style={{ backgroundColor: `${limitation.color}15` }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: limitation.color }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {limitation.label}
                    </span>
                  </div>
                  {userTier === 'ADMIN' ? (
                    <span className="text-lg font-bold text-green-600">∞</span>
                  ) : (
                    <span
                      className={cn(
                        'text-base font-bold',
                        isEmpty
                          ? 'text-red-600'
                          : isLow
                            ? 'text-orange-600'
                            : 'text-gray-900',
                      )}
                    >
                      {limitation.remaining}
                    </span>
                  )}
                </div>
                {userTier !== 'ADMIN' && (
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-300',
                          isEmpty
                            ? 'bg-red-500'
                            : isLow
                              ? 'bg-orange-500'
                              : 'bg-green-500',
                        )}
                        style={{ width: `${100 - percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>0</span>
                      <span>{limitation.total}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {!userTier && (
          <div className="p-3 pt-2 border-t">
            <Button
              className="w-full text-white h-9 text-sm font-medium"
              style={{ backgroundColor: mainColor }}
              onClick={() => setTransactionPopUp(true)}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade ke Premium
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

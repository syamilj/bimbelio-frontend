'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  HelpCircle,
  Menu,
  MoreVertical,
  Timer,
  Trophy,
  User,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  tryoutName: string;
  sessionName: string;
  currentSession: number;
  totalSessions: number;
  timeRemaining: number;
  totalTime: number;
  totalQuestions: number;
  currentQuestion: number;
  participantCount: number;
  onExit?: () => void;
  onHelp?: () => void;
}

const TryoutHeader = ({
  tryoutName,
  sessionName,
  currentSession,
  totalSessions,
  timeRemaining,
  totalTime,
  totalQuestions,
  currentQuestion,
  participantCount,
  onExit,
  onHelp,
}: HeaderProps) => {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Progress calculation
  const questionProgress = (currentQuestion / totalQuestions) * 100;
  const sessionProgress = ((currentSession - 1) / totalSessions) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getTimeStatus = () => {
    const percentage = (timeRemaining / totalTime) * 100;
    if (percentage > 50)
      return { color: 'text-green-600', bg: 'bg-green-100', status: 'Aman' };
    if (percentage > 25)
      return {
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        status: 'Perhatian',
      };
    return { color: 'text-red-600', bg: 'bg-red-100', status: 'Kritis' };
  };

  const timeStatus = getTimeStatus();

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="lg:hidden sticky top-0 z-50 bg-white border-b-2 shadow-md">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Left: Exit & Info */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Button
              variant="ghost"
              onClick={onExit}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Keluar</span>
            </Button>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: mainColor }}
              >
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-bold text-gray-900 text-sm leading-tight truncate">
                  {tryoutName}
                </h1>
                <p className="text-xs text-gray-600 truncate">
                  Sesi {currentSession}: {sessionName}
                </p>
              </div>
            </div>
          </div>
          {/* Right: Timer & Menu */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ backgroundColor: `${mainColor}10` }}
            >
              <Timer
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
              <span
                className="text-lg font-mono font-bold"
                style={{ color: mainColor }}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-10 h-10 p-0 rounded-lg hover:bg-gray-100"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
        {/* Quick Stats Row */}
        <div className="flex items-center justify-between px-3 pb-2">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>
              Soal:{' '}
              <span className="font-medium">
                {currentQuestion}/{totalQuestions}
              </span>
            </span>
            <span>
              Sesi:{' '}
              <span className="font-medium">
                {currentSession}/{totalSessions}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={cn('text-xs', timeStatus.bg, timeStatus.color)}
              variant="outline"
            >
              {timeStatus.status}
            </Badge>
            <Button
              variant="ghost"
              onClick={() => setShowMobileDetails(!showMobileDetails)}
              className="w-6 h-6 p-0 rounded hover:bg-gray-100"
            >
              {showMobileDetails ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </Button>
          </div>
        </div>
        {/* Collapsible Progress */}
        {showMobileDetails && (
          <div className="px-3 pb-3 space-y-2">
            <div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Waktu</span>
                <span className={cn('font-medium', timeStatus.color)}>
                  {formatTime(timeRemaining)} / {formatTime(totalTime)}
                </span>
              </div>
              <Progress
                value={100 - (timeRemaining / totalTime) * 100}
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Soal</span>
                <span
                  className="font-medium"
                  style={{ color: mainColor }}
                >
                  {currentQuestion}/{totalQuestions}
                </span>
              </div>
              <Progress
                value={questionProgress}
                className="h-2"
                style={
                  {
                    '--progress-foreground': mainColor,
                  } as React.CSSProperties
                }
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Sesi</span>
                <span
                  className="font-medium"
                  style={{ color: mainColor }}
                >
                  {currentSession}/{totalSessions}
                </span>
              </div>
              <Progress
                value={sessionProgress}
                className="h-2"
                style={
                  {
                    '--progress-foreground': mainColor,
                  } as React.CSSProperties
                }
              />
            </div>
          </div>
        )}
      </div>

      {/* MOBILE MENU OVERLAY */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <User
                    className="w-5 h-5"
                    style={{ color: mainColor }}
                  />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {session?.user?.name || 'Peserta'}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {session?.user?.id?.slice(-6) || 'XXXXXX'}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowMobileMenu(false)}
                className="w-10 h-10 p-0 rounded-xl hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div
                  className="text-center p-3 rounded-2xl"
                  style={{ backgroundColor: `${mainColor}10` }}
                >
                  <Users
                    className="w-5 h-5 mx-auto mb-1"
                    style={{ color: mainColor }}
                  />
                  <div className="text-xs text-gray-600">Peserta</div>
                  <div
                    className="font-bold"
                    style={{ color: mainColor }}
                  >
                    {participantCount}
                  </div>
                </div>
                <div
                  className="text-center p-3 rounded-2xl"
                  style={{ backgroundColor: `${mainColor}10` }}
                >
                  <Timer
                    className="w-5 h-5 mx-auto mb-1"
                    style={{ color: mainColor }}
                  />
                  <div className="text-xs text-gray-600">Waktu</div>
                  <div
                    className="font-bold"
                    style={{ color: mainColor }}
                  >
                    {formatTime(timeRemaining)}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Soal</span>
                    <span
                      className="font-medium"
                      style={{ color: mainColor }}
                    >
                      {currentQuestion}/{totalQuestions}
                    </span>
                  </div>
                  <Progress
                    value={questionProgress}
                    className="h-2"
                    style={
                      {
                        '--progress-foreground': mainColor,
                      } as React.CSSProperties
                    }
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Sesi</span>
                    <span
                      className="font-medium"
                      style={{ color: mainColor }}
                    >
                      {currentSession}/{totalSessions}
                    </span>
                  </div>
                  <Progress
                    value={sessionProgress}
                    className="h-2"
                    style={
                      {
                        '--progress-foreground': mainColor,
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={onHelp}
                  className="flex-1 rounded-xl border-2"
                  style={{ borderColor: `${mainColor}30` }}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Bantuan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowMobileMenu(false)}
                  className="px-4 rounded-xl border-2 border-gray-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden lg:block sticky top-0 z-50 bg-white border-b-2 shadow-lg"
        style={{ borderColor: `${mainColor}20` }}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-4">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onExit}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-100"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Keluar</span>
              </Button>
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: mainColor }}
                >
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="font-bold text-gray-900 text-base leading-tight truncate">
                    {tryoutName}
                  </h1>
                  <p className="text-sm text-gray-600 truncate">
                    Sesi {currentSession}: {sessionName}
                  </p>
                </div>
              </div>
            </div>
            {/* Center Section */}
            <div className="flex justify-center">
              <Card
                className="border-2 rounded-2xl overflow-hidden shadow-lg"
                style={{ borderColor: `${mainColor}30` }}
              >
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <Timer
                        className="w-5 h-5"
                        style={{ color: mainColor }}
                      />
                      <span
                        className="text-2xl font-mono font-bold"
                        style={{ color: mainColor }}
                      >
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <Progress
                        value={100 - (timeRemaining / totalTime) * 100}
                        className="h-2 bg-gray-200"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0:00</span>
                        <span className={cn('font-medium', timeStatus.color)}>
                          {timeStatus.status}
                        </span>
                        <span>{formatTime(totalTime)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Right Section */}
            <div className="flex items-center justify-end gap-3">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {session?.user?.name || 'Peserta'}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {session?.user?.id?.slice(-6) || 'XXXXXX'}
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <User
                    className="w-5 h-5"
                    style={{ color: mainColor }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={onHelp}
                  className="w-10 h-10 p-0 rounded-xl hover:bg-gray-100"
                >
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-10 h-10 p-0 rounded-xl hover:bg-gray-100"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </Button>
              </div>
            </div>
          </div>
          {/* Progress Indicators Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">
                  Progress Sesi
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: mainColor }}
                >
                  {currentSession}/{totalSessions}
                </span>
              </div>
              <Progress
                value={sessionProgress}
                className="h-2"
                style={
                  {
                    '--progress-foreground': mainColor,
                  } as React.CSSProperties
                }
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">
                  Progress Soal
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: mainColor }}
                >
                  {currentQuestion}/{totalQuestions}
                </span>
              </div>
              <Progress
                value={questionProgress}
                className="h-2"
                style={
                  {
                    '--progress-foreground': mainColor,
                  } as React.CSSProperties
                }
              />
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600">
                <span className="font-medium">{participantCount}</span> peserta
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default TryoutHeader;

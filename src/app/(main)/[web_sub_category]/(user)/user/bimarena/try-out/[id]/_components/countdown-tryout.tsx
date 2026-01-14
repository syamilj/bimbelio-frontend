// src/pages/client/try-out/[id]/_component/countdown-tryout.tsx

'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CountDownTryoutProps {
  seconds: number;
  sessionId: string;
  sessionAnswer: any;
}

const CountDownTryout = ({
  seconds,
  sessionId,
  sessionAnswer,
}: CountDownTryoutProps) => {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const FinishTryOutLate = async (payload: {
    userId: string;
    sessionId: string;
    answer: any[];
  }) => {
    await mutateGeneral(`/tryoutSession/finishSessionLate`, {
      payload,
      type: 'post',
      onSuccess() {
        localStorage.removeItem(`sessionAnswer-${sessionId}`);
        window.location.reload();
      },
    });
  };

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    // Set warning states based on time left
    const warningThreshold = Math.max(600, seconds * 0.2); // 10 minutes or 20% of total time
    const criticalThreshold = Math.max(300, seconds * 0.1); // 5 minutes or 10% of total time

    setIsWarning(timeLeft <= warningThreshold && timeLeft > criticalThreshold);
    setIsCritical(timeLeft <= criticalThreshold);
  }, [timeLeft, seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      FinishTryOutLate({
        sessionId,
        answer: sessionAnswer,
        userId: session?.user.id || '',
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          FinishTryOutLate({
            sessionId,
            answer: sessionAnswer,
            userId: session?.user.id || '',
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, sessionId, sessionAnswer, session]);

  const getTimerColor = () => {
    if (isCritical) return '#EF4444'; // red
    if (isWarning) return '#F59E0B'; // yellow
    return mainColor; // main color
  };

  const getTimerBg = () => {
    if (isCritical) return '#FEF2F2'; // red bg
    if (isWarning) return '#FFFBEB'; // yellow bg
    return `${mainColor}08`; // main color bg
  };

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{
        scale: isCritical ? [1, 1.05, 1] : 1,
      }}
      transition={{
        duration: 1,
        repeat: isCritical ? Infinity : 0,
        ease: 'easeInOut',
      }}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 rounded-3xl font-mono font-bold text-sm md:text-base transition-all duration-300',
        isCritical && 'shadow-lg animate-pulse',
      )}
      style={{
        backgroundColor: getTimerBg(),
        color: getTimerColor(),
        border: `2px solid ${getTimerColor()}20`,
      }}
    >
      {/* Icon */}
      <motion.div
        animate={{
          rotate: isCritical ? [0, -10, 10, 0] : 0,
        }}
        transition={{
          duration: 0.5,
          repeat: isCritical ? Infinity : 0,
          repeatType: 'reverse',
        }}
      >
        {isCritical ? (
          <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <Clock className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </motion.div>

      {/* Time Display */}
      <span className="tabular-nums tracking-wide">{formatTime(timeLeft)}</span>

      {/* Status Text for Mobile */}
      <div className="hidden md:block">
        {isCritical && (
          <span className="text-xs font-normal opacity-80">
            Waktu hampir habis!
          </span>
        )}
        {isWarning && !isCritical && (
          <span className="text-xs font-normal opacity-80">Perhatian</span>
        )}
      </div>
    </motion.div>
  );
};

export default CountDownTryout;

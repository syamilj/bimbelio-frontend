'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Save,
  Shield,
  Swords,
  Trophy,
  Users,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { TryoutDataType } from '../page';

interface Props {
  sessionData: NonNullable<TryoutDataType>['TryoutSession'];
  tryoutName: string;
  tryoutData: NonNullable<TryoutDataType>;
  currentIndexSession: number;
}

const StartTryout = ({
  currentIndexSession,
  tryoutName,
  sessionData,
  tryoutData,
}: Props) => {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  const pathname = usePathname();
  const mode = pathname.toLocaleLowerCase().includes('try-out')
    ? 'try out'
    : 'quiz';

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [loading, setLoading] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);

  const createTryoutSessionParticipant = async (payload: {
    sessionId: string;
    userId: string;
  }) => {
    await mutateGeneral('/tryoutSession/createTryoutSessionParticipant', {
      payload,
      type: 'post',
      toast: {
        errorTitle: 'Gagal Memulai Sesi',
        errorMsg: 'Silahkan ulangi',
      },
      onSuccess() {
        window.location.reload();
      },
      onError() {
        setLoading(false);
      },
    });
  };

  const handleStart = () => {
    if (!agreedToRules) return;
    setLoading(true);
    createTryoutSessionParticipant({
      sessionId: sessionData[currentIndexSession].id,
      userId: session?.user.id || '',
    });
  };

  const currentSession = sessionData[currentIndexSession];
  const totalQuestions = sessionData.reduce(
    (acc, session) => acc + session.TryoutQuestion.length,
    0,
  );
  const totalDuration = sessionData.reduce(
    (acc, session) => acc + session.duration,
    0,
  );

  const rules = [
    {
      icon: Clock,
      title: 'Waktu Terbatas',
      description: `Setiap sesi memiliki waktu yang telah ditentukan dan tidak dapat diperpanjang`,
      highlight: `${currentSession?.duration} menit`,
      color: '#3b82f6',
    },
    {
      icon: Shield,
      title: 'Fair Play',
      description:
        'Dilarang membuka tab lain, menggunakan bantuan, atau bekerja sama dengan orang lain',
      highlight: 'Wajib',
      color: '#8b5cf6',
    },
    {
      icon: Save,
      title: 'Auto Save',
      description:
        'Jawaban tersimpan otomatis, pastikan koneksi internet stabil',
      highlight: 'Otomatis',
      color: '#10b981',
    },
  ];

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-40 h-40 md:w-64 md:h-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 md:w-48 md:h-48 rounded-full bg-white/5 blur-xl" />
          </div>

          <div className="relative z-10 p-4 md:p-6">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="text-[10px] md:text-xs font-bold text-white/90">
                  SIAP BATTLE
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm">
                <Swords className="w-3 h-3 text-white/80" />
                <span className="text-[10px] md:text-xs font-bold text-white/90 capitalize">
                  {mode}
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <h1 className="text-xl md:text-2xl font-black text-white mb-1">
                {currentSession?.TryoutCategory.name}
              </h1>
              <p className="text-xs md:text-sm text-white/70 font-medium">
                Sesi {currentIndexSession + 1} dari {sessionData.length} •{' '}
                {currentSession?.name}
              </p>
            </div>

            {/* Stats Row - Horizontal Scroll on Mobile */}
            <div
              className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`.stats-scroll::-webkit-scrollbar { display: none; }`}</style>
              <div className="stats-scroll flex md:grid md:grid-cols-3 gap-3 md:gap-4 min-w-max md:min-w-0">
                {[
                  {
                    icon: BookOpen,
                    value: currentSession?.TryoutQuestion.length,
                    label: 'Soal',
                    color: '#fbbf24',
                  },
                  {
                    icon: Clock,
                    value: currentSession?.duration,
                    label: 'Menit',
                    color: '#3b82f6',
                  },
                  {
                    icon: Users,
                    value: tryoutData.TryoutRegistration.length,
                    label: 'Peserta',
                    color: '#a855f7',
                  },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-3xl flex-shrink-0"
                    >
                      <div className="w-8 h-8 rounded-3xl bg-white/25 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-base md:text-lg font-black text-white">
                          {stat.value}
                        </p>
                        <p className="text-[9px] md:text-[10px] text-white/60 font-bold uppercase tracking-wider">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Motivation Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-4 md:p-5 border border-slate-200 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-3xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Flame
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed">
                <span className="font-black text-slate-900">Siap battle?</span>{' '}
                Pastikan kamu sudah memahami aturan dan koneksi internet stabil.{' '}
                <span className="text-emerald-600 font-bold">
                  Semoga berhasil! 🔥
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Rules Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div
            className="px-4 md:px-6 py-4 border-b"
            style={{
              backgroundColor: `${mainColor}08`,
              borderColor: `${mainColor}20`,
            }}
          >
            <div className="flex items-center gap-2">
              <AlertCircle
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
              <h3 className="text-base md:text-lg font-black text-slate-800">
                Aturan dan Ketentuan
              </h3>
            </div>
            <p className="text-xs md:text-sm text-slate-600 mt-1 font-medium">
              Baca dan pahami sebelum memulai
            </p>
          </div>

          {/* Rules List */}
          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            {rules.map((rule, index) => {
              const Icon = rule.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 md:p-4 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-all group"
                >
                  <div
                    className="w-9 h-9 md:w-10 md:h-10 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: `${rule.color}15` }}
                  >
                    <Icon
                      className="w-4 h-4 md:w-5 md:h-5"
                      style={{ color: rule.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-sm md:text-base font-black text-slate-900">
                        {rule.title}
                      </h4>
                      <span
                        className="px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: rule.color }}
                      >
                        {rule.highlight}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Agreement Checkbox */}
          <div
            className="px-4 md:px-6 py-4 border-t"
            style={{ borderColor: `${mainColor}20` }}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id="agree-rules"
                checked={agreedToRules}
                onCheckedChange={(checked) =>
                  setAgreedToRules(checked as boolean)
                }
                className="mt-0.5"
              />
              <label
                htmlFor="agree-rules"
                className="text-sm md:text-base text-slate-700 leading-relaxed cursor-pointer font-medium"
              >
                Aku telah membaca dan memahami semua aturan. Aku setuju untuk
                mematuhi aturan dan siap memulai {mode} dengan sportif. 💪
              </label>
            </div>
          </div>
        </motion.div>

        {/* Start Button Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cn(
            'rounded-3xl border-2 shadow-sm overflow-hidden transition-all',
            agreedToRules
              ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white'
              : 'border-slate-200 bg-slate-50',
          )}
        >
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Icon & Status */}
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={cn(
                    'w-12 h-12 md:w-14 md:h-14 rounded-3xl flex items-center justify-center transition-all',
                    agreedToRules ? 'bg-emerald-100' : 'bg-slate-200',
                  )}
                >
                  {agreedToRules ? (
                    <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 md:w-7 md:h-7 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-slate-900">
                    {agreedToRules ? 'Siap Tempur!' : 'Setujui Aturan Dulu'}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium">
                    {agreedToRules
                      ? `Klik tombol untuk mulai ${mode}`
                      : 'Centang checkbox persetujuan'}
                  </p>
                </div>
              </div>

              {/* Start Button */}
              <motion.div
                whileHover={agreedToRules ? { scale: 1.02 } : {}}
                whileTap={agreedToRules ? { scale: 0.98 } : {}}
                className="w-full md:w-auto"
              >
                <Button
                  onClick={handleStart}
                  disabled={!agreedToRules || loading}
                  size="lg"
                  className={cn(
                    'w-full md:w-auto md:px-8 h-12 md:h-14 rounded-3xl text-sm md:text-base font-black shadow-md transition-all',
                    agreedToRules
                      ? 'hover:shadow-xl'
                      : 'cursor-not-allowed opacity-60',
                  )}
                  style={{
                    background: agreedToRules
                      ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                      : '#cbd5e1',
                  }}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Memulai...
                    </>
                  ) : (
                    <>
                      <Swords className="w-5 h-5 mr-2" />
                      Mulai Battle
                    </>
                  )}
                </Button>
              </motion.div>
            </div>

            {!agreedToRules && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-amber-600 mt-3 flex items-center gap-1.5 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Kamu harus menyetujui aturan terlebih dahulu
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Tips Card - Optional */}
        {agreedToRules && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl p-4 md:p-5 border shadow-sm"
            style={{
              backgroundColor: `${mainColor}05`,
              borderColor: `${mainColor}20`,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-3xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${mainColor}20` }}
              >
                <Trophy
                  className="w-5 h-5"
                  style={{ color: mainColor }}
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm md:text-base font-black text-slate-900 mb-2">
                  💡 Tips Sukses
                </h4>
                <ul className="space-y-1.5 text-xs md:text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>Pastikan koneksi internet stabil</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>Siapkan alat tulis untuk coret-coretan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>Fokus dan baca soal dengan teliti</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    <span>Manfaatkan waktu dengan efisien</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StartTryout;

'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const LiveStats = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const liveStats = [
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Siswa Aktif',
      value: 15247,
      suffix: '',
      increment: 3,
      color: '#3B82F6',
      description: 'Siswa belajar hari ini',
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      label: 'Berhasil Lolos',
      value: 12583,
      suffix: '',
      increment: 2,
      color: '#10B981',
      description: 'Alumni yang diterima PTN/Kedinasan',
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: 'Soal Dikerjakan',
      value: 2847392,
      suffix: '',
      increment: 47,
      color: '#F59E0B',
      description: 'Total soal yang telah diselesaikan',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Jam Belajar',
      value: 428736,
      suffix: ' Jam',
      increment: 12,
      color: '#8B5CF6',
      description: 'Total waktu belajar akumulatif',
    },
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Tingkat Akurasi',
      value: 94.7,
      suffix: '%',
      increment: 0.1,
      color: '#EC4899',
      description: 'Akurasi prediksi skor AI',
    },
    {
      icon: <Star className="w-6 h-6" />,
      label: 'Rating Kepuasan',
      value: 4.9,
      suffix: '/5',
      increment: 0.01,
      color: '#F59E0B',
      description: 'Rating dari pengguna aktif',
    },
  ];

  const AnimatedCounter = ({
    value,
    suffix = '',
    increment,
    color,
  }: {
    value: number;
    suffix?: string;
    increment: number;
    color: string;
  }) => {
    const [currentValue, setCurrentValue] = useState(value);
    const motionValue = useMotionValue(value);
    const springValue = useSpring(motionValue, { duration: 2000 });
    const rounded = useTransform(
      springValue,
      (latest) => Math.round(latest * 100) / 100,
    );

    useEffect(() => {
      // Simulate real-time updates
      const interval = setInterval(
        () => {
          const newValue = currentValue + increment;
          setCurrentValue(newValue);
          motionValue.set(newValue);
        },
        3000 + Math.random() * 2000,
      ); // Random interval between 3-5 seconds

      return () => clearInterval(interval);
    }, [currentValue, increment, motionValue]);

    return (
      <motion.span
        className="text-3xl md:text-4xl font-black"
        style={{ color }}
      >
        <motion.span>{rounded}</motion.span>
        <span className="text-lg font-normal">{suffix}</span>
      </motion.span>
    );
  };

  const realtimeActivities = [
    {
      user: 'Ahmad S.',
      action: 'menyelesaikan Try Out UTBK',
      time: '2 detik lalu',
      score: 89,
    },
    {
      user: 'Sarah M.',
      action: 'bergabung ke Live Class',
      time: '5 detik lalu',
      score: null,
    },
    {
      user: 'Budi R.',
      action: 'mencapai target harian',
      time: '12 detik lalu',
      score: 95,
    },
    {
      user: 'Rina K.',
      action: 'menyelesaikan Quiz AI',
      time: '18 detik lalu',
      score: 87,
    },
    {
      user: 'Davi P.',
      action: 'memulai sesi belajar',
      time: '23 detik lalu',
      score: null,
    },
  ];

  const [activities, setActivities] = useState(realtimeActivities);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activity
      const newActivity = {
        user: `User ${Math.floor(Math.random() * 1000)}`,
        action: [
          'menyelesaikan Try Out',
          'bergabung Live Class',
          'mencapai target',
          'menyelesaikan Quiz',
        ][Math.floor(Math.random() * 4)],
        time: 'baru saja',
        score: Math.random() > 0.5 ? Math.floor(Math.random() * 40 + 60) : null,
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 4)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="live-stats"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span
              className="inline-flex items-center gap-2 rounded-3xl px-6 py-3 text-sm font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <TrendingUp className="w-4 h-4" />
              LIVE STATISTICS
            </span>
          </motion.div>

          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: mainColor }}
          >
            Prestasi Real-Time
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Saksikan pencapaian luar biasa yang terjadi setiap detik di platform
            Bimbelio
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {liveStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="border-2 border-gray-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group relative">
                    {/* Live indicator */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-gray-500">
                          LIVE
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-6 relative">
                      {/* Background gradient */}
                      <div
                        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                        style={{ backgroundColor: stat.color }}
                      />

                      <div className="relative z-10">
                        {/* Icon */}
                        <div
                          className="w-12 h-12 rounded-3xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300"
                          style={{ backgroundColor: `${stat.color}15` }}
                        >
                          <div style={{ color: stat.color }}>{stat.icon}</div>
                        </div>

                        {/* Value */}
                        <div className="mb-2">
                          <AnimatedCounter
                            value={stat.value}
                            suffix={stat.suffix}
                            increment={stat.increment}
                            color={stat.color}
                          />
                        </div>

                        {/* Label */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {stat.label}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {stat.description}
                        </p>

                        {/* Trend indicator */}
                        <div className="mt-4 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">
                            +{stat.increment}/menit
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Real-time Activity Feed */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 border-gray-100 rounded-3xl overflow-hidden shadow-lg h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Zap
                        className="w-5 h-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Live Activity</h3>
                      <p className="text-sm text-gray-600">
                        Aktivitas terkini pengguna
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {activities.map((activity, index) => (
                      <motion.div
                        key={`${activity.user}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: mainColor }}
                        >
                          {activity.user.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">
                              {activity.user}
                            </span>
                            <span className="text-gray-600">
                              {' '}
                              {activity.action}
                            </span>
                            {activity.score && (
                              <span className="text-green-600 font-medium">
                                {' '}
                                (Skor: {activity.score})
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.time}
                          </div>
                        </div>
                        {activity.score && activity.score >= 90 && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom stats */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div
                          className="text-xl font-bold"
                          style={{ color: mainColor }}
                        >
                          <AnimatedCounter
                            value={847}
                            increment={2}
                            color={mainColor}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          Online sekarang
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-600">
                          <AnimatedCounter
                            value={156}
                            increment={1}
                            color="#10B981"
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          Aktivitas/menit
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveStats;

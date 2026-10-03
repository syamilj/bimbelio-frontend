'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Calendar, Clock, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CountdownResultProps {
  targetDate: string | Date;
  title?: string;
  description?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const CountdownResult = ({
  targetDate,
  title = 'Pengumuman Hasil',
  description = 'Hasil try out akan diumumkan dalam',
}: CountdownResultProps) => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0066FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#4C94FF';

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const countdown = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
      }
    };

    // Initial countdown
    countdown();

    const timerId = setInterval(countdown, 1000);

    return () => clearInterval(timerId);
  }, [targetDate]);

  if (!mounted) {
    return (
      <Card className="border-2 rounded-3xl overflow-hidden shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-3/4 mx-auto"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="text-center"
                >
                  <div className="h-12 bg-gray-200 rounded-3xl mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const timeUnits = [
    { label: 'Hari', value: timeLeft.days, icon: Calendar },
    { label: 'Jam', value: timeLeft.hours, icon: Clock },
    { label: 'Menit', value: timeLeft.minutes, icon: Timer },
    { label: 'Detik', value: timeLeft.seconds, icon: Timer },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card
        className="border-2 rounded-3xl overflow-hidden shadow-lg"
        style={{ borderColor: `${mainColor}20` }}
      >
        <CardContent
          className="p-6 md:p-8"
          style={{
            background: `linear-gradient(135deg, ${mainColor}05, ${secondaryColor}05)`,
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-3xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: mainColor }}
            >
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h3
              className="text-xl md:text-2xl font-bold mb-2"
              style={{ color: mainColor }}
            >
              {title}
            </h3>
            <p className="text-gray-600 text-sm md:text-base">{description}</p>
          </div>

          {/* Countdown Display */}
          {timeLeft.isExpired ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }}>
                  <Clock className="w-10 h-10 text-green-600" />
                </motion.div>
              </div>
              <h4 className="text-2xl font-bold text-green-600 mb-2">
                Waktu Telah Berakhir!
              </h4>
              <p className="text-gray-600">
                Hasil sudah dapat dilihat sekarang
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {timeUnits.map((unit) => {
                const IconComponent = unit.icon;
                return (
                  <motion.div
                    key={unit.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div
                      className="relative rounded-3xl p-4 mb-3 border-2 shadow-lg bg-white hover:shadow-xl transition-all duration-300"
                      style={{ borderColor: `${mainColor}20` }}
                    >
                      {/* Background Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-5">
                        <IconComponent
                          className="w-12 h-12"
                          style={{ color: mainColor }}
                        />
                      </div>

                      {/* Number */}
                      <motion.div
                        key={unit.value}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="relative z-10 text-2xl md:text-3xl lg:text-4xl font-black"
                        style={{ color: mainColor }}
                      >
                        {String(unit.value).padStart(2, '0')}
                      </motion.div>

                      {/* Pulse effect for seconds */}
                      {unit.label === 'Detik' && (
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          className="absolute inset-0 rounded-3xl"
                          style={{ backgroundColor: `${mainColor}10` }}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <IconComponent className="w-3 h-3 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">
                          {unit.label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Footer Message */}
          {!timeLeft.isExpired && (
            <div className="mt-8 text-center">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white shadow-sm"
                style={{ backgroundColor: mainColor }}
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span>Menghitung mundur secara real-time</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CountdownResult;

'use client';

import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Award,
  BookOpen,
  Calculator,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const SuccessCalculator = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Calculator states
  const [currentScore, setCurrentScore] = useState([450]);
  const [targetUniversity, setTargetUniversity] = useState('');
  const [studyTime, setStudyTime] = useState([3]);
  // const [targetScore, setTargetScore] = useState(600);
  const [showResult, setShowResult] = useState(false);
  const [calculationStep, setCalculationStep] = useState(0);

  // Universities data
  const universities = [
    {
      name: 'Universitas Indonesia',
      minScore: 650,
      category: 'PTN Top 3',
      difficulty: 'Sangat Tinggi',
    },
    {
      name: 'Universitas Gadjah Mada',
      minScore: 640,
      category: 'PTN Top 3',
      difficulty: 'Sangat Tinggi',
    },
    {
      name: 'Institut Teknologi Bandung',
      minScore: 630,
      category: 'PTN Top 3',
      difficulty: 'Sangat Tinggi',
    },
    {
      name: 'STAN',
      minScore: 580,
      category: 'Kedinasan',
      difficulty: 'Tinggi',
    },
    {
      name: 'STIS',
      minScore: 590,
      category: 'Kedinasan',
      difficulty: 'Tinggi',
    },
    {
      name: 'IPDN',
      minScore: 520,
      category: 'Kedinasan',
      difficulty: 'Sedang',
    },
    {
      name: 'Universitas Brawijaya',
      minScore: 550,
      category: 'PTN',
      difficulty: 'Sedang',
    },
    {
      name: 'Universitas Diponegoro',
      minScore: 540,
      category: 'PTN',
      difficulty: 'Sedang',
    },
  ];

  // Success calculation logic
  const calculateSuccess = () => {
    const selectedUni = universities.find((u) => u.name === targetUniversity);
    if (!selectedUni)
      return { percentage: 0, status: 'low', recommendations: [] };

    const scoreGap = selectedUni.minScore - currentScore[0];
    const weeklyStudy = studyTime[0];
    const improvementRate = weeklyStudy * 5; // 5 points per hour study
    const weeksToTarget = Math.max(1, Math.ceil(scoreGap / improvementRate));

    let successPercentage = 0;
    if (currentScore[0] >= selectedUni.minScore) {
      successPercentage = 95;
    } else {
      const baseChance = Math.max(10, 60 - scoreGap / 10);
      const studyBonus = Math.min(30, weeklyStudy * 5);
      successPercentage = Math.min(95, baseChance + studyBonus);
    }

    const status =
      successPercentage >= 80
        ? 'high'
        : successPercentage >= 50
          ? 'medium'
          : 'low';

    const recommendations = [
      weeklyStudy < 4
        ? 'Tingkatkan waktu belajar minimal 4 jam/hari'
        : 'Waktu belajar sudah optimal',
      scoreGap > 100
        ? 'Fokus pada materi dasar terlebih dahulu'
        : 'Lanjutkan latihan soal advanced',
      'Ikuti try out rutin untuk track progress',
      'Gunakan AI tutor untuk pembelajaran personal',
    ];

    return {
      percentage: successPercentage,
      status,
      recommendations,
      weeksToTarget,
    };
  };

  const result = showResult
    ? calculateSuccess()
    : { percentage: 0, status: 'low', recommendations: [], weeksToTarget: 0 };

  const handleCalculate = () => {
    setCalculationStep(0);
    setShowResult(false);

    // Animated calculation steps
    const steps = [
      'Menganalisis skor saat ini...',
      'Menghitung gap dengan target...',
      'Memproses data universitas...',
      'Menyusun rekomendasi...',
    ];

    let step = 0;
    const interval = setInterval(() => {
      setCalculationStep(step);
      step++;

      if (step >= steps.length) {
        clearInterval(interval);
        setTimeout(() => setShowResult(true), 500);
      }
    }, 800);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'high':
        return {
          color: '#10B981',
          bg: 'bg-green-50',
          text: 'Peluang Tinggi',
          icon: <CheckCircle className="w-5 h-5" />,
        };
      case 'medium':
        return {
          color: '#F59E0B',
          bg: 'bg-yellow-50',
          text: 'Peluang Sedang',
          icon: <Target className="w-5 h-5" />,
        };
      default:
        return {
          color: '#EF4444',
          bg: 'bg-red-50',
          text: 'Perlu Peningkatan',
          icon: <AlertTriangle className="w-5 h-5" />,
        };
    }
  };

  return (
    <section
      id="success-calculator"
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
              <Calculator className="w-4 h-4" />
              SUCCESS CALCULATOR
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <AnimatedGradientText>
              Prediksi Peluang Kesuksesanmu
            </AnimatedGradientText>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hitung peluang masuk universitas impianmu berdasarkan skor saat ini
            dan target belajar
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-gray-100 rounded-3xl shadow-xl overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Kalkulator Sukses
                  </h3>
                  <p className="text-gray-600">
                    Masukkan data untuk analisis personal
                  </p>
                </div>

                {/* Current Score */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-gray-900">
                    Skor Try Out Terbaru:{' '}
                    <span style={{ color: mainColor }}>{currentScore[0]}</span>
                  </Label>
                  <Slider
                    value={currentScore}
                    onValueChange={setCurrentScore}
                    max={800}
                    min={200}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>200</span>
                    <span>800</span>
                  </div>
                </div>

                {/* Target University */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-900">
                    Universitas Target
                  </Label>
                  <Select onValueChange={setTargetUniversity}>
                    <SelectTrigger className="h-12 rounded-xl border-2">
                      <SelectValue placeholder="Pilih universitas impianmu" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((uni, index) => (
                        <SelectItem
                          key={index}
                          value={uni.name}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{uni.name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              Min: {uni.minScore}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Study Time */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-gray-900">
                    Waktu Belajar per Hari:{' '}
                    <span style={{ color: mainColor }}>{studyTime[0]} jam</span>
                  </Label>
                  <Slider
                    value={studyTime}
                    onValueChange={setStudyTime}
                    max={12}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>1 jam</span>
                    <span>12 jam</span>
                  </div>
                </div>

                {/* Calculate Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-4"
                >
                  <Button
                    onClick={handleCalculate}
                    disabled={!targetUniversity || calculationStep > 0}
                    className="w-full h-14 rounded-3xl font-bold text-lg text-white shadow-lg transition-all duration-300"
                    style={{
                      background: targetUniversity
                        ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                        : '#9CA3AF',
                    }}
                  >
                    {calculationStep === 0 ? (
                      <>
                        <Calculator className="w-5 h-5 mr-2" />
                        Hitung Peluang Sukses
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Menganalisis...
                      </>
                    )}
                  </Button>
                </motion.div>

                {/* Calculation Steps */}
                <AnimatePresence>
                  {calculationStep > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center space-y-2"
                    >
                      {[
                        'Menganalisis skor saat ini...',
                        'Menghitung gap dengan target...',
                        'Memproses data universitas...',
                        'Menyusun rekomendasi...',
                      ]
                        .slice(0, calculationStep)
                        .map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm text-gray-600 flex items-center justify-center gap-2"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            {step}
                          </motion.div>
                        ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              {showResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-2 border-gray-100 rounded-3xl shadow-xl overflow-hidden">
                    <CardContent className="p-8 space-y-8">
                      {/* Success Percentage */}
                      <div className="text-center">
                        <div
                          className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center relative"
                          style={{
                            backgroundColor: `${getStatusConfig(result.status).color}15`,
                          }}
                        >
                          <div
                            className="text-4xl font-black"
                            style={{
                              color: getStatusConfig(result.status).color,
                            }}
                          >
                            {Math.round(result.percentage)}%
                          </div>
                          <div
                            className="absolute inset-0 rounded-full border-4 border-transparent"
                            style={{
                              borderTopColor: getStatusConfig(result.status)
                                .color,
                              transform: `rotate(${(result.percentage / 100) * 360}deg)`,
                              transition: 'transform 1s ease-out',
                            }}
                          />
                        </div>

                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${getStatusConfig(result.status).bg}`}
                          style={{
                            color: getStatusConfig(result.status).color,
                          }}
                        >
                          {getStatusConfig(result.status).icon}
                          {getStatusConfig(result.status).text}
                        </div>
                      </div>

                      {/* University Info */}
                      {targetUniversity && (
                        <div className="p-6 rounded-xl bg-gray-50">
                          <h4 className="font-bold text-lg text-gray-900 mb-2">
                            Target: {targetUniversity}
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">
                                Skor Minimum:
                              </span>
                              <div
                                className="font-bold"
                                style={{ color: mainColor }}
                              >
                                {
                                  universities.find(
                                    (u) => u.name === targetUniversity,
                                  )?.minScore
                                }
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Skor Kamu:</span>
                              <div className="font-bold text-gray-900">
                                {currentScore[0]}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Gap Skor:</span>
                              <div className="font-bold text-orange-600">
                                {Math.max(
                                  0,
                                  (universities.find(
                                    (u) => u.name === targetUniversity,
                                  )?.minScore || 0) - currentScore[0],
                                )}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Estimasi Waktu:
                              </span>
                              <div className="font-bold text-blue-600">
                                {result.weeksToTarget} minggu
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                          <Sparkles
                            className="w-5 h-5"
                            style={{ color: mainColor }}
                          />
                          Rekomendasi Personal
                        </h4>
                        <div className="space-y-3">
                          {result.recommendations.map((rec, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-200"
                            >
                              <ChevronRight
                                className="w-4 h-4 mt-0.5"
                                style={{ color: mainColor }}
                              />
                              <span className="text-sm text-gray-700 leading-relaxed">
                                {rec}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            className="w-full h-12 rounded-xl font-bold text-white shadow-lg"
                            style={{
                              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                            }}
                          >
                            <Target className="w-4 h-4 mr-2" />
                            Mulai Program Peningkatan
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </motion.div>

                        <Button
                          variant="outline"
                          className="w-full h-12 rounded-xl font-medium border-2"
                          style={{ borderColor: mainColor, color: mainColor }}
                          onClick={() => setShowResult(false)}
                        >
                          Hitung Ulang
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="border-2 border-gray-100 rounded-3xl shadow-xl overflow-hidden h-full">
                    <CardContent className="p-8 h-full flex items-center justify-center">
                      <div className="text-center space-y-6">
                        <div
                          className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center"
                          style={{ backgroundColor: `${mainColor}15` }}
                        >
                          <TrendingUp
                            className="w-10 h-10"
                            style={{ color: mainColor }}
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Analisis Tersedia
                          </h3>
                          <p className="text-gray-600">
                            Isi form di samping untuk mendapatkan prediksi
                            peluang sukses yang akurat
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {[
                            {
                              icon: <Calculator className="w-4 h-4" />,
                              text: 'AI Analysis',
                            },
                            {
                              icon: <Target className="w-4 h-4" />,
                              text: 'Personal Goal',
                            },
                            {
                              icon: <BookOpen className="w-4 h-4" />,
                              text: 'Study Plan',
                            },
                            {
                              icon: <Award className="w-4 h-4" />,
                              text: 'Success Tips',
                            },
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-gray-600"
                            >
                              <div style={{ color: mainColor }}>
                                {item.icon}
                              </div>
                              <span>{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: <Users className="w-6 h-6" />,
                label: 'Pengguna Calculator',
                value: '25K+',
                color: '#3B82F6',
              },
              {
                icon: <Award className="w-6 h-6" />,
                label: 'Prediksi Akurat',
                value: '94%',
                color: '#10B981',
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                label: 'Peningkatan Rata-rata',
                value: '+150',
                color: '#F59E0B',
              },
              {
                icon: <Target className="w-6 h-6" />,
                label: 'Target Tercapai',
                value: '89%',
                color: '#8B5CF6',
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-xl bg-white shadow-sm border border-gray-200"
              >
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <div style={{ color: stat.color }}>{stat.icon}</div>
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessCalculator;

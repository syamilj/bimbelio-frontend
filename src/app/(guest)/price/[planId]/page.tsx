'use client';

import { DialogPayment } from '@/components/_shared/other/card-plan/_components/dialog-payment';
import ConsultationDialog from '@/components/_shared/contact/consultation-dialog';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { pixel } from '@/lib/pixel/_core';
import { cn, formatDate } from '@/lib/utils';
import {
  Category,
  Instructor,
  LiveClass,
  Pivot_LiveClass_Plan,
  Pivot_Plan_Category,
  Plan,
  PlanBenefit,
  PlanFeature,
  PlanLimitation,
  PlanSubscription,
  WebsiteSubCategory,
} from '@/types/database';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crown,
  Eye,
  FileText,
  Infinity,
  LockOpen,
  MessageCircle,
  Play,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

type PlanDataType = Plan & {
  PlanBenefit: PlanBenefit[];
  discount: number | undefined;
  PlanLimitation: PlanLimitation;
  PlanSubscription: PlanSubscription & {
    PlanFeature: (PlanFeature & {
      Pivot_Plan_Category: (Pivot_Plan_Category & {
        Category: Category;
      })[];
    })[];
    WebsiteSubCategory: WebsiteSubCategory;
  };
  Pivot_LiveClass_Plan: (Pivot_LiveClass_Plan & {
    LiveClass: LiveClass & {
      Instructor: Instructor;
    };
  })[];
  timeline: string;
};

export default function PlanDetailPage() {
  const { planId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] =
    useState(false);
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const { data: plan, isLoading: planIsLoading } = useGet<PlanDataType>(
    `/plan/getSinglePlan?id=${planId}`,
    {
      useEffectDependencies: [planId],
    },
  );

  // Handle consultation dialog open
  const handleConsultationClick = () => {
    try {
      pixel.meta.track('ViewContent', {
        content_type: 'page',
        content_name: 'Contact Modal from Plan Detail',
      });

      pixel.tiktok.track('ViewContent', {
        content_name: 'Contact Modal from Plan Detail',
        content_id: 'plan_detail_contact_modal',
        page_path: '/plan-detail-contact-modal',
      });

      console.log('📊 Pixel tracked: Contact dialog opened from plan detail');
    } catch (error) {
      console.warn('Pixel tracking error:', error);
    }

    setIsConsultationDialogOpen(true);
  };

  if (planIsLoading) {
    return <LoadingSkeleton />;
  }

  if (!plan) {
    return <div className="">Not Found</div>;
  }

  const discountPercentage = plan.originalPrice
    ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
    : 0;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16">
        {/* Hero Section - Compact SNBT Style */}
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Compact Hero Card */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6 lg:p-8">
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                  {/* Content - 2/3 width */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Compact badges */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="flex items-center gap-2 flex-wrap"
                    >
                      <Badge
                        className="px-3 py-1 text-xs font-bold text-white border-none flex items-center gap-1"
                        style={{ backgroundColor: mainColor }}
                      >
                        <Crown className="w-3 h-3" />
                        Blueprint Plan
                      </Badge>
                      {discountPercentage > 0 && (
                        <Badge className="bg-red-500 text-white px-2 py-1 text-xs animate-pulse">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {discountPercentage}% OFF
                        </Badge>
                      )}
                    </motion.div>

                    {/* Compact title */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="space-y-3"
                    >
                      <h1 className="text-2xl lg:text-3xl font-black leading-tight text-gray-900">
                        <SparklesText sparklesCount={4}>
                          <span
                            className="bg-clip-text text-transparent"
                            style={{
                              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {plan.name}
                          </span>
                        </SparklesText>
                      </h1>
                      <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                        <span
                          className="font-bold"
                          style={{ color: mainColor }}
                        >
                          Goal kita jelas:
                        </span>{' '}
                        Blueprint personal untuk naik 200+ poin dalam waktu
                        terukur.
                      </p>
                    </motion.div>

                    {/* Compact pricing and CTA */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex items-center gap-4 flex-wrap"
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl lg:text-3xl font-black text-gray-900">
                          {formatPrice(plan.price)}
                        </span>
                        {plan.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(plan.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {plan.PlanSubscription?.expireDays || 365} hari akses
                      </div>
                    </motion.div>

                    {/* Compact CTA buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <DialogPayment plan={plan}>
                        <Button
                          className="px-6 py-2 rounded-xl font-bold text-white hover:scale-105 transition-all duration-300 text-sm"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Mulai Sekarang
                        </Button>
                      </DialogPayment>
                      <Button
                        variant="outline"
                        onClick={handleConsultationClick}
                        className="px-6 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition-all duration-300"
                        style={{
                          borderColor: mainColor,
                          color: mainColor,
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Konsultasi
                      </Button>
                    </motion.div>
                  </div>

                  {/* Compact image - 1/3 width */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative"
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white/20 backdrop-blur-sm">
                      {plan.image && (
                        <Image
                          src={plan.image || '/placeholder.svg'}
                          alt={plan.name}
                          width={300}
                          height={200}
                          className="w-full h-auto rounded-2xl"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl" />
                    </div>

                    {/* Small floating badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: mainColor }}
                    >
                      <Star className="w-5 h-5" />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Compact stats row */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200/50"
                >
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: mainColor }}
                    >
                      15K+
                    </div>
                    <div className="text-xs text-gray-600">Users</div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: mainColor }}
                    >
                      +200
                    </div>
                    <div className="text-xs text-gray-600">Score</div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: mainColor }}
                    >
                      97%
                    </div>
                    <div className="text-xs text-gray-600">Success</div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content - Adjusted spacing */}
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              {/* Compact Navigation Tabs */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full h-full grid-cols-5 mb-6 bg-white/70 backdrop-blur-sm border border-blue-200/50 rounded-xl p-1">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300 text-sm py-2"
                    style={{
                      backgroundColor:
                        activeTab === 'overview' ? mainColor : 'transparent',
                    }}
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="course"
                    className="data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300 text-sm py-2"
                    style={{
                      backgroundColor:
                        activeTab === 'course' ? mainColor : 'transparent',
                    }}
                  >
                    Course
                  </TabsTrigger>
                  <TabsTrigger
                    value="features"
                    className="data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300 text-sm py-2"
                    style={{
                      backgroundColor:
                        activeTab === 'features' ? mainColor : 'transparent',
                    }}
                  >
                    Fitur
                  </TabsTrigger>
                  <TabsTrigger
                    value="classes"
                    className="data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300 text-sm py-2"
                    style={{
                      backgroundColor:
                        activeTab === 'classes' ? mainColor : 'transparent',
                    }}
                  >
                    Live Class
                  </TabsTrigger>
                  <TabsTrigger
                    value="limits"
                    className="data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300 text-sm py-2"
                    style={{
                      backgroundColor:
                        activeTab === 'limits' ? mainColor : 'transparent',
                    }}
                  >
                    Koin
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent
                  value="overview"
                  className="space-y-8"
                >
                  {/* Benefits Grid - SNBT Style */}
                  {plan.PlanBenefit && plan.PlanBenefit.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                        <CardHeader className="pb-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                          >
                            <Badge
                              className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit"
                              style={{ backgroundColor: mainColor }}
                            >
                              <Star className="w-4 h-4" />
                              Keunggulan Blueprint
                            </Badge>
                            <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                              Sistem yang{' '}
                              <span
                                className="bg-clip-text text-transparent"
                                style={{
                                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                terukur
                              </span>{' '}
                              untuk hasil maksimal
                            </CardTitle>
                            <CardDescription className="text-xl text-gray-600 leading-relaxed">
                              <span
                                className="font-bold"
                                style={{ color: mainColor }}
                              >
                                Goal kita jelas:
                              </span>{' '}
                              setiap fitur dirancang khusus untuk bantu kamu
                              naik minimal 200+ poin.
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-6">
                            {plan.PlanBenefit.sort(
                              (a, b) => a.order - b.order,
                            ).map((benefit, index) => (
                              <motion.div
                                key={benefit.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.6,
                                  delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="group relative p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                              >
                                <div className="flex items-start gap-4">
                                  <div
                                    className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                                    style={{
                                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                    }}
                                  >
                                    <Check className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                                      {benefit.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                      {benefit.description}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full text-white"
                                  style={{ backgroundColor: secondaryColor }}
                                >
                                  {String(index + 1).padStart(2, '0')}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Features Overview - SNBT Style */}
                  {plan.PlanSubscription?.PlanFeature && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                        <CardHeader className="pb-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                          >
                            <Badge
                              className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit"
                              style={{ backgroundColor: mainColor }}
                            >
                              <BookOpen className="w-4 h-4" />
                              Fitur Blueprint
                            </Badge>
                            <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                              Akses{' '}
                              <span
                                className="bg-clip-text text-transparent"
                                style={{
                                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                unlimited
                              </span>{' '}
                              ke semua kategori
                            </CardTitle>
                            <CardDescription className="text-xl text-gray-600 leading-relaxed">
                              <span
                                className="font-bold"
                                style={{ color: mainColor }}
                              >
                                Semua fitur premium
                              </span>{' '}
                              yang kamu butuhkan untuk persiapan UTBK maksimal.
                              Bukan sekadar akses biasa, tapi{' '}
                              <span
                                className="font-bold"
                                style={{ color: secondaryColor }}
                              >
                                sistem pembelajaran terintegrasi
                              </span>
                              !
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-3 gap-6">
                            {plan.PlanSubscription.PlanFeature.map(
                              (feature, index) => (
                                <motion.div
                                  key={feature.id}
                                  initial={{ opacity: 0, y: 30 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.6,
                                    delay: index * 0.15,
                                  }}
                                  viewport={{ once: true }}
                                  className="group p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                                >
                                  <div className="flex items-center gap-3 mb-4">
                                    <div
                                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                                      style={{
                                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                      }}
                                    >
                                      {getFeatureIcon(feature.type)}
                                    </div>
                                    <div>
                                      <h3 className="font-black text-gray-900 text-lg capitalize">
                                        {feature.type
                                          .toLowerCase()
                                          .replace('_', ' ')}
                                      </h3>
                                      {feature.liveClassesPerWeek && (
                                        <p
                                          className="text-sm font-medium"
                                          style={{ color: mainColor }}
                                        >
                                          {feature.liveClassesPerWeek}{' '}
                                          kelas/minggu
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    {feature.type === 'COURSE' &&
                                      feature.Pivot_Plan_Category.slice(
                                        0,
                                        3,
                                      ).map((pivot) => (
                                        <div
                                          key={pivot.id}
                                          className="flex items-center gap-3 p-2 rounded-xl bg-white/60 hover:bg-white/80 transition-all duration-200"
                                        >
                                          <div
                                            className="w-6 h-6 rounded-lg text-white text-xs flex items-center justify-center font-bold"
                                            style={{
                                              backgroundColor: mainColor,
                                            }}
                                          >
                                            {pivot.Category.nomor}
                                          </div>
                                          <span className="text-gray-900 font-semibold text-sm">
                                            {pivot.Category.name}
                                          </span>
                                          <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                                        </div>
                                      ))}
                                    {feature.type === 'DOCUMENT' && (
                                      <div className="flex gap-3 p-2 rounded-xl bg-white/60">
                                        <div
                                          className="w-6 h-6 rounded-lg text-white text-xs flex items-center justify-center font-bold shrink-0"
                                          style={{ backgroundColor: mainColor }}
                                        >
                                          <LockOpen className="w-3 h-3" />
                                        </div>
                                        <span className="text-gray-900 font-semibold text-sm">
                                          Akses ke Semua Document Premium
                                        </span>
                                      </div>
                                    )}
                                    {feature.type === 'LIVECLASS' &&
                                      feature.liveClassesPerWeek && (
                                        <div className="flex gap-3 p-2 rounded-xl bg-white/60">
                                          <div
                                            className="w-6 h-6 rounded-lg text-white text-xs flex items-center justify-center font-bold shrink-0"
                                            style={{
                                              backgroundColor: mainColor,
                                            }}
                                          >
                                            <Play className="w-3 h-3" />
                                          </div>
                                          <span className="text-gray-900 font-semibold text-sm">
                                            {feature.liveClassesPerWeek} Live
                                            Class per Minggu
                                          </span>
                                        </div>
                                      )}
                                  </div>

                                  {/* Feature highlight badge */}
                                  <div className="mt-4 pt-3 border-t border-gray-200/50">
                                    <div
                                      className="text-xs font-bold px-3 py-1 rounded-full text-white w-fit"
                                      style={{
                                        backgroundColor: secondaryColor,
                                      }}
                                    >
                                      Premium Access
                                    </div>
                                  </div>
                                </motion.div>
                              ),
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Live Classes Overview - SNBT Style */}
                  {plan.Pivot_LiveClass_Plan &&
                    plan.Pivot_LiveClass_Plan.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        viewport={{ once: true }}
                      >
                        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                          <CardHeader className="pb-6">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.5 }}
                              viewport={{ once: true }}
                            >
                              <Badge
                                className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit"
                                style={{ backgroundColor: mainColor }}
                              >
                                <Video className="w-4 h-4" />
                                Live Class Premium
                              </Badge>
                              <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                                Belajar langsung dengan{' '}
                                <span
                                  className="bg-clip-text text-transparent"
                                  style={{
                                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                  }}
                                >
                                  mentor terbaik
                                </span>
                              </CardTitle>
                              <CardDescription className="text-xl text-gray-600 leading-relaxed">
                                <span
                                  className="font-bold"
                                  style={{ color: mainColor }}
                                >
                                  {plan.Pivot_LiveClass_Plan.length} live class
                                  terjadwal
                                </span>{' '}
                                dengan instruktur berpengalaman. Interaksi
                                langsung,{' '}
                                <span
                                  className="font-bold"
                                  style={{ color: secondaryColor }}
                                >
                                  hasil maksimal
                                </span>
                                !
                              </CardDescription>
                            </motion.div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                              {plan.Pivot_LiveClass_Plan.slice(0, 4).map(
                                (pivot, index) => (
                                  <motion.div
                                    key={pivot.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                      duration: 0.6,
                                      delay: index * 0.1,
                                    }}
                                    viewport={{ once: true }}
                                    className="group p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                                  >
                                    {/* Background decoration */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-transparent rounded-full -translate-y-8 translate-x-8 opacity-50" />

                                    <div className="relative">
                                      <div className="flex items-start gap-4 mb-4">
                                        <div
                                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shrink-0"
                                          style={{
                                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                          }}
                                        >
                                          {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h4 className="font-black text-gray-900 text-lg mb-2 leading-tight">
                                            {pivot.LiveClass.title}
                                          </h4>
                                          <div className="flex flex-wrap items-center gap-3 text-sm">
                                            <div className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded-lg">
                                              <Clock
                                                className="w-4 h-4"
                                                style={{ color: mainColor }}
                                              />
                                              <span className="font-semibold text-gray-700">
                                                {pivot.LiveClass.duration}m
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-1 px-2 py-1 bg-white/60 rounded-lg">
                                              <Users
                                                className="w-4 h-4"
                                                style={{ color: mainColor }}
                                              />
                                              <span className="font-semibold text-gray-700">
                                                {pivot.LiveClass
                                                  .maxParticipant ||
                                                  'Unlimited'}
                                              </span>
                                            </div>
                                            {pivot.LiveClass.isRecord && (
                                              <Badge className="bg-green-500 text-white text-xs font-semibold border-0">
                                                <Play className="w-3 h-3 mr-1" />
                                                Direkam
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Instructor info */}
                                      {pivot.LiveClass.Instructor && (
                                        <div className="flex items-center gap-2 pt-3 border-t border-purple-200/50">
                                          <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                            <Users className="w-3 h-3 text-white" />
                                          </div>
                                          <span className="text-sm font-semibold text-gray-700">
                                            Instructor Premium
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Class number badge */}
                                    <div
                                      className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full text-white"
                                      style={{
                                        backgroundColor: secondaryColor,
                                      }}
                                    >
                                      Class {index + 1}
                                    </div>
                                  </motion.div>
                                ),
                              )}
                            </div>

                            {plan.Pivot_LiveClass_Plan.length > 4 && (
                              <div className="mt-8 text-center">
                                <Button
                                  variant="outline"
                                  onClick={() => setActiveTab('classes')}
                                  className="px-8 py-4 rounded-2xl border-2 font-semibold hover:scale-105 transition-all duration-300"
                                  style={{
                                    borderColor: mainColor,
                                    color: mainColor,
                                  }}
                                >
                                  Lihat Semua {plan.Pivot_LiveClass_Plan.length}{' '}
                                  Live Class
                                  <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                  {/* Usage Limits Overview - SNBT Style */}
                  {plan.PlanLimitation && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      viewport={{ once: true }}
                    >
                      <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                        <CardHeader className="pb-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            viewport={{ once: true }}
                          >
                            <Badge
                              className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit"
                              style={{ backgroundColor: mainColor }}
                            >
                              <Infinity className="w-4 h-4" />
                              Koin Blueprint
                            </Badge>
                            <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                              Sistem koin yang{' '}
                              <span
                                className="bg-clip-text text-transparent"
                                style={{
                                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                unlimited
                              </span>{' '}
                              untuk belajar
                            </CardTitle>
                            <CardDescription className="text-xl text-gray-600 leading-relaxed">
                              <span
                                className="font-bold"
                                style={{ color: mainColor }}
                              >
                                Gak perlu khawatir
                              </span>{' '}
                              soal limit! Paket ini dirancang untuk pembelajaran
                              maksimal dengan{' '}
                              <span
                                className="font-bold"
                                style={{ color: secondaryColor }}
                              >
                                koin yang berlimpah
                              </span>
                              .
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(plan.PlanLimitation)
                              .filter(
                                ([key]) =>
                                  key !== 'id' &&
                                  key !== 'planId' &&
                                  key !== 'expireDays',
                              )
                              .map(([key, value], index) => (
                                <motion.div
                                  key={key}
                                  initial={{ opacity: 0, y: 30 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.6,
                                    delay: index * 0.1,
                                  }}
                                  viewport={{ once: true }}
                                  className="group p-6 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                                >
                                  {/* Background decoration */}
                                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -translate-y-6 translate-x-6 opacity-50" />

                                  <div className="relative">
                                    <div
                                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg"
                                      style={{
                                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                      }}
                                    >
                                      {getLimitationIcon(key)}
                                    </div>
                                    <h4 className="font-black text-gray-900 mb-3 text-lg">
                                      {key === 'chat'
                                        ? 'Chat AI'
                                        : key === 'notes'
                                          ? 'Catatan'
                                          : key === 'vision'
                                            ? 'Vision AI'
                                            : key === 'quiz'
                                              ? 'Kuis'
                                              : key === 'tryout'
                                                ? 'Tryout'
                                                : key}
                                    </h4>
                                    <div
                                      className="text-4xl font-black mb-2"
                                      style={{ color: mainColor }}
                                    >
                                      {typeof value === 'number'
                                        ? value.toLocaleString()
                                        : value}
                                    </div>
                                    <div className="text-sm text-gray-600 font-semibold">
                                      koin tersedia
                                    </div>

                                    {/* Progress bar indicator */}
                                    <div className="mt-4">
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                          className="h-2 rounded-full"
                                          style={{
                                            backgroundColor: secondaryColor,
                                            width:
                                              typeof value === 'number' &&
                                              value > 100
                                                ? '100%'
                                                : '85%',
                                          }}
                                        />
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        Lebih dari cukup!
                                      </p>
                                    </div>
                                  </div>

                                  {/* Feature badge */}
                                  <div
                                    className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full text-white"
                                    style={{ backgroundColor: secondaryColor }}
                                  >
                                    Premium
                                  </div>
                                </motion.div>
                              ))}
                          </div>

                          {/* Info banner */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            viewport={{ once: true }}
                            className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50"
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: mainColor }}
                              >
                                <Infinity className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-black text-gray-900 mb-2">
                                  Sistem Koin Blueprint yang Berbeda
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                  <span
                                    className="font-bold"
                                    style={{ color: mainColor }}
                                  >
                                    Gak kayak platform lain
                                  </span>{' '}
                                  yang perhitungan koinnya pelit. Di sini kamu
                                  bisa belajar sepuasnya tanpa khawatir koin
                                  habis!
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </TabsContent>

                {/* Course Tab - Chapter & SubChapter */}
                <TabsContent
                  value="course"
                  className="space-y-8"
                >
                  {plan.PlanSubscription?.PlanFeature.find(
                    (feature) => feature.type === 'COURSE',
                  ) && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                        <CardHeader className="pb-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                          >
                            <Badge
                              className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit"
                              style={{ backgroundColor: mainColor }}
                            >
                              <BookOpen className="w-4 h-4" />
                              Struktur Pembelajaran
                            </Badge>
                            <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                              Materi{' '}
                              <span
                                className="bg-clip-text text-transparent"
                                style={{
                                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                terstruktur
                              </span>{' '}
                              untuk hasil optimal
                            </CardTitle>
                            <CardDescription className="text-xl text-gray-600 leading-relaxed">
                              <span
                                className="font-bold"
                                style={{ color: mainColor }}
                              >
                                Sistem pembelajaran berjenjang
                              </span>{' '}
                              dari dasar hingga mahir. Setiap chapter dirancang
                              khusus dengan subchapter yang mendalam.
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {plan.PlanSubscription.PlanFeature.find(
                              (feature) => feature.type === 'COURSE',
                            )?.Pivot_Plan_Category.map(
                              (pivot, categoryIndex) => (
                                <motion.div
                                  key={pivot.id}
                                  initial={{ opacity: 0, y: 30 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.6,
                                    delay: categoryIndex * 0.1,
                                  }}
                                  viewport={{ once: true }}
                                  className="group p-6 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                                >
                                  {/* Background decoration */}
                                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-y-8 translate-x-8 opacity-50" />

                                  <div className="relative">
                                    {/* Category Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                      <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg"
                                        style={{
                                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                        }}
                                      >
                                        {pivot.Category.nomor}
                                      </div>
                                      <div className="flex-1">
                                        <h3 className="text-2xl font-black text-gray-900 mb-1">
                                          {pivot.Category.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                          Kategori #{pivot.Category.nomor} •{' '}
                                          <span
                                            className="font-bold"
                                            style={{ color: secondaryColor }}
                                          >
                                            Akses Premium
                                          </span>
                                        </p>
                                      </div>
                                      <Badge
                                        className="text-white border-none"
                                        style={{
                                          backgroundColor: secondaryColor,
                                        }}
                                      >
                                        <Crown className="w-3 h-3 mr-1" />
                                        Premium
                                      </Badge>
                                    </div>

                                    {/* Chapters Preview */}
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-2 mb-4">
                                        <div
                                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                                          style={{ backgroundColor: mainColor }}
                                        >
                                          <Play className="w-3 h-3 text-white" />
                                        </div>
                                        <h4 className="font-bold text-gray-800">
                                          Chapter & Subchapter
                                        </h4>
                                      </div>

                                      {/* Sample Chapter Structure */}
                                      <div className="space-y-3 bg-white/60 p-4 rounded-2xl border border-white/50">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 hover:bg-white transition-all duration-200">
                                          <div
                                            className="w-8 h-8 rounded-lg text-white text-xs flex items-center justify-center font-bold"
                                            style={{
                                              backgroundColor: mainColor,
                                            }}
                                          >
                                            1
                                          </div>
                                          <div className="flex-1">
                                            <span className="text-gray-900 font-semibold text-sm">
                                              Pengenalan {pivot.Category.name}
                                            </span>
                                            <div className="text-xs text-gray-500 mt-1">
                                              Chapter dasar dan fundamental
                                            </div>
                                          </div>
                                          <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>

                                        <div className="pl-6 space-y-2">
                                          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/80">
                                            <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">
                                              1.1
                                            </div>
                                            <span className="text-gray-700 text-sm">
                                              Konsep Dasar
                                            </span>
                                            <div className="text-xs text-gray-500 ml-auto flex items-center gap-1">
                                              <Clock className="w-3 h-3" />
                                              15 menit
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/80">
                                            <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">
                                              1.2
                                            </div>
                                            <span className="text-gray-700 text-sm">
                                              Teori dan Aplikasi
                                            </span>
                                            <div className="text-xs text-gray-500 ml-auto flex items-center gap-1">
                                              <Clock className="w-3 h-3" />
                                              25 menit
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/80">
                                            <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 text-xs flex items-center justify-center font-bold">
                                              1.3
                                            </div>
                                            <span className="text-gray-700 text-sm">
                                              Latihan Soal
                                            </span>
                                            <div className="text-xs text-gray-500 ml-auto flex items-center gap-1">
                                              <FileText className="w-3 h-3" />
                                              Tryout
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/80 hover:bg-white transition-all duration-200">
                                          <div
                                            className="w-8 h-8 rounded-lg text-white text-xs flex items-center justify-center font-bold"
                                            style={{
                                              backgroundColor: mainColor,
                                            }}
                                          >
                                            2
                                          </div>
                                          <div className="flex-1">
                                            <span className="text-gray-900 font-semibold text-sm">
                                              Lanjutan {pivot.Category.name}
                                            </span>
                                            <div className="text-xs text-gray-500 mt-1">
                                              Chapter intermediate
                                            </div>
                                          </div>
                                          <ChevronRight className="w-4 h-4 text-gray-400" />
                                        </div>

                                        <div className="text-center py-3">
                                          <span className="text-xs text-gray-500 font-semibold">
                                            + Banyak chapter & subchapter
                                            lainnya
                                          </span>
                                        </div>
                                      </div>

                                      {/* Category Features */}
                                      <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200">
                                          <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center">
                                            <Video className="w-3 h-3 text-white" />
                                          </div>
                                          <span className="text-green-700 text-xs font-semibold">
                                            Video Pembelajaran
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 border border-purple-200">
                                          <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center">
                                            <FileText className="w-3 h-3 text-white" />
                                          </div>
                                          <span className="text-purple-700 text-xs font-semibold">
                                            Materi & Dokumen
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-200">
                                          <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center">
                                            <Target className="w-3 h-3 text-white" />
                                          </div>
                                          <span className="text-orange-700 text-xs font-semibold">
                                            Latihan Tryout
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200">
                                          <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center">
                                            <CheckCircle className="w-3 h-3 text-white" />
                                          </div>
                                          <span className="text-blue-700 text-xs font-semibold">
                                            Progress Tracking
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Category Stats */}
                                    <div className="mt-6 p-4 rounded-2xl bg-white/60 border border-white/50">
                                      <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                          <div
                                            className="text-xl font-black"
                                            style={{ color: mainColor }}
                                          >
                                            12+
                                          </div>
                                          <div className="text-xs text-gray-600 font-semibold">
                                            Chapter
                                          </div>
                                        </div>
                                        <div>
                                          <div
                                            className="text-xl font-black"
                                            style={{ color: secondaryColor }}
                                          >
                                            48+
                                          </div>
                                          <div className="text-xs text-gray-600 font-semibold">
                                            Subchapter
                                          </div>
                                        </div>
                                        <div>
                                          <div
                                            className="text-xl font-black"
                                            style={{ color: mainColor }}
                                          >
                                            ∞
                                          </div>
                                          <div className="text-xs text-gray-600 font-semibold">
                                            Akses
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Category badge */}
                                  <div
                                    className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full text-white"
                                    style={{ backgroundColor: secondaryColor }}
                                  >
                                    #{pivot.Category.nomor}
                                  </div>
                                </motion.div>
                              ),
                            )}

                            {/* Info banner */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.8 }}
                              viewport={{ once: true }}
                              className="p-6 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50"
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: mainColor }}
                                >
                                  <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-black text-gray-900 mb-2 text-lg">
                                    Pembelajaran Sistematis & Terstruktur
                                  </h4>
                                  <p className="text-gray-600 leading-relaxed">
                                    <span
                                      className="font-bold"
                                      style={{ color: mainColor }}
                                    >
                                      Setiap kategori
                                    </span>{' '}
                                    memiliki chapter yang disusun bertahap,
                                    dilengkapi subchapter yang detail.{' '}
                                    <span
                                      className="font-bold"
                                      style={{ color: secondaryColor }}
                                    >
                                      Progress tracking otomatis
                                    </span>{' '}
                                    membantu kamu memantau kemajuan belajar
                                    secara real-time!
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </TabsContent>

                {/* Features Tab - SNBT Style */}
                <TabsContent
                  value="features"
                  className="space-y-8"
                >
                  {plan.PlanSubscription?.PlanFeature && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className="space-y-6"
                    >
                      {plan.PlanSubscription.PlanFeature.map(
                        (feature, index) => (
                          <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm overflow-hidden group hover:shadow-2xl transition-all duration-300">
                              <CardHeader
                                className="text-white relative overflow-hidden"
                                style={{
                                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                }}
                              >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-20">
                                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2220%22%20cy%3D%2220%22%20r%3D%222%22/%3E%3C/g%3E%3C/svg%3E')]" />
                                </div>

                                <CardTitle className="flex items-center gap-4 text-xl relative">
                                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                    {getFeatureIcon(feature.type)}
                                  </div>
                                  <div>
                                    <div className="font-black text-2xl capitalize">
                                      {feature.type === 'COURSE' &&
                                        'Materi Kursus Premium'}
                                      {feature.type === 'DOCUMENT' &&
                                        'Bank Dokumen Lengkap'}
                                      {feature.type === 'LIVECLASS' &&
                                        'Live Class Eksklusif'}
                                      {![
                                        'COURSE',
                                        'DOCUMENT',
                                        'LIVECLASS',
                                      ].includes(feature.type) &&
                                        feature.type
                                          .toLowerCase()
                                          .replace('_', ' ')}
                                    </div>
                                    <div className="text-white/80 text-sm font-normal mt-1">
                                      Akses penuh tanpa batas
                                    </div>
                                  </div>
                                  <Badge className="ml-auto bg-white/20 text-white border-none">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Premium
                                  </Badge>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-6">
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {feature.type === 'COURSE' &&
                                    feature.Pivot_Plan_Category.map(
                                      (pivot, pivotIndex) => (
                                        <motion.div
                                          key={pivot.id}
                                          initial={{ opacity: 0, y: 20 }}
                                          whileInView={{ opacity: 1, y: 0 }}
                                          transition={{
                                            duration: 0.4,
                                            delay: pivotIndex * 0.1,
                                          }}
                                          viewport={{ once: true }}
                                          className="group/item p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                                        >
                                          {/* Background decoration */}
                                          <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-transparent rounded-full -translate-y-4 translate-x-4 opacity-50" />

                                          <div className="relative flex items-center gap-3">
                                            <div
                                              className="w-10 h-10 rounded-xl text-white text-sm flex items-center justify-center font-bold shadow-lg shrink-0"
                                              style={{
                                                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                              }}
                                            >
                                              {pivot.Category.nomor}
                                            </div>
                                            <div className="flex-1">
                                              <span className="font-black text-gray-900 group-hover/item:text-blue-600 transition-colors block text-sm leading-tight">
                                                {pivot.Category.name}
                                              </span>
                                              <div className="text-xs text-gray-500 mt-1">
                                                Kategori #{pivot.Category.nomor}
                                              </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-blue-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                                          </div>
                                        </motion.div>
                                      ),
                                    )}

                                  {feature.type === 'DOCUMENT' && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 20 }}
                                      whileInView={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.6 }}
                                      viewport={{ once: true }}
                                      className="group/item col-span-3 p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                                    >
                                      {/* Background decoration */}
                                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -translate-y-8 translate-x-8 opacity-50" />

                                      <div className="relative flex items-center gap-4">
                                        <div
                                          className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg shrink-0"
                                          style={{
                                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                          }}
                                        >
                                          <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                          <span className="font-black text-gray-900 group-hover/item:text-emerald-600 transition-colors text-lg">
                                            Akses ke Semua Dokumen
                                          </span>
                                          <div className="text-gray-600 mt-1">
                                            <span
                                              className="font-bold"
                                              style={{ color: mainColor }}
                                            >
                                              Gak ada yang terkunci!
                                            </span>{' '}
                                            Semua materi, e-book, dan dokumen
                                            pendukung bisa diakses kapan saja.
                                          </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-emerald-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                                      </div>
                                    </motion.div>
                                  )}

                                  {feature.type === 'LIVECLASS' &&
                                    feature.liveClassesPerWeek && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6 }}
                                        viewport={{ once: true }}
                                        className="group/item col-span-3 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                                      >
                                        {/* Background decoration */}
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-transparent rounded-full -translate-y-8 translate-x-8 opacity-50" />

                                        <div className="relative flex items-center gap-4">
                                          <div
                                            className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg shrink-0"
                                            style={{
                                              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                            }}
                                          >
                                            <Play className="w-6 h-6" />
                                          </div>
                                          <div className="flex-1">
                                            <span className="font-black text-gray-900 group-hover/item:text-purple-600 transition-colors text-lg">
                                              {feature.liveClassesPerWeek} Live
                                              Class Per Minggu
                                            </span>
                                            <div className="text-gray-600 mt-1">
                                              <span
                                                className="font-bold"
                                                style={{ color: mainColor }}
                                              >
                                                Interaksi langsung
                                              </span>{' '}
                                              dengan instruktur terbaik. Tanya
                                              jawab real-time & pembahasan
                                              mendalam.
                                            </div>
                                          </div>
                                          <ChevronRight className="w-5 h-5 text-purple-400 group-hover/item:translate-x-1 transition-transform shrink-0" />
                                        </div>
                                      </motion.div>
                                    )}
                                </div>

                                {/* Feature summary */}
                                <motion.div
                                  initial={{ opacity: 0, y: 20 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.6, delay: 0.4 }}
                                  viewport={{ once: true }}
                                  className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200/50"
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                      style={{
                                        backgroundColor: secondaryColor,
                                      }}
                                    >
                                      <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="font-black text-gray-900 text-sm mb-1">
                                        Goal kita jelas: Kamu sukses!
                                      </h4>
                                      <p className="text-gray-600 text-sm leading-relaxed">
                                        <span
                                          className="font-bold"
                                          style={{ color: mainColor }}
                                        >
                                          Semua fitur ini
                                        </span>{' '}
                                        dirancang khusus buat memastikan kamu
                                        bisa meraih target dengan pembelajaran
                                        yang optimal.
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ),
                      )}
                    </motion.div>
                  )}
                </TabsContent>

                {/* Live Classes Tab - SNBT Style */}
                <TabsContent
                  value="classes"
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                  >
                    {plan.Pivot_LiveClass_Plan.map((pivot, index) => (
                      <motion.div
                        key={pivot.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                          <div className="md:flex">
                            <div className="md:w-1/3">
                              {pivot.LiveClass.image && (
                                <div className="relative h-48 md:h-full overflow-hidden">
                                  <Image
                                    src={
                                      pivot.LiveClass.image ||
                                      '/placeholder.svg'
                                    }
                                    alt={pivot.LiveClass.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div
                                    className="absolute inset-0 opacity-60"
                                    style={{
                                      background: `linear-gradient(135deg, ${mainColor}40, ${secondaryColor}40)`,
                                    }}
                                  />
                                  <div className="absolute top-4 left-4">
                                    <Badge
                                      className="text-white border-none font-bold"
                                      style={{ backgroundColor: mainColor }}
                                    >
                                      <Play className="w-3 h-3 mr-1" />
                                      Kelas #{index + 1}
                                    </Badge>
                                  </div>
                                  {pivot.LiveClass.isRecord && (
                                    <div className="absolute top-4 right-4">
                                      <Badge className="bg-red-500 text-white border-none font-semibold animate-pulse">
                                        <Video className="w-3 h-3 mr-1" />
                                        LIVE
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="md:w-2/3 p-6">
                              <div className="space-y-6">
                                <div>
                                  <Badge
                                    className="mb-3 px-3 py-1 text-xs font-bold text-white border-none"
                                    style={{ backgroundColor: secondaryColor }}
                                  >
                                    <Crown className="w-3 h-3 mr-1" />
                                    Live Class Eksklusif
                                  </Badge>
                                  <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                                    {pivot.LiveClass.title}
                                  </h3>
                                  <p className="text-gray-600 leading-relaxed">
                                    {pivot.LiveClass.description}
                                  </p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: mainColor }}
                                      >
                                        <Calendar className="w-5 h-5 text-white" />
                                      </div>
                                      <div>
                                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                                          Jadwal
                                        </div>
                                        <div className="font-black text-gray-900">
                                          {formatDate(
                                            pivot.LiveClass.startDate,
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{
                                          backgroundColor: secondaryColor,
                                        }}
                                      >
                                        <Clock className="w-5 h-5 text-white" />
                                      </div>
                                      <div>
                                        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                                          Durasi
                                        </div>
                                        <div className="font-black text-gray-900">
                                          {pivot.LiveClass.duration} menit
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {pivot.LiveClass.maxParticipant && (
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50">
                                      <div className="flex items-center gap-3">
                                        <div
                                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                                          style={{ backgroundColor: mainColor }}
                                        >
                                          <Users className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                                            Kapasitas
                                          </div>
                                          <div className="font-black text-gray-900">
                                            Max {pivot.LiveClass.maxParticipant}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {pivot.LiveClass.isRecord && (
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200/50">
                                      <div className="flex items-center gap-3">
                                        <div
                                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                                          style={{
                                            backgroundColor: secondaryColor,
                                          }}
                                        >
                                          <Video className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                                            Status
                                          </div>
                                          <div className="font-black text-gray-900">
                                            Direkam
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* CTA Button */}
                                <div className="pt-2">
                                  <Link
                                    href={`/${pivot.LiveClass.websiteSubCategoryId}/user/live-class/${pivot.liveClassId}`}
                                    onClick={() => {
                                      window.scrollTo(0, 0);
                                    }}
                                  >
                                    <Button
                                      className="group/btn w-full sm:w-auto text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                      style={{
                                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                      }}
                                    >
                                      <Play className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                                      Ikuti Kelas Live
                                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Bottom highlight */}
                          <div
                            className="h-1"
                            style={{
                              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                            }}
                          />
                        </Card>
                      </motion.div>
                    ))}

                    {/* No classes message */}
                    {plan.Pivot_LiveClass_Plan.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center py-12"
                      >
                        <div
                          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}20, ${secondaryColor}20)`,
                          }}
                        >
                          <Play
                            className="w-10 h-10"
                            style={{ color: mainColor }}
                          />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">
                          Live Class Segera Hadir
                        </h3>
                        <p className="text-gray-600 text-lg">
                          <span
                            className="font-bold"
                            style={{ color: mainColor }}
                          >
                            Tunggu update dari kita!
                          </span>{' '}
                          Kelas live eksklusif akan segera tersedia untuk
                          membermu.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </TabsContent>

                {/* Limits Tab - SNBT Style */}
                <TabsContent value="limits">
                  {plan.PlanLimitation && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                        <CardHeader className="pb-6">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                          >
                            <Badge
                              className="mb-4 px-4 py-2 text-sm font-semibold text-white border-none flex items-center gap-2 w-fit"
                              style={{ backgroundColor: mainColor }}
                            >
                              <Infinity className="w-4 h-4" />
                              Koin Detail
                            </Badge>
                            <CardTitle className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                              Detail sistem{' '}
                              <span
                                className="bg-clip-text text-transparent"
                                style={{
                                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                koin
                              </span>{' '}
                              per fitur
                            </CardTitle>
                            <CardDescription className="text-xl text-gray-600 leading-relaxed">
                              <span
                                className="font-bold"
                                style={{ color: mainColor }}
                              >
                                Breakdown lengkap
                              </span>{' '}
                              koin yang tersedia untuk setiap fitur pembelajaran
                              premium.
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {Object.entries(plan.PlanLimitation)
                            .filter(
                              ([key]) =>
                                key !== 'id' &&
                                key !== 'planId' &&
                                key !== 'expireDays',
                            )
                            .map(([key, value], index) => (
                              <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.6,
                                  delay: index * 0.1,
                                }}
                                viewport={{ once: true }}
                                className="group p-6 rounded-3xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-4">
                                    <div
                                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                                      style={{
                                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                      }}
                                    >
                                      {getLimitationIcon(key)}
                                    </div>
                                    <div>
                                      <span className="font-black text-gray-900 text-xl block">
                                        {key === 'chat'
                                          ? 'Chat AI'
                                          : key === 'notes'
                                            ? 'Catatan'
                                            : key === 'vision'
                                              ? 'Vision AI'
                                              : key === 'quiz'
                                                ? 'Kuis'
                                                : key === 'tryout'
                                                  ? 'Tryout'
                                                  : key}
                                      </span>
                                      <div className="text-gray-600 mt-1 font-medium">
                                        {key === 'chat' &&
                                          'Tanya jawab unlimited dengan AI'}
                                        {key === 'notes' &&
                                          'Buat catatan sepuasnya'}
                                        {key === 'vision' &&
                                          'Analisis gambar dengan AI'}
                                        {key === 'quiz' &&
                                          'Latihan soal tanpa batas'}
                                        {key === 'tryout' &&
                                          'Simulasi ujian premium'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div
                                      className="text-4xl font-black mb-1"
                                      style={{ color: mainColor }}
                                    >
                                      {typeof value === 'number'
                                        ? value.toLocaleString()
                                        : value}
                                    </div>
                                    <div className="text-sm text-gray-600 font-semibold">
                                      koin tersedia
                                    </div>
                                  </div>
                                </div>

                                {/* Enhanced Progress Bar */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 font-medium">
                                      Kapasitas
                                    </span>
                                    <span
                                      className="font-bold"
                                      style={{ color: secondaryColor }}
                                    >
                                      {typeof value === 'number' && value > 1000
                                        ? 'Unlimited'
                                        : 'Full Access'}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                      className="h-3 rounded-full relative overflow-hidden"
                                      style={{
                                        background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                                        width:
                                          typeof value === 'number' &&
                                          value > 500
                                            ? '100%'
                                            : '75%',
                                      }}
                                    >
                                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                    </div>
                                  </div>
                                </div>

                                {/* Feature highlight */}
                                <div className="mt-4 p-3 rounded-2xl bg-white/60 border border-white/80">
                                  <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle2
                                      className="w-4 h-4 shrink-0"
                                      style={{ color: secondaryColor }}
                                    />
                                    <span className="text-gray-700 font-medium">
                                      <span
                                        className="font-bold"
                                        style={{ color: mainColor }}
                                      >
                                        Goal kita jelas:
                                      </span>{' '}
                                      Kamu bisa maksimalin fitur ini tanpa worry
                                      soal limit!
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}

                          {/* Summary card */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            viewport={{ once: true }}
                            className="p-6 rounded-3xl border-2 border-dashed border-gray-300 bg-gradient-to-r from-yellow-50 to-orange-50"
                          >
                            <div className="text-center">
                              <div
                                className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4"
                                style={{
                                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                }}
                              >
                                <TrendingUp className="w-8 h-8 text-white" />
                              </div>
                              <h4 className="font-black text-gray-900 text-xl mb-2">
                                Total Value Lebih dari Cukup!
                              </h4>
                              <p className="text-gray-600 leading-relaxed">
                                <span
                                  className="font-bold"
                                  style={{ color: mainColor }}
                                >
                                  Semua angka di atas
                                </span>{' '}
                                dirancang supaya kamu bisa belajar optimal tanpa
                                mikirin batas koin.
                                <span
                                  className="font-bold"
                                  style={{ color: secondaryColor }}
                                >
                                  {' '}
                                  Focus aja sama goalmu!
                                </span>
                              </p>
                            </div>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Compact Sidebar - SNBT Style */}
            <div className="space-y-4">
              {/* Compact Purchase Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                  <div
                    className="p-4 text-white relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <div className="relative">
                      <Badge className="px-3 py-1 bg-white/20 text-white border-none text-xs font-bold mb-3 flex items-center gap-1 w-fit">
                        <Crown className="w-3 h-3" />
                        Blueprint Plan
                      </Badge>

                      <h3 className="text-lg font-bold mb-3 leading-tight">
                        {plan.name}
                      </h3>

                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black">
                            {formatPrice(plan.price)}
                          </span>
                          {plan.originalPrice && (
                            <span className="text-sm text-white/70 line-through">
                              {formatPrice(plan.originalPrice)}
                            </span>
                          )}
                        </div>
                        {discountPercentage > 0 && (
                          <Badge className="bg-red-500 text-white border-0 animate-pulse text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Hemat {discountPercentage}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-4">
                    {/* Compact Plan Details */}
                    <div className="space-y-3">
                      {plan.PlanSubscription && (
                        <div className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                          <span className="text-gray-700 flex items-center gap-2 text-sm font-medium">
                            <div
                              className="w-6 h-6 rounded flex items-center justify-center"
                              style={{ backgroundColor: mainColor }}
                            >
                              <Clock className="w-3 h-3 text-white" />
                            </div>
                            Durasi
                          </span>
                          <span
                            className="font-bold text-sm"
                            style={{ color: mainColor }}
                          >
                            {plan.PlanSubscription.expireDays} hari
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between py-2 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
                        <span className="text-gray-700 flex items-center gap-2 text-sm font-medium">
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{ backgroundColor: mainColor }}
                          >
                            <Video className="w-3 h-3 text-white" />
                          </div>
                          Live Classes
                        </span>
                        <span
                          className="font-bold text-sm"
                          style={{ color: mainColor }}
                        >
                          {plan.Pivot_LiveClass_Plan.length} kelas
                        </span>
                      </div>
                    </div>

                    {/* Compact Action Buttons */}
                    <div className="space-y-2">
                      <DialogPayment plan={plan}>
                        <Button
                          className="w-full py-3 text-sm font-bold rounded-xl text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Mulai Sekarang
                        </Button>
                      </DialogPayment>

                      <Button
                        onClick={handleConsultationClick}
                        variant="outline"
                        className="w-full py-3 text-sm font-semibold rounded-xl border hover:scale-[1.02] transition-all duration-300"
                        style={{
                          borderColor: mainColor,
                          color: mainColor,
                        }}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Konsultasi
                      </Button>
                    </div>

                    {/* Compact Trust Indicators */}
                    <div className="pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div
                            className="text-lg font-bold"
                            style={{ color: mainColor }}
                          >
                            97%
                          </div>
                          <div className="text-xs text-gray-600">Success</div>
                        </div>
                        <div>
                          <div
                            className="text-lg font-bold"
                            style={{ color: mainColor }}
                          >
                            +200
                          </div>
                          <div className="text-xs text-gray-600">Score</div>
                        </div>
                        <div>
                          <div
                            className="text-lg font-bold"
                            style={{ color: mainColor }}
                          >
                            24/7
                          </div>
                          <div className="text-xs text-gray-600">Support</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Dialog */}
      <ConsultationDialog
        isOpen={isConsultationDialogOpen}
        onOpenChange={setIsConsultationDialogOpen}
        title="Wujudkan Impian PTN-mu!"
        description="Pilih langkah pertama untuk memulai journey menuju PTN idaman"
        showStats={true}
      />
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16">
      {/* Hero Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-2xl bg-linear-to-br from-main-default via-[#0077CC] to-[#005599] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

          <CardContent className="relative p-8 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                {/* Status badges skeleton */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Skeleton className="h-8 w-24 bg-white/20" />
                  <Skeleton className="h-8 w-32 bg-white/20" />
                  <Skeleton className="h-8 w-36 bg-white/20" />
                </div>

                {/* Title and description skeleton */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full bg-white/20" />
                    <Skeleton className="h-8 w-3/4 bg-white/20" />
                  </div>
                  <Skeleton className="h-6 w-full bg-white/20" />
                  <Skeleton className="h-6 w-5/6 bg-white/20" />
                </div>

                {/* Pricing skeleton */}
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-baseline gap-3">
                    <Skeleton className="h-12 w-40 bg-white/20" />
                    <Skeleton className="h-6 w-24 bg-white/20" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20 bg-white/20" />
                    <Skeleton className="h-5 w-16 bg-white/20" />
                  </div>
                </div>

                {/* CTA Buttons skeleton */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton className="h-14 w-64 bg-white/20" />
                  <Skeleton className="h-14 w-48 bg-white/20" />
                </div>

                {/* Social proof skeleton */}
                <div className="flex items-center gap-8 pt-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="text-center space-y-2"
                    >
                      <Skeleton className="h-8 w-16 bg-white/20 mx-auto" />
                      <Skeleton className="h-4 w-20 bg-white/20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Hero Image skeleton */}
              <div className="relative">
                <Skeleton className="w-full h-96 rounded-2xl bg-white/20" />
                {/* Floating elements skeleton */}
                <Skeleton className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/20" />
                <Skeleton className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content Area Skeleton */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs Skeleton */}
            <div className="w-full mb-8">
              <div className="grid w-full grid-cols-4 gap-2 bg-white/50 backdrop-blur-sm border border-[#B3D9FF]/50 rounded-lg p-1">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-10 rounded-md"
                  />
                ))}
              </div>
            </div>

            {/* Content Area Skeleton */}
            <div className="space-y-8">
              {/* Benefits Grid Skeleton */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <Skeleton className="h-8 w-64" />
                  </div>
                  <Skeleton className="h-6 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="p-6 rounded-2xl bg-[#E6F3FF] border border-[#B3D9FF]/50"
                      >
                        <div className="flex items-start gap-4">
                          <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                          </div>
                        </div>
                        <Skeleton className="absolute top-4 right-4 w-6 h-4" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Features Overview Skeleton */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <Skeleton className="h-8 w-48" />
                  </div>
                  <Skeleton className="h-6 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-6 rounded-2xl bg-[#E6F3FF] border border-[#B3D9FF]/50"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <Skeleton className="w-12 h-12 rounded-xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          {[1, 2, 3].map((j) => (
                            <div
                              key={j}
                              className="flex items-center gap-2"
                            >
                              <Skeleton className="w-5 h-5 rounded" />
                              <Skeleton className="h-4 w-20" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Live Classes Overview Skeleton */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <Skeleton className="h-8 w-52" />
                  </div>
                  <Skeleton className="h-6 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-[#E6F3FF] border border-[#B3D9FF]/50"
                      >
                        <div className="flex items-start gap-3">
                          <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-full" />
                            <div className="flex items-center gap-4">
                              <Skeleton className="h-4 w-12" />
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-5 w-14 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Skeleton className="h-10 w-48 mx-auto" />
                  </div>
                </CardContent>
              </Card>

              {/* Usage Limits Overview Skeleton */}
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <Skeleton className="h-8 w-44" />
                  </div>
                  <Skeleton className="h-6 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-[#E6F3FF] border border-[#B3D9FF]/50 text-center"
                      >
                        <Skeleton className="w-12 h-12 rounded-xl mx-auto mb-3" />
                        <Skeleton className="h-5 w-16 mx-auto mb-1" />
                        <Skeleton className="h-8 w-12 mx-auto mb-1" />
                        <Skeleton className="h-3 w-12 mx-auto" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Purchase Card Skeleton */}
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="bg-linear-to-r from-main-default to-[#0077CC] p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-32 bg-white/20" />
                  <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <Skeleton className="h-10 w-32 bg-white/20" />
                    <Skeleton className="h-6 w-24 bg-white/20" />
                  </div>
                  <Skeleton className="h-6 w-24 bg-white/20" />
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Plan Details Skeleton */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </div>

                {/* Action Buttons Skeleton */}
                <div className="space-y-3">
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-12" />
                  <Skeleton className="w-full h-10" />
                </div>

                {/* Trust Indicators Skeleton */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="space-y-1"
                      >
                        <Skeleton className="h-6 w-12 mx-auto" />
                        <Skeleton className="h-3 w-10 mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Skeleton */}
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between"
                  >
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const getFeatureIcon = (type: string) => {
  switch (type) {
    case 'LIVECLASS':
      return <Video className="w-5 h-5 text-white" />;
    case 'DOCUMENT':
      return <FileText className="w-5 h-5 text-white" />;
    case 'COURSE':
      return <BookOpen className="w-5 h-5 text-white" />;
    default:
      return <Star className="w-5 h-5 text-white" />;
  }
};

const getLimitationIcon = (type: string) => {
  switch (type) {
    case 'chat':
      return <MessageCircle className="w-5 h-5" />;
    case 'notes':
      return <FileText className="w-5 h-5" />;
    case 'vision':
      return <Eye className="w-5 h-5" />;
    case 'quiz':
      return <Brain className="w-5 h-5" />;
    case 'tryout':
      return <Trophy className="w-5 h-5" />;
    default:
      return <Star className="w-5 h-5" />;
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

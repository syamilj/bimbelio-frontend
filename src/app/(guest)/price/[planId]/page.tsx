'use client';

import { DialogPayment } from '@/components/_shared/other/card-plan/_components/dialog-payment';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { formatDate } from '@/lib/utils';
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
import {
  BookOpen,
  Brain,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Infinity,
  LockOpen,
  MessageCircle,
  Play,
  Share2,
  Shield,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Video,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

type PlanDataType = Plan & {
  PlanBenefit: PlanBenefit[];
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
  //   const plan = mockPlanData;

  const { data: plan, isLoading: planIsLoading } = useGet<PlanDataType>(
    `/plan/getSinglePlan?id=${planId}`,
    {
      useEffectDependencies: [planId],
    },
  );

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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 pt-16">
      {/* Hero Section as Card */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Card className="border-0 shadow-2xl bg-linear-to-br from-main-default via-[#0077CC] to-[#005599] text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fillRule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fillOpacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

          <CardContent className="relative p-8 lg:p-16">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                {/* Status badges */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-4 py-2 text-sm font-medium">
                    <Zap className="w-4 h-4 mr-2" />
                    {plan.PlanSubscription?.tier || 'PREMIUM'}
                  </Badge>
                  {discountPercentage > 0 && (
                    <Badge className="bg-linear-to-r from-red-500 to-pink-500 text-white border-0 px-4 py-2 text-sm font-medium animate-pulse">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Hemat {discountPercentage}%
                    </Badge>
                  )}
                  <Badge className="bg-green-500/20 backdrop-blur-sm text-green-100 border-green-400/30 px-4 py-2 text-sm font-medium">
                    <Shield className="w-4 h-4 mr-2" />
                    Garansi 30 Hari
                  </Badge>
                </div>

                {/* Title and description */}
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-white">
                    {plan.name}
                    <span className="block text-xl lg:text-2xl font-normal text-blue-100 mt-2">
                      Raih PTN Impianmu
                    </span>
                  </h1>

                  <p className="text-lg text-blue-100 leading-relaxed max-w-2xl">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl lg:text-4xl font-bold text-white">
                      {formatPrice(plan.price)}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-lg text-blue-200 line-through">
                        {formatPrice(plan.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="text-blue-100">
                    <div className="text-sm">Berlaku selama</div>
                    <div className="font-semibold">
                      {plan.PlanSubscription?.expireDays || 365} hari
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <DialogPayment plan={plan}>
                    <Button
                      size="lg"
                      className="bg-white text-main-default hover:bg-[#E6F3FF] shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 text-lg font-semibold"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Beli Sekarang
                    </Button>
                  </DialogPayment>
                </div>

                {/* Social proof */}
                <div className="flex items-center gap-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">15,000+</div>
                    <div className="text-sm text-blue-200">Siswa Aktif</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">4.9/5</div>
                    <div className="text-sm text-blue-200">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">95%</div>
                    <div className="text-sm text-blue-200">Lulus PTN</div>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm">
                  {plan.image && (
                    <Image
                      src={plan.image || '/placeholder.svg'}
                      alt={plan.name}
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-2xl"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent rounded-2xl" />
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white/20 backdrop-blur-sm rounded-full p-4 text-white">
                  <Star className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-sm rounded-full p-4 text-white">
                  <Trophy className="w-8 h-8" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/50 backdrop-blur-sm border border-[#B3D9FF]/50">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-main-default data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="data-[state=active]:bg-main-default data-[state=active]:text-white"
                >
                  Fitur
                </TabsTrigger>
                <TabsTrigger
                  value="classes"
                  className="data-[state=active]:bg-main-default data-[state=active]:text-white"
                >
                  Live Class
                </TabsTrigger>
                <TabsTrigger
                  value="limits"
                  className="data-[state=active]:bg-main-default data-[state=active]:text-white"
                >
                  Koin
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent
                value="overview"
                className="space-y-8"
              >
                {/* Benefits Grid */}
                {plan.PlanBenefit && plan.PlanBenefit.length > 0 && (
                  <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-3xl text-[#003366] flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-r from-main-default to-[#0077CC] rounded-xl flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        Keunggulan Paket Premium
                      </CardTitle>
                      <CardDescription className="text-lg text-gray-600">
                        Dapatkan akses lengkap ke semua fitur premium untuk
                        memaksimalkan persiapan UTBK
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {plan.PlanBenefit.sort((a, b) => a.order - b.order).map(
                          (benefit, index) => (
                            <div
                              key={benefit.id}
                              className="group relative p-6 rounded-2xl bg-[#E6F3FF] border border-[#B3D9FF]/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                              <div className="flex items-start gap-4">
                                <div className="shrink-0 w-12 h-12 bg-linear-to-r from-main-default to-[#0077CC] rounded-xl flex items-center justify-center shadow-lg">
                                  <Check className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-[#003366] text-lg mb-2">
                                    {benefit.title}
                                  </h3>
                                  <p className="text-[#0077CC] leading-relaxed">
                                    {benefit.description}
                                  </p>
                                </div>
                              </div>
                              <div className="absolute top-4 right-4 text-blue-300 font-bold text-sm">
                                {String(index + 1).padStart(2, '0')}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Features Overview */}
                {plan.PlanSubscription?.PlanFeature && (
                  <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-3xl text-[#003366] flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-r from-main-default to-[#0077CC] rounded-xl flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        Fitur yang Tersedia
                      </CardTitle>
                      <CardDescription className="text-lg text-gray-600">
                        Akses ke berbagai kategori pembelajaran dan fitur
                        premium
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-6">
                        {plan.PlanSubscription.PlanFeature.map((feature) => (
                          <div
                            key={feature.id}
                            className="p-6 rounded-2xl bg-[#E6F3FF] border border-[#B3D9FF]/50 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-linear-to-r from-main-default to-[#0077CC] rounded-xl flex items-center justify-center shadow-lg">
                                {getFeatureIcon(feature.type)}
                              </div>
                              <div>
                                <h3 className="font-bold text-[#003366] text-lg capitalize">
                                  {feature.type.toLowerCase().replace('_', ' ')}
                                </h3>
                                {/* {feature.liveClassesPerWeek && (
                                  <p className="text-sm text-[#0077CC]">
                                    {feature.liveClassesPerWeek} kelas/minggu
                                  </p>
                                )} */}
                              </div>
                            </div>
                            <div className="space-y-2">
                              {feature.type === 'COURSE' &&
                                feature.Pivot_Plan_Category.map((pivot) => (
                                  <div
                                    key={pivot.id}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <div className="w-5 h-5 bg-linear-to-r from-main-default to-[#0077CC] rounded text-white text-xs flex items-center justify-center font-bold">
                                      {pivot.Category.nomor}
                                    </div>
                                    <span className="text-[#003366] font-medium">
                                      {pivot.Category.name}
                                    </span>
                                  </div>
                                ))}
                              {feature.type === 'DOCUMENT' && (
                                <div className="flex gap-2 text-sm">
                                  <div className="w-5 h-5 bg-linear-to-r from-main-default to-[#0077CC] rounded text-white text-xs flex items-center justify-center font-bold shrink-0">
                                    <LockOpen className="w-3 h-3" />
                                  </div>
                                  <span className="text-[#003366] font-medium">
                                    Terbuka Untuk Semua Document
                                  </span>
                                </div>
                              )}
                              {feature.type === 'LIVECLASS' &&
                                feature.liveClassesPerWeek && (
                                  <div className="flex gap-2 text-sm">
                                    <div className="w-5 h-5 bg-linear-to-r from-main-default to-[#0077CC] rounded text-white text-xs flex items-center justify-center font-bold shrink-0">
                                      <BookOpen className="w-3 h-3" />
                                    </div>
                                    <span className="text-[#003366] font-medium">
                                      {feature.liveClassesPerWeek} kelas/minggu
                                    </span>
                                  </div>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Live Classes Overview */}
                {plan.Pivot_LiveClass_Plan &&
                  plan.Pivot_LiveClass_Plan.length > 0 && (
                    <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                      <CardHeader className="pb-6">
                        <CardTitle className="text-3xl text-[#003366] flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-r from-main-default to-[#0077CC] rounded-xl flex items-center justify-center">
                            <Video className="w-5 h-5 text-white" />
                          </div>
                          Live Class Terjadwal
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600">
                          {plan.Pivot_LiveClass_Plan.length} kelas langsung
                          dengan instruktur berpengalaman
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          {plan.Pivot_LiveClass_Plan.slice(0, 4).map(
                            (pivot, index) => (
                              <div
                                key={pivot.id}
                                className="p-4 rounded-xl bg-[#E6F3FF] border border-[#B3D9FF]/50 hover:shadow-md transition-all duration-300"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 bg-linear-to-r from-main-default to-[#0077CC] rounded-lg flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-[#003366] mb-1">
                                      {pivot.LiveClass.title}
                                    </h4>
                                    <div className="flex items-center gap-4 text-xs text-[#0077CC]">
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {pivot.LiveClass.duration}m
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {pivot.LiveClass.maxParticipant ||
                                          'Unlimited'}
                                      </span>
                                      {pivot.LiveClass.isRecord && (
                                        <Badge
                                          variant="secondary"
                                          className="bg-green-100 text-green-700 text-xs"
                                        >
                                          Direkam
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                        {plan.Pivot_LiveClass_Plan.length > 4 && (
                          <div className="mt-4 text-center">
                            <Button
                              variant="outline"
                              className="border-main-default text-main-default hover:bg-[#E6F3FF] bg-transparent"
                              onClick={() => setActiveTab('classes')}
                            >
                              Lihat Semua {plan.Pivot_LiveClass_Plan.length}{' '}
                              Kelas
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                {/* Usage Limits Overview */}
                {plan.PlanLimitation && (
                  <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-3xl text-[#003366] flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-r from-main-default to-[#0077CC] rounded-xl flex items-center justify-center">
                          <Infinity className="w-5 h-5 text-white" />
                        </div>
                        Koin
                      </CardTitle>
                      <CardDescription className="text-lg text-gray-600">
                        Batas penggunaan fitur dalam paket ini
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(plan.PlanLimitation)
                          .filter(
                            ([key]) =>
                              key !== 'id' &&
                              key !== 'planId' &&
                              key !== 'expireDays',
                          )
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="p-4 rounded-xl bg-[#E6F3FF] border border-[#B3D9FF]/50 text-center hover:shadow-md transition-all duration-300"
                            >
                              <div className="w-12 h-12 bg-linear-to-r from-main-default to-[#0077CC] rounded-xl flex items-center justify-center text-white mx-auto mb-3">
                                {getLimitationIcon(key)}
                              </div>
                              <h4 className="font-bold text-[#003366] mb-1">
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
                              <div className="text-2xl font-bold text-main-default mb-1">
                                {typeof value === 'number'
                                  ? value.toLocaleString()
                                  : value}
                              </div>
                              <div className="text-xs text-gray-500">
                                tersedia
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Features Tab */}
              <TabsContent
                value="features"
                className="space-y-8"
              >
                {plan.PlanSubscription?.PlanFeature && (
                  <div className="space-y-6">
                    {plan.PlanSubscription.PlanFeature.map((feature, index) => (
                      <Card
                        key={feature.id}
                        className="border-0 shadow-xl bg-white/70 backdrop-blur-sm overflow-hidden"
                      >
                        <CardHeader className="bg-linear-to-r from-main-default to-[#0077CC] text-white">
                          <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              {getFeatureIcon(feature.type)}
                            </div>
                            <div>
                              <div className="capitalize">
                                {feature.type.toLowerCase().replace('_', ' ')}
                              </div>
                              {/* {feature.liveClassesPerWeek && (
                                <div className="text-sm text-blue-100 font-normal">
                                  {feature.liveClassesPerWeek} kelas per minggu
                                </div>
                              )} */}
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {feature.type === 'COURSE' &&
                              feature.Pivot_Plan_Category.map((pivot) => (
                                <div
                                  key={pivot.id}
                                  className="group flex items-center gap-3 p-4 bg-[#E6F3FF] border border-[#B3D9FF]/50 hover:shadow-md transition-all duration-300"
                                >
                                  <div className="w-8 h-8 bg-linear-to-r from-main-default to-[#0077CC] rounded-lg text-white text-sm flex items-center justify-center font-bold shadow-lg">
                                    {pivot.Category.nomor}
                                  </div>
                                  <span className="font-semibold text-[#003366] group-hover:text-[#0077CC] transition-colors">
                                    {pivot.Category.name}
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-blue-400 ml-auto group-hover:translate-x-1 transition-transform" />
                                </div>
                              ))}

                            {feature.type === 'DOCUMENT' && (
                              <div className="group col-span-3 flex items-center gap-3 p-4 bg-[#E6F3FF] border border-[#B3D9FF]/50 hover:shadow-md transition-all duration-300">
                                <div className="w-8 h-8 bg-linear-to-r from-main-default to-[#0077CC] rounded-lg text-white text-sm flex items-center justify-center font-bold shadow-lg shrink-0">
                                  <BookOpen className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-[#003366] group-hover:text-[#0077CC] transition-colors">
                                  Terbuka untuk semua document
                                </span>
                                <ChevronRight className="w-4 h-4 text-blue-400 ml-auto group-hover:translate-x-1 transition-transform" />
                              </div>
                            )}
                            {feature.type === 'LIVECLASS' &&
                              feature.liveClassesPerWeek && (
                                <div className="group col-span-3 flex items-center gap-3 p-4 bg-[#E6F3FF] border border-[#B3D9FF]/50 hover:shadow-md transition-all duration-300">
                                  <div className="w-8 h-8 bg-linear-to-r from-main-default to-[#0077CC] rounded-lg text-white text-sm flex items-center justify-center font-bold shadow-lg shrink-0">
                                    <Play className="w-5 h-5" />
                                  </div>
                                  <span className="font-semibold text-[#003366] group-hover:text-[#0077CC] transition-colors">
                                    {feature.liveClassesPerWeek} kelas per
                                    minggu
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-blue-400 ml-auto group-hover:translate-x-1 transition-transform" />
                                </div>
                              )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Live Classes Tab */}
              <TabsContent
                value="classes"
                className="space-y-6"
              >
                {plan.Pivot_LiveClass_Plan.map((pivot, index) => (
                  <Card
                    key={pivot.id}
                    className="border-0 shadow-xl bg-white/70 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        {pivot.LiveClass.image && (
                          <div className="relative h-48 md:h-full">
                            <Image
                              src={pivot.LiveClass.image || '/placeholder.svg'}
                              alt={pivot.LiveClass.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-main-default text-white">
                                Kelas #{index + 1}
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-bold text-[#003366] mb-2 group-hover:text-[#0077CC] transition-colors">
                              {pivot.LiveClass.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {pivot.LiveClass.description}
                            </p>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2 text-main-default">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {formatDate(pivot.LiveClass.startDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-main-default">
                              <Clock className="w-4 h-4" />
                              <span>{pivot.LiveClass.duration} menit</span>
                            </div>
                            {pivot.LiveClass.maxParticipant && (
                              <div className="flex items-center gap-2 text-main-default">
                                <Users className="w-4 h-4" />
                                <span>
                                  Max {pivot.LiveClass.maxParticipant} peserta
                                </span>
                              </div>
                            )}
                            {pivot.LiveClass.isRecord && (
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-700"
                                >
                                  <Video className="w-3 h-3 mr-1" />
                                  Direkam
                                </Badge>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3 pt-2">
                            <Link
                              href={`/${pivot.LiveClass.websiteSubCategoryId}/user/live-class/${pivot.liveClassId}`}
                              onClick={() => {
                                window.scrollTo(0, 0);
                              }}
                            >
                              <Button
                                size="sm"
                                className="bg-main-default hover:bg-[#0077CC]"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Lihat Kelas
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Limits Tab */}
              <TabsContent value="limits">
                {plan.PlanLimitation && (
                  <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-2xl text-[#003366] flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-r from-main-default to-[#0077CC] rounded-xl flex items-center justify-center">
                          <Infinity className="w-5 h-5 text-white" />
                        </div>
                        Koin
                      </CardTitle>
                      <CardDescription className="text-lg">
                        Batas penggunaan fitur dalam paket ini
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {Object.entries(plan.PlanLimitation)
                        .filter(
                          ([key]) =>
                            key !== 'id' &&
                            key !== 'planId' &&
                            key !== 'expireDays',
                        )
                        .map(([key, value]) => (
                          <div
                            key={key}
                            className="space-y-3"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-linear-to-r from-main-default to-[#0077CC] rounded-lg flex items-center justify-center text-white">
                                  {getLimitationIcon(key)}
                                </div>
                                <div>
                                  <span className="font-semibold text-[#003366] text-lg">
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
                                  <div className="text-sm text-gray-500">
                                    {key === 'chat' && 'Tanya jawab dengan AI'}
                                    {key === 'notes' && 'Catatan pribadi'}
                                    {key === 'vision' && 'Analisis gambar AI'}
                                    {key === 'quiz' && 'Latihan soal'}
                                    {key === 'tryout' && 'Simulasi ujian'}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-main-default">
                                  {typeof value === 'number'
                                    ? value.toLocaleString()
                                    : value}
                                </div>
                                <div className="text-sm text-gray-500">
                                  tersedia
                                </div>
                              </div>
                            </div>
                            <Progress
                              value={Math.random() * 40 + 20}
                              className="h-3 bg-blue-100"
                            />
                          </div>
                        ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Sticky Purchase Card */}
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
              <div className="bg-linear-to-r from-main-default to-[#0077CC] p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">
                      {formatPrice(plan.price)}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-lg text-blue-200 line-through">
                        {formatPrice(plan.originalPrice)}
                      </span>
                    )}
                  </div>
                  {discountPercentage > 0 && (
                    <Badge className="bg-red-500 text-white">
                      Hemat {discountPercentage}%
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Plan Details */}
                <div className="space-y-4">
                  {plan.PlanSubscription && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Durasi Akses
                      </span>
                      <span className="font-bold text-[#003366]">
                        {plan.PlanSubscription.expireDays} hari
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Live Classes
                    </span>
                    <span className="font-bold text-[#003366]">
                      {plan.Pivot_LiveClass_Plan.length} kelas
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Garansi
                    </span>
                    <span className="font-bold text-green-600">30 hari</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <DialogPayment plan={plan}>
                    <Button
                      className="w-full bg-linear-to-r from-main-default to-[#0077CC] hover:from-[#0077CC] hover:to-[#005599] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Beli Sekarang
                    </Button>
                  </DialogPayment>

                  <Button
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-main-default hover:bg-[#E6F3FF] transition-all duration-300"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Bagikan ke Teman
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-main-default">
                        15K+
                      </div>
                      <div className="text-xs text-gray-500">Siswa</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-main-default">
                        4.9★
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-main-default">
                        95%
                      </div>
                      <div className="text-xs text-gray-500">Lulus</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {/* <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#003366] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Statistik Cepat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Materi</span>
                  <span className="font-bold text-[#003366]">500+ Video</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bank Soal</span>
                  <span className="font-bold text-[#003366]">10,000+ Soal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tryout</span>
                  <span className="font-bold text-[#003366]">50 Paket</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sertifikat</span>
                  <span className="font-bold text-green-600">
                    &check; Tersedia
                  </span>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
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

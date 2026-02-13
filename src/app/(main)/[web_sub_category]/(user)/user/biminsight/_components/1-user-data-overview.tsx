'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import {
  Award,
  Clock,
  Home,
  Mail,
  Phone,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { SectionTitle } from './section-title';

export const UserDataOverview = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const pathname = usePathname();

  const isAdmin = pathname.toLowerCase().includes('/admin/');
  const { mainColor, secondaryColor } = useWebsiteSubCategory();

  const { data: UserData, isLoading: UserDataIsLoading } = useGet<DataType>(
    '/learningAnalytics/getUserData',
    {
      params: {
        userId: id ? id : undefined,
      },
      useEffectDependencies: [id],
    },
  );

  if (UserDataIsLoading) return <LoadingPage />;

  return (
    <div>
      {isAdmin && (
        <SectionTitle
          icon={Users}
          title="Profile Pengguna"
        />
      )}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Main User Card */}
        <div className="lg:col-span-2">
          {isAdmin && (
            <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
              <CardHeader
                className="pb-4 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
                }}
              >
                <div className="relative z-10">
                  <CardTitle
                    className="text-xl font-bold"
                    style={{ color: mainColor }}
                  >
                    {UserData?.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Informasi akun dan target akademik
                  </CardDescription>
                </div>
                <div
                  className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
                  style={{ backgroundColor: mainColor }}
                />
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-3xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Mail
                        className="h-5 w-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-sm">{UserData?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-3xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Phone
                        className="h-5 w-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Telepon</p>
                      <p className="font-semibold text-sm">
                        {UserData?.telp || 'Belum diisi'}
                      </p>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Target Value */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Target Nilai</p>
                  <p
                    className="text-3xl font-bold"
                    style={{ color: mainColor }}
                  >
                    {UserData?.targetValue || '—'}
                  </p>
                </div>

                {/* University Choices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className="p-3 rounded-3xl"
                    style={{ backgroundColor: `${mainColor}08` }}
                  >
                    <p className="text-xs text-gray-500 mb-1">Pilihan 1</p>
                    <p className="font-semibold text-sm">
                      {UserData?.choiceOne?.univ || 'Belum dipilih'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {UserData?.choiceOne?.major || '—'}
                    </p>
                  </div>

                  <div
                    className="p-3 rounded-3xl"
                    style={{ backgroundColor: `${secondaryColor}08` }}
                  >
                    <p className="text-xs text-gray-500 mb-1">Pilihan 2</p>
                    <p className="font-semibold text-sm">
                      {UserData?.choiceTwo?.univ || 'Belum dipilih'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {UserData?.choiceTwo?.major || '—'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isAdmin && (
            <div className="md:col-span-2 bg-white border-2 border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    Selamat Datang Kembali,
                  </p>
                  <h1
                    className="text-3xl md:text-4xl font-black"
                    style={{ color: mainColor }}
                  >
                    {UserData?.name || 'User'}
                  </h1>
                </div>
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center text-white"
                  style={{ backgroundColor: mainColor }}
                >
                  <Home className="w-8 h-8" />
                </div>
              </div>
              <p className="text-gray-600 text-base">
                Pantau kemajuan belajarmu dengan data real-time dan tingkatkan
                persiapan ujianmu
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge className="bg-blue-50 text-blue-700 border border-blue-200 font-medium px-4 py-2">
                  <Zap className="w-3 h-3 mr-2" />
                  Terus Semangat!
                </Badge>
                <Badge className="bg-green-50 text-green-700 border border-green-200 font-medium px-4 py-2">
                  <TrendingUp className="w-3 h-3 mr-2" />
                  Progres Positif
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Subscription Status */}
        <div className="space-y-4">
          {/* Active Programs */}
          <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle
                className="text-lg"
                style={{ color: mainColor }}
              >
                Program Aktif
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {UserData?.program && UserData.program.length > 0 ? (
                UserData.program.map((prog, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-3xl"
                    style={{ backgroundColor: `${mainColor}08` }}
                  >
                    <p className="font-semibold text-sm">{prog.name}</p>
                    <p className="text-xs text-gray-600">
                      Hingga:{' '}
                      {new Date(prog.expire).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Tidak ada program aktif</p>
              )}
            </CardContent>
          </Card>

          {/* Pending Programs */}
          {UserData?.pendingProgram && UserData.pendingProgram.length > 0 && (
            <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-yellow-600">
                  Program Tertunda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {UserData?.pendingProgram.map((prog, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-3xl bg-yellow-50"
                  >
                    <p className="font-semibold text-sm">{prog.name}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 mt-12">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-3xl p-5 text-center">
          <Clock className="w-5 h-5 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-700">
            {UserData?.summaryCount.liveClass || '0'}
          </div>
          <p className="text-xs text-blue-600 font-medium mt-1">
            Live Class Diikuti
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-3xl p-5 text-center">
          <Award className="w-5 h-5 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-700">
            {UserData?.summaryCount.quiz || '0'}
          </div>
          <p className="text-xs text-green-600 font-medium mt-1">
            Quiz Selesai
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-3xl p-5 text-center">
          <Target className="w-5 h-5 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-700">
            {UserData?.summaryCount.tryout || '0'}
          </div>
          <p className="text-xs text-orange-600 font-medium mt-1">
            Try Out Selesai
          </p>
        </div>
      </div>
    </div>
  );
};

const LoadingPage = () => {
  const pathname = usePathname();

  const isAdmin = pathname.toLowerCase().includes('/admin/');
  return (
    <div>
      {isAdmin && (
        <SectionTitle
          icon={Users}
          title="Profile Pengguna"
        />
      )}
      <Skeleton className="w-full h-[400px]" />
    </div>
  );
};

type DataType = {
  name: string;
  email: string;
  telp: string | null;
  program: {
    planId: string | null;
    name: string;
    expire: Date;
  }[];
  pendingProgram: {
    planId: string | null;
    name: string;
  }[];
  targetValue: number | null;
  choiceOne: {
    univ: string | null | undefined;
    major: string | null | undefined;
  };
  choiceTwo: {
    univ: string | null | undefined;
    major: string | null | undefined;
  };
  summaryCount: {
    tryout: number;
    quiz: number;
    liveClass: number;
  };
};

'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGet } from '@/lib/fetch-helper/useGet';
import { formatDateTime } from '@/lib/utils';
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  ClipboardList,
  Users,
  Video,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

type AttendanceReportType = {
  summary: {
    total: number;
    present: number;
    late: number;
    absent: number;
    upcoming: number;
    attendanceRate: number;
  };
  report: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    duration: number;
    instructor: {
      id: string;
      name: string;
      image?: string;
    };
    category: {
      id: string;
      name: string;
    };
    attendanceStatus: 'PRESENT' | 'LATE' | 'ABSENT' | 'UPCOMING';
    checkIn: {
      time: string;
      status: string;
    } | null;
    checkOut: {
      time: string;
      status: string;
    } | null;
    isClassEnded: boolean;
  }[];
};

export default function AttendancePage() {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const {
    data: attendanceData,
    isLoading,
    error,
  } = useGet<AttendanceReportType>('/liveClass/getAttendanceReport', {
    params: { take: 100, page: 1 },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Hadir
          </Badge>
        );
      case 'LATE':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            Terlambat
          </Badge>
        );
      case 'ABSENT':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            Tidak Hadir
          </Badge>
        );
      case 'UPCOMING':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <CalendarCheck className="w-3 h-3 mr-1" />
            Akan Datang
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Terjadi Kesalahan</h3>
            <p className="text-gray-500">Gagal memuat data absensi</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const summary = attendanceData?.summary;
  const report = attendanceData?.report || [];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-6">
        {/* Header */}
        <Card className="bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden mb-8">
          <CardHeader
            className="pb-6 border-b-2 border-gray-100 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${mainColor}08, ${mainColor}15)`,
            }}
          >
            <div className="relative z-10">
              <CardTitle className="text-3xl font-black flex items-center gap-4 text-gray-900">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <ClipboardList
                    className="w-6 h-6"
                    style={{ color: mainColor }}
                  />
                </div>
                Laporan Absensi
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2 text-base">
                Riwayat kehadiran Anda di live class
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {summary.total}
                </div>
                <div className="text-sm text-blue-700 font-medium">
                  Total Kelas
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {summary.present}
                </div>
                <div className="text-sm text-green-700 font-medium">
                  Hadir Tepat Waktu
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {summary.late}
                </div>
                <div className="text-sm text-yellow-700 font-medium">
                  Terlambat
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {summary.absent}
                </div>
                <div className="text-sm text-red-700 font-medium">
                  Tidak Hadir
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {summary.attendanceRate}%
                </div>
                <div className="text-sm text-purple-700 font-medium">
                  Tingkat Kehadiran
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attendance Rate Progress */}
        {summary && summary.total > 0 && (
          <Card className="border-2 border-gray-100 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Progress Kehadiran
                </h3>
                <span
                  className="text-2xl font-bold"
                  style={{ color: mainColor }}
                >
                  {summary.attendanceRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${summary.attendanceRate}%`,
                    backgroundColor: mainColor,
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Anda hadir di {summary.present + summary.late} dari{' '}
                {summary.total} kelas yang sudah selesai
              </p>
            </CardContent>
          </Card>
        )}

        {/* Attendance History */}
        <Card className="border-2 border-gray-100">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className="text-lg font-bold">
              Riwayat Kehadiran
            </CardTitle>
            <CardDescription>
              Daftar semua live class yang pernah Anda ikuti
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {report.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {report.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <Video
                          className="w-6 h-6"
                          style={{ color: mainColor }}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 line-clamp-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {item.instructor?.name || '-'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDateTime(item.startDate)}
                          </span>
                        </div>
                        {item.checkIn && (
                          <div className="text-xs text-gray-400 mt-1">
                            Check-in:{' '}
                            {new Date(item.checkIn.time).toLocaleTimeString(
                              'id-ID',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )}
                            {item.checkOut &&
                              ` • Check-out: ${new Date(item.checkOut.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`}
                          </div>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(item.attendanceStatus)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Belum Ada Riwayat Kehadiran
                </h3>
                <p className="text-gray-500 mb-4">
                  Ikuti live class untuk melihat riwayat kehadiran Anda
                </p>
                <Link
                  href={`/${websiteSubCategory?.id}/user/live-learning`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium"
                  style={{ backgroundColor: mainColor }}
                >
                  <Video className="w-4 h-4" />
                  Lihat Semua Kelas
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

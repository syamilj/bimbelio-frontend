'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import {
  LiveClassAccessTypeEnum,
  LiveClassTypeEnum,
  Plan,
} from '@/types/database';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import ExcelJS from 'exceljs';
import { BookOpen, Download, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { SectionTitle } from './section-title';

export const LiveClassAnalytics = () => {
  const { id } = useParams<{ id: string | undefined }>();

  const { data: session } = useSession();

  const role = session?.user.role;

  const { mainColor, secondaryColor } = useWebsiteSubCategory();

  const [selectedProgramId, setSelectedProgramId] = useState<string>('all');
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);

  const { data: LiveClassData, isLoading: LiveClassDataIsLoading } =
    useGet<DataType>('/learningAnalytics/getUserAnalyticsLiveClass', {
      params: {
        planId: selectedProgramId === 'all' ? undefined : selectedProgramId,
        userId: id ? id : undefined,
      },
      useEffectDependencies: [selectedProgramId, id],
    });

  if (LiveClassDataIsLoading) return <LoadingPage />;

  if (!LiveClassData) return null;

  const handleExportPerProgram = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('BimLive Analytics');

      // Add headers
      worksheet.columns = [
        { header: 'Program', key: 'program', width: 30 },
        { header: 'Status', key: 'status', width: 50 },
      ];

      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: mainColor.replace('#', 'FF') },
      };
      headerRow.alignment = { horizontal: 'center' };

      // Add data rows
      const dataRows: Array<{ program: string; status: string }> = [];

      LiveClassData.ListProgram.forEach((program) => {
        const statusParts = [];
        if (presenceData.present > 0)
          statusParts.push(`Hadir: ${presenceData.present}`);
        if (presenceData.late > 0)
          statusParts.push(`Terlambat: ${presenceData.late}`);
        if (presenceData.absent > 0)
          statusParts.push(`Absen: ${presenceData.absent}`);
        dataRows.push({
          program: program.name.replace(/,/g, '|'),
          status: statusParts.join(', ') || 'No data',
        });
      });

      worksheet.addRows(dataRows);

      // Auto-fit columns
      worksheet.columns.forEach((col) => {
        col.width = col.width || 20;
      });

      // Add border to all cells
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.alignment = {
            horizontal: 'left',
            wrapText: true,
          };
        });
      });

      // Generate file
      const buffer = await workbook.csv.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BimLive-Analytics-Per-Program-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      setShowExportDialog(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleExportPerLiveClass = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('BimLive Analytics');

      // Add headers
      worksheet.columns = [
        { header: 'LiveClass', key: 'liveClass', width: 35 },
        { header: 'Status', key: 'status', width: 50 },
      ];

      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: mainColor.replace('#', 'FF') },
      };
      headerRow.alignment = { horizontal: 'center' };

      // Add data rows from listData
      const dataRows: Array<{ liveClass: string; status: string }> = [];

      listData.forEach((liveClass) => {
        dataRows.push({
          liveClass: liveClass.title.replace(/,/g, '|'),
          status:
            liveClass.presenceStatus === 'ABSENT'
              ? 'Absen'
              : liveClass.presenceStatus === 'PRESENT'
                ? 'Hadir'
                : liveClass.presenceStatus === 'LATE'
                  ? 'Terlambat'
                  : 'No Status',
        });
      });

      worksheet.addRows(dataRows);

      // Auto-fit columns
      worksheet.columns.forEach((col) => {
        col.width = col.width || 20;
      });

      // Add border to all cells
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
          cell.alignment = {
            horizontal: 'left',
            wrapText: true,
          };
        });
      });

      // Generate file
      const buffer = await workbook.csv.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `BimLive-Analytics-Per-LiveClass-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      setShowExportDialog(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const presenceData = LiveClassData.Present;
  const listData = LiveClassData.List;
  const chartData = [
    { name: 'Hadir', value: presenceData.present, color: '#10B981' },
    { name: 'Terlambat', value: presenceData.late, color: '#F59E0B' },
    { name: 'Absen', value: presenceData.absent, color: '#EF4444' },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  console.log({ LiveClassData });

  return (
    <div>
      <SectionTitle
        icon={BookOpen}
        title="BimLive"
      />
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Card Grafik (2 kolom) */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
            <CardHeader
              className="pb-4 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
              }}
            >
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle
                    className="text-xl font-bold flex items-center gap-3"
                    style={{ color: mainColor }}
                  >
                    <div
                      className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Users
                        className="w-5 h-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                    Jumlah Kehadiran Siswa pada BimLive
                  </CardTitle>
                </div>
                <div className="flex justify-between gap-2">
                  <Select
                    value={selectedProgramId}
                    onValueChange={setSelectedProgramId}
                  >
                    <SelectTrigger
                      className="w-full border-2"
                      style={{
                        borderColor: `${mainColor}30`,
                        backgroundColor: `${mainColor}05`,
                      }}
                    >
                      <SelectValue placeholder="Pilih Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Program</SelectItem>
                      {LiveClassData.ListProgram.map((program) => (
                        <SelectItem
                          key={program.id}
                          value={program.id}
                        >
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
                    <button
                      onClick={() => setShowExportDialog(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-3xl font-medium text-white transition-all hover:opacity-90 whitespace-nowrap shrink-0"
                      style={{ backgroundColor: mainColor }}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  )}
                </div>
              </div>
              <div
                className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
                style={{ backgroundColor: mainColor }}
              />
            </CardHeader>

            <CardContent className="p-6">
              <div className="w-full h-80">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} siswa`} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => {
                        const item = chartData.find((d) => d.name === value);
                        return item ? `${item.name}: ${item.value}` : value;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Stats */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: `${mainColor}08` }}
                >
                  <p className="text-xs text-gray-500 mb-1">Total Undangan</p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: mainColor }}
                  >
                    {presenceData.totalInvited}
                  </p>
                </div>
                <div
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: '#D1FAE5' }}
                >
                  <p className="text-xs text-gray-500 mb-1">Hadir</p>
                  <p className="text-2xl font-bold text-green-600">
                    {presenceData.present}
                  </p>
                </div>
                <div
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: '#FEF3C7' }}
                >
                  <p className="text-xs text-gray-500 mb-1">Terlambat</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {presenceData.late}
                  </p>
                </div>
                <div
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: '#FEE2E2' }}
                >
                  <p className="text-xs text-gray-500 mb-1">Absen</p>
                  <p className="text-2xl font-bold text-red-600">
                    {presenceData.absent}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card List Data (1 kolom) */}
        <div>
          <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden h-full">
            <CardHeader
              className="pb-4 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
              }}
            >
              <div className="relative z-10">
                <CardTitle
                  className="text-lg font-bold"
                  style={{ color: mainColor }}
                >
                  Jadwal BimLive
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1 text-xs">
                  Daftar kelas langsung terbaru
                </CardDescription>
              </div>
              <div
                className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
                style={{ backgroundColor: mainColor }}
              />
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {listData && listData.length > 0 ? (
                  listData.map((item) => {
                    const getTypeColor = (type: string) => {
                      switch (type) {
                        case 'LIVECLASS':
                          return { bg: 'bg-blue-100', text: 'text-blue-700' };
                        case 'LIVESTREAM':
                          return {
                            bg: 'bg-purple-100',
                            text: 'text-purple-700',
                          };
                        case 'WEBINAR':
                          return { bg: 'bg-green-100', text: 'text-green-700' };
                        default:
                          return { bg: 'bg-gray-100', text: 'text-gray-700' };
                      }
                    };

                    const getAccessColor = (access: string) => {
                      switch (access) {
                        case 'PREMIUM':
                          return { bg: '#FFD700', text: '#333' };
                        case 'FREE_WITH_REGISTRATION':
                          return { bg: '#90EE90', text: '#333' };
                        case 'FREE_NO_REGISTRATION':
                          return { bg: '#87CEEB', text: '#fff' };
                        default:
                          return { bg: '#808080', text: '#fff' };
                      }
                    };

                    const typeColor = getTypeColor(item.type);
                    const accessColor = getAccessColor(item.accessType);
                    const startDate = new Date(item.startDate);
                    const endDate = new Date(item.endDate);

                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                      >
                        {/* Title */}
                        <p className="font-semibold text-sm text-gray-900 truncate mb-2">
                          {item.title}
                        </p>

                        {/* Type & Access Badges */}
                        <div className="flex gap-2 mb-2 flex-wrap">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColor.bg} ${typeColor.text}`}
                          >
                            {item.type === 'LIVECLASS'
                              ? 'Live Class'
                              : item.type === 'LIVESTREAM'
                                ? 'Live Stream'
                                : 'Webinar'}
                          </span>
                          <span
                            className="text-xs font-semibold px-2 py-1 rounded-full text-white"
                            style={{
                              backgroundColor: accessColor.bg,
                              color: accessColor.text,
                            }}
                          >
                            {item.accessType === 'PREMIUM'
                              ? 'Premium'
                              : item.accessType === 'FREE_WITH_REGISTRATION'
                                ? 'Gratis'
                                : 'Publik'}
                          </span>
                        </div>

                        {/* Date & Time */}
                        <div className="text-xs text-gray-600 mb-2">
                          <p>
                            {format(startDate, 'dd MMM yyyy', {
                              locale: localeId,
                            })}
                          </p>
                          <p className="text-gray-500">
                            {format(startDate, 'HH:mm', { locale: localeId })} -{' '}
                            {format(endDate, 'HH:mm', { locale: localeId })}
                          </p>
                        </div>

                        {/* Duration */}
                        <div className="text-xs text-gray-500 mb-2 pb-2 border-b">
                          Durasi: {Math.round(item.duration / 60)} menit
                        </div>

                        {/* Presence Status */}
                        <p
                          className="text-xs font-semibold px-3 py-2 rounded-full text-white text-center"
                          style={{
                            backgroundColor:
                              item.presenceStatus === 'PRESENT'
                                ? '#10B981'
                                : item.presenceStatus === 'LATE'
                                  ? '#3B82F6'
                                  : item.presenceStatus === 'ABSENT'
                                    ? '#EF4444'
                                    : '#9CA3AF',
                          }}
                        >
                          {item.presenceStatus === 'PRESENT'
                            ? '✓ Hadir'
                            : item.presenceStatus === 'LATE'
                              ? '⏱ Terlambat'
                              : item.presenceStatus === 'ABSENT'
                                ? '✗ Absen'
                                : 'Belum dimulai'}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">Belum ada jadwal</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Pilih Format Export</DialogTitle>
            <DialogDescription>
              Pilih cara Anda ingin mengekspor data analitik BimLive
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleExportPerProgram}
              className="w-full"
              style={{ backgroundColor: mainColor }}
            >
              Export Per Program
            </Button>
            <Button
              onClick={handleExportPerLiveClass}
              className="w-full"
              variant="outline"
            >
              Export Per LiveClass
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const LoadingPage = () => {
  return (
    <div>
      <SectionTitle
        icon={BookOpen}
        title="BimLive"
      />
      <Skeleton className="w-full h-[1200px] md:h-[670px]" />
    </div>
  );
};

type DataType = {
  ListProgram: Plan[];
  Present: {
    totalInvited: number;
    present: number;
    late: number;
    absent: number;
  };
  List: {
    id: string;
    duration: number;
    startDate: Date;
    endDate: Date;
    title: string;
    type: LiveClassTypeEnum;
    accessType: LiveClassAccessTypeEnum;
    presenceStatus: 'ABSENT' | 'PRESENT' | 'LATE';
  }[];
};

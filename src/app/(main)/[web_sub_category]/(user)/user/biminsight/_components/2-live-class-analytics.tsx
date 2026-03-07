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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
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
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Users,
  XCircle,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { SectionTitle } from './section-title';

export const LiveClassAnalytics = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const { data: session } = useSession();
  const role = session?.user.role;
  const { mainColor } = useWebsiteSubCategory();

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
                  : liveClass.presenceStatus === 'UPCOMING'
                    ? 'Akan Datang'
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

  const pieData = [
    { name: 'Hadir', value: presenceData.present, color: '#10B981' },
    { name: 'Terlambat', value: presenceData.late, color: '#F59E0B' },
    { name: 'Absen', value: presenceData.absent, color: '#EF4444' },
  ];

  const attendanceRate =
    presenceData.totalInvited > 0
      ? Math.round(((presenceData.present + presenceData.late) / presenceData.totalInvited) * 100)
      : 0;

  return (
    <div>
      <SectionTitle icon={BookOpen} title="BimLive" description="Riwayat kehadiranmu di kelas langsung" />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Left: Chart card */}
        <div className="lg:col-span-2">
          <Card className="w-full border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-3xl flex items-center justify-center"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black text-slate-800">Rekap Kehadiran</CardTitle>
                    <CardDescription>Distribusi kehadiran per status</CardDescription>
                  </div>
                </div>
                {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
                  <button
                    onClick={() => setShowExportDialog(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                )}
              </div>

              {/* Filter */}
              <div className="mt-3">
                <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
                  <SelectTrigger
                    className="h-9 rounded-full border-2 text-xs"
                    style={{ borderColor: `${mainColor}30`, backgroundColor: `${mainColor}05` }}
                  >
                    <SelectValue placeholder="Pilih Program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Program</SelectItem>
                    {LiveClassData.ListProgram.map((program) => (
                      <SelectItem key={program.id} value={program.id}>{program.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Stat badges */}
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 flex-shrink-0">
                  <Users className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-700">Total: {presenceData.totalInvited}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-700">Hadir: {presenceData.present}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 flex-shrink-0">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-bold text-amber-700">Terlambat: {presenceData.late}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 flex-shrink-0">
                  <XCircle className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] font-bold text-red-600">Absen: {presenceData.absent}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {presenceData.totalInvited === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <BookOpen className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-1">Belum Ada Data Kehadiran</h3>
                  <p className="text-sm text-slate-500">
                    {listData.length > 0
                      ? 'Kelas yang terdaftar belum berlangsung atau belum selesai.'
                      : 'Kamu belum terdaftar di program BimLive manapun'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ChartContainer
                    config={{
                      hadir: { label: 'Hadir', color: '#10B981' },
                      terlambat: { label: 'Terlambat', color: '#F59E0B' },
                      absen: { label: 'Absen', color: '#EF4444' },
                    }}
                    className="h-[260px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={65}
                          dataKey="value"
                          paddingAngle={3}
                          stroke="white"
                          strokeWidth={2}
                          isAnimationActive
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                          <Label
                            content={({ viewBox }) => {
                              const vb = viewBox as { cx?: number; cy?: number };
                              if (!vb?.cx || !vb?.cy) return null;
                              return (
                                <text textAnchor="middle">
                                  <tspan x={vb.cx} y={vb.cy - 6} fontSize={30} fontWeight={900} fill="#1e293b">{attendanceRate}%</tspan>
                                  <tspan x={vb.cx} y={vb.cy + 14} fontSize={11} fontWeight={600} fill="#94a3b8">Kehadiran</tspan>
                                </text>
                              );
                            }}
                          />
                        </Pie>
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              nameKey="name"
                              formatter={(value, name) => (
                                <>
                                  <span className="text-muted-foreground">{name}</span>
                                  <span className="ml-auto font-mono font-bold tabular-nums">{value} sesi</span>
                                </>
                              )}
                            />
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: List card */}
        <div>
          <Card className="w-full border-2 h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-3xl flex items-center justify-center"
                  style={{ backgroundColor: mainColor }}
                >
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-slate-800">Jadwal BimLive</CardTitle>
                  <CardDescription>Daftar kelas langsung terbaru</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {listData && listData.length > 0 ? (
                  listData.map((item) => {
                    const startDate = new Date(item.startDate);
                    const endDate = new Date(item.endDate);
                    const statusStyle =
                      item.presenceStatus === 'PRESENT'
                        ? { bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-700', dot: '#10B981' }
                        : item.presenceStatus === 'LATE'
                          ? { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-700', dot: '#F59E0B' }
                          : item.presenceStatus === 'ABSENT'
                            ? { bg: 'bg-red-50 border-red-100', text: 'text-red-600', dot: '#EF4444' }
                            : item.presenceStatus === 'UPCOMING'
                              ? { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600', dot: '#3B82F6' }
                              : { bg: 'bg-slate-50 border-slate-100', text: 'text-slate-500', dot: '#9CA3AF' };

                    return (
                      <div key={item.id} className={`p-3 rounded-2xl border ${statusStyle.bg} transition-all hover:shadow-sm`}>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-bold text-xs text-slate-800 line-clamp-2 flex-1">{item.title}</p>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusStyle.dot }} />
                            <span className={`text-[10px] font-bold ${statusStyle.text}`}>
                              {item.presenceStatus === 'PRESENT' ? 'Hadir' : item.presenceStatus === 'LATE' ? 'Terlambat' : item.presenceStatus === 'ABSENT' ? 'Absen' : item.presenceStatus === 'UPCOMING' ? 'Akan Datang' : 'Pending'}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {format(startDate, 'dd MMM yyyy', { locale: localeId })} · {format(startDate, 'HH:mm')}–{format(endDate, 'HH:mm')} · {Math.round(item.duration / 60)} mnt
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                      <Calendar className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-600">Belum ada jadwal</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Pilih Format Export</DialogTitle>
            <DialogDescription>Pilih cara Anda ingin mengekspor data analitik BimLive</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button onClick={handleExportPerProgram} className="w-full" style={{ backgroundColor: mainColor }}>
              Export Per Program
            </Button>
            <Button onClick={handleExportPerLiveClass} className="w-full" variant="outline">
              Export Per LiveClass
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const LoadingPage = () => (
  <div>
    <SectionTitle icon={BookOpen} title="BimLive" />
    <Skeleton className="w-full h-[400px] rounded-3xl" />
  </div>
);

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

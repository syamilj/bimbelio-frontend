'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
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
  ChevronDown,
  Clock,
  Download,
  Flame,
  Users,
  XCircle,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Label, LabelList, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { EmptyState, HeroBanner, InsightBanner, SectionLabel, StatPill } from './_primitives';


export const LiveClassAnalytics = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const { data: session } = useSession();
  const role = session?.user.role;
  const { mainColor } = useWebsiteSubCategory();

  const [selectedProgramId, setSelectedProgramId] = useState<string>('all');
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  const [showAllSchedule, setShowAllSchedule] = useState(false);

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
  const weeklyTrend = LiveClassData.WeeklyTrend ?? [];
  const streak = LiveClassData.Streak ?? 0;

  const pieData = [
    { name: 'Hadir', value: presenceData.present, color: '#10B981' },
    { name: 'Terlambat', value: presenceData.late, color: '#F59E0B' },
    { name: 'Absen', value: presenceData.absent, color: '#EF4444' },
  ];

  const attendanceRate =
    presenceData.totalInvited > 0
      ? Math.round(((presenceData.present + presenceData.late) / presenceData.totalInvited) * 100)
      : 0;

  const visibleSchedule = showAllSchedule ? listData : listData.slice(0, 5);

  return (
    <div>
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <HeroBanner color={mainColor}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <SectionLabel title="Rekap Kehadiran" sub="Distribusi kehadiran per status" />
          <div className="flex items-center gap-2">
            <Select value={selectedProgramId} onValueChange={setSelectedProgramId}>
              <SelectTrigger className="h-8 rounded-full border-slate-200 bg-white text-xs text-slate-700 min-w-[140px]">
                <SelectValue placeholder="Pilih Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Program</SelectItem>
                {LiveClassData.ListProgram.map((program) => (
                  <SelectItem key={program.id} value={program.id}>{program.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(role === 'ADMIN' || role === 'SUPER_ADMIN') && (
              <button
                onClick={() => setShowExportDialog(true)}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
              >
                <Download className="h-3 w-3" />
                Export
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatPill label="Total" value={String(presenceData.totalInvited)} sub="sesi" icon={<Users className="h-3 w-3" />} color={mainColor} />
          <StatPill label="Hadir" value={String(presenceData.present)} sub="sesi" icon={<CheckCircle2 className="h-3 w-3" />} color="#10B981" />
          <StatPill label="Terlambat" value={String(presenceData.late)} sub="sesi" icon={<Clock className="h-3 w-3" />} color="#F59E0B" />
          <StatPill label="Absen" value={String(presenceData.absent)} sub="sesi" icon={<XCircle className="h-3 w-3" />} color="#EF4444" />
        </div>
      </HeroBanner>

      {/* Insight */}
      {presenceData.totalInvited > 0 && (
        <InsightBanner
          tone={
            presenceData.present / presenceData.totalInvited >= 0.8
              ? "success"
              : presenceData.present / presenceData.totalInvited >= 0.5
                ? "info"
                : "warning"
          }
        >
          {presenceData.present / presenceData.totalInvited >= 0.8
            ? `Kehadiranmu ${Math.round((presenceData.present / presenceData.totalInvited) * 100)}% — konsistensi yang luar biasa!`
            : presenceData.present / presenceData.totalInvited >= 0.5
              ? `Kehadiranmu ${Math.round((presenceData.present / presenceData.totalInvited) * 100)}% — usahakan hadir lebih rutin.`
              : `Kehadiranmu hanya ${Math.round((presenceData.present / presenceData.totalInvited) * 100)}% — pastikan kamu tidak tertinggal materi.`}
        </InsightBanner>
      )}

      {/* ── Attendance Section ───────────────────────────────────────── */}
      {presenceData.totalInvited === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Belum Ada Data Kehadiran"
          description={
            listData.length > 0
              ? 'Kelas yang terdaftar belum berlangsung atau belum selesai.'
              : 'Kamu belum terdaftar di program BimLive manapun'
          }
        />
      ) : (
        <>
          {/* ── Row 1: Donut + Streak side-by-side ────────────────── */}
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
              <SectionLabel title="Distribusi Kehadiran" />
              <div className="flex flex-col items-center sm:flex-row sm:items-center sm:gap-6">
                <ChartContainer
                  config={{
                    hadir: { label: 'Hadir', color: '#10B981' },
                    terlambat: { label: 'Terlambat', color: '#F59E0B' },
                    absen: { label: 'Absen', color: '#EF4444' },
                  }}
                  className="h-[180px] w-[180px] flex-shrink-0"
                >
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={50}
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
                              <tspan x={vb.cx} y={vb.cy - 4} fontSize={24} fontWeight={900} fill="#1e293b">{attendanceRate}%</tspan>
                              <tspan x={vb.cx} y={vb.cy + 12} fontSize={10} fontWeight={600} fill="#94a3b8">Kehadiran</tspan>
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
                </ChartContainer>

                {/* Legend + summary */}
                <div className="mt-3 flex flex-col gap-2.5 sm:mt-0">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-semibold text-slate-700 w-20">{item.name}</span>
                      <span className="text-sm font-bold tabular-nums text-slate-900">{item.value}</span>
                      <span className="text-xs text-slate-400">sesi</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Streak Card ──────────────────────────────────── */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-3xl" style={{ backgroundColor: `${mainColor}15` }}>
                <Flame className="h-6 w-6" style={{ color: mainColor }} />
              </div>
              <p className="text-3xl font-black text-slate-900 tabular-nums">{streak}</p>
              <p className="text-sm font-bold text-slate-600">Streak Kehadiran</p>
              <p className="mt-1 text-xs text-slate-400">Kelas berturut-turut hadir</p>
            </div>
          </div>

          {/* ── Row 2: Weekly Trend ───────────────────────────────── */}
          {weeklyTrend.length > 0 && (
            <div className="mt-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <SectionLabel title="Tren Kehadiran Mingguan" />
              <p className="mb-3 text-xs text-slate-400">8 minggu terakhir</p>
              <ChartContainer
                config={{
                  hadir: { label: 'Hadir', color: '#10B981' },
                  terlambat: { label: 'Terlambat', color: '#F59E0B' },
                  absen: { label: 'Absen', color: '#EF4444' },
                }}
                className="h-[160px] w-full"
              >
                <BarChart data={weeklyTrend} barGap={1} barCategoryGap="20%">
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={10} tick={{ fill: '#94a3b8' }} />
                  <YAxis tickLine={false} axisLine={false} fontSize={10} tick={{ fill: '#94a3b8' }} allowDecimals={false} width={28} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <>
                            <span className="text-muted-foreground capitalize">{String(name)}</span>
                            <span className="ml-auto font-mono font-bold tabular-nums">{value}</span>
                          </>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="hadir" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]}>
                    <LabelList
                      position="center"
                      className="fill-white font-bold text-[9px]"
                      formatter={(v: unknown) => Number(v) > 0 ? String(v) : ''}
                    />
                  </Bar>
                  <Bar dataKey="terlambat" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]}>
                    <LabelList
                      position="center"
                      className="fill-white font-bold text-[9px]"
                      formatter={(v: unknown) => Number(v) > 0 ? String(v) : ''}
                    />
                  </Bar>
                  <Bar dataKey="absen" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]}>
                    <LabelList
                      position="center"
                      className="fill-white font-bold text-[9px]"
                      formatter={(v: unknown) => Number(v) > 0 ? String(v) : ''}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          )}

          {/* ── Row 3: Schedule List (compact) ───────────────────── */}
          <div className="mt-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <SectionLabel title="Jadwal BimLive" />
            <p className="mb-3 text-xs text-slate-400">Daftar kelas langsung terbaru</p>

            {listData.length > 0 ? (
              <>
                <div className="space-y-2">
                  {visibleSchedule.map((item) => {
                    const startDate = new Date(item.startDate);
                    const endDate = new Date(item.endDate);
                    const statusStyle =
                      item.presenceStatus === 'PRESENT'
                        ? { bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-700', dot: '#10B981', label: 'Hadir' }
                        : item.presenceStatus === 'LATE'
                          ? { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-700', dot: '#F59E0B', label: 'Terlambat' }
                          : item.presenceStatus === 'ABSENT'
                            ? { bg: 'bg-red-50 border-red-100', text: 'text-red-600', dot: '#EF4444', label: 'Absen' }
                            : item.presenceStatus === 'UPCOMING'
                              ? { bg: 'bg-blue-50 border-blue-100', text: 'text-blue-600', dot: '#3B82F6', label: 'Akan Datang' }
                              : { bg: 'bg-slate-50 border-slate-100', text: 'text-slate-500', dot: '#9CA3AF', label: 'Pending' };

                    return (
                      <div key={item.id} className={`flex items-center justify-between gap-3 rounded-3xl border px-3 py-2.5 transition-all hover:shadow-sm ${statusStyle.bg}`}>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{item.title}</p>
                          <p className="text-[10px] text-slate-500">
                            {format(startDate, 'dd MMM yyyy', { locale: localeId })} · {format(startDate, 'HH:mm')}–{format(endDate, 'HH:mm')} · {Math.round(item.duration / 60)} mnt
                          </p>
                        </div>
                        <div className="flex flex-shrink-0 items-center gap-1">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: statusStyle.dot }} />
                          <span className={`text-[10px] font-bold ${statusStyle.text}`}>{statusStyle.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {listData.length > 5 && (
                  <button
                    onClick={() => setShowAllSchedule(!showAllSchedule)}
                    className="mt-3 flex w-full items-center justify-center gap-1 rounded-3xl border border-slate-200 bg-slate-50 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-100"
                  >
                    {showAllSchedule ? 'Tutup' : `Lihat semua (${listData.length})`}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAllSchedule ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <Calendar className="h-5 w-5 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-600">Belum ada jadwal</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Export Dialog ─────────────────────────────────────────────── */}
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
    <Skeleton className="h-[400px] w-full rounded-3xl" />
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
    presenceStatus: 'ABSENT' | 'PRESENT' | 'LATE' | 'UPCOMING';
    checkInAt: Date | null;
  }[];
  WeeklyTrend?: {
    week: string;
    hadir: number;
    terlambat: number;
    absen: number;
  }[];
  Streak?: number;
};

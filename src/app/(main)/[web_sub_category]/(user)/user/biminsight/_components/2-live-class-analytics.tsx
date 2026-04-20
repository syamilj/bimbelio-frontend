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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import {
  EmptyState,
  HeroBanner,
  InsightBanner,
  SectionLabel,
  StatPill,
} from './_primitives';

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
      ? Math.round(
          ((presenceData.present + presenceData.late) /
            presenceData.totalInvited) *
            100,
        )
      : 0;

  const visibleSchedule = showAllSchedule ? listData : listData.slice(0, 5);

  return (
    <div>
      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <HeroBanner>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <SectionLabel
            title="Rekap Kehadiran"
            sub="Distribusi kehadiran per status"
          />
          <div className="flex items-center gap-2">
            <Select
              value={selectedProgramId}
              onValueChange={setSelectedProgramId}
            >
              <SelectTrigger className="h-8 rounded-full border-slate-200 bg-white text-xs text-slate-700 min-w-[140px]">
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
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50"
              >
                <Download className="h-3 w-3" />
                Export
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <StatPill
            label="Total"
            value={String(presenceData.totalInvited)}
            sub="sesi"
            icon={<Users className="h-3 w-3" />}
            color={mainColor}
          />
          <StatPill
            label="Hadir"
            value={String(presenceData.present)}
            sub="sesi"
            icon={<CheckCircle2 className="h-3 w-3" />}
            color="#10B981"
          />
          <StatPill
            label="Terlambat"
            value={String(presenceData.late)}
            sub="sesi"
            icon={<Clock className="h-3 w-3" />}
            color="#F59E0B"
          />
          <StatPill
            label="Absen"
            value={String(presenceData.absent)}
            sub="sesi"
            icon={<XCircle className="h-3 w-3" />}
            color="#EF4444"
          />
        </div>
      </HeroBanner>

      {/* Insight */}
      {presenceData.totalInvited > 0 && (
        <InsightBanner
          tone={
            presenceData.present / presenceData.totalInvited >= 0.8
              ? 'success'
              : presenceData.present / presenceData.totalInvited >= 0.5
                ? 'info'
                : 'warning'
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
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm lg:col-span-2 flex flex-col justify-center">
              <SectionLabel title="Distribusi Kehadiran" />
              <div className="mt-2 flex flex-col items-center sm:flex-row sm:items-center sm:gap-8 sm:justify-around w-full">
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
                      paddingAngle={4}
                      stroke="white"
                      strokeWidth={2}
                      isAnimationActive
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.color}
                        />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          const vb = viewBox as { cx?: number; cy?: number };
                          if (!vb?.cx || !vb?.cy) return null;
                          return (
                            <text textAnchor="middle">
                              <tspan
                                x={vb.cx}
                                y={vb.cy - 2}
                                fontSize={28}
                                fontWeight={900}
                                fill="#1e293b"
                              >
                                {attendanceRate}%
                              </tspan>
                              <tspan
                                x={vb.cx}
                                y={vb.cy + 16}
                                fontSize={11}
                                fontWeight={600}
                                fill="#64748b"
                              >
                                Kehadiran
                              </tspan>
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
                              <span className="text-slate-500 font-medium">
                                {String(name)}
                              </span>
                              <span className="ml-auto font-mono font-bold text-slate-800">
                                {String(value)} sesi
                              </span>
                            </>
                          )}
                        />
                      }
                    />
                  </PieChart>
                </ChartContainer>

                {/* Legend + summary */}
                <div className="mt-4 sm:mt-0 flex flex-col gap-3">
                  {pieData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 bg-slate-50/50 px-4 py-2.5 rounded-2xl border border-slate-100"
                    >
                      <div
                        className="h-3 w-3 rounded-full flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-semibold text-slate-600 w-20">
                        {item.name}
                      </span>
                      <span className="text-base font-bold text-slate-800">
                        {item.value}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        sesi
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Streak Card ──────────────────────────────────── */}
            <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-slate-50/80 border border-slate-100">
                <Flame
                  className="h-7 w-7"
                  style={{ color: mainColor }}
                />
              </div>
              <p className="text-4xl font-black text-slate-800 tabular-nums tracking-tight">
                {streak}
              </p>
              <p className="text-sm font-bold text-slate-600 mt-1">
                Streak Kehadiran
              </p>
              <p className="mt-1.5 text-xs text-slate-400 font-medium">
                Kelas berturut-turut hadir
              </p>
            </div>
          </div>

          {/* ── Row 2: Weekly Trend ───────────────────────────────── */}
          {weeklyTrend.length > 0 && (
            <div className="mt-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
              <SectionLabel title="Tren Kehadiran Mingguan" />
              <p className="mb-5 text-xs font-medium text-slate-500">
                8 minggu terakhir
              </p>
              <ChartContainer
                config={{
                  hadir: { label: 'Hadir', color: '#10B981' },
                  terlambat: { label: 'Terlambat', color: '#F59E0B' },
                  absen: { label: 'Absen', color: '#EF4444' },
                }}
                className="h-[160px] w-full"
              >
                <BarChart
                  data={weeklyTrend}
                  barGap={1}
                  barCategoryGap="20%"
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickMargin={10}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    allowDecimals={false}
                    width={30}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <>
                            <span className="text-slate-500 font-medium capitalize">
                              {String(name)}
                            </span>
                            <span className="ml-auto font-mono font-bold text-slate-800 tabular-nums">
                              {String(value)}
                            </span>
                          </>
                        )}
                      />
                    }
                  />
                  <Bar
                    dataKey="hadir"
                    stackId="a"
                    fill="#10B981"
                    radius={[0, 0, 0, 0]}
                  >
                    <LabelList
                      position="center"
                      className="fill-white font-bold text-[9px]"
                      formatter={(v: unknown) =>
                        Number(v) > 0 ? String(v) : ''
                      }
                    />
                  </Bar>
                  <Bar
                    dataKey="terlambat"
                    stackId="a"
                    fill="#F59E0B"
                    radius={[0, 0, 0, 0]}
                  >
                    <LabelList
                      position="center"
                      className="fill-white font-bold text-[9px]"
                      formatter={(v: unknown) =>
                        Number(v) > 0 ? String(v) : ''
                      }
                    />
                  </Bar>
                  <Bar
                    dataKey="absen"
                    stackId="a"
                    fill="#EF4444"
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      position="center"
                      className="fill-white font-bold text-[9px]"
                      formatter={(v: unknown) =>
                        Number(v) > 0 ? String(v) : ''
                      }
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          )}

          {/* ── Row 3: Schedule List (compact) ───────────────────── */}
          <div className="mt-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <SectionLabel title="Jadwal BimLive" />
            <p className="mb-2 text-xs font-medium text-slate-500">
              Daftar kelas langsung terbaru
            </p>

            {listData.length > 0 ? (
              <>
                <div className="space-y-0 text-sm mt-3">
                  {visibleSchedule.map((item) => {
                    const startDate = new Date(item.startDate);
                    const endDate = new Date(item.endDate);
                    const statusStyle =
                      item.presenceStatus === 'PRESENT'
                        ? {
                            bg: '#ecfdf5',
                            text: 'text-emerald-700',
                            dot: 'bg-emerald-500',
                            label: 'Hadir',
                          }
                        : item.presenceStatus === 'LATE'
                          ? {
                              bg: '#fffbeb',
                              text: 'text-amber-700',
                              dot: 'bg-amber-500',
                              label: 'Terlambat',
                            }
                          : item.presenceStatus === 'ABSENT'
                            ? {
                                bg: '#fef2f2',
                                text: 'text-red-700',
                                dot: 'bg-red-500',
                                label: 'Absen',
                              }
                            : item.presenceStatus === 'UPCOMING'
                              ? {
                                  bg: '#eff6ff',
                                  text: 'text-blue-700',
                                  dot: 'bg-blue-500',
                                  label: 'Akan Datang',
                                }
                              : {
                                  bg: '#f8fafc',
                                  text: 'text-slate-600',
                                  dot: 'bg-slate-400',
                                  label: 'Pending',
                                };

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b border-slate-100 py-3.5 last:border-0 hover:bg-slate-50/50 transition-colors px-2 rounded-xl -mx-2"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-sm font-bold text-slate-800 truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] font-medium text-slate-500 mt-1">
                            {format(startDate, 'dd MMM yyyy', {
                              locale: localeId,
                            })}{' '}
                            <span className="opacity-50 mx-1">•</span>{' '}
                            {format(startDate, 'HH:mm')}–
                            {format(endDate, 'HH:mm')}{' '}
                            <span className="opacity-50 mx-1">•</span>{' '}
                            {Math.round(item.duration / 60)} mnt
                          </p>
                        </div>
                        <div
                          className="flex flex-shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1"
                          style={{ backgroundColor: statusStyle.bg }}
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                          />
                          <span
                            className={`text-[10px] font-bold ${statusStyle.text}`}
                          >
                            {statusStyle.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {listData.length > 5 && (
                  <button
                    onClick={() => setShowAllSchedule(!showAllSchedule)}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                  >
                    {showAllSchedule
                      ? 'Tutup'
                      : `Lihat semua (${listData.length})`}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${showAllSchedule ? 'rotate-180' : ''}`}
                    />
                  </button>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <Calendar className="h-5 w-5 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-600">
                  Belum ada jadwal
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Export Dialog ─────────────────────────────────────────────── */}
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

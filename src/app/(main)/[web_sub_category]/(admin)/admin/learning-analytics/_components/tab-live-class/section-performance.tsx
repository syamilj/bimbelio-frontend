'use client';

import { Download, Search, Users } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// import AbsoluteLoader from '@/components/ui/loading/absolute-loader';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import { getDate, getDateStringShort } from '@/lib/utils';
import { LiveClassAccessTypeEnum, LiveClassTypeEnum } from '@/types/database';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import ExcelJS from 'exceljs';
import { useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export const SectionPerformance = () => {
  const { mainColor, secondaryColor } = useWebsiteSubCategory();

  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nama');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedLiveClass, setSelectedLiveClass] = useState<string>('all');

  const { data: LiveClassData, isLoading: LiveClassDataIsLoading } =
    useGet<DataType>('/learningAnalytics/getAnalyticsLiveClass', {
      debounceTime: 300,
      params: {
        from: startDate,
        to: endDate,
      },
      useEffectDependencies: [startDate, endDate],
    });

  if (LiveClassDataIsLoading) {
    return (
      <div>
        <Skeleton className="w-full h-[1200px] md:h-[670px]" />
        <Skeleton className="w-full h-[800px] mt-6" />
      </div>
    );
  }

  if (!LiveClassData) return null;

  const presenceData = LiveClassData.summary.absence;
  const listData = LiveClassData.summary.list;
  const chartData = [
    { name: 'Hadir', value: presenceData.present, color: '#10B981' },
    { name: 'Terlambat', value: presenceData.late, color: '#F59E0B' },
    { name: 'Absen', value: presenceData.absent, color: '#EF4444' },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  const listUsers = LiveClassData.detail.listUser;
  const listLiveClass = LiveClassData.detail.listLiveClass;

  const filteredListLiveClass = listLiveClass.filter((liveClass) => {
    if (selectedLiveClass === 'all') return true;
    return liveClass.id === selectedLiveClass;
  });

  // Filter users based on search term
  const filteredListUsers = listUsers
    .filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.User.name.toLowerCase().includes(searchLower) ||
        user.User.email.toLowerCase().includes(searchLower) ||
        user.User.phone?.includes(searchTerm) ||
        false
      );
    })
    .sort((a, b) => {
      if (sortBy === 'nama') {
        const comparison = a.User.name.localeCompare(b.User.name);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else if (sortBy === 'email') {
        const comparison = a.User.email.localeCompare(b.User.email);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else if (sortBy === 'kehadiran') {
        const aPresent = a.LiveClass.filter(
          (lc) => lc.presenceStatus === 'PRESENT',
        ).length;
        const bPresent = b.LiveClass.filter(
          (lc) => lc.presenceStatus === 'PRESENT',
        ).length;
        const comparison = aPresent - bPresent;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      return 0;
    });

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Daftar Kehadiran');

      // Create header columns
      const headers = [
        'No',
        'Nama',
        'Email',
        'Telp',
        'Subscription',
        ...filteredListLiveClass.map(
          (lc) => `${getDate(lc.startDate)} - ${lc.title}`,
        ),
      ];
      worksheet.columns = headers.map((header) => ({
        header,
        key: header,
      }));

      // Add data rows
      filteredListUsers.forEach((user, index) => {
        const row: Record<string, any> = {
          No: index + 1,
          Nama: user.User.name,
          Email: user.User.email,
          Telp: user.User.phone || '-',
          Subscription: user.User.Subscription.map((sub) => sub.planName).join(
            ', ',
          ),
        };

        // Add presence status for each live class
        filteredListLiveClass.forEach((liveClass) => {
          const userLiveClass = user.LiveClass.find(
            (lc) => lc.id === liveClass.id,
          );
          const status = userLiveClass?.presenceStatus || null;
          const statusLabel =
            status === 'PRESENT'
              ? 'Hadir'
              : status === 'LATE'
                ? 'Terlambat'
                : status === 'ABSENT'
                  ? 'Absen'
                  : '-';
          row[`${getDate(liveClass.startDate)} - ${liveClass.title}`] =
            statusLabel;
        });

        worksheet.addRow(row);
      });

      // Generate file
      const buffer = await workbook.csv.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Kehadiran-Analytics-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      setIsExporting(false);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };
  return (
    <div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
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
                    Statistik Kehadiran pada BimLive
                  </CardTitle>
                </div>
                <div className="flex w-full justify-end">
                  <DateRangePicker
                    initialDateFrom={startDate}
                    initialDateTo={endDate}
                    onUpdate={(value) => {
                      console.log({ value });
                      if (value.range.from) {
                        setStartDate(value.range.from);
                      }
                      if (value.range.to) {
                        setEndDate(value.range.to);
                      }
                    }}
                    className="w-fit border-2"
                    style={{
                      borderColor: `${mainColor}30`,
                      backgroundColor: `${mainColor}05`,
                    }}
                  />
                </div>
                {/* <div className="flex justify-between gap-2">
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
              </div> */}
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
                  className="text-center p-3 rounded-3xl"
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
                  className="text-center p-3 rounded-3xl"
                  style={{ backgroundColor: '#D1FAE5' }}
                >
                  <p className="text-xs text-gray-500 mb-1">Hadir</p>
                  <p className="text-2xl font-bold text-green-600">
                    {presenceData.present}
                  </p>
                </div>
                <div
                  className="text-center p-3 rounded-3xl"
                  style={{ backgroundColor: '#FEF3C7' }}
                >
                  <p className="text-xs text-gray-500 mb-1">Terlambat</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {presenceData.late}
                  </p>
                </div>
                <div
                  className="text-center p-3 rounded-3xl"
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
                        className="p-3 rounded-3xl border border-gray-200 hover:shadow-md transition-all"
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

                        {/* Presence Statistics */}
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div
                            className="text-center p-2 rounded-3xl text-white font-semibold"
                            style={{ backgroundColor: '#10B981' }}
                          >
                            <p className="text-xs opacity-90">Hadir</p>
                            <p className="text-sm font-bold">
                              {item.absence.present}
                            </p>
                          </div>
                          <div
                            className="text-center p-2 rounded-3xl text-white font-semibold"
                            style={{ backgroundColor: '#F59E0B' }}
                          >
                            <p className="text-xs opacity-90">Terlambat</p>
                            <p className="text-sm font-bold">
                              {item.absence.late}
                            </p>
                          </div>
                          <div
                            className="text-center p-2 rounded-3xl text-white font-semibold"
                            style={{ backgroundColor: '#EF4444' }}
                          >
                            <p className="text-xs opacity-90">Absen</p>
                            <p className="text-sm font-bold">
                              {item.absence.absent}
                            </p>
                          </div>
                        </div>
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

      {/* Detail Table */}
      <div className="mt-6">
        <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
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
                Detail Kehadiran Siswa ({getDateStringShort(startDate)} -{' '}
                {getDateStringShort(endDate)})
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1 text-xs">
                Rincian kehadiran per siswa dan kelas
              </CardDescription>
            </div>
            <div
              className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
              style={{ backgroundColor: mainColor }}
            />
          </CardHeader>

          <CardContent className="p-6">
            <div className="flex items-center w-full mb-4 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari berdasarkan nama, email, atau telp..."
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.startsWith('08')) {
                      setSearchTerm(value.replace('08', '+628'));
                    } else {
                      setSearchTerm(value);
                    }
                  }}
                  className="pl-10 rounded-3xl border-gray-200 focus:border-blue-500"
                />
              </div>
              <Button
                onClick={handleExportData}
                disabled={isExporting}
                className="gap-2"
                style={{ backgroundColor: mainColor }}
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin inline-block">
                      <Download className="w-4 h-4" />
                    </div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export CSV
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center w-full mb-6 gap-6">
              <div className="flex items-center gap-3">
                <p className="font-semibold text-sm text-gray-700 whitespace-nowrap">
                  Urutkan:
                </p>
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-[150px] rounded-3xl border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nama">Nama</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="kehadiran">Jumlah Kehadiran</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortDirection}
                  onValueChange={(value) =>
                    setSortDirection(value as 'asc' | 'desc')
                  }
                >
                  <SelectTrigger className="w-[110px] rounded-3xl border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Urutan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">↑ A-Z</SelectItem>
                    <SelectItem value="desc">↓ Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-gray-300" />
              <div className="flex items-center gap-3">
                <p className="font-semibold text-sm text-gray-700 whitespace-nowrap">
                  Filter:
                </p>
                <Select
                  value={selectedLiveClass}
                  onValueChange={setSelectedLiveClass}
                >
                  <SelectTrigger className="w-[150px] rounded-3xl border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Pilih BimLive" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua BimLive</SelectItem>
                    {listLiveClass.map((liveClass) => (
                      <SelectItem
                        key={liveClass.id}
                        value={liveClass.id}
                      >
                        {liveClass.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="sticky top-0 z-20">
                    <th className="sticky top-0 left-0 z-30 text-left p-3 text-sm font-bold text-gray-700 w-12 bg-white">
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200" />
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gray-200" />
                      No
                    </th>
                    <th className="sticky top-0 left-10 z-30 text-left p-3 text-sm font-bold text-gray-700 min-w-[200px] bg-white">
                      <div className="absolute top-0 right-0 w-[1px] bottom-0 bg-gray-200" />
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200" />
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gray-200" />
                      Nama (Email)
                    </th>
                    <th className="sticky top-0 z-20 text-center text-sm font-bold text-gray-700 min-w-[150px] border-r bg-white p-0">
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200" />
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gray-200" />
                      Subscription
                    </th>
                    {filteredListLiveClass.map((liveClass) => (
                      <th
                        key={liveClass.id}
                        className="sticky top-0 z-20 text-center text-sm font-bold text-gray-700 min-w-[150px] border-r bg-white p-0"
                      >
                        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200" />
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gray-200" />
                        <div className="flex flex-col">
                          <div className="text-xs text-gray-500 border-b p-1">
                            {getDate(liveClass.startDate)}
                          </div>
                          <div className="text-xs p-1 border-b">
                            {liveClass.title}
                          </div>
                          <div className="text-xs text-gray-500 mb-1  p-1">
                            {liveClass.Instructor.name}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredListUsers.map((userItem, index) => {
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case 'PRESENT':
                          return {
                            bg: '#D1FAE5',
                            text: '#065F46',
                            label: 'Hadir',
                          };
                        case 'LATE':
                          return {
                            bg: '#FEF3C7',
                            text: '#92400E',
                            label: 'Terlambat',
                          };
                        case 'ABSENT':
                          return {
                            bg: '#FEE2E2',
                            text: '#7F1D1D',
                            label: 'Absen',
                          };
                        default:
                          return {
                            bg: '#F3F4F6',
                            text: '#6B7280',
                            label: '-',
                          };
                      }
                    };

                    return (
                      <tr
                        key={userItem.User.id}
                        className="border-b hover:bg-gray-50 transition-colors"
                        style={{ borderColor: `${mainColor}10` }}
                      >
                        <td className="sticky left-0 z-10 p-3 text-sm text-gray-600 font-medium bg-white border-b">
                          {index + 1}
                        </td>
                        <td className="sticky left-10 z-10 p-3 text-sm bg-white border-b">
                          <div className="absolute top-0 right-0 w-[1px] bottom-0 bg-gray-200" />
                          <div className="font-semibold text-gray-900">
                            {userItem.User.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {userItem.User.email}
                          </div>
                          {userItem.User.phone && (
                            <div className="text-xs text-gray-500">
                              {userItem.User.phone}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-start border-r border-b text-[10px]">
                          {userItem.User.Subscription.map((sub) => (
                            <p>{sub.planName}</p>
                          ))}
                        </td>
                        {filteredListLiveClass.map((liveClass) => {
                          const userLiveClass = userItem.LiveClass.find(
                            (lc) => lc.id === liveClass.id,
                          );

                          if (!userLiveClass) {
                            return (
                              <td
                                key={liveClass.id}
                                className="p-3 text-center border-r border-b"
                              >
                                -
                              </td>
                            );
                          }
                          const status =
                            userLiveClass.presenceStatus || 'ABSENT';
                          const statusColor = getStatusColor(status);

                          return (
                            <td
                              key={liveClass.id}
                              className="p-3 text-center border-r border-b"
                            >
                              <span
                                className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                  backgroundColor: statusColor.bg,
                                  color: statusColor.text,
                                }}
                              >
                                {statusColor.label}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {(!listUsers ||
              listUsers.length === 0 ||
              filteredListUsers.length === 0) && (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">
                  {filteredListUsers.length === 0 && searchTerm
                    ? 'Tidak ada hasil pencarian'
                    : 'Belum ada data siswa'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

type DataType = {
  detail: {
    listLiveClass: {
      id: string;
      title: string;
      startDate: Date;
      endDate: Date;
      Instructor: {
        id: string;
        email: string;
        name: string;
      };
    }[];
    listUser: {
      User: {
        id: string;
        email: string;
        name: string;
        phone: string | null;
        Subscription: {
          id: string;
          planName: string;
        }[];
      };
      LiveClass: {
        id: string;
        title: string;
        startDate: Date;
        endDate: Date;
        presenceStatus: 'PRESENT' | 'LATE' | 'ABSENT';
        Instructor: {
          id: string;
          email: string;
          name: string;
        };
      }[];
    }[];
  };
  summary: {
    absence: {
      totalInvited: number;
      present: number;
      late: number;
      absent: number;
    };
    list: {
      id: string;
      duration: number;
      startDate: Date;
      endDate: Date;
      title: string;
      type: LiveClassTypeEnum;
      accessType: LiveClassAccessTypeEnum;
      absence: {
        present: number;
        late: number;
        absent: number;
        totalInvited: number;
      };
    }[];
  };
};

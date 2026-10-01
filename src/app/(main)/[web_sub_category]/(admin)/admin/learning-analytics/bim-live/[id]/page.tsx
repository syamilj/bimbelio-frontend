'use client';

import { SectionTitle } from '@/app/(main)/[web_sub_category]/(user)/user/biminsight/_components/section-title';
import { LiveClassType } from '@/app/(main)/[web_sub_category]/(user)/user/bimlive/detail/[classId]/page';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGet } from '@/lib/fetch-helper/useGet';
import { getDateString, getHours } from '@/lib/utils';
import { LiveClassAccessTypeEnum } from '@/types/database';
import ExcelJS from 'exceljs';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  MessageCircle,
  Search,
  Target,
  Users,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function LearningAnalyticsLiveClassAdmin({
  id,
}: {
  id: string;
}) {
  // const { id } = useParams<{ id: string | undefined }>();
  const { mainColor, secondaryColor } = useWebsiteSubCategory();

  const { data: liveClassData, isLoading: isLoading } = useGet<DataType>(
    '/learningAnalytics/getAnalyticsLiveClassById',
    {
      params: {
        id: id ? id : undefined,
      },
      useEffectDependencies: [id],
    },
  );

  if (isLoading) return <LoadingPage />;
  if (!liveClassData) return null;

  const liveClass = liveClassData;

  return (
    <div>
      <SectionTitle
        icon={Target}
        title="BimLive - Analytics"
      />

      {/* Live Class Information Card */}
      <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden mb-6">
        <CardHeader
          className="pb-4 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <div className="relative z-10">
            <CardTitle
              className="text-2xl font-bold"
              style={{ color: mainColor }}
            >
              {liveClass.title}
            </CardTitle>
          </div>
          <div
            className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
            style={{ backgroundColor: mainColor }}
          />
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Start Date */}
            <div className="border border-slate-200 rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar
                  className="w-4 h-4"
                  style={{ color: mainColor }}
                />
                <p className="text-xs font-semibold text-gray-500">
                  Tanggal Kelas
                </p>
              </div>
              <p className="font-medium text-gray-900">
                {getDateString(liveClass.startDate)}
              </p>
              <p className="text-sm text-gray-600">
                {getHours(liveClass.startDate)}
              </p>
            </div>

            {/* Duration */}
            <div className="border border-slate-200 rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock
                  className="w-4 h-4"
                  style={{ color: mainColor }}
                />
                <p className="text-xs font-semibold text-gray-500">
                  Durasi Kelas
                </p>
              </div>
              <p className="font-medium text-gray-900">
                {liveClass.duration} menit
              </p>
              <p className="text-sm text-gray-600">
                Hingga{' '}
                {getHours(
                  new Date(
                    new Date(liveClass.startDate).getTime() +
                      liveClass.duration * 60000,
                  ),
                )}
              </p>
            </div>

            {/* Max Participant */}
            <div className="border border-slate-200 rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users
                  className="w-4 h-4"
                  style={{ color: mainColor }}
                />
                <p className="text-xs font-semibold text-gray-500">Kapasitas</p>
              </div>
              <p className="font-medium text-gray-900">
                {liveClass.maxParticipant || 'Unlimited'}
              </p>
              <p className="text-sm text-gray-600">
                Terdaftar: {liveClass.totalInvited}
              </p>
            </div>

            {/* Access Type */}
            <div className="border border-slate-200 rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target
                  className="w-4 h-4"
                  style={{ color: mainColor }}
                />
                <p className="text-xs font-semibold text-gray-500">
                  Tipe Akses
                </p>
              </div>
              <p className="font-medium text-gray-900 capitalize">
                {liveClass.accessType}
              </p>
              <p className="text-sm text-gray-600">Tipe: Live Training</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User List Section */}
      <UserListSection liveClass={liveClass} />
    </div>
  );
}

const UserListSection = ({ liveClass }: { liveClass: DataType }) => {
  const listUser = liveClass.listUser || [];
  const absence = liveClass.absence;

  const { mainColor } = useWebsiteSubCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [sortColumn, setSortColumn] = useState<
    'name' | 'email' | 'status' | null
  >(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: 'name' | 'email' | 'status') => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to asc
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  let filteredUsers = listUser.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.phone?.includes(searchTerm) ?? false);

    const matchesStatus =
      selectedStatus === 'all' || user.presenceStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Apply sorting
  if (sortColumn) {
    filteredUsers = [...filteredUsers].sort((a, b) => {
      let aValue: string | undefined;
      let bValue: string | undefined;

      switch (sortColumn) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'status':
          aValue = a.presenceStatus;
          bValue = b.presenceStatus;
          break;
      }

      if (!aValue || !bValue) return 0;

      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  const handleExportUsers = async () => {
    try {
      setIsExporting(true);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Daftar Kehadiran');

      // Create header columns
      const headers = ['No', 'Nama', 'Email', 'Telepon', 'Status Kehadiran'];
      worksheet.columns = headers.map((header) => ({
        header,
        key: header,
      }));

      // Add data rows
      filteredUsers.forEach((user, index) => {
        worksheet.addRow({
          No: index + 1,
          Nama: user.name,
          Email: user.email,
          Telepon: user.phone || '-',
          'Status Kehadiran': user.presenceStatus || '-',
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
      link.download = `${liveClass.title} [Kehadiran-${new Date().toISOString().split('T')[0]}].csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      setIsExporting(false);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'PRESENT':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs font-semibold text-green-700">Hadir</span>
          </div>
        );
      case 'LATE':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700">
              Terlambat
            </span>
          </div>
        );
      case 'ABSENT':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-semibold text-red-700">
              Tidak Hadir
            </span>
          </div>
        );
      default:
        return <span className="text-xs text-gray-500">-</span>;
    }
  };

  const chartData = [
    { name: 'Hadir', value: absence.present, color: '#10B981' },
    { name: 'Terlambat', value: absence.late, color: '#F59E0B' },
    { name: 'Absen', value: absence.absent, color: '#EF4444' },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        {/* Absence Summary */}
        <Card className="bg-white shadow-none border-0 rounded-3xl overflow-hidden">
          <CardHeader className="pb-4 relative overflow-hidden px-0">
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
                  Jumlah Kehadiran Siswa pada {liveClass.title}
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-6 px-0 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="w-full h-80 md:col-span-2">
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
            <div className="flex flex-col gap-4 mb-6 shrink-0 md:col-span-1">
              <div className="border border-blue-200 rounded-3xl p-4 bg-blue-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <p className="text-xs font-semibold text-gray-600">Hadir</p>
                </div>
                <p className="font-bold text-2xl text-blue-700">
                  {liveClass.totalInvited}
                </p>
              </div>
              <div className="border border-green-200 rounded-3xl p-4 bg-green-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-xs font-semibold text-gray-600">Hadir</p>
                </div>
                <p className="font-bold text-2xl text-green-700">
                  {absence.present}
                </p>
              </div>
              <div className="border border-yellow-200 rounded-3xl p-4 bg-yellow-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <p className="text-xs font-semibold text-gray-600">
                    Terlambat
                  </p>
                </div>
                <p className="font-bold text-2xl text-yellow-700">
                  {absence.late}
                </p>
              </div>
              <div className="border border-red-200 rounded-3xl p-4 bg-red-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <p className="text-xs font-semibold text-gray-600">
                    Tidak Hadir
                  </p>
                </div>
                <p className="font-bold text-2xl text-red-700">
                  {absence.absent}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Counter */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-3xl">
          <p className="text-sm text-blue-700 font-semibold">
            Total Data:{' '}
            <span className="text-blue-900 font-bold">{listUser.length}</span>{' '}
            user
          </p>
        </div>

        {/* Search, Filter and Export */}
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
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[150px] rounded-3xl border-gray-200 focus:border-blue-500">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="PRESENT">Hadir</SelectItem>
              <SelectItem value="LATE">Terlambat</SelectItem>
              <SelectItem value="ABSENT">Tidak Hadir</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleExportUsers}
            disabled={isExporting}
            className="gap-2"
            style={{ backgroundColor: mainColor }}
          >
            {isExporting ? (
              <>
                <div className="animate-spin inline-block">
                  <Download className="w-4 h-4" />
                </div>
                Mengekspor...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export CSV
              </>
            )}
          </Button>
        </div>

        {/* User Table */}
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: `${mainColor}08` }}>
                <TableHead className="font-bold text-gray-800 py-3">
                  No
                </TableHead>
                <TableHead
                  className="font-bold text-gray-800 py-3 cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    <span>User</span>
                    {sortColumn === 'name' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="w-4 h-4 text-blue-600" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-blue-600" />
                      )
                    ) : (
                      <ArrowDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="font-bold text-gray-800 py-3 cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-2">
                    <span>Email</span>
                    {sortColumn === 'email' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="w-4 h-4 text-blue-600" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-blue-600" />
                      )
                    ) : (
                      <ArrowDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="font-bold text-gray-800 py-3 text-center cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Status</span>
                    {sortColumn === 'status' ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="w-4 h-4 text-blue-600" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-blue-600" />
                      )
                    ) : (
                      <ArrowDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="font-bold text-gray-800 py-3 text-center">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    <p className="text-sm">Belum ada data</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.userId}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900 py-4">
                      {index + 1}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.image || ''}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {user.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 py-4">
                      <p className="truncate text-sm">{user.email}</p>
                      <p className="truncate text-xs text-gray-500">
                        {user.phone}
                      </p>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      {getStatusBadge(user.presenceStatus)}
                    </TableCell>
                    <TableCell className="text-center py-4">
                      {user.phone && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="gap-2 hover:bg-green-100"
                          onClick={() => {
                            window.open(
                              `https://wa.me/${user.phone}`,
                              '_blank',
                            );
                          }}
                        >
                          <MessageCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingPage = () => {
  return (
    <div>
      <SectionTitle
        icon={Target}
        title="BimLive - Analytics"
      />
      <Skeleton className="w-full h-[400px] rounded-3xl mb-6" />
      <Skeleton className="w-full h-[500px] rounded-3xl" />
    </div>
  );
};

type DataType = {
  totalInvited: number;
  id: string;
  title: string;
  categoryId: string;
  description: string;
  image: string | null;
  startDate: Date;
  endDate: Date;
  link: string;
  duration: number;
  maxParticipant: number | null;
  isRecord: boolean;
  averageRating: number;
  type: LiveClassType;
  accessType: LiveClassAccessTypeEnum;
  instructorId: string;
  createdAt: Date;
  updatedAt: Date;
  websiteSubCategoryId: string;
  absence: {
    present: number;
    late: number;
    absent: number;
  };
  listUser: {
    userId: string;
    name: string;
    email: string;
    image: string | null;
    phone: string | null;
    presenceStatus: 'ABSENT' | 'PRESENT' | 'LATE';
  }[];
};

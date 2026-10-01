'use client';

import { SectionTitle } from '@/app/(main)/[web_sub_category]/(user)/user/biminsight/_components/section-title';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { getDateString, getHours } from '@/lib/utils';
import { Tryout, TryoutSession } from '@/types/database';
import ExcelJS from 'exceljs';
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Download,
  MessageCircle,
  Search,
  Target,
  UserCheck,
  Users,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function LearningAnalyticsTryoutAdmin() {
  const { id } = useParams<{ id: string | undefined }>();
  const { mainColor, secondaryColor } = useWebsiteSubCategory();

  const {
    data: TryoutData,
    isLoading: TryoutDataIsLoading,
    // error: TryoutDataError,
  } = useGet<DataType>('/learningAnalytics/getAnalyticsTryoutById', {
    params: {
      id: id ? id : undefined,
    },
    useEffectDependencies: [id],
  });

  console.log({ TryoutData });

  if (TryoutDataIsLoading) return <LoadingPage />;
  if (!TryoutData) return null;

  const tryout = TryoutData.tryout;
  const listResults = TryoutData.listResults;
  const listRegistrations = TryoutData.listRegistrations;

  // Get unique subcategories from listResults
  const allSubCategories = Array.from(
    new Map(
      listResults
        .flatMap((result) => result.subCategories)
        .map((sc) => [sc.id, sc]),
    ).values(),
  );

  return (
    <div>
      <SectionTitle
        icon={Target}
        title="BimArena - Tryout"
      />

      {/* Tryout Information Card */}
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
              {tryout.title}
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
                  Waktu Mulai
                </p>
              </div>
              <p className="font-medium text-gray-900">
                {getDateString(tryout.startDate)}
              </p>
              <p className="text-sm text-gray-600">
                {getHours(tryout.startDate)}
              </p>
            </div>

            {/* End Date */}
            <div className="border border-slate-200 rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar
                  className="w-4 h-4"
                  style={{ color: mainColor }}
                />
                <p className="text-xs font-semibold text-gray-500">
                  Waktu Selesai
                </p>
              </div>
              <p className="font-medium text-gray-900">
                {getDateString(tryout.endDate)}
              </p>
              <p className="text-sm text-gray-600">
                {getHours(tryout.endDate)}
              </p>
            </div>

            {/* Score Distribution Date */}
            <div className="border border-slate-200 rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar
                  className="w-4 h-4"
                  style={{ color: mainColor }}
                />
                <p className="text-xs font-semibold text-gray-500">
                  Pembagian Nilai
                </p>
              </div>
              <p className="font-medium text-gray-900">
                {tryout.resultDate ? getDateString(tryout.resultDate) : 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                {tryout.resultDate ? getHours(tryout.resultDate) : '-'}
              </p>
            </div>

            {/* Participants Summary */}
            <div className="border border-slate-200 rounded-3xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users
                  className="w-4 h-4"
                  style={{ color: mainColor }}
                />
                <p className="text-xs font-semibold text-gray-500">
                  Total Pendaftar
                </p>
              </div>
              <p className="font-medium text-gray-900">
                {tryout.totalRegistrations || 0}
              </p>
              <p className="text-sm text-gray-600">
                Mengerjakan: {tryout.totalParticipants || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Results and Registrations */}
      <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <Tabs defaultValue="results">
            <TabsList
              className="w-fit mb-6 rounded-3xl p-1 h-11 border-0"
              style={{ backgroundColor: `${mainColor}08` }}
            >
              <TabsTrigger value="results">
                <UserCheck className="w-4 h-4 mr-2" />
                User Mengerjakan
              </TabsTrigger>
              <TabsTrigger value="registrations">
                <Users className="w-4 h-4 mr-2" />
                User Mendaftar
              </TabsTrigger>
            </TabsList>

            {/* User Mengerjakan Tab */}
            <UserParticipants
              tryoutTitle={tryout.title}
              allSubCategories={allSubCategories}
              listResults={listResults}
            />

            {/* User Mendaftar Tab */}
            <UserRegistrations
              tryoutTitle={tryout.title}
              listRegistrations={listRegistrations}
            />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

const UserParticipants = ({
  tryoutTitle,
  allSubCategories,
  listResults,
}: {
  tryoutTitle: string;
  allSubCategories: DataType['listResults'][0]['subCategories'];
  listResults: DataType['listResults'];
}) => {
  const { mainColor } = useWebsiteSubCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [sortColumn, setSortColumn] = useState<'name' | 'finalScore' | string>(
    'name',
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: 'name' | 'finalScore' | string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  let filteredResults = listResults.filter((result) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      result.name.toLowerCase().includes(searchLower) ||
      result.email.toLowerCase().includes(searchLower) ||
      (result.phone?.includes(searchTerm) ?? false)
    );
  });

  // Apply sorting
  filteredResults = [...filteredResults].sort((a, b) => {
    let comparison: number;

    if (sortColumn === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortColumn === 'finalScore') {
      comparison = a.totalScore - b.totalScore;
    } else {
      // Sort by subcategory score
      const aSubCat = a.subCategories.find((sc) => sc.id === sortColumn);
      const bSubCat = b.subCategories.find((sc) => sc.id === sortColumn);
      const aScore = aSubCat?.totalScore ?? 0;
      const bScore = bSubCat?.totalScore ?? 0;
      comparison = aScore - bScore;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleExportParticipants = async () => {
    try {
      setIsExporting(true);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('User Mengerjakan');

      // Create header columns
      const headers = ['No', 'Nama', 'Email', 'Telepon', 'Final Score'];
      allSubCategories.forEach((subCat) => {
        headers.push(subCat.name);
      });

      worksheet.columns = headers.map((header) => ({
        header,
        key: header,
      }));

      // Add data rows
      filteredResults.forEach((result, index) => {
        const rowData: any = {
          No: index + 1,
          Nama: result.name,
          Email: result.email,
          Telepon: result.phone || '-',
          'Final Score': result.totalScore.toFixed(2),
        };

        allSubCategories.forEach((subCat) => {
          const subCatData = result.subCategories.find(
            (sc) => sc.id === subCat.id,
          );
          rowData[subCat.name] = subCatData?.totalScore
            ? subCatData.totalScore.toFixed(2)
            : '-';
        });

        worksheet.addRow(rowData);
      });

      // Generate file
      const buffer = await workbook.csv.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${tryoutTitle} [User-Mengerjakan-${new Date().toISOString().split('T')[0]}].csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      setIsExporting(false);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };
  return (
    <TabsContent
      value="results"
      className="mt-0"
    >
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-3xl">
        <p className="text-sm text-blue-700 font-semibold">
          Total Data:{' '}
          <span className="text-blue-900 font-bold">{listResults.length}</span>{' '}
          user
        </p>
      </div>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-3xl">
        <p className="text-sm text-blue-700 mb-2">
          <span className="font-semibold">Keterangan Inisial:</span>
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {allSubCategories.map((subCat) => (
            <div
              key={subCat.id}
              className="text-xs"
            >
              <span className="font-semibold">{subCat.initial}</span> ={' '}
              {subCat.name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center w-full mb-4 gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari berdasarkan nama, email, atau telp..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(() => {
                const value = e.target.value;

                if (value.startsWith('08')) {
                  return value.replace('08', '+628');
                }

                return value;
              })
            }
            className="pl-10 rounded-3xl border-gray-200 focus:border-blue-500"
          />
        </div>
        <Button
          onClick={handleExportParticipants}
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

      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: `${mainColor}08` }}>
              <TableHead className="font-bold text-gray-800 py-3">No</TableHead>
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
                className="font-bold text-gray-800 py-3 text-center cursor-pointer hover:opacity-70 transition-opacity"
                onClick={() => handleSort('finalScore')}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Final Score</span>
                  {sortColumn === 'finalScore' ? (
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
              {allSubCategories.map((subCat) => (
                <TableHead
                  key={subCat.id}
                  className="font-bold text-gray-800 py-3 text-center cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => handleSort(subCat.id)}
                  title={subCat.name}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{subCat.initial}</span>
                    {sortColumn === subCat.id ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="w-3 h-3 text-blue-600" />
                      ) : (
                        <ArrowDown className="w-3 h-3 text-blue-600" />
                      )
                    ) : (
                      <ArrowDown className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="font-bold text-gray-800 py-3 text-center">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3 + allSubCategories.length + 1}
                  className="text-center py-8 text-gray-500"
                >
                  <p className="text-sm">Belum ada data</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredResults.map((result, index) => (
                <TableRow
                  key={result.userId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900 py-4">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={result.image || ''}
                          alt={result.name}
                        />
                        <AvatarFallback>
                          {result.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {result.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {result.email}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {result.phone}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900 py-4 text-center">
                    {result.totalScore.toFixed(2)}
                  </TableCell>
                  {allSubCategories.map((subCat) => {
                    const subCatData = result.subCategories.find(
                      (sc) => sc.id === subCat.id,
                    );
                    const score = subCatData?.totalScore || 0;
                    return (
                      <TableCell
                        key={subCat.id}
                        className="text-center py-4 font-medium text-gray-900"
                      >
                        {typeof score === 'number' ? score.toFixed(2) : '-'}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center py-4">
                    {result.phone && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-2 hover:bg-green-100"
                        onClick={() => {
                          window.open(
                            `https://wa.me/${result.phone}`,
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
    </TabsContent>
  );
};

const UserRegistrations = ({
  tryoutTitle,
  listRegistrations,
}: {
  tryoutTitle: string;
  listRegistrations: DataType['listRegistrations'];
}) => {
  const { mainColor } = useWebsiteSubCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [sortColumn, setSortColumn] = useState<'name' | 'email'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: 'name' | 'email') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  let filteredRegistrations = listRegistrations.filter((registration) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      registration.name.toLowerCase().includes(searchLower) ||
      registration.email.toLowerCase().includes(searchLower) ||
      (registration.phone?.includes(searchTerm) ?? false)
    );
  });

  // Apply sorting
  filteredRegistrations = [...filteredRegistrations].sort((a, b) => {
    let aValue: string;
    let bValue: string;

    if (sortColumn === 'name') {
      aValue = a.name;
      bValue = b.name;
    } else {
      aValue = a.email;
      bValue = b.email;
    }

    const comparison = aValue.localeCompare(bValue);
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleExportRegistrations = async () => {
    try {
      setIsExporting(true);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('User Mendaftar');

      // Create header columns
      const headers = ['No', 'Nama', 'Email', 'Telepon'];
      worksheet.columns = headers.map((header) => ({
        header,
        key: header,
      }));

      // Add data rows
      filteredRegistrations.forEach((registration, index) => {
        worksheet.addRow({
          No: index + 1,
          Nama: registration.name,
          Email: registration.email,
          Telepon: registration.phone || '-',
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
      link.download = `${tryoutTitle} [User-Mendaftar-${new Date().toISOString().split('T')[0]}].csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      setIsExporting(false);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };
  return (
    <TabsContent
      value="registrations"
      className="mt-0"
    >
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-3xl">
        <p className="text-sm text-blue-700 font-semibold">
          Total Data:{' '}
          <span className="text-blue-900 font-bold">
            {listRegistrations.length}
          </span>{' '}
          user
        </p>
      </div>
      <div className="flex items-center w-full mb-4 gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari berdasarkan nama, email, atau telp..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(() => {
                const value = e.target.value;

                if (value.startsWith('08')) {
                  return value.replace('08', '+628');
                }

                return value;
              })
            }
            className="pl-10 rounded-3xl border-gray-200 focus:border-blue-500"
          />
        </div>
        <Button
          onClick={handleExportRegistrations}
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

      <div className="w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: `${mainColor}08` }}>
              <TableHead className="font-bold text-gray-800 py-3">No</TableHead>
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
              <TableHead className="font-bold text-gray-800 py-3 text-center">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  <p className="text-sm">Belum ada data</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredRegistrations.map((registration, index) => (
                <TableRow
                  key={registration.userId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900 py-4">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={registration.image || ''}
                          alt={registration.name}
                        />
                        <AvatarFallback>
                          {registration.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {registration.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 py-4">
                    <p>{registration.email}</p>
                    <p>{registration.phone}</p>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    {registration.phone && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-2 hover:bg-green-100"
                        onClick={() => {
                          window.open(
                            `https://wa.me/${registration.phone}`,
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
    </TabsContent>
  );
};

const LoadingPage = () => {
  return (
    <div>
      <SectionTitle
        icon={Target}
        title="BimArena - Tryout"
      />
      <Skeleton className="w-full h-[400px] rounded-3xl mb-6" />
      <Skeleton className="w-full h-[500px] rounded-3xl" />
    </div>
  );
};

type DataType = {
  tryout: Tryout & {
    TryoutSession: TryoutSession[];
    totalRegistrations: number;
    totalParticipants: number;
  };
  listResults: {
    userId: string;
    name: string;
    email: string;
    image: string | null;
    phone: string | null;
    totalScore: number;
    subCategories: {
      id: string;
      name: string;
      initial: string;
      totalScore: number | undefined;
    }[];
  }[];
  listRegistrations: {
    userId: string;
    name: string;
    email: string;
    image: string | null;
    phone: string | null;
  }[];
};

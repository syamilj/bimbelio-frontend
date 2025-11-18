// src/app/(admin)/admin/user/page.tsx
'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import ListPagination from '@/components/ui/list-pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn, formatSchoolName } from '@/lib/utils';

import { Subscription, UserRoleEnum } from '@/types/database';
import {
  ChevronDown,
  ChevronRight,
  Crown,
  Download,
  Edit,
  Facebook,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe,
  GraduationCap,
  Hash,
  Instagram,
  MessageCircle,
  Search,
  SortAsc,
  SortDesc,
  Users,
} from 'lucide-react';
import { Fragment, ReactNode, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import * as XLSX from 'xlsx';

export default function UserManagementDashboard() {
  const { data: session } = useSession();

  const sessionRole = session?.user?.role;

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<
    undefined | 'ADMIN' | 'SUPER_ADMIN' | 'USER'
  >();
  const [sortOption, setSortOption] = useState<'LATEST' | 'OLDEST'>('LATEST');
  // const [currentPage, setCurrentPage] = useState(1);
  const [expandedProvinces, setExpandedProvinces] = useState<string[]>([]);

  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [isExporting, setIsExporting] = useState<'EXCEL' | 'CSV' | null>(null);

  const [hasSubscription, setHasSubscription] = useState<'HAS' | 'NOT' | 'ALL'>(
    'ALL',
  );

  const { data: usersData, totalPages } = useGet<UserDataType[]>(
    '/user/getAllUsers',
    {
      params: {
        take,
        page,
        role: roleFilter,
        sort: sortOption,
        search: searchTerm,
        hasSubscription:
          hasSubscription !== 'ALL' ? hasSubscription : undefined,
      },
      useEffectDependencies: [
        take,
        page,
        roleFilter,
        sortOption,
        searchTerm,
        hasSubscription,
      ],
    },
  );

  const { data: overviewData } = useGet<OverviewType>('/user/getUserOverview');

  const { data: channelData } = useGet<ChannelDataType[]>(
    '/user/getChannelAnalytics',
  );

  const { data: regionalData } = useGet<RegionalDataType[]>(
    '/user/getRegionalAnalytics',
  );

  // Loading and error handling
  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-full p-6">
  //       <Loader2 className="w-4 h-4 animate-spin" />
  //     </div>
  //   );
  // }

  // if (error) {
  //   return <div className="p-6 text-red-500">Error: {error.message}</div>;
  // }

  const getWhatsAppLink = (phone: string) => {
    // Remove any non-digit characters from the phone number
    const sanitizedPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${sanitizedPhone}?text=Selamat%20datang%20di%20grup%20tryout%20premium%20kami!`;
  };

  const prepareExportData = (users: UserDataType[]) => {
    return users.map((user, index) => ({
      'No.': index + 1,
      Name: user.name,
      Email: user.email,
      School: formatSchoolName(user.UserTryout?.schoolOrigin),
      City: user.UserTryout?.kabupaten || '-',
      Province: user.UserTryout?.provinsi || '-',
      Role: user.Role,
      Status:
        user.Role !== 'USER'
          ? 'Premium'
          : user.TryoutUnlock.length > 0
            ? 'Tryout'
            : 'User',
      // 'Tryout Count':
      //   user.Role === 'PREMIUM'
      //     ? 'Unlimited'
      //     : user.TryoutUnlock.length.toString(),
      Verification: user.UserTryout ? 'Verified' : 'Unverified',
      Phone: user.UserTryout?.phone || '-',
      Channel: user.UserTryout?.channel || '-',
      'Registration Date': new Date(user.createdAt).toLocaleDateString('id-ID'),
    }));
  };

  const exportToExcel = async () => {
    try {
      setIsExporting('EXCEL');

      const response = await getGeneral('/user/getAllUsers');
      const { data } = response!;

      // const data = await response.json();
      const allUsers = data || [];

      const exportData = prepareExportData(allUsers);

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      const colWidths = [
        { wch: 5 }, // No.
        { wch: 25 }, // Name
        { wch: 30 }, // Email
        { wch: 30 }, // School
        { wch: 20 }, // City
        { wch: 20 }, // Province
        { wch: 12 }, // Role
        { wch: 12 }, // Status
        { wch: 12 }, // Tryout Count
        { wch: 12 }, // Verification
        { wch: 15 }, // Phone
        { wch: 15 }, // Channel
        { wch: 15 }, // Registration Date
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Users Data');

      const timestamp = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Bimbelio_Users_Data_${timestamp}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data to Excel');
    } finally {
      setIsExporting(null);
    }
  };

  const exportToCSV = async () => {
    try {
      setIsExporting('CSV');

      // Fetch all users without pagination for export

      const response = await getGeneral('/user/getAllUsers');
      const { data } = response!;
      // const data = await response.json();
      const allUsers = data || [];

      const exportData = prepareExportData(allUsers);

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
      XLSX.utils.book_append_sheet(wb, ws, 'Users Data');

      // Generate CSV
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

      // Create download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().split('T')[0];

      link.setAttribute('href', url);
      link.setAttribute('download', `Bimbelio_Users_Data_${timestamp}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      alert('Failed to export data to CSV');
    } finally {
      setIsExporting(null);
    }
  };

  const chartConfig: ChartConfig = {
    total: { label: 'Total Users', color: 'var(--color-chart-1)' },
    premium: { label: 'Premium Users', color: 'var(--color-chart-2)' },
    tryout: { label: 'Tryout Users', color: 'var(--color-chart-3)' },
  };

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>

      <Tabs
        defaultValue="overview"
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="channel">Channel Analysis</TabsTrigger>
          <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admin</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overviewData?.totalAdmin || '-'}
                </div>
              </CardContent>
            </Card>
            {/* Total Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overviewData?.totalUsers || '-'}
                </div>
              </CardContent>
            </Card>

            {/* Tryout Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Verified Users
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overviewData?.totalVerifiedUsers || '-'}
                </div>
              </CardContent>
            </Card>

            {/* Premium Users */}

            {/* Tryout Users Count */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tryout Premium
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {overviewData?.totalTryoutUnlock || '-'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Trend Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Daily User Registration Trend</CardTitle>
              <CardDescription>
                Daily registrations over the last Week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <LineChart
                    data={overviewData?.registrationTrendData}
                    accessibilityLayer
                    margin={{
                      top: 20,
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      interval={Math.floor(
                        overviewData?.registrationTrendData
                          ? overviewData?.registrationTrendData.length / 30
                          : 0,
                      )} // Menampilkan label setiap 3 hari jika data 30 hari
                      tickFormatter={(value) => value}
                    />
                    <YAxis />
                    <ChartTooltip
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="var(--color-total)"
                      strokeWidth={2}
                      dot={{
                        fill: 'var(--color-total)',
                      }}
                      activeDot={{
                        r: 6,
                      }}
                    >
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-main-gray-text"
                        fontSize={12}
                      />
                    </Line>
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form
              className="flex items-center space-x-2"
              onSubmit={(e) => {
                e.preventDefault();
                const Form = new FormData(e.currentTarget);
                const searchValue = Form.get('searchInput') as string;
                setSearchTerm(searchValue || '');
              }}
            >
              <Input
                name="searchInput"
                placeholder="Search users email..."
                onChange={(e) => {
                  if (e.target.value === '') {
                    setSearchTerm('');
                  }
                }}
                className="max-w-sm"
              />
              <Button
                variant="outline"
                // onClick={() => setSearchTerm('')}
                type="submit"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>

            <div className="flex flex-wrap items-center gap-3">
              {/* Export Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={exportToExcel}
                  disabled={isExporting === 'EXCEL'}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isExporting === 'EXCEL' ? (
                    <>
                      <Download className="mr-2 h-4 w-4 animate-bounce" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export Excel
                    </>
                  )}
                </Button>
                <Button
                  onClick={exportToCSV}
                  disabled={isExporting === 'CSV'}
                  variant="outline"
                  className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-all duration-300"
                >
                  {isExporting === 'CSV' ? (
                    <>
                      <Download className="mr-2 h-4 w-4 animate-bounce" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Export CSV
                    </>
                  )}
                </Button>
              </div>

              {/* Filter and Sort Section */}
              <div className="flex space-x-2">
                {/* Role Filter */}
                <Select
                  value={roleFilter}
                  onValueChange={(value) => {
                    if (value === 'All') {
                      setRoleFilter(undefined);
                    } else {
                      setRoleFilter(value as any);
                    }
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="flex h-10 w-[180px] items-center justify-between rounded-xl border border-gray-300 px-3">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="All Roles" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Roles</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={hasSubscription}
                  onValueChange={(value) => {
                    setHasSubscription(value as any);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="flex h-10 w-[180px] items-center justify-between rounded-xl border border-gray-300 px-3">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="All Roles" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Subscription</SelectItem>
                    <SelectItem value="HAS">Premium Subscription</SelectItem>
                    <SelectItem value="NOT">Free Tier Subscription</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort Option */}
                <Select
                  value={sortOption}
                  onValueChange={(value: any) => setSortOption(value)}
                >
                  <SelectTrigger className="flex h-10 w-[180px] items-center justify-between rounded-xl border border-gray-300 px-3">
                    <div className="flex items-center">
                      {sortOption === 'LATEST' ? (
                        <SortDesc className="mr-2 h-4 w-4 text-muted-foreground" />
                      ) : (
                        <SortAsc className="mr-2 h-4 w-4 text-muted-foreground" />
                      )}
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LATEST">Latest</SelectItem>
                    <SelectItem value="OLDEST">Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-hidden rounded-xl bg-white shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Telp</TableHead>
                  <TableHead>Status</TableHead> {/* Updated */}
                  <TableHead>WhatsApp</TableHead>
                  {sessionRole === 'SUPER_ADMIN' && (
                    <TableHead>Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData?.map((user, uIndex) => (
                  <TableRow key={user.id}>
                    <TableCell>{page * take - take + uIndex + 1}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {formatSchoolName(user.UserTryout?.schoolOrigin)}
                    </TableCell>
                    <TableCell>{user.UserTryout?.kabupaten || '-'}</TableCell>
                    <TableCell>{user.Role}</TableCell>
                    <TableCell>
                      <DialogDetailSubscription subData={user.Subscription}>
                        <Badge
                          variant={
                            user.Subscription.length > 0 ? 'default' : 'outline'
                          }
                          className="cursor-pointer"
                        >
                          {user.Subscription.length > 0
                            ? `${user.Subscription.length} Active`
                            : 'Free Tier'}
                        </Badge>
                      </DialogDetailSubscription>
                    </TableCell>
                    <TableCell>
                      {user.Role === 'PREMIUM'
                        ? 'Unlimited'
                        : user.TryoutUnlock.length}
                    </TableCell>
                    <TableCell>{user.UserTryout?.phone || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.UserTryout ? 'outline' : 'destructive'}
                        className={cn(!user.UserTryout && 'text-white')}
                      >
                        {user.UserTryout ? 'Verified' : 'Unverified'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.UserTryout?.phone && (
                        <a
                          href={getWhatsAppLink(user.UserTryout?.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <MessageCircle className="mr-1 h-4 w-4" />
                          Invite
                        </a>
                      )}
                    </TableCell>
                    {sessionRole === 'SUPER_ADMIN' && (
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ListPagination
              className="px-4"
              onSizeChange={(size) => {
                setTake(size);
              }}
              onPageChange={(page) => {
                setPage(page);
              }}
              currentPage={page}
              totalPage={totalPages}
              pageSize={take}
            />
            {/* <div className="flex items-center justify-between border-t p-4">
              <div>
                Showing {(page - 1) * pageSize + 1} to{' '}
                {Math.min(page * pageSize, filteredUsers.length)} of{' '}
                {filteredUsers.length} users
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div> */}
          </div>
        </TabsContent>

        <TabsContent value="channel">
          <Card>
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>Detailed breakdown by channel</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                {/* Membungkus multiple children dengan React.Fragment */}
                <>
                  <ResponsiveContainer
                    width="100%"
                    height={350}
                  >
                    <BarChart data={channelData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <ChartTooltip
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <Bar
                        dataKey="total"
                        fill="var(--color-total)"
                      />
                      <Bar
                        dataKey="premium"
                        fill="var(--color-premium)"
                      />
                      <Bar
                        dataKey="tryout"
                        fill="var(--color-tryout)"
                      />
                      <LabelList
                        position="top"
                        offset={12}
                        className="fill-main-gray-text"
                        fontSize={12}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <ChartLegend />
                </>
              </ChartContainer>
              <Table className="mt-6">
                <TableHeader>
                  <TableRow>
                    <TableHead>Channel</TableHead>
                    <TableHead>Total Users</TableHead>
                    <TableHead>Premium Users</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channelData?.map((channel) => (
                    <TableRow key={channel.name}>
                      <TableCell className="font-medium">
                        {channel.name === 'Instagram' && (
                          <Instagram className="inline mr-2 h-4 w-4" />
                        )}
                        {channel.name === 'WhatsApp' && (
                          <MessageCircle className="inline mr-2 h-4 w-4" />
                        )}
                        {channel.name === 'Facebook' && (
                          <Facebook className="inline mr-2 h-4 w-4" />
                        )}
                        {channel.name === 'Website' && (
                          <Globe className="inline mr-2 h-4 w-4" />
                        )}
                        {channel.name === 'Other' && (
                          <Hash className="inline mr-2 h-4 w-4" />
                        )}
                        {channel.name}
                      </TableCell>
                      <TableCell>{channel.total}</TableCell>
                      <TableCell>{channel.premium}</TableCell>
                      <TableCell>{channel.tryout}</TableCell>
                      <TableCell>
                        {channel.total > 0
                          ? (
                              ((channel.premium + channel.tryout) /
                                channel.total) *
                              100
                            ).toFixed(1)
                          : '0.0'}
                        %
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional">
          <Card>
            <CardHeader>
              <CardTitle>Provincial Distribution</CardTitle>
              <CardDescription>User distribution by province</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Province</TableHead>
                    <TableHead>Total Users</TableHead>
                    <TableHead>Premium Users</TableHead>
                    <TableHead>Tryout Users</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regionalData?.map((province, index) => (
                    <Fragment key={index}>
                      <TableRow
                        key={province.region}
                        className="cursor-pointer"
                        onClick={() =>
                          setExpandedProvinces((prev) =>
                            prev.includes(province.region)
                              ? prev.filter((p) => p !== province.region)
                              : [...prev, province.region],
                          )
                        }
                      >
                        <TableCell className="font-medium">
                          {expandedProvinces.includes(province.region) ? (
                            <ChevronDown className="inline mr-2 h-4 w-4" />
                          ) : (
                            <ChevronRight className="inline mr-2 h-4 w-4" />
                          )}
                          {province.region}
                        </TableCell>
                        <TableCell>{province.total}</TableCell>
                        <TableCell>{province.premium}</TableCell>
                        <TableCell>{province.tryout}</TableCell>
                        <TableCell>
                          {province.total > 0
                            ? (
                                ((province.premium + province.tryout) /
                                  province.total) *
                                100
                              ).toFixed(1)
                            : '0.0'}
                          %
                        </TableCell>
                      </TableRow>
                      {expandedProvinces.includes(province.region) &&
                        province.cities?.map((city) => (
                          <TableRow
                            key={`${province.region}-${city.name}`}
                            className="bg-muted/50"
                          >
                            <TableCell className="pl-8">{city.name}</TableCell>
                            <TableCell>{city.total}</TableCell>
                            <TableCell>{city.premium}</TableCell>
                            <TableCell>{city.tryout}</TableCell>
                            <TableCell>
                              {city.total > 0
                                ? (
                                    ((city.premium + city.tryout) /
                                      city.total) *
                                    100
                                  ).toFixed(1)
                                : '0.0'}
                              %
                            </TableCell>
                          </TableRow>
                        ))}
                    </Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

type OverviewType = {
  totalUsers: number;
  totalVerifiedUsers: number;
  totalAdmin: number;
  totalTryoutUnlock: number;
  registrationTrendData: {
    name: string;
    total: number;
  }[];
};

type UserDataType = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  Role: UserRoleEnum;
  TryoutUnlock: {
    id: string;
  }[];
  UserTryout: {
    id: string;
    phone: string;
    kabupaten: string;
    provinsi: string;
    channel: string;
    schoolOrigin: string;
  } | null;
  Subscription: Subscription[];
};

type ChannelDataType = {
  total: number;
  premium: number;
  tryout: number;
  name: string;
};

type RegionalDataType = {
  cities: {
    total: number;
    premium: number;
    tryout: number;
    name: string;
  }[];
  total: number;
  premium: number;
  tryout: number;
  region: string;
};

const DialogDetailSubscription = ({
  subData,
  children,
}: {
  subData: Subscription[];
  children: ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-1 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Subscription Details
            </h2>
            <p className="text-sm text-gray-500">
              {subData.length === 0
                ? 'No active subscriptions'
                : `${subData.length} active subscription${subData.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Empty State */}
          {subData.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center">
              <Crown className="mx-auto mb-3 h-8 w-8 text-gray-300" />
              <p className="text-sm font-medium text-gray-500">
                No active subscriptions
              </p>
              <p className="text-xs text-gray-400">
                This user does not have any active subscriptions yet
              </p>
            </div>
          ) : (
            /* Subscriptions List */
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {subData.map((sub, index) => (
                <div
                  key={sub.id}
                  className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="space-y-3">
                    {/* Title Section */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1">
                        <Badge
                          variant="default"
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 shrink-0"
                        >
                          #{index + 1}
                        </Badge>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {sub.planName || 'Unknown Plan'}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {sub.planTier}
                          </p>
                        </div>
                      </div>
                      {/* <Badge
                        variant="default"
                        className={cn(
                          'shrink-0',
                          sub.discord_user_id
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-gray-400 hover:bg-gray-500',
                        )}
                      >
                        {sub.planExpire ? 'Active' : 'Pending'}
                      </Badge> */}
                    </div>

                    {/* Description */}
                    {sub.planDescription && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {sub.planDescription}
                      </p>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {/* Price */}
                      <div className="rounded-lg bg-white/60 p-2.5">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Price
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          Rp {sub.planPrice?.toLocaleString('id-ID') || '-'}
                        </p>
                      </div>

                      {/* Duration */}
                      <div className="rounded-lg bg-white/60 p-2.5">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Expire At
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {sub.planExpire
                            ? new Date(sub.planExpire).toLocaleDateString(
                                'id-ID',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                },
                              )
                            : '-'}
                        </p>
                      </div>

                      {/* Start Date */}
                      <div className="rounded-lg bg-white/60 p-2.5">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Created
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {sub.createdAt
                            ? new Date(sub.createdAt).toLocaleDateString(
                                'id-ID',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                },
                              )
                            : '-'}
                        </p>
                      </div>

                      {/* Discord Status */}
                      <div className="rounded-lg bg-white/60 p-2.5">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Discord
                        </p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {sub.discord_username || 'Not linked'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

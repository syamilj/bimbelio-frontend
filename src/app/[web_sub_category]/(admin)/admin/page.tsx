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
import { useGet } from '@/lib/fetch-helper/useGet';
import { formatSchoolName } from '@/lib/utils';

import { UserRoleEnum } from '@/types/database';
import {
  ChevronDown,
  ChevronRight,
  Crown,
  Edit,
  Facebook,
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
import { Fragment, useState } from 'react';
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

export default function UserManagementDashboard() {
  const { data: session } = useSession();

  const sessionRole = session?.user?.role;

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<
    undefined | 'ADMIN' | 'SUPER_ADMIN' | 'USER'
  >();
  const [sortOption, setSortOption] = useState<'LATEST' | 'OLDEST'>('OLDEST');
  // const [currentPage, setCurrentPage] = useState(1);
  const [expandedProvinces, setExpandedProvinces] = useState<string[]>([]);

  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const { data: usersData, totalPages } = useGet<UserDataType[]>(
    '/user/getAllUsers',
    {
      params: {
        take,
        page,
        role: roleFilter,
        sort: sortOption,
        search: searchTerm,
      },
      useEffectDependencies: [take, page, roleFilter, sortOption, searchTerm],
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
          <div className="mb-6 flex items-center justify-between">
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
            {/* Filter and Sort Section */}
            <div className="flex space-x-4">
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
                  <TableHead>Status</TableHead>
                  <TableHead>Count</TableHead>
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
                      <Badge
                        variant={
                          user.Role !== 'USER'
                            ? 'default'
                            : user.TryoutUnlock.length > 0
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {user.Role !== 'USER'
                          ? 'Premium'
                          : user.TryoutUnlock.length > 0
                            ? 'Tryout'
                            : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.Role === 'PREMIUM'
                        ? 'Unlimited'
                        : user.TryoutUnlock.length}
                    </TableCell>
                    <TableCell>
                      {' '}
                      {/* Updated */}
                      <Badge
                        variant={user.UserTryout ? 'outline' : 'destructive'}
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

// src/app/(admin)/admin/user/page.tsx
'use client';

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

import { formatPhoneNumber, formatSchoolName } from '@/lib/utils';
import { UserRoleEnum } from '@/types/database';
import { eachDayOfInterval, format, subWeeks } from 'date-fns';
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
  Loader2,
  MessageCircle,
  Search,
  SortAsc,
  SortDesc,
  Users,
} from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';
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
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedProvinces, setExpandedProvinces] = useState<string[]>([]);

  const {
    data: usersData,
    isLoading,
    error,
  } = useGet<UserDataType[]>('/user/getAllUsers');

  const { data: channelData } = useGet<ChannelDataType[]>(
    '/user/getChannelAnalytics',
  );

  const { data: regionalData } = useGet<RegionalDataType[]>(
    '/user/getRegionalAnalytics',
  );

  useEffect(() => {
    if (usersData) {
      setUsers(
        usersData.map((user) => ({
          ...user,
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          school: user.UserTryout?.schoolOrigin
            ? formatSchoolName(user.UserTryout.schoolOrigin)
            : '',
          city: user.UserTryout?.kabupaten || '',
          phone: user.UserTryout?.phone
            ? formatPhoneNumber(user.UserTryout.phone)
            : '',
          tryoutCount: user.TryoutUnlock.length,
        })),
      );
    }
  }, [usersData]);

  // Sort and filter users
  const sortedUsers = [...users].sort((a, b) => {
    if (sortOption === 'Latest') {
      return b.createdAt.getTime() - a.createdAt.getTime();
    } else {
      return a.createdAt.getTime() - b.createdAt.getTime();
    }
  });

  const filteredUsers = sortedUsers.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (roleFilter === 'All' || user.Role === roleFilter),
  );

  // Pagination
  const pageSize = 20;
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Verified and user type counts
  const premiumUsers = users.filter((user) => user.Role === 'PREMIUM').length;
  const tryoutUsers = users.filter((user) => user.UserTryout !== null).length;
  const tryoutUsersCount = users.filter((user) => user.tryoutCount > 0).length;

  // Calculate registration trend data for the last Week based on today's date
  const today = new Date();
  const oneWeekAgo = subWeeks(today, 1);

  // Buat interval harian antara satu bulan yang lalu dan hari ini
  const dailyIntervals = eachDayOfInterval({
    start: oneWeekAgo,
    end: today,
  });

  // Hitung registrasi untuk setiap hari
  const registrationTrendData = dailyIntervals.map((day) => {
    const count = users.filter(
      (user) =>
        format(user.createdAt, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'),
    ).length;
    return {
      name: format(day, 'dd MMM'),
      total: count,
    };
  });

  // Loading and error handling
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>;
  }

  const getWhatsAppLink = (phone: string) => {
    // Remove any non-digit characters from the phone number
    const sanitizedPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${sanitizedPhone}?text=Selamat%20datang%20di%20grup%20tryout%20premium%20kami!`;
  };

  const chartConfig: ChartConfig = {
    total: { label: 'Total Users', color: 'hsl(var(--chart-1))' },
    premium: { label: 'Premium Users', color: 'hsl(var(--chart-2))' },
    tryout: { label: 'Tryout Users', color: 'hsl(var(--chart-3))' },
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
            {/* Total Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>

            {/* Tryout Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tryoutUsers}</div>
              </CardContent>
            </Card>

            {/* Premium Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Premium Users
                </CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{premiumUsers}</div>
              </CardContent>
            </Card>

            {/* Tryout Users Count */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tryout Premium
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tryoutUsersCount}</div>
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
                    data={registrationTrendData}
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
                      interval={Math.floor(registrationTrendData.length / 30)} // Menampilkan label setiap 3 hari jika data 30 hari
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
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search users email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
            {/* Filter and Sort Section */}
            <div className="flex space-x-4">
              {/* Role Filter */}
              <Select
                value={roleFilter}
                onValueChange={setRoleFilter}
              >
                <SelectTrigger className="flex h-10 w-[180px] items-center justify-between rounded-xl border border-gray-300 px-3">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="All Roles" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Roles</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="PREMIUM">Premium</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Option */}
              <Select
                value={sortOption}
                onValueChange={setSortOption}
              >
                <SelectTrigger className="flex h-10 w-[180px] items-center justify-between rounded-xl border border-gray-300 px-3">
                  <div className="flex items-center">
                    {sortOption === 'Latest' ? (
                      <SortDesc className="mr-2 h-4 w-4 text-muted-foreground" />
                    ) : (
                      <SortAsc className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Latest">Latest</SelectItem>
                  <SelectItem value="Oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-hidden rounded-xl bg-white shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Status</TableHead> {/* Updated */}
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.school}</TableCell>
                    <TableCell>{user.city}</TableCell>
                    <TableCell>{user.Role}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.Role === 'PREMIUM'
                            ? 'default'
                            : user.tryoutCount > 0
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {user.Role === 'PREMIUM'
                          ? 'Premium'
                          : user.tryoutCount > 0
                            ? 'Tryout'
                            : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.Role === 'PREMIUM' ? 'Unlimited' : user.tryoutCount}
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
                      <a
                        href={getWhatsAppLink(user.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <MessageCircle className="mr-1 h-4 w-4" />
                        Invite
                      </a>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between border-t p-4">
              <div>
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, filteredUsers.length)} of{' '}
                {filteredUsers.length} users
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
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

type User = {
  id: string;
  name: string;
  email: string;
  Role: 'ADMIN' | 'USER' | 'PREMIUM';
  createdAt: Date;
  UserTryout: { id: string } | null;
  school: string;
  city: string;
  phone: string;
  tryoutCount: number;
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

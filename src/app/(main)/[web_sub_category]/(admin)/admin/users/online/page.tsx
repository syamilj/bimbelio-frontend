'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSocket } from '@/lib/socket/useSocket';
import {
  Clock,
  Network,
  RefreshCw,
  Search,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function UsersOnline() {
  const { isConnected, emit } = useSocket();

  const [usersData, setUsersData] = useState<
    {
      userId: string;
      email: string;
      image: string | null;
      sockets: string[];
      connectedAt: string;
    }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');
  const fetchActiveUsers = () => {
    if (!isConnected) return;
    emit(
      'users:get:active',
      (response: {
        success: boolean;
        data: {
          userId: string;
          email: string;
          image: string | null;
          sockets: string[];
          connectedAt: string;
        }[];
      }) => {
        console.log('[SOCKET] Received active users data:', response);
        if (response.success) {
          setUsersData(response.data);
        }
      },
    );
  };

  useEffect(() => {
    if (!isConnected) return;
    fetchActiveUsers();
  }, [isConnected, emit]);

  // Filter users based on search term
  const filteredUsers = usersData.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Format time difference
  const getTimeAgo = (connectedAt: string) => {
    const now = new Date();
    const connected = new Date(connectedAt);
    const diffMs = now.getTime() - connected.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Get initials from email
  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map((part) => part[0].toUpperCase())
      .join('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-xl md:text-2xl font-bold">Online Users</h1>
        <p className="text-sm text-muted-foreground">
          Monitor users currently connected to the platform
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {/* Total Online Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Users</CardTitle>
            <Wifi className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{usersData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time connected users
            </p>
          </CardContent>
        </Card>

        {/* Total Connections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Connections
            </CardTitle>
            <Network className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {usersData.reduce((sum, user) => sum + user.sockets.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active socket connections
            </p>
          </CardContent>
        </Card>

        {/* Average Connections Per User */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Connections
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {usersData.length > 0
                ? (
                    usersData.reduce(
                      (sum, user) => sum + user.sockets.length,
                      0,
                    ) / usersData.length
                  ).toFixed(2)
                : '0'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Connections per user
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Refresh */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <form
          className="flex flex-1 items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            type="submit"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <Button
          onClick={fetchActiveUsers}
          disabled={!isConnected}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2`} />
          Refresh
        </Button>
      </div>

      {/* Socket Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Socket Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm">
                  <span className="font-semibold text-green-600">
                    Connected
                  </span>
                  <span className="text-muted-foreground">
                    {' '}
                    • Real-time updates enabled
                  </span>
                </span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm">
                  <span className="font-semibold text-red-600">
                    Disconnected
                  </span>
                  <span className="text-muted-foreground">
                    {' '}
                    • Attempting to reconnect...
                  </span>
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Users List</CardTitle>
          <CardDescription>
            {filteredUsers.length} of {usersData.length} users online
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-center">Connections</TableHead>
                  <TableHead className="text-center">Connected At</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <TableRow
                      key={user.userId}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user.image || undefined}
                              alt={user.email}
                            />
                            <AvatarFallback className="text-xs">
                              {getInitials(user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium truncate max-w-xs">
                              {user.email}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-xs">
                              ID: {user.userId.substring(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {user.sockets.length}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {getTimeAgo(user.connectedAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Wifi className="h-3 w-3 text-green-500" />
                          <span className="text-xs font-medium text-green-600">
                            Online
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <WifiOff className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium text-muted-foreground">
                          {searchTerm
                            ? 'No users found matching your search'
                            : 'No online users at the moment'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

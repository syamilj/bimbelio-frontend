'use client';

import { Button } from '@/components/ui/button';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  exportShortUrlAnalytics,
  fetchShortUrlAnalytics,
  type ShortUrlAnalytics,
} from '@/lib/api/short-url';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ShortUrlAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const shortUrlId = params.id as string;

  const [analytics, setAnalytics] = useState<ShortUrlAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<string>('30');
  const [exporting, setExporting] = useState(false);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const data = await fetchShortUrlAnalytics(shortUrlId, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shortUrlId) {
      loadAnalytics();
    }
  }, [shortUrlId, dateRange]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await exportShortUrlAnalytics(shortUrlId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `short-url-analytics-${shortUrlId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Analytics exported successfully!');
    } catch (error) {
      console.error('Failed to export analytics:', error);
      toast.error('Failed to export analytics');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-20 text-gray-500">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-20 text-gray-500">
          No analytics data available
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Short URL Analytics</h1>
            <p className="text-gray-600 mt-1">
              Track performance and visitor insights
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            value={dateRange}
            onValueChange={setDateRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={loadAnalytics}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exporting}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Klik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.summary.totalClicks.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.summary.uniqueVisitors.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg Clicks/Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {parseFloat(analytics.summary.averageClicksPerDay).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technology Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Devices */}
        <Card>
          <CardHeader>
            <CardTitle>Devices</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.technology.devices.length > 0 ? (
              <div className="space-y-2">
                {analytics.technology.devices.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">
                      {item.device || 'Unknown'}
                    </span>
                    <span className="text-sm font-medium">{item._count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">No data</div>
            )}
          </CardContent>
        </Card>

        {/* Browsers */}
        <Card>
          <CardHeader>
            <CardTitle>Browsers</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.technology.browsers.length > 0 ? (
              <div className="space-y-2">
                {analytics.technology.browsers.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">
                      {item.browser || 'Unknown'}
                    </span>
                    <span className="text-sm font-medium">{item._count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">No data</div>
            )}
          </CardContent>
        </Card>

        {/* Operating Systems */}
        <Card>
          <CardHeader>
            <CardTitle>Operating Systems</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.technology.operatingSystems.length > 0 ? (
              <div className="space-y-2">
                {analytics.technology.operatingSystems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">
                      {item.os || 'Unknown'}
                    </span>
                    <span className="text-sm font-medium">{item._count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">No data</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Geographic and Traffic Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>
              Geographic distribution of visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.geographic.countries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.geographic.countries.map((country, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {country.country || 'Unknown'}
                      </TableCell>
                      <TableCell className="text-right">
                        {country._count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No country data
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Where your clicks are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.traffic.referrers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.traffic.referrers.map((ref, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-sm">
                        {ref.referer ? (
                          <span className="break-all">
                            {ref.referer.substring(0, 50)}
                            {ref.referer.length > 50 ? '...' : ''}
                          </span>
                        ) : (
                          'Direct / Unknown'
                        )}
                      </TableCell>
                      <TableCell className="text-right">{ref._count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-gray-500">
                No referrer data
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Clicks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest visitor clicks</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.recentClicks.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Device</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.recentClicks.map((click, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm">
                      {new Date(click.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm">
                      {click.country || 'Unknown'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {click.device || 'Unknown'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No recent activity
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

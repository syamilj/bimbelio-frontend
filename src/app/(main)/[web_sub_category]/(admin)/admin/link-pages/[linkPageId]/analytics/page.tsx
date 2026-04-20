'use client';

import { ArrowLeft, Rows3 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { trackTestConversion } from '@/lib/api/link-pages';
import { LinkShareCard } from '../../_components/LinkShareCard';
import { ConversionFunnelChart } from './_components/conversion-funnel-chart';
import { EventDetailsTable } from './_components/event-details-table';
import { GeographicBreakdownChart } from './_components/geographic-breakdown-chart';
import { HourlyHeatmapChart } from './_components/hourly-heatmap-chart';
import { OverviewMetrics } from './_components/overview-metrics';
import { TrafficSourceChart } from './_components/traffic-source-chart';
import { OverviewMetricsType } from './_hooks/type';

const presetOptions = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 90 days', value: '90d' },
  { label: 'Custom', value: 'custom' },
] as const;

type PresetValue = (typeof presetOptions)[number]['value'];

const getIsoDate = (date: Date) => date.toISOString();

const getPresetRange = (preset: PresetValue) => {
  const end = new Date();
  const start = new Date();
  if (preset === '7d') {
    start.setDate(end.getDate() - 7);
  } else if (preset === '30d') {
    start.setDate(end.getDate() - 30);
  } else if (preset === '90d') {
    start.setDate(end.getDate() - 90);
  }
  return { startDate: getIsoDate(start), endDate: getIsoDate(end) };
};

// const exportCsv = (data: Record<string, unknown>[], filename: string) => {
//   if (!data.length) {
//     toaster({
//       title: 'Nothing to export',
//       description: 'No rows available',
//       condition: 'warning',
//     });
//     return;
//   }
//   const csv = Papa.unparse(data);
//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement('a');
//   link.href = url;
//   link.setAttribute('download', `${filename}.csv`);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

export default function LinkAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const webSubCategory = params.web_sub_category as string;
  const linkPageId = params.linkPageId as string;

  const [preset, setPreset] = useState<PresetValue>('30d');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  // const [dateFilter, setDateFilter] = useState({
  //   from: subDays(new Date(), 30),
  //   to: new Date(),
  // });

  const [analytics, setAnalytics] = useState<OverviewMetricsType | null>(null);
  // const [linkPage, setLinkPage] = useState<LinkPageDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [testingPixel, setTestingPixel] = useState(false);

  const rangeParams = useMemo(() => {
    if (preset === 'custom') {
      if (!customRange.start || !customRange.end) return getPresetRange(preset);
      return {
        startDate: new Date(customRange.start).toISOString(),
        endDate: new Date(customRange.end).toISOString(),
      };
    }
    return getPresetRange(preset);
  }, [preset, customRange]);

  // useEffect(() => {
  //   handleRefresh();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [linkPageId, preset, customRange.start, customRange.end]);

  // const handleRefresh = async () => {
  //   if (!rangeParams) return;
  //   try {
  //     setRefreshing(true);
  //     const [pageResponse] = await Promise.all([fetchLinkPage(linkPageId)]);
  //     setLinkPage(pageResponse);
  //   } catch (error: any) {
  //     toaster({
  //       title: 'Error',
  //       description: error.response?.data?.message || 'Failed to refresh',
  //       condition: 'warning',
  //     });
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };

  const handleTestConversion = async () => {
    try {
      setTestingPixel(true);
      await trackTestConversion(linkPageId);
      toaster({
        title: 'Pixel test sent',
        description: 'Verify in Events Manager',
        condition: 'success',
      });
    } catch (error: any) {
      toaster({
        title: 'Error',
        description:
          error.response?.data?.message || 'Failed to send test conversion',
        condition: 'warning',
      });
    } finally {
      setTestingPixel(false);
    }
  };

  const dateFilter = {
    from: new Date(rangeParams.startDate),
    to: new Date(rangeParams.endDate),
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/link/analytics/overview?linkPageId=${linkPageId}&startDate=${dateFilter.from.toISOString()}&endDate=${dateFilter.to.toISOString()}`,
      );
      const res = await response.json();
      setAnalytics(res.data || null);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   fetchMetrics();
  // }, [linkPageId, dateFilter]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  console.log({ loading });

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/${webSubCategory}/admin/link-pages`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Track performance, devices, and conversions for{' '}
              {analytics?.linkPage?.title || 'this page'}.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/${webSubCategory}/admin/link-pages/${linkPageId}/buttons`,
              )
            }
          >
            <Rows3 className="mr-2 h-4 w-4" /> Manage Buttons
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/${webSubCategory}/admin/link-pages/edit/${linkPageId}`,
              )
            }
          >
            <Rows3 className="mr-2 h-4 w-4" /> Edit Page
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Date Range</CardTitle>
            <CardDescription>Select a preset or custom period.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={preset}
              onValueChange={(value: PresetValue) => setPreset(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent>
                {presetOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {preset === 'custom' && (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  type="date"
                  value={customRange.start}
                  onChange={(e) =>
                    setCustomRange((prev) => ({
                      ...prev,
                      start: e.target.value,
                    }))
                  }
                />
                <Input
                  type="date"
                  value={customRange.end}
                  onChange={(e) =>
                    setCustomRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                />
              </div>
            )}
            {/* <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing || loading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />{' '}
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button> */}
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <Skeleton className="h-[60vh] w-full" />
      ) : (
        <>
          {analytics?.linkPage && (
            <LinkShareCard
              linkPage={analytics.linkPage}
              sendingTest={testingPixel}
              onSendTest={handleTestConversion}
            />
          )}

          {!loading && (
            <>
              <Tabs
                defaultValue="overview"
                className="w-full"
              >
                <TabsList className="w-full flex">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                </TabsList>

                {/* Overview Tab - All Charts Combined */}
                <TabsContent
                  value="overview"
                  className="space-y-4"
                >
                  <OverviewMetrics
                    data={analytics}
                    isLoading={loading}
                  />

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <TrafficSourceChart
                      data={analytics?.eventsByUtmSource || []}
                      isLoading={loading}
                    />
                    <ConversionFunnelChart
                      dateFilter={{
                        from: new Date(rangeParams.startDate),
                        to: new Date(rangeParams.endDate),
                      }}
                      selectedLinkPageId={linkPageId}
                    />
                  </div>

                  <HourlyHeatmapChart
                    data={analytics?.hourlyHeatmap || []}
                    isLoading={loading}
                  />

                  <GeographicBreakdownChart
                    data={analytics?.eventsByCountry || []}
                    isLoading={loading}
                  />
                </TabsContent>

                {/* Events Tab */}
                <TabsContent
                  value="events"
                  className="space-y-4"
                >
                  <EventDetailsTable
                    dateFilter={{
                      from: new Date(rangeParams.startDate),
                      to: new Date(rangeParams.endDate),
                    }}
                    selectedLinkPageId={linkPageId}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
        </>
      )}
    </div>
  );
}

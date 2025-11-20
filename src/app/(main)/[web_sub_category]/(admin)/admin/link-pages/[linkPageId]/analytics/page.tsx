"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Rows3,
  RefreshCw,
  Download,
} from "lucide-react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  TooltipProps,
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import Papa from "papaparse";

import { LinkAnalyticsResponse, LinkPageDetail } from "@/types/link";
import { fetchLinkAnalytics, fetchLinkPage, trackTestConversion } from "@/lib/api/link-pages";
import { LinkShareCard } from "../../_components/LinkShareCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toaster } from "@/components/ui/toaster";

const presetOptions = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Last 90 days", value: "90d" },
  { label: "Custom", value: "custom" },
] as const;

type PresetValue = (typeof presetOptions)[number]["value"];

const chartColors = ["#6366F1", "#F97316", "#10B981", "#0EA5E9", "#EC4899", "#FACC15"];

const getIsoDate = (date: Date) => date.toISOString();

const getPresetRange = (preset: PresetValue) => {
  const end = new Date();
  const start = new Date();
  if (preset === "7d") {
    start.setDate(end.getDate() - 7);
  } else if (preset === "30d") {
    start.setDate(end.getDate() - 30);
  } else if (preset === "90d") {
    start.setDate(end.getDate() - 90);
  }
  return { startDate: getIsoDate(start), endDate: getIsoDate(end) };
};

const exportCsv = (data: Record<string, unknown>[], filename: string) => {
  if (!data.length) {
    toaster({ title: "Nothing to export", description: "No rows available", condition: "warning" });
    return;
  }
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function LinkAnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const webSubCategory = params.web_sub_category as string;
  const linkPageId = params.linkPageId as string;

  const [preset, setPreset] = useState<PresetValue>("30d");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [analytics, setAnalytics] = useState<LinkAnalyticsResponse | null>(null);
  const [linkPage, setLinkPage] = useState<LinkPageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [testingPixel, setTestingPixel] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const rangeParams = useMemo(() => {
    if (preset === "custom") {
      if (!customRange.start || !customRange.end) return null;
      return {
        startDate: new Date(customRange.start).toISOString(),
        endDate: new Date(customRange.end).toISOString(),
      };
    }
    return getPresetRange(preset);
  }, [preset, customRange]);

  const fetchData = async () => {
    if (!rangeParams) return;
    try {
      setLoading(true);
      const [analyticsResponse, pageResponse] = await Promise.all([
        fetchLinkAnalytics(linkPageId, rangeParams),
        fetchLinkPage(linkPageId),
      ]);
      setAnalytics(analyticsResponse);
      setLinkPage(pageResponse);
    } catch (error: any) {
      toaster({
        title: "Error",
        description: error.response?.data?.message || "Failed to load analytics",
        condition: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkPageId, preset, customRange.start, customRange.end]);

  const handleRefresh = async () => {
    if (!rangeParams) return;
    try {
      setRefreshing(true);
      const [analyticsResponse, pageResponse] = await Promise.all([
        fetchLinkAnalytics(linkPageId, rangeParams),
        fetchLinkPage(linkPageId),
      ]);
      setAnalytics(analyticsResponse);
      setLinkPage(pageResponse);
    } catch (error: any) {
      toaster({
        title: "Error",
        description: error.response?.data?.message || "Failed to refresh",
        condition: "warning",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleTestConversion = async () => {
    try {
      setTestingPixel(true);
      await trackTestConversion(linkPageId);
      toaster({ title: "Pixel test sent", description: "Verify in Events Manager", condition: "success" });
    } catch (error: any) {
      toaster({
        title: "Error",
        description: error.response?.data?.message || "Failed to send test conversion",
        condition: "warning",
      });
    } finally {
      setTestingPixel(false);
    }
  };

  const overview = analytics?.overview;

  return (
    <div className="container mx-auto space-y-6 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.push(`/${webSubCategory}/admin/link-pages`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Track performance, devices, and conversions for {analytics?.linkPage.title || "this page"}.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => router.push(`/${webSubCategory}/admin/link-pages/${linkPageId}/buttons`)}>
            <Rows3 className="mr-2 h-4 w-4" /> Manage Buttons
          </Button>
          <Button variant="outline" onClick={() => router.push(`/${webSubCategory}/admin/link-pages/edit/${linkPageId}`)}>
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
            <Select value={preset} onValueChange={(value: PresetValue) => setPreset(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent>
                {presetOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {preset === "custom" && (
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  type="date"
                  value={customRange.start}
                  onChange={(e) => setCustomRange((prev) => ({ ...prev, start: e.target.value }))}
                />
                <Input
                  type="date"
                  value={customRange.end}
                  onChange={(e) => setCustomRange((prev) => ({ ...prev, end: e.target.value }))}
                />
              </div>
            )}
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing || loading}>
              <RefreshCw className="mr-2 h-4 w-4" /> {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {loading ? (
        <Skeleton className="h-[60vh] w-full" />
      ) : (
        <>
          {linkPage && <LinkShareCard linkPage={linkPage} sendingTest={testingPixel} onSendTest={handleTestConversion} />}

          {overview && (
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Key metrics for the selected range.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Views</p>
                  <p className="text-3xl font-semibold">{overview.totalViews}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clicks</p>
                  <p className="text-3xl font-semibold">{overview.totalClicks}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unique IPs</p>
                  <p className="text-3xl font-semibold">{overview.totalUniqueIps}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversions</p>
                  <p className="text-3xl font-semibold">{overview.conversionCount}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Views by Day</CardTitle>
                <CardDescription>Trend of page views during the selected period.</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                {analytics?.viewsByDay?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.viewsByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip content={<div />} />
                      <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">No views recorded.</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Button Performance</CardTitle>
                <CardDescription>Compare click volume per button.</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                {analytics?.buttonPerformance?.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.buttonPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" interval={0} angle={-20} textAnchor="end" height={80} />
                      <YAxis allowDecimals={false} />
                      <Tooltip content={<div />} />
                      <Bar dataKey="clicks" fill="#F97316" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">No button clicks yet.</div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { title: "Device Breakdown", data: analytics?.deviceBreakdown, label: "device" },
              { title: "Browser Breakdown", data: analytics?.browserBreakdown, label: "browser" },
              { title: "OS Breakdown", data: analytics?.osBreakdown, label: "os" },
            ].map(({ title, data, label }, idx) => (
              <Card key={title}>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>Share by {label}.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {data && data.length ? (
                    <div className="flex items-center gap-4">
                      <ResponsiveContainer width={120} height={120}>
                        <PieChart>
                          <Pie data={data} dataKey="count" innerRadius={30} outerRadius={50}>
                            {data.map((_, dataIdx) => (
                              <Cell key={`cell-${title}-${dataIdx}`} fill={chartColors[dataIdx % chartColors.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-2 text-sm">
                        {data.map((entry, entryIdx) => {
                          const key = entry[label as keyof typeof entry];
                          const labelValue = String(key ?? "Unknown");
                          return (
                            <div key={`${label}-${entryIdx}`} className="flex items-center gap-2">
                              <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: chartColors[entryIdx % chartColors.length] }} />
                              <span className="capitalize">{labelValue}</span>
                              <span className="text-muted-foreground">{entry.count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No data available.</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-col gap-2">
                <div>
                  <CardTitle>Top Referrers</CardTitle>
                  <CardDescription>Highest converting traffic sources.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-1">
                  {analytics?.topReferrers?.map((ref) => (
                    <Badge key={`${ref.domain}-${ref.source}`} variant="outline">
                      {ref.source} · {ref.domain}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="flex flex-col gap-2">
                <div>
                  <CardTitle>Top Countries</CardTitle>
                  <CardDescription>Where your visitors are located.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-1">
                  {analytics?.topCountries?.map((country) => (
                    <Badge key={`${country.code}-${country.count}`} variant="outline">
                      {country.country} · {country.count}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Conversions</CardTitle>
                <CardDescription>Recent conversion events.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  analytics?.conversions &&
                  exportCsv(
                    analytics.conversions.map((conv) => ({
                      id: conv.id,
                      type: conv.conversionType,
                      value: conv.value ?? 0,
                      currency: conv.currency ?? "IDR",
                      referralCode: conv.referralCode || "",
                      createdAt: conv.createdAt,
                    })),
                    `${analytics?.linkPage.slug || "link"}-conversions`
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="max-h-80 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Referral</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics?.conversions?.length ? (
                      analytics.conversions.map((conv) => (
                        <TableRow key={conv.id}>
                          <TableCell className="font-mono text-xs">{conv.id.slice(0, 6)}...</TableCell>
                          <TableCell>{conv.conversionType}</TableCell>
                          <TableCell>
                            {conv.value ? `${conv.value} ${conv.currency ?? "IDR"}` : "-"}
                          </TableCell>
                          <TableCell>{conv.referralCode || "-"}</TableCell>
                          <TableCell>{new Date(conv.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No conversions yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Referral Codes</CardTitle>
              <CardDescription>Which partners drive the most traffic.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {analytics?.topReferralCodes?.length ? (
                analytics.topReferralCodes.map((entry) => (
                  <div key={entry.code ?? Math.random()} className="flex items-center justify-between rounded-lg border p-3">
                    <span>{entry.code || "(Direct)"}</span>
                    <Badge variant="outline">{entry.count}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No referral codes recorded.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest events captured.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  analytics?.recentActivity &&
                  exportCsv(
                    analytics.recentActivity.map((activity) => ({
                      id: activity.id,
                      type: activity.eventType,
                      country: activity.country,
                      city: activity.city,
                      device: activity.deviceType,
                      browser: activity.browser,
                      referrer: activity.referrerSource,
                      referralCode: activity.referralCode,
                      createdAt: activity.createdAt,
                    })),
                    `${analytics?.linkPage.slug || "link"}-activity`
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Geo</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Referrer</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics?.recentActivity?.length ? (
                      analytics.recentActivity.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>{activity.eventType}</TableCell>
                          <TableCell>{activity.city ? `${activity.city}, ` : ""}{activity.country || "-"}</TableCell>
                          <TableCell>{activity.deviceType || "-"}</TableCell>
                          <TableCell>{activity.referrerSource || "-"}</TableCell>
                          <TableCell>{new Date(activity.createdAt).toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No activity for this range.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

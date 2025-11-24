'use client';

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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { OverviewMetricsType } from '../_hooks/type';

const chartColors = [
  '#6366F1',
  '#F97316',
  '#10B981',
  '#0EA5E9',
  '#EC4899',
  '#FACC15',
];

const pieChartConfig = {
  count: {
    label: 'Count',
  },
} satisfies ChartConfig;
const viewsChartConfig = {
  count: {
    label: 'Page Views',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const buttonChartConfig = {
  clicks: {
    label: 'Clicks',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function OverviewMetrics({
  data,
  isLoading,
}: {
  data: OverviewMetricsType | null;
  isLoading: boolean;
}) {
  const metrics = [
    {
      title: 'Total Events',
      value: data?.totalEvents ?? 0,
      subtext: `${(data?.conversionRate ?? 0).toFixed(2)}% conversion rate`,
    },
    {
      title: 'Page Views',
      value: data?.pageViews ?? 0,
      subtext: `${data?.uniqueVisitors ?? 0} unique visitors`,
    },
    {
      title: 'Button Clicks',
      value: data?.buttonClicks ?? 0,
      subtext: `${data?.uniqueSessions ?? 0} sessions`,
    },
    {
      title: 'Conversions',
      value: data?.conversions ?? 0,
      subtext: `${data?.uniqueEmails ?? 0} emails collected`,
    },
    {
      title: 'Avg Page Load Time',
      value: `${(data?.avgPageLoadTime ?? 0).toFixed(0)}ms`,
      subtext: 'Performance metric',
    },
    {
      title: 'Avg Time on Page',
      value: `${((data?.avgTimeOnPage ?? 0) / 1000).toFixed(1)}s`,
      subtext: 'Engagement time',
    },
    {
      title: 'Avg Scroll Depth',
      value: `${(data?.avgScrollDepth ?? 0).toFixed(1)}%`,
      subtext: 'Page engagement',
    },
    {
      title: 'Bounce Rate',
      value: `${(data?.bounceRate ?? 0).toFixed(1)}%`,
      subtext: 'Lower is better',
    },
    {
      title: 'Total Revenue',
      value: `Rp ${(data?.totalRevenue ?? 0).toLocaleString('id-ID')}`,
      subtext: 'Total conversions value',
    },
    {
      title: 'Avg Order Value',
      value: `Rp ${(data?.avgOrderValue ?? 0).toLocaleString('id-ID')}`,
      subtext: 'Per conversion',
    },
  ];

  const analytics = data;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ) : (
                <>
                  <div className="text-xl font-bold">
                    {typeof metric.value === 'string'
                      ? metric.value
                      : metric.value.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{metric.subtext}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Views by Day</CardTitle>
            <CardDescription>
              Trend of page views during the selected period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.viewsByDay?.length ? (
              <ChartContainer
                config={viewsChartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <LineChart
                  accessibilityLayer
                  data={analytics.viewsByDay}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      });
                    }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="count"
                    type="natural"
                    stroke="var(--color-count)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                No views recorded.
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Button Performance</CardTitle>
            <CardDescription>Compare click volume per button.</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.buttonPerformance?.length ? (
              <ChartContainer
                config={buttonChartConfig}
                className="aspect-auto h-[250px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={analytics.buttonPerformance}
                  margin={{
                    top: 20,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="title"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) =>
                      value.length > 10 ? `${value.slice(0, 10)}...` : value
                    }
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="clicks"
                    fill="var(--color-clicks)"
                    radius={8}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                No button clicks yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            title: 'Device Breakdown',
            data: analytics?.deviceBreakdown,
            label: 'device',
          },
          {
            title: 'Browser Breakdown',
            data: analytics?.browserBreakdown,
            label: 'browser',
          },
          {
            title: 'OS Breakdown',
            data: analytics?.osBreakdown,
            label: 'os',
          },
        ].map(({ title, data, label }, idx) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>Share by {label}.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {data && data.length ? (
                <div className="flex items-center gap-4">
                  <ChartContainer
                    config={pieChartConfig}
                    className="aspect-square h-[120px] w-[120px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={data}
                        dataKey="count"
                        innerRadius={30}
                        outerRadius={50}
                      >
                        {data.map((_, dataIdx) => (
                          <Cell
                            key={`cell-${title}-${dataIdx}`}
                            fill={chartColors[dataIdx % chartColors.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  <div className="space-y-2 text-sm">
                    {data.map((entry, entryIdx) => {
                      const key = entry[label as keyof typeof entry];
                      const labelValue = String(key ?? 'Unknown');
                      return (
                        <div
                          key={`${label}-${entryIdx}`}
                          className="flex items-center gap-2"
                        >
                          <span
                            className="block h-2 w-2 rounded-full"
                            style={{
                              backgroundColor:
                                chartColors[entryIdx % chartColors.length],
                            }}
                          />
                          <span className="capitalize">{labelValue}</span>
                          <span className="text-muted-foreground">
                            {entry.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No data available.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

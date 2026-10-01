'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function GeographicBreakdownChart({
  data,
  isLoading,
}: {
  data: {
    name: string;
    code?: string;
    value: number;
  }[];
  isLoading: boolean;
}) {
  const chartData =
    data && Array.isArray(data)
      ? data.slice(0, 10).map((item) => ({
          name: item.name || item.code || 'Unknown',
          visits: item.value || 0,
        }))
      : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution (Top 10)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64" />
        ) : chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-500">
            Tidak ada data
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
              />
              <Tooltip />
              <Bar
                dataKey="visits"
                fill="#10b981"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

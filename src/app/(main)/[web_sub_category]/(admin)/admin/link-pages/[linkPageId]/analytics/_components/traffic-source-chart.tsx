'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface TrafficSourceChartProps {
  dateFilter: { from: Date; to: Date };
  selectedLinkPageId: string;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export function TrafficSourceChart({
  data,
  isLoading,
}: {
  data: {
    name: string;
    value: number;
  }[];
  isLoading: boolean;
}) {
  // const [data, setData] = useState<
  //   Array<{
  //     name: string;
  //     value: number;
  //   }>
  // >([]);
  // const [isLoading, setIsLoading] = useState(false);

  const chartData =
    data && Array.isArray(data)
      ? data.map((item: any) => ({
          name: item.name || item.utmSource || 'Direct',
          value: item.value || item.count || 0,
        }))
      : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64" />
        ) : chartData.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-500">
            No data available
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

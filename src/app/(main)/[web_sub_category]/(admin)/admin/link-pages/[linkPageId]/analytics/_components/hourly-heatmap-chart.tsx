'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface HourlyHeatmapChartProps {
  dateFilter: { from: Date; to: Date };
  selectedLinkPageId: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function HourlyHeatmapChart({
  data,
  isLoading,
}: {
  data: {
    hour: number;
    pageViews: number;
    clicks: number;
    conversions: number;
  }[];
  isLoading: boolean;
}) {
  console.log({ heatMap: data });

  const heatmapData = data && Array.isArray(data) ? data : [];

  // Create a 7x24 matrix for the heatmap based on page views
  const matrix = Array(7)
    .fill(null)
    .map(() => Array(24).fill(0));

  // For hourly data without day information, we'll distribute across all days
  if (heatmapData.length > 0) {
    heatmapData.forEach((item: any) => {
      const hour = item.hour || 0;
      const pageViews = item.pageViews || 0;

      // Distribute this hour's data across all days (or you can modify this logic)
      if (hour >= 0 && hour < 24) {
        for (let day = 0; day < 7; day++) {
          matrix[day][hour] = pageViews;
        }
      }
    });
  }

  const getColor = (value: number, max: number) => {
    if (value === 0) return 'bg-gray-100';
    const intensity = value / max;
    if (intensity > 0.8) return 'bg-blue-900';
    if (intensity > 0.6) return 'bg-blue-700';
    if (intensity > 0.4) return 'bg-blue-500';
    if (intensity > 0.2) return 'bg-blue-300';
    return 'bg-blue-100';
  };

  const maxValue = Math.max(
    ...heatmapData.map((item: any) => item.pageViews || 0),
    1,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap (Day × Hour)</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Visualisasi aktivitas per jam per hari.{' '}
          <strong>Warna gelap = traffic tinggi</strong>, warna terang = traffic
          rendah. Hover untuk melihat detail (views, clicks, conversions).
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64" />
        ) : (
          <div className="space-y-4">
            {/* Legend */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">
                Cara Membaca:
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-100 rounded border border-gray-300"></div>
                  <span>0% - Tidak ada activity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-100 rounded"></div>
                  <span>1-20% - Sangat rendah</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-300 rounded"></div>
                  <span>21-40% - Rendah-sedang</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded"></div>
                  <span>41-60% - Sedang</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-700 rounded"></div>
                  <span>61-80% - Tinggi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-900 rounded"></div>
                  <span>81-100% - Puncak</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                💡 <strong>Tips:</strong> Hover di setiap kotak untuk melihat
                Views, Clicks, dan Conversions detail.
              </p>
            </div>

            {/* Heatmap Grid */}
            <div className="w-full overflow-x-auto border border-gray-200 rounded-lg p-2 bg-white">
              <div className="inline-block min-w-full">
                {/* Hour labels */}
                <div className="flex gap-1">
                  <div className="w-12" />
                  {Array(24)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={`hour-${i}`}
                        className="w-6 text-center text-xs font-medium"
                      >
                        {i}
                      </div>
                    ))}
                </div>

                {/* Day rows */}
                {DAYS.map((day, dayIndex) => (
                  <div
                    key={day}
                    className="flex gap-1"
                  >
                    <div className="w-12 text-sm font-medium">{day}</div>
                    {matrix[dayIndex].map((count, hourIndex) => {
                      // Find the original data for this hour to show clicks and conversions
                      const hourData = heatmapData.find(
                        (item: any) => item.hour === hourIndex,
                      );

                      return (
                        <div
                          key={`${dayIndex}-${hourIndex}`}
                          className={`w-6 h-6 rounded text-xs flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${getColor(
                            count,
                            maxValue,
                          )}`}
                          title={`${day} ${hourIndex}:00 - Views: ${count}, Clicks: ${hourData?.clicks || 0}, Conversions: ${hourData?.conversions || 0}`}
                        >
                          {count > 0 && count}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

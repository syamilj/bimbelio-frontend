'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { env } from '@/env.mjs';
import { useEffect, useState } from 'react';

interface ConversionFunnelChartProps {
  dateFilter: { from: Date; to: Date };
  selectedLinkPageId: string;
}

export function ConversionFunnelChart({
  dateFilter,
  selectedLinkPageId,
}: ConversionFunnelChartProps) {
  const [data, setData] = useState<{
    totalSessions: number;
    step1_pageView: {
      count: number;
      rate: number;
    };
    step2_buttonClick: {
      count: number;
      rate: number;
      dropoffFromStep1: number;
    };
    step3_formSubmit: {
      count: number;
      rate: number;
      dropoffFromStep2: number;
    };
    step4_purchase: {
      count: number;
      rate: number;
      dropoffFromStep3: number;
    };
    completionRate: number;
    avgTimeToConversion: number;
    totalRevenue: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedLinkPageId) return;

    const fetchFunnelData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/link/analytics/funnel?linkPageId=${selectedLinkPageId}&startDate=${dateFilter.from.toISOString()}&endDate=${dateFilter.to.toISOString()}`,
        );
        const res = await response.json();
        setData(res.data || null);
      } catch (error) {
        console.error('Error fetching funnel data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFunnelData();
  }, [selectedLinkPageId, dateFilter]);

  console.log({ funnelData: data });

  // Transform data to steps array for display
  const steps = data
    ? [
        {
          name: '1. Page View',
          count: data.step1_pageView.count,
          percentage: data.step1_pageView.rate,
          dropoff: 0,
        },
        {
          name: '2. Button Click',
          count: data.step2_buttonClick.count,
          percentage: data.step2_buttonClick.rate,
          dropoff: data.step2_buttonClick.dropoffFromStep1,
        },
        {
          name: '3. Form Submit',
          count: data.step3_formSubmit.count,
          percentage: data.step3_formSubmit.rate,
          dropoff: data.step3_formSubmit.dropoffFromStep2,
        },
        {
          name: '4. Purchase',
          count: data.step4_purchase.count,
          percentage: data.step4_purchase.rate,
          dropoff: data.step4_purchase.dropoffFromStep3,
        },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        {data && (
          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-3xl">
              <p className="text-gray-600">Completion Rate</p>
              <p className="text-xl font-bold text-blue-600">
                {(data.completionRate * 100).toFixed(2)}%
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-3xl">
              <p className="text-gray-600">Avg Time to Convert</p>
              <p className="text-xl font-bold text-green-600">
                {data.avgTimeToConversion.toFixed(1)}s
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-3xl">
              <p className="text-gray-600">Total Revenue</p>
              <p className="text-xl font-bold text-purple-600">
                Rp {data.totalRevenue.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="h-16"
              />
            ))}
          </div>
        ) : steps.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-500">
            Tidak ada data
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step: any, index: number) => (
              <div
                key={index}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{step.name}</span>
                  <span className="text-gray-500">
                    {step.count.toLocaleString()} ({step.percentage.toFixed(1)}
                    %)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="bg-blue-500 py-1"
                      style={{ width: `${step.percentage}%` }}
                    />
                  </div>
                  {step.dropoff > 0 && (
                    <span className="text-xs text-red-600">
                      ↓ {step.dropoff.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

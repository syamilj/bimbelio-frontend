'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { env } from '@/env.mjs';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { EventDataType } from '../_hooks/type';

interface EventDetailsTableProps {
  data: EventDataType[];
  isLoading: boolean;
}

const EVENT_COLORS: Record<string, string> = {
  PAGE_VIEW: 'bg-blue-100 text-blue-800',
  BUTTON_CLICK: 'bg-green-100 text-green-800',
  CONVERSION: 'bg-purple-100 text-purple-800',
};

const CONVERSION_TYPE_COLORS: Record<string, string> = {
  PURCHASE: 'bg-green-100 text-green-800',
  EMAIL_SIGNUP: 'bg-yellow-100 text-yellow-800',
  REGISTRATION: 'bg-blue-100 text-blue-800',
  SUBSCRIBE: 'bg-indigo-100 text-indigo-800',
  DOWNLOAD: 'bg-purple-100 text-purple-800',
  CONTACT: 'bg-orange-100 text-orange-800',
  BOOKING: 'bg-pink-100 text-pink-800',
  CUSTOM: 'bg-gray-100 text-gray-800',
  CLICK: 'bg-cyan-100 text-cyan-800',
};

export function EventDetailsTable({
  dateFilter,
  selectedLinkPageId,
}: {
  selectedLinkPageId: string;
  dateFilter: { from: Date; to: Date };
}) {
  const [data, setEventsData] = useState<EventDataType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!selectedLinkPageId) return;

    const fetchEventsData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/link/analytics/events?linkPageId=${selectedLinkPageId}&startDate=${dateFilter.from.toISOString()}&endDate=${dateFilter.to.toISOString()}`,
        );
        const res = await response.json();
        setEventsData(res.data || []);
      } catch (error) {
        console.error('Error fetching events data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventsData();
  }, [selectedLinkPageId, dateFilter]);

  const tableData = Array.isArray(data) ? data.slice(0, 100) : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Events (Last 100)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                className="h-12"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Device/OS</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>Geo</TableHead>
                  <TableHead>User Info</TableHead>
                  <TableHead>UTM</TableHead>
                  <TableHead>Conversion</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Referrer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center text-gray-500"
                    >
                      No events recorded yet
                    </TableCell>
                  </TableRow>
                ) : (
                  tableData.map((event) => (
                    <TableRow
                      key={event.id}
                      className="text-xs"
                    >
                      {/* Time */}
                      <TableCell>
                        <div className="whitespace-nowrap">
                          {format(new Date(event.createdAt), 'HH:mm:ss')}
                        </div>
                        <div className="text-gray-500">
                          {format(new Date(event.createdAt), 'MMM dd')}
                        </div>
                      </TableCell>

                      {/* Event Type */}
                      <TableCell>
                        <div className="space-y-1">
                          <Badge
                            className={EVENT_COLORS[event.eventType] || ''}
                          >
                            {event.eventType}
                          </Badge>
                          {event.eventName && (
                            <div className="text-gray-600">
                              {event.eventName}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Device/OS */}
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {event.device || '-'}
                          </div>
                          <div className="text-gray-500">
                            {event.os || '-'} {event.osVersion || ''}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {event.deviceType || '-'}
                          </div>
                          {event.screenResolution && (
                            <div className="text-gray-500 text-xs">
                              {event.screenResolution}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Browser */}
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {event.browser || '-'}
                          </div>
                          <div className="text-gray-500">
                            {event.browserVersion || '-'}
                          </div>
                        </div>
                      </TableCell>

                      {/* Geo */}
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {event.country || '-'}
                          </div>
                          <div className="text-gray-500">
                            {event.city || '-'}, {event.region || '-'}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {event.timezone || '-'}
                          </div>
                          {event.latitude && event.longitude && (
                            <div className="text-gray-500 text-xs">
                              ({event.latitude.toFixed(2)},{' '}
                              {event.longitude.toFixed(2)})
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* User Info */}
                      <TableCell>
                        <div>
                          {event.email && (
                            <div className="truncate text-blue-600">
                              {event.email}
                            </div>
                          )}
                          {event.phone && (
                            <div className="text-gray-600">{event.phone}</div>
                          )}
                          {event.userId && (
                            <div className="text-gray-500 text-xs">
                              User: {event.userId}
                            </div>
                          )}
                          {event.sessionId && (
                            <div className="text-gray-500 text-xs truncate">
                              Session: {event.sessionId.slice(0, 8)}...
                            </div>
                          )}
                          {event.ipAddress && (
                            <div className="text-gray-500 text-xs">
                              IP: {event.ipAddress}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* UTM */}
                      <TableCell>
                        <div className="space-y-1">
                          {event.utmSource && (
                            <div className="text-xs">
                              <span className="font-medium">Source:</span>{' '}
                              {event.utmSource}
                            </div>
                          )}
                          {event.utmMedium && (
                            <div className="text-xs">
                              <span className="font-medium">Medium:</span>{' '}
                              {event.utmMedium}
                            </div>
                          )}
                          {event.utmCampaign && (
                            <div className="text-xs">
                              <span className="font-medium">Campaign:</span>{' '}
                              {event.utmCampaign}
                            </div>
                          )}
                          {event.utmContent && (
                            <div className="text-xs">
                              <span className="font-medium">Content:</span>{' '}
                              {event.utmContent}
                            </div>
                          )}
                          {event.abVariant && (
                            <Badge
                              variant="outline"
                              className="text-xs"
                            >
                              AB: {event.abVariant}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Conversion */}
                      <TableCell>
                        <div>
                          {event.isConversion ? (
                            <div className="space-y-1">
                              <Badge
                                className={
                                  CONVERSION_TYPE_COLORS[
                                    event.conversionType
                                  ] || 'bg-gray-100 text-gray-800'
                                }
                              >
                                {event.conversionType || 'N/A'}
                              </Badge>
                              {event.conversionValue && (
                                <div className="font-bold text-green-600">
                                  Rp{' '}
                                  {event.conversionValue.toLocaleString(
                                    'id-ID',
                                  )}
                                </div>
                              )}
                              {event.conversionCurrency && (
                                <div className="text-gray-500 text-xs">
                                  {event.conversionCurrency}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline">No Conversion</Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Performance */}
                      <TableCell>
                        <div className="space-y-1">
                          {event.pageLoadTime && (
                            <div className="text-xs">
                              Load:{' '}
                              <span className="font-medium">
                                {event.pageLoadTime}ms
                              </span>
                            </div>
                          )}
                          {event.timeOnPage && (
                            <div className="text-xs">
                              Time:{' '}
                              <span className="font-medium">
                                {(event.timeOnPage / 1000).toFixed(1)}s
                              </span>
                            </div>
                          )}
                          {event.scrollDepth && (
                            <div className="text-xs">
                              Scroll:{' '}
                              <span className="font-medium">
                                {event.scrollDepth}%
                              </span>
                            </div>
                          )}
                          {event.engagementScore && (
                            <div className="text-xs">
                              Engagement:{' '}
                              <span className="font-medium">
                                {event.engagementScore}
                              </span>
                            </div>
                          )}
                          {event.connectionType && (
                            <div className="text-xs">
                              Connection:{' '}
                              <span className="font-medium">
                                {event.connectionType}
                              </span>
                            </div>
                          )}
                          {event.connectionSpeed && (
                            <div className="text-xs">
                              Speed:{' '}
                              <span className="font-medium">
                                {event.connectionSpeed}Mbps
                              </span>
                            </div>
                          )}
                          {event.dayOfWeek !== null && (
                            <div className="text-xs">
                              Day:{' '}
                              <span className="font-medium">
                                {event.dayOfWeek}
                              </span>
                            </div>
                          )}
                          {event.hourOfDay !== null && (
                            <div className="text-xs">
                              Hour:{' '}
                              <span className="font-medium">
                                {event.hourOfDay}:00
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Referrer */}
                      <TableCell>
                        <div>
                          {event.referrerSource && (
                            <Badge
                              variant="outline"
                              className="text-xs mb-1"
                            >
                              {event.referrerSource}
                            </Badge>
                          )}
                          {event.referrerDomain && (
                            <div className="truncate text-xs text-blue-600">
                              {event.referrerDomain}
                            </div>
                          )}
                          {event.referer && (
                            <div className="truncate text-xs text-gray-500">
                              {event.referer}
                            </div>
                          )}
                          {(event.gclid || event.fbclid || event.ttclid) && (
                            <div className="mt-1 space-y-1">
                              {event.gclid && (
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                >
                                  Google
                                </Badge>
                              )}
                              {event.fbclid && (
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                >
                                  Facebook
                                </Badge>
                              )}
                              {event.ttclid && (
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                >
                                  TikTok
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

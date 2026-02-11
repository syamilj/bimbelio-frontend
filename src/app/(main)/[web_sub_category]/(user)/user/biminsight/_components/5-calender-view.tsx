'use client';

import { useCallback } from 'react';

// Komponen UI
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Provider dan Hooks

// Icon dari lucide-react
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { CalendarRangeIcon } from 'lucide-react';
import { SectionTitle } from './section-title';

// Komponen Chart dari recharts

interface CalendarViewType {
  value: string;
  label: string;
}
const calendarViews: CalendarViewType[] = [
  { value: 'schedule', label: 'Jadwal' },
  { value: 'week', label: 'Mingguan' },
  { value: 'month', label: 'Bulanan' },
];

export const CalenderView = () => {
  const { mainColor, secondaryColor } = useWebsiteSubCategory();
  const generateCalendarUrl = useCallback((view: string) => {
    let mode = view.toUpperCase();
    if (view === 'schedule') mode = 'AGENDA';
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return `https://calendar.google.com/calendar/embed?src=bimbelio.marketing%40gmail.com&wkst=2&bgcolor=%23ffffff&ctz=Asia%2FJakarta&hl=id&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=1&mode=${mode}${
      view === 'agenda' ? `&dates=${today}%2F${today}` : ''
    }`;
  }, []);

  return (
    <div>
      <SectionTitle
        icon={CalendarRangeIcon}
        title="Kalender Kegiatan"
        description="Pantau dan aktivitas kegiatan belajarmu."
      />
      <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
        <CardHeader
          hidden
          className="pb-4 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <div className="relative z-10">
            <CardTitle>Kalender</CardTitle>
          </div>
          {/* Decorative elements */}
          <div
            className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
            style={{ backgroundColor: mainColor }}
          />
        </CardHeader>

        <CardContent className="p-6">
          <Tabs defaultValue="schedule">
            <TabsList
              className="grid w-full grid-cols-3 mb-6 md:mb-8 rounded-3xl p-1 h-11 md:h-12 border-0"
              style={{ backgroundColor: `${mainColor}08` }}
            >
              {calendarViews.map(({ value, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="rounded-lg font-semibold transition-all duration-200 text-gray-700 data-[state=active]:text-white data-[state=active]:shadow-md bg-transparent"
                  isActiveClassName="bg-main"
                >
                  <span className="font-medium text-xs md:text-sm">
                    {label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            {calendarViews.map(({ value }) => (
              <TabsContent
                key={value}
                value={value}
              >
                <iframe
                  src={generateCalendarUrl(value)}
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] border-0 rounded-3xl"
                  style={{ border: 0 }}
                />
              </TabsContent>
            ))}
          </Tabs>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">Keterangan:</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200 py-1.5 px-4 rounded-full hover:bg-white">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                Kelas Online
              </Badge>
              <Badge className="bg-green-50 text-green-700 border border-green-200 py-1.5 px-4 rounded-full hover:bg-white">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Try Out
              </Badge>
              <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 py-1.5 px-4 rounded-full hover:bg-white">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                Webinar
              </Badge>
              <Badge className="bg-red-50 text-red-700 border border-red-200 py-1.5 px-4 rounded-full hover:bg-white">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                Tanggal Penting
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

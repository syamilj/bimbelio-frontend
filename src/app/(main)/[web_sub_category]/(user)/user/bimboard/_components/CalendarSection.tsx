'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink } from 'lucide-react';

const GOOGLE_CALENDAR_ID = 'bimbelio.marketing@gmail.com';
const GOOGLE_CALENDAR_EMBED_URL = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(GOOGLE_CALENDAR_ID)}&ctz=Asia%2FJakarta&mode=AGENDA&showTitle=0&showNav=0&showPrint=0&showTabs=0&showCalendars=0`;

export default function CalendarSection() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  return (
    <div className="w-full">
      <div className="border border-gray-100 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
              <Calendar
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
            </div>
            <span className="font-bold text-sm text-slate-800">
              Jadwal Event
            </span>
          </div>
          <a
            href={`https://calendar.google.com/calendar/u/0?cid=${GOOGLE_CALENDAR_ID}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8 px-3 rounded-full hover:bg-slate-50 transition-colors font-medium border border-gray-100"
              style={{ color: mainColor }}
            >
              <ExternalLink className="w-3 h-3 mr-1.5" />
              Buka Kalender
            </Button>
          </a>
        </div>

        {/* Calendar Embed */}
        <div className="bg-white p-1">
          <iframe
            src={GOOGLE_CALENDAR_EMBED_URL}
            className="w-full h-[400px] border-0 rounded-b-3xl"
            title="Jadwal Event"
          />
        </div>
      </div>
    </div>
  );
}

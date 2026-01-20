"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ExternalLink, ChevronRight } from "lucide-react";
import axiosInstanceWithToken from "@/lib/axios/axiosInstanceWithToken";
import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { format, parseISO, isToday, isTomorrow, isThisWeek } from "date-fns";
import { id } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  location: string;
  color?: string;
  htmlLink?: string;
  creator?: string;
}

interface BimCalendarProps {
  websiteSubCategoryId: string;
}

export default function BimCalendar({ websiteSubCategoryId }: BimCalendarProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { websiteSubCategory } = useWebsiteSubCategory();

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const timeMin = new Date().toISOString();
      const timeMax = new Date();
      timeMax.setMonth(timeMax.getMonth() + 3);

      const response = await axiosInstanceWithToken.get("/calendar/getCalendarEvents", {
        params: {
          timeMin,
          timeMax: timeMax.toISOString(),
          maxResults: 100,
        },
      });

      if (response.data.status === 200 || response.data.data) {
        setEvents(response.data.data || []);
      } else {
        setError("Gagal memuat kalender");
      }
    } catch (err: any) {
      console.error("Calendar fetch error:", err);
      setError(err.response?.data?.message || "Gagal memuat kalender");
    } finally {
      setLoading(false);
    }
  };

  const getDateLabel = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isToday(date)) return "Hari Ini";
      if (isTomorrow(date)) return "Besok";
      if (isThisWeek(date)) return format(date, "EEEE", { locale: id });
      return format(date, "dd MMM yyyy", { locale: id });
    } catch {
      return dateString;
    }
  };

  const getTimeLabel = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "HH:mm", { locale: id });
    } catch {
      return "";
    }
  };

  // Group events by date
  const groupedEvents = events.reduce((acc, event) => {
    const dateKey = event.start.split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const sortedDates = Object.keys(groupedEvents).sort();
  const upcomingEvents = sortedDates.slice(0, 10).flatMap(date => 
    groupedEvents[date].map(event => ({ ...event, dateKey: date }))
  );

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold">Jadwal Kegiatan</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg border animate-pulse">
              <div className="h-14 w-14 bg-muted rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold">Jadwal Kegiatan</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchCalendarEvents}>
              Coba lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (upcomingEvents.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-semibold">Jadwal Kegiatan</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-8">
          <div className="text-center text-sm text-muted-foreground">
            Belum ada kegiatan terjadwal
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-lg font-semibold">Jadwal Kegiatan</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {events.length} kegiatan
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {upcomingEvents.map((event) => {
          const isAllDay = !event.start.includes("T");
          const dateLabel = getDateLabel(event.start);
          const timeLabel = isAllDay ? "Sepanjang hari" : getTimeLabel(event.start);
          
          return (
            <div
              key={event.id}
              className="group flex gap-3 p-3 rounded-lg border hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer"
              onClick={() => event.htmlLink && window.open(event.htmlLink, "_blank")}
            >
              {/* Date Badge */}
              <div 
                className="flex flex-col items-center justify-center h-14 w-14 rounded-lg text-white font-semibold flex-shrink-0"
                style={{ backgroundColor: websiteSubCategory?.main_color || "#3b82f6" }}
              >
                <span className="text-xs opacity-90">
                  {format(parseISO(event.start), "MMM", { locale: id })}
                </span>
                <span className="text-xl leading-none">
                  {format(parseISO(event.start), "dd")}
                </span>
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                    {event.title}
                  </h4>
                  {event.htmlLink && (
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{timeLabel}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                </div>

                {/* Date label for context */}
                <Badge variant="outline" className="text-xs mt-2 border-primary/20">
                  {dateLabel}
                </Badge>
              </div>
            </div>
          );
        })}

        {events.length > 10 && (
          <Button
            variant="ghost"
            className="w-full mt-2"
            onClick={() => window.open("https://calendar.google.com", "_blank")}
          >
            Lihat semua kegiatan
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

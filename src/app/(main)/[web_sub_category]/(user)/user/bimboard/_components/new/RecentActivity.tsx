"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import {
  Target,
  BookOpen,
  FileText,
  Video,
  Clock,
  CheckCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { EmptyStateIllustrations } from "./EmptyStateIllustrations";

interface RecentActivityProps {
  activities: Array<{
    id: string;
    type: "tryout" | "course" | "document" | "liveclass";
    title: string;
    description: string;
    timestamp: string;
    icon: string;
  }>;
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || "#0091FF";

  const getIcon = (type: string) => {
    switch (type) {
      case "tryout":
        return Target;
      case "course":
        return BookOpen;
      case "document":
        return FileText;
      case "liveclass":
        return Video;
      default:
        return CheckCircle;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "tryout":
        return "bg-purple-100 text-purple-600";
      case "course":
        return "bg-blue-100 text-blue-600";
      case "document":
        return "bg-amber-100 text-amber-600";
      case "liveclass":
        return "bg-rose-100 text-rose-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-slate-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-slate-800">🕒 Aktivitas Terakhir</h2>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
        {activities.length > 0 ? (
          activities.map((activity) => {
            const Icon = getIcon(activity.type);
            const colorClass = getColor(activity.type);

            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-3xl hover:bg-slate-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-3xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-slate-800 truncate">
                    {activity.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400 font-medium">
                      {(() => {
                        try {
                          const date = new Date(activity.timestamp);
                          if (isNaN(date.getTime())) {
                            return "Baru saja";
                          }
                          return formatDistanceToNow(date, {
                            addSuffix: true,
                            locale: id,
                          });
                        } catch {
                          return "Baru saja";
                        }
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto mb-3">
              <EmptyStateIllustrations.NoActivity />
            </div>
            <p className="text-sm font-bold text-slate-700 mb-1">Belum Ada Aktivitas</p>
            <p className="text-xs text-slate-500">Mulai belajar untuk melihat riwayat aktivitasmu</p>
          </div>
        )}
      </div>
    </div>
  );
}

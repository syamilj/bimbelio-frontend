import { Skeleton } from '@/components/ui/skeleton';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { BookOpen, Crown, FileText, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';

const CARD_META = [
  { icon: FileText, color: '#6366f1', bg: '#eef2ff' },
  { icon: Tag,      color: '#0891b2', bg: '#ecfeff' },
  { icon: Crown,    color: '#d97706', bg: '#fffbeb' },
  { icon: BookOpen, color: '#059669', bg: '#d1fae5' },
];

export default function DocumentInfo() {
  const [data, setData] = useState<{ Document: unknown[]; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocumentInfo = async () => {
    setLoading(true);
    await getGeneral('/document/getDocumentInfo', { setData });
    setLoading(false);
  };

  useEffect(() => { fetchDocumentInfo(); }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
      {data.map((item, i) => {
        const meta = CARD_META[i % CARD_META.length];
        const Icon = meta.icon;
        return (
          <div
            key={i}
            className="rounded-2xl bg-white border border-gray-100 p-4 flex items-center gap-3.5 hover:shadow-md transition-shadow"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: meta.bg }}
            >
              <Icon className="w-5 h-5" style={{ color: meta.color }} />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 leading-none">
                {item.Document.length}
              </p>
              <p className="text-xs font-medium text-gray-500 mt-1 leading-tight">
                {item.name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

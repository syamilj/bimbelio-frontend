'use client';

import { InputImage } from '@/components/ui/input-image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { storage } from '@/supabaseClient';
import { Plus, Sparkles } from 'lucide-react';
import React, { SetStateAction, useState } from 'react';
import DialogAIMatch from '../../_component/DialogAIMatch';
import { SessionProps, TryoutProps } from '../page';
// import Image from 'next/image';
// import { env } from '@/env.mjs';
// import { supabase } from '@/servers/supabase/supabaseClient';

interface Props {
  tryout: TryoutProps | null;
  setTryout: React.Dispatch<SetStateAction<TryoutProps | null>>;
  sessions: SessionProps[];
  setSessions: React.Dispatch<SetStateAction<SessionProps[]>>;
  startDate: string;
  setStartDate: React.Dispatch<SetStateAction<string>>;
  startDateTime: string;
  setStartDateTime: React.Dispatch<SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<SetStateAction<string>>;
  endDateTime: string;
  setEndDateTime: React.Dispatch<SetStateAction<string>>;
  resultDate: string;
  setResultDate: React.Dispatch<SetStateAction<string>>;
  resultDateTime: string;
  setResultDateTime: React.Dispatch<SetStateAction<string>>;
  currentIndexEdit: number | null;
  setCurrentIndexEdit: React.Dispatch<SetStateAction<number | null>>;
  setQuestionIndex: React.Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  setAssesmentType: React.Dispatch<SetStateAction<string>>;
  resetTryout: () => void;
}

const TryoutOption = ({
  tryout,
  sessions,
  setSessions,
  setTryout,
  startDate,
  setStartDate,
  startDateTime,
  setStartDateTime,
  endDate,
  setEndDate,
  endDateTime,
  setEndDateTime,
  resultDate,
  setResultDate,
  resultDateTime,
  setResultDateTime,
  currentIndexEdit,
  setCurrentIndexEdit,
  setQuestionIndex,
  isLoading: _isLoading,
  setAssesmentType,
  resetTryout,
}: Props) => {
  const [_prevIndexEdit, setPrevIndexEdit] = useState<number | null>(null);
  const addSesi = () => {
    setSessions((prev) => {
      return [
        ...prev,
        {
          categoryId: '',
          name: '',
          description: '',
          duration: 0,
          thresholdValue: 0,
          assessmentType: '1-5',
          Questions: [],
        },
      ];
    });
  };

  // const saveImage = async (filename: string, file: File) => {
  //   let isSaved = false;
  //   while (!isSaved) {
  //     if (tryout?.image) {
  //       await supabase.storage.from('img').remove([`tryout/${tryout.image}`]);
  //     }
  //     const save = await supabase.storage
  //       .from('img')
  //       .upload(`tryout/${filename}`, file);
  //     if (save.data) isSaved = true;
  //     if (save.error) isSaved = false;
  //   }
  // };

  // useEffect(() => {
  //   if (thumbnail) {
  //     const name = `tryout-${crypto.randomUUID()}`;
  //     saveImage(name, thumbnail);
  //     setThumbnailName(name);
  //     setTryout(prev => ({ ...prev, image: name }));
  //   }
  // }, [thumbnail]);

  // useEffect(() => {
  //   if (tryout && tryout.image) setThumbnailName(tryout.image);
  // }, [tryout]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Panel header */}
      <div className="shrink-0 px-5 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Detail Tryout</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Konfigurasi dasar tryout
          </p>
        </div>
        {currentIndexEdit !== null && (
          <button
            type="button"
            onClick={() => {
              setCurrentIndexEdit(null);
              if (currentIndexEdit !== null) setPrevIndexEdit(currentIndexEdit);
            }}
            className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 rounded-3xl px-2.5 py-1.5 transition-colors"
          >
            Lihat semua
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Judul Tryout
          </label>
          <input
            type="text"
            placeholder="Masukkan judul tryout..."
            className="h-9 w-full rounded-3xl border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300"
            required
            value={tryout?.title ?? ''}
            onChange={(e) =>
              setTryout((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        {/* Status + Instagram */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </label>
            <div className="relative bg-white rounded-3xl border border-gray-200 hover:border-gray-300 transition-colors">
              <input
                type="text"
                defaultValue={tryout?.status ?? ''}
                required
                className="absolute bottom-0 left-4 h-px w-px p-0 opacity-0 pointer-events-none"
              />
              <Select
                value={tryout?.status ?? 'placeholder'}
                onValueChange={(value) => {
                  setTryout((prev) => ({
                    ...prev,
                    status: value as 'PUBLIC' | 'PRIVATE' | 'DRAFT',
                  }));
                }}
              >
                <SelectTrigger className="h-9 w-full rounded-3xl border-none bg-transparent shadow-none outline-none text-sm px-3">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="placeholder"
                    disabled
                  >
                    Pilih Status
                  </SelectItem>
                  <SelectItem value="PUBLIC">PUBLIC</SelectItem>
                  <SelectItem value="PRIVATE">PRIVATE</SelectItem>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Instagram{' '}
              <span className="font-normal normal-case text-gray-400">
                (opsional)
              </span>
            </label>
            <input
              type="text"
              placeholder="Link postingan..."
              className="h-9 w-full rounded-3xl border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300"
              value={tryout?.instagram ?? ''}
              onChange={(e) =>
                setTryout((prev) => ({ ...prev, instagram: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Thumbnail
          </label>
          <InputImage
            preview={
              tryout?.image && tryout.image !== ''
                ? `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/tryout/${tryout?.image}`
                : undefined
            }
            onChange={async (image) => {
              const imageNow = tryout?.image;
              if (!image) return;
              const filename = `tryout-${crypto.randomUUID()}`;
              const upload = await storage
                .from('img')
                .upload(`tryout/${filename}`, image);
              if (upload?.error?.message === 'The resource already exists') {
                await storage.from('img').update(`tryout/${filename}`, image);
              }
              if (imageNow) {
                await storage.from('img').remove([`tryout/${imageNow}`]);
              }
              setTryout((prev) => ({ ...prev, image: filename }));
            }}
          />
        </div>

        <div className="h-px bg-gray-100" />

        {/* Timeline */}
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Timeline
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-600 font-medium">Mulai</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 rounded-3xl border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300"
              />
              <input
                type="time"
                required
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="h-9 rounded-3xl border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-600 font-medium">
              Berakhir
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 rounded-3xl border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300"
              />
              <input
                type="time"
                required
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="h-9 rounded-3xl border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-600 font-medium">
              Pembagian Hasil
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                required
                value={resultDate}
                onChange={(e) => setResultDate(e.target.value)}
                className="h-9 rounded-3xl border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300"
              />
              <input
                type="time"
                required
                value={resultDateTime}
                onChange={(e) => setResultDateTime(e.target.value)}
                className="h-9 rounded-3xl border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Sessions */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Sesi Tryout
            </p>
            <div className="flex items-center gap-1.5">
              <DialogAIMatch
                sessions={sessions}
                setSessions={setSessions}
                currentWebsubId={website_sub_category_id ?? ''}
              >
                <button
                  type="button"
                  title="AI otomatis cocokkan kategori dan bab materi untuk semua sesi"
                  disabled={sessions.every((s) => !s.Questions?.length)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 hover:text-purple-800 border border-purple-200 hover:border-purple-300 bg-purple-50 hover:bg-purple-100 disabled:opacity-40 disabled:cursor-not-allowed rounded-3xl px-2.5 py-1.5 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  AI Match
                </button>
              </DialogAIMatch>
              <button
                type="button"
                onClick={addSesi}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-3xl px-3 py-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Sesi
              </button>
            </div>
          </div>

          {sessions.length === 0 && (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 py-6 flex flex-col items-center gap-1">
              <p className="text-sm text-gray-400">Belum ada sesi</p>
              <p className="text-xs text-gray-300">
                Klik "Tambah Sesi" untuk mulai
              </p>
            </div>
          )}

          {sessions.map((item, sessionIndex) => (
            <div
              key={sessionIndex}
              className="flex items-center gap-2 rounded-3xl border border-gray-200 bg-white p-3 hover:border-gray-300 transition-colors"
            >
              <div className="shrink-0">
                <input
                  type="text"
                  defaultValue={`${sessionIndex + 1}`}
                  required
                  className="absolute bottom-0 left-4 h-px w-px p-0 opacity-0 pointer-events-none"
                />
                <Select
                  value={`${sessionIndex + 1}`}
                  onValueChange={(value) => {
                    const fixValue = parseInt(value) - 1;
                    const currentSessions = [...sessions];
                    const [movedSession] = currentSessions.splice(
                      sessionIndex,
                      1,
                    );
                    currentSessions.splice(fixValue, 0, movedSession);
                    setSessions([...currentSessions]);
                  }}
                >
                  <SelectTrigger className="h-7 w-12 rounded-3xl border border-gray-200 bg-gray-50 text-xs shadow-none px-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: sessions.length }).map((_, index) => (
                      <SelectItem
                        key={index}
                        value={`${index + 1}`}
                      >
                        {index + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.subCategory ? (
                    <span className="inline-flex items-center rounded-3xl bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold px-2 py-0.5">
                      {item.subCategory}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">
                      Belum dikonfig
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-gray-500">
                    {item.Questions?.length ?? 0} soal
                  </span>
                  <span className="text-[11px] text-gray-300">·</span>
                  <span className="text-[11px] text-gray-500">
                    {item.duration || 0} mnt
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentIndexEdit(sessionIndex);
                  setQuestionIndex(0);
                  if (item.assessmentType)
                    setAssesmentType(item.assessmentType);
                }}
                className="shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 rounded-3xl px-3 py-1.5 transition-colors"
              >
                Edit
              </button>
            </div>
          ))}

          {/* Rest time */}
          <div className="flex items-center justify-between gap-3 rounded-3xl border border-gray-200 bg-white p-3">
            <div>
              <p className="text-xs font-medium text-gray-700">
                Waktu Istirahat
              </p>
              <p className="text-[11px] text-gray-400">menit antar sesi</p>
            </div>
            <input
              type="number"
              placeholder="0"
              className="h-9 w-24 rounded-3xl border border-gray-200 px-3 text-sm text-right outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300"
              value={tryout?.restTime ?? ''}
              onChange={(e) =>
                setTryout((prev) => ({
                  ...prev,
                  restTime: parseInt(e.target.value),
                }))
              }
            />
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Danger zone */}
        <button
          type="button"
          className="w-full rounded-3xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium py-2.5 transition-colors"
          onClick={async () => {
            await resetTryout();
            await storage.from('img').remove([`tryout/${tryout?.image}`]);
          }}
        >
          Reset & Hapus Draft
        </button>

        <div className="h-4" />
      </div>
    </div>
  );
};

export default TryoutOption;

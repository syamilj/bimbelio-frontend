'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import axiosInstance from '@/lib/axios/axiosInstance';
import { useGet } from '@/lib/fetch-helper/useGet';
import { response, responseError } from '@/lib/response';
import { cn, getDateForInputDateTime } from '@/lib/utils';
import { QuizVolume } from '@/types/database';
import { Check, ChevronsUpDown, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DialogAIMatch from '../../../../tryout/_component/DialogAIMatch';
import { useEditQuizTryoutContext } from '../../../_component/provider-edit-tryout';
import ModalDeleteTryout from './modal-delete-tryout';

const TryoutOption = () => {
  const {
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
    setCurrentIndexEdit,
    setQuestionIndex,
    setAssesmentType,
    setSelectedQuizVolume,
    selectedQuizVolume,
  } = useEditQuizTryoutContext();

  const router = useRouter();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [loadingDeleteTryout, setIsLoadingDeleteTryout] = useState<boolean>(false);
  const [searchQuizVolume, setSearchQuizVolume] = useState<string>('');

  const deleteTryout = async ({ id }: { id: string }) => {
    try {
      setIsLoadingDeleteTryout(true);
      const res = await axiosInstance.delete(`/tryout/deleteTryout?id=${id}`);
      router.push(`/${website_sub_category_id}/admin/quiz`);
      return response(res, true);
    } catch (error) {
      return responseError(error, true);
    } finally {
      setIsLoadingDeleteTryout(false);
    }
  };

  const handleDeleteTryout = () => {
    if (tryout?.id) {
      deleteTryout({ id: tryout.id });
    }
  };

  const { data: QuizVolumeList } = useGet<QuizVolume[]>(
    '/quizTryout/getQuizVolumeList',
    {
      params: {
        search: searchQuizVolume,
        take: 10,
        page: 1,
      },
      debounceTime: 1000,
      enabled: searchQuizVolume.length >= 3 || searchQuizVolume.length === 0,
      useEffectDependencies: [searchQuizVolume],
    },
  );

  return (
    <div className="w-full p-4 sm:p-6 space-y-6">
      <ModalDeleteTryout
        isLoading={loadingDeleteTryout}
        open={openDelete}
        setOpen={setOpenDelete}
        onClick={handleDeleteTryout}
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Detail Quiz</h2>
          <div className="flex items-center gap-2">
            <DialogAIMatch
              sessions={[sessions] as any}
              setSessions={(updater: any) => {
                setSessions((prev) => {
                  const next = typeof updater === 'function' ? updater([prev]) : updater;
                  return next?.[0] ?? prev;
                });
              }}
              currentWebsubId={website_sub_category_id || ''}
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors disabled:opacity-60"
                disabled={!sessions?.Questions || sessions.Questions.length === 0}
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Match
              </button>
            </DialogAIMatch>
            <button
              type="button"
              onClick={() => {
                setCurrentIndexEdit(0);
                setQuestionIndex(0);
                if (sessions?.assessmentType) {
                  setAssesmentType(sessions.assessmentType);
                }
              }}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit Sesi
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">Judul Quiz</label>
          <input
            type="text"
            placeholder="Judul quiz"
            className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            required
            value={tryout?.title ?? ''}
            onChange={(e) => {
              setTryout((prev) => ({ ...prev, title: e.target.value }));
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">Status</label>
          <Select
            value={tryout?.status ? `${tryout.status}` : 'placeholder'}
            onValueChange={(value) => {
              if (value) {
                setTryout((prev) => ({
                  ...prev,
                  status: value as 'PUBLIC' | 'PRIVATE' | 'DRAFT',
                }));
              }
            }}
          >
            <SelectTrigger className="h-11 rounded-xl border border-gray-200 bg-white text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder" disabled>
                Status
              </SelectItem>
              <SelectItem value="PUBLIC">PUBLIC</SelectItem>
              <SelectItem value="PRIVATE">PRIVATE</SelectItem>
              <SelectItem value="DRAFT">DRAFT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">
            Pilih Quiz Volume <span className="text-gray-400">(optional)</span>
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                className="w-full h-11 justify-between rounded-xl border-gray-200"
              >
                {selectedQuizVolume?.name || 'Pilih Quiz Volume...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[360px] p-0" align="start">
              <Command>
                <CommandInput
                  placeholder="Cari Quiz Volume..."
                  value={searchQuizVolume}
                  onValueChange={(value) => setSearchQuizVolume(value)}
                />
                <CommandList>
                  <CommandEmpty>Tidak ada quiz volume.</CommandEmpty>
                  <CommandGroup>
                    {(QuizVolumeList || []).map((volume) => {
                      const isSelected = selectedQuizVolume?.id === volume.id;
                      return (
                        <CommandItem
                          key={volume.id}
                          value={volume.id}
                          onSelect={() => {
                            if (isSelected) {
                              localStorage.removeItem(`temporary-selectedQuizVolume-${tryout?.id}`);
                              setSelectedQuizVolume(null);
                              return;
                            }
                            setSelectedQuizVolume({
                              id: volume.id,
                              name: volume.title || '',
                            });
                            const startDateSplit = getDateForInputDateTime(volume.startDate).split('T');
                            const endDateSplit = getDateForInputDateTime(volume.endDate).split('T');
                            setStartDate(startDateSplit[0]);
                            setStartDateTime(startDateSplit[1]);
                            setEndDate(endDateSplit[0]);
                            setEndDateTime(endDateSplit[1]);
                            setResultDate(startDateSplit[0]);
                            setResultDateTime(startDateSplit[1]);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              isSelected ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                          {volume.title}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <section className="space-y-4 border-t border-gray-100 pt-6">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">
            Waktu mulai quiz
            {selectedQuizVolume && (
              <span className="ml-1 text-[11px] text-gray-400">(otomatis dari quiz volume)</span>
            )}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={selectedQuizVolume !== null}
            />
            <input
              type="time"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm"
              required
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              disabled={selectedQuizVolume !== null}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">
            Pelaksanaan berakhir
            {selectedQuizVolume && (
              <span className="ml-1 text-[11px] text-gray-400">(otomatis dari quiz volume)</span>
            )}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={selectedQuizVolume !== null}
            />
            <input
              type="time"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm"
              required
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              disabled={selectedQuizVolume !== null}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-600">
            Waktu pembagian hasil quiz
            {selectedQuizVolume && (
              <span className="ml-1 text-[11px] text-gray-400">(otomatis dari quiz volume)</span>
            )}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm"
              required
              value={resultDate}
              onChange={(e) => setResultDate(e.target.value)}
              disabled={selectedQuizVolume !== null}
            />
            <input
              type="time"
              className="h-11 rounded-xl border border-gray-200 px-3 text-sm"
              required
              value={resultDateTime}
              onChange={(e) => setResultDateTime(e.target.value)}
              disabled={selectedQuizVolume !== null}
            />
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 pt-6 space-y-3">
        <button
          type="button"
          className={cn(
            'w-full h-11 rounded-xl bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100',
            loadingDeleteTryout && 'pointer-events-none opacity-60',
          )}
          onClick={() => {
            localStorage.removeItem(`temporary-edit-tryout-${tryout?.id}`);
            localStorage.removeItem(`temporary-selectedQuizVolume-${tryout?.id}`);
            window.location.reload();
          }}
        >
          Reset Temporary Data
        </button>

        <button
          type="button"
          className={cn(
            'w-full h-11 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100',
            loadingDeleteTryout && 'pointer-events-none opacity-60',
          )}
          onClick={() => setOpenDelete(true)}
        >
          Hapus
        </button>
      </section>
    </div>
  );
};

export default TryoutOption;
